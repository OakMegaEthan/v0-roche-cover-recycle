"use client"

import { useMemo, useState } from "react"
import { Plus, Search, ShieldAlert, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
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
}

const INITIAL_USERS: BackendUser[] = [
  { id: "B-001", name: "吳孟儒", email: "mengju.wu@example.com", role: "admin" },
  { id: "B-002", name: "蔡佩珊", email: "peishan.tsai@example.com", role: "admin" },
  { id: "B-003", name: "黃思婷", email: "szuting.huang@example.com", role: "user" },
  { id: "B-004", name: "劉冠宇", email: "kuanyu.liu@example.com", role: "user" },
  { id: "B-005", name: "鄭雅文", email: "yawen.cheng@example.com", role: "user" },
]

const ROLE_DESCRIPTION: Record<StaffRole, string> = {
  admin: "可使用完整功能，含業務權限管理與優惠券後台權限管理。",
  user: "僅可使用會員查詢／優惠券發放與批次發放。",
}

export function BackendPermissionTable() {
  const [users, setUsers] = useState<BackendUser[]>(INITIAL_USERS)
  const [keyword, setKeyword] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState<{ name: string; email: string; role: StaffRole }>({
    name: "",
    email: "",
    role: "user",
  })
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const adminCount = users.filter((u) => u.role === "admin").length

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return users
    return users.filter((u) => u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw))
  }, [users, keyword])

  function changeRole(id: string, role: StaffRole) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)))
  }

  function submit() {
    const nextErrors: { name?: string; email?: string } = {}
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
      },
    ])
    setForm({ name: "", email: "", role: "user" })
    setDialogOpen(false)
  }

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
              <TableHead>編號</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>權限分級</TableHead>
              <TableHead>可使用範圍</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
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
              filtered.map((user) => {
                // 至少保留一名管理者，避免後台失去可管理權限的人。
                const isLastAdmin = user.role === "admin" && adminCount === 1
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-mono text-sm text-muted-foreground">{user.id}</TableCell>
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
                      {isLastAdmin && (
                        <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                          <ShieldAlert className="h-3 w-3" />
                          需至少保留一位管理者
                        </p>
                      )}
                    </TableCell>
                    <TableCell className="max-w-xs text-sm text-muted-foreground">
                      {ROLE_DESCRIPTION[user.role]}
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
