"use client"

import { useMemo, useState } from "react"
import { ChevronDown, MoreHorizontal, Plus, Search, Trash2, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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

const REGIONS = ["北區", "中區", "南區"] as const
type Region = (typeof REGIONS)[number]

type SalesUser = {
  id: string
  name: string
  email: string
  regions: Region[]
  enabled: boolean
  /** 加入時間，決定列表的預設排序（最新在最上）。 */
  createdAt: string
}

const INITIAL_USERS: SalesUser[] = [
  {
    id: "S-001",
    name: "王志明",
    email: "chihming.wang@example.com",
    regions: ["北區"],
    enabled: true,
    createdAt: "2025-03-12T09:20:00Z",
  },
  {
    id: "S-002",
    name: "林雅婷",
    email: "yating.lin@example.com",
    regions: ["北區", "南區"],
    enabled: true,
    createdAt: "2025-06-02T14:05:00Z",
  },
  {
    id: "S-003",
    name: "陳建宏",
    email: "chienhung.chen@example.com",
    regions: ["中區"],
    enabled: true,
    createdAt: "2025-01-08T11:30:00Z",
  },
  {
    id: "S-004",
    name: "張怡君",
    email: "yichun.chang@example.com",
    regions: ["南區"],
    enabled: false,
    createdAt: "2025-05-21T16:45:00Z",
  },
  {
    id: "S-005",
    name: "李俊毅",
    email: "chunyi.lee@example.com",
    regions: ["中區", "南區"],
    enabled: true,
    createdAt: "2025-02-17T10:00:00Z",
  },
]

/** 依 REGIONS 的順序顯示，避免勾選先後影響 badge 排列。 */
function sortRegions(regions: Region[]): Region[] {
  return REGIONS.filter((r) => regions.includes(r))
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("zh-TW", { year: "numeric", month: "2-digit", day: "2-digit" })
}

/** 表格內直接編輯負責區域；至少須保留一區，故最後一區不可取消勾選。 */
function RegionPicker({ user, onChange }: { user: SalesUser; onChange: (regions: Region[]) => void }) {
  function toggle(region: Region, checked: boolean) {
    if (checked) {
      onChange(sortRegions([...user.regions, region]))
    } else {
      if (user.regions.length === 1) return
      onChange(user.regions.filter((r) => r !== region))
    }
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className="flex items-center gap-1.5 rounded-md px-2 py-1 -mx-2 transition-colors hover:bg-muted"
          aria-label={`編輯 ${user.name} 的負責區域`}
        >
          <span className="flex flex-wrap gap-1">
            {user.regions.map((r) => (
              <Badge key={r} variant="secondary">
                {r}
              </Badge>
            ))}
          </span>
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-2" align="start">
        <p className="px-2 pb-2 text-xs text-muted-foreground">至少需選擇一個區域</p>
        {REGIONS.map((region) => {
          const checked = user.regions.includes(region)
          const isLast = checked && user.regions.length === 1
          return (
            <label
              key={region}
              className="flex cursor-pointer items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-muted has-disabled:cursor-not-allowed has-disabled:opacity-50"
            >
              <Checkbox
                checked={checked}
                disabled={isLast}
                onCheckedChange={(value) => toggle(region, value === true)}
              />
              {region}
            </label>
          )
        })}
      </PopoverContent>
    </Popover>
  )
}

export function SalesPermissionTable() {
  const [users, setUsers] = useState<SalesUser[]>(INITIAL_USERS)
  const [keyword, setKeyword] = useState("")
  const [regionFilter, setRegionFilter] = useState<Region | "all">("all")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<SalesUser | null>(null)
  const [form, setForm] = useState<{ name: string; email: string; regions: Region[] }>({
    name: "",
    email: "",
    regions: [],
  })
  const [errors, setErrors] = useState<{ name?: string; email?: string; regions?: string }>({})

  const visible = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return users
      // 搜尋僅比對姓名與 email；區域另由右側 filter 處理。
      .filter((u) => !kw || u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw))
      .filter((u) => regionFilter === "all" || u.regions.includes(regionFilter))
      // 預設排序：加入時間，最新在最上。
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  }, [users, keyword, regionFilter])

  function updateRegions(id: string, regions: Region[]) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, regions } : u)))
  }

  function toggleEnabled(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u)))
  }

  function confirmDelete() {
    if (!deleteTarget) return
    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id))
    setDeleteTarget(null)
  }

  function toggleFormRegion(region: Region, checked: boolean) {
    setForm((prev) => ({
      ...prev,
      regions: checked ? sortRegions([...prev.regions, region]) : prev.regions.filter((r) => r !== region),
    }))
    if (errors.regions) setErrors((prev) => ({ ...prev, regions: undefined }))
  }

  function submit() {
    const nextErrors: typeof errors = {}
    if (!form.name.trim()) nextErrors.name = "請輸入姓名"
    if (!form.email.trim()) nextErrors.email = "請輸入 email"
    else if (!isValidEmail(form.email)) nextErrors.email = "email 格式不正確"
    else if (users.some((u) => u.email.toLowerCase() === form.email.trim().toLowerCase())) {
      nextErrors.email = "這個 email 已在名單中"
    }
    if (form.regions.length === 0) nextErrors.regions = "請至少選擇一個負責區域"

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setUsers((prev) => [
      ...prev,
      {
        id: `S-${String(prev.length + 1).padStart(3, "0")}`,
        name: form.name.trim(),
        email: form.email.trim(),
        regions: form.regions,
        enabled: true,
        createdAt: new Date().toISOString(),
      },
    ])
    setForm({ name: "", email: "", regions: [] })
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex w-full gap-3 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="搜尋姓名或 email"
              className="pl-9"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <select
            className="h-9 shrink-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            value={regionFilter}
            aria-label="以負責區域篩選"
            onChange={(e) => setRegionFilter(e.target.value as Region | "all")}
          >
            <option value="all">全部區域</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <Button className="gap-2" onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          新增業務
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>姓名</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>負責區域</TableHead>
              <TableHead>盒蓋回收權限</TableHead>
              <TableHead>加入時間</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {visible.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-40">
                  {/* 查無資料空狀態，文案待客戶確認。 */}
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <UserX className="h-8 w-8 text-muted-foreground" />
                    <p className="font-medium text-foreground">查無符合的業務</p>
                    <p className="text-sm text-muted-foreground">請調整搜尋關鍵字或區域篩選條件。</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              visible.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <RegionPicker user={user} onChange={(regions) => updateRegions(user.id, regions)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={user.enabled}
                        onCheckedChange={() => toggleEnabled(user.id)}
                        aria-label={`${user.name} 的盒蓋回收權限`}
                      />
                      <span className="text-sm text-muted-foreground">{user.enabled ? "已啟用" : "已停用"}</span>
                    </div>
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
                        <DropdownMenuItem variant="destructive" onSelect={() => setDeleteTarget(user)}>
                          <Trash2 className="h-4 w-4" />
                          移除業務
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteTarget !== null} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>確定要移除「{deleteTarget?.name}」嗎？</AlertDialogTitle>
            <AlertDialogDescription>
              移除後，{deleteTarget?.name} 將無法再使用盒蓋回收功能。此操作無法復原。
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
            <DialogTitle>新增業務</DialogTitle>
            <DialogDescription>新增後預設啟用盒蓋回收權限，可隨時於列表停用。</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sales-name">姓名 *</Label>
              <Input
                id="sales-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                aria-invalid={errors.name ? true : undefined}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sales-email">Email *</Label>
              <Input
                id="sales-email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                aria-invalid={errors.email ? true : undefined}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label>負責區域 *（可複選）</Label>
              <div className="flex gap-4 rounded-md border p-3">
                {REGIONS.map((region) => (
                  <label key={region} className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox
                      checked={form.regions.includes(region)}
                      onCheckedChange={(value) => toggleFormRegion(region, value === true)}
                    />
                    {region}
                  </label>
                ))}
              </div>
              {errors.regions && <p className="text-sm text-destructive">{errors.regions}</p>}
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
