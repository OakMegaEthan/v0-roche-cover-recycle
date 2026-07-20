"use client"

import { useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, Plus, Search, Trash2, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { isValidEmail } from "@/lib/mock-auth"
import type { StaffRole } from "@/lib/staff-role"
import { ROLE_LABEL } from "@/lib/staff-role"

type BackendUser = {
  id: string
  name: string
  email: string
  role: StaffRole
  /** 加入時間，決定列表的預設排序（最新在最上）。 */
  createdAt: string
}

/** 權限分級的三段式排序：預設（加入時間）→ 管理者優先 → 一般使用者優先。 */
type SortMode = "default" | "admin-first" | "user-first"

const SORT_CYCLE: Record<SortMode, SortMode> = {
  default: "admin-first",
  "admin-first": "user-first",
  "user-first": "default",
}

const SORT_LABEL: Record<SortMode, string> = {
  default: "預設（依加入時間）",
  "admin-first": "管理者優先",
  "user-first": "一般使用者優先",
}

const SORT_ICON = {
  default: ArrowUpDown,
  "admin-first": ArrowUp,
  "user-first": ArrowDown,
}

const INITIAL_USERS: BackendUser[] = [
  { id: "B-001", name: "吳孟儒", email: "mengju.wu@example.com", role: "admin", createdAt: "2025-01-15T09:00:00Z" },
  { id: "B-002", name: "蔡佩珊", email: "peishan.tsai@example.com", role: "admin", createdAt: "2025-04-28T13:20:00Z" },
  { id: "B-003", name: "黃思婷", email: "szuting.huang@example.com", role: "user", createdAt: "2025-06-10T10:15:00Z" },
  { id: "B-004", name: "劉冠宇", email: "kuanyu.liu@example.com", role: "user", createdAt: "2025-02-03T15:40:00Z" },
  { id: "B-005", name: "鄭雅文", email: "yawen.cheng@example.com", role: "user", createdAt: "2025-05-19T11:05:00Z" },
]

const ROLE_DESCRIPTION: Record<StaffRole, string> = {
  admin: "可使用完整功能，含業務權限管理與優惠券後台權限管理。",
  user: "僅可使用會員查詢／優惠券發放與批次發放。",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" })
}

export function BackendPermissionTable() {
  const [users, setUsers] = useState<BackendUser[]>(INITIAL_USERS)
  const [keyword, setKeyword] = useState("")
  const [sortMode, setSortMode] = useState<SortMode>("default")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<BackendUser | null>(null)
  const [form, setForm] = useState<{ name: string; email: string; role: StaffRole }>({
    name: "",
    email: "",
    role: "user",
  })
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const adminCount = users.filter((u) => u.role === "admin").length

  const visible = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    const filtered = users.filter(
      (u) => !kw || u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw),
    )
    // 同分級內一律以加入時間排序，最新在最上。
    const byNewest = (a: BackendUser, b: BackendUser) => b.createdAt.localeCompare(a.createdAt)

    if (sortMode === "default") return [...filtered].sort(byNewest)

    const first: StaffRole = sortMode === "admin-first" ? "admin" : "user"
    return [...filtered].sort((a, b) => {
      if (a.role !== b.role) return a.role === first ? -1 : 1
      return byNewest(a, b)
    })
  }, [users, keyword, sortMode])

  function changeRole(id: string, role: StaffRole) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  function submit() {
    const nextErrors: typeof errors = {}
    if (!form.name.trim()) nextErrors.name = "請輸入姓名"
    if (!form.email.trim()) nextErrors.email = "請輸入 email"
    else if (!isValidEmail(form.email)) nextErrors.email = "email 格式不正確"
    else if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) {
      nextErrors.email = "這個 email 已在名單中"
    }

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setUsers((prev) => [
      ...prev,
      {
        id: `B-${String(prev.length + 1).padStart(3, "0")}`,
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        createdAt: new Date().toISOString(),
      },
    ])
    setForm({ name: "", email: "", role: "user" })
    setDialogOpen(false)
  }

  const SortIcon = SORT_ICON[sortMode]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜尋姓名或 email"
            className="pl-9"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          新增後台使用者
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>
                <button
                  className="flex items-center gap-1.5 rounded-md px-2 py-1 -mx-2 font-medium transition-colors hover:bg-muted"
                  onClick={() => setSortMode(SORT_CYCLE[sortMode])}
                  title={`目前排序：${SORT_LABEL[sortMode]}（點擊切換）`}
                >
                  權限分級
                  <SortIcon
                    className={sortMode === "default" ? "h-3.5 w-3.5 text-muted-foreground" : "h-3.5 w-3.5"}
                  />
                </button>
              </TableHead>
              <TableHead>加入時間</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40">
                  {/* 查無資料空狀態，文案待客戶確認。 */}
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <UserX className="h-8 w-8 text-muted-foreground" />
                    <p className="font-medium text-foreground">查無符合的使用者</p>
                    <p className="text-sm text-muted-foreground">請確認關鍵字是否正確，或改用其他條件搜尋。</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              visible.map((user) => {
                // 至少保留一名管理者，避免後台失去可管理權限的人。
                const isLastAdmin = user.role === "admin" && adminCount === 1
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">{user.email}</TableCell>
                    <TableCell>
                      <select
                        className="flex h-9 w-40 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                        value={user.role}
                        disabled={isLastAdmin}
                        aria-label={`${user.name} 的權限分級`}
                        onChange={(e) => changeRole(user.id, e.target.value as StaffRole)}
                      >
                        <option value="user">{ROLE_LABEL.user}</option>
                        <option value="admin">{ROLE_LABEL.admin}</option>
                      </select>
                      {isLastAdmin && <p className="mt-1 text-xs text-muted-foreground">需至少保留一位管理者</p>}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(user.createdAt)}</TableCell>
                    <TableCell>
                      {/* modal={false}：預設的 modal 選單會在 body 設下 pointer-events:none，
                          自選單開啟確認框時該樣式不會被清掉，導致整頁失去互動。 */}
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" aria-label={`${user.name} 的更多操作`}>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            variant="destructive"
                            disabled={isLastAdmin}
                            onSelect={() => setDeleteTarget(user)}
                          >
                            <Trash2 className="h-4 w-4" />
                            移除使用者
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span>
          共 <Badge variant="secondary">{users.length}</Badge> 位後台使用者
        </span>
        <span>
          其中管理者 <Badge variant="secondary">{adminCount}</Badge> 位
        </span>
      </div>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要移除「{deleteTarget?.name}」嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              移除後，{deleteTarget?.name} 將無法再登入優惠券後台。此操作無法復原。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              確認移除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>新增後台使用者</DialogTitle>
            <DialogDescription>使用者將以此 email 收取登入用的一次性驗證碼。</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="backend-name">姓名 *</Label>
              <Input
                id="backend-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={errors.name ? true : undefined}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="backend-email">Email *</Label>
              <Input
                id="backend-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={errors.email ? true : undefined}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="backend-role">權限分級</Label>
              <select
                id="backend-role"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as StaffRole })}
              >
                <option value="user">{ROLE_LABEL.user}</option>
                <option value="admin">{ROLE_LABEL.admin}</option>
              </select>
              <p className="text-sm text-muted-foreground">{ROLE_DESCRIPTION[form.role]}</p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={submit}>確認新增</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
