"use client"

import { useMemo, useState } from "react"
import { Plus, Search, UserX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
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

type SalesUser = {
  id: string
  name: string
  email: string
  region: string
  enabled: boolean
}

const INITIAL_USERS: SalesUser[] = [
  { id: "S-001", name: "王志明", email: "chihming.wang@example.com", region: "北區", enabled: true },
  { id: "S-002", name: "林雅婷", email: "yating.lin@example.com", region: "北區", enabled: true },
  { id: "S-003", name: "陳建宏", email: "chienhung.chen@example.com", region: "中區", enabled: true },
  { id: "S-004", name: "張怡君", email: "yichun.chang@example.com", region: "南區", enabled: false },
  { id: "S-005", name: "李俊毅", email: "chunyi.lee@example.com", region: "南區", enabled: true },
]

const REGIONS = ["北區", "中區", "南區"]

export function SalesPermissionTable() {
  const [users, setUsers] = useState<SalesUser[]>(INITIAL_USERS)
  const [keyword, setKeyword] = useState("")
  const [dialogOpen, setDialogOpen] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", region: REGIONS[0] })
  const [errors, setErrors] = useState<{ name?: string; email?: string }>({})

  const filtered = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return users
    return users.filter(
      (u) => u.name.toLowerCase().includes(kw) || u.email.toLowerCase().includes(kw) || u.region.includes(kw),
    )
  }, [users, keyword])

  function toggleEnabled(id: string) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, enabled: !u.enabled } : u)))
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
        id: `S-${String(prev.length + 1).padStart(3, "0")}`,
        name: form.name.trim(),
        email: form.email.trim(),
        region: form.region,
        enabled: true,
      },
    ])
    setForm({ name: "", email: "", region: REGIONS[0] })
    setDialogOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="搜尋姓名、email 或區域"
            className="pl-9"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
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
              <TableHead>業務編號</TableHead>
              <TableHead>姓名</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>負責區域</TableHead>
              <TableHead>盒蓋回收權限</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-40">
                  {/* 查無資料空狀態，文案待客戶確認。 */}
                  <div className="flex flex-col items-center justify-center gap-2 text-center">
                    <UserX className="h-8 w-8 text-muted-foreground" />
                    <p className="font-medium text-foreground">查無符合的業務</p>
                    <p className="text-sm text-muted-foreground">請確認關鍵字是否正確，或改用其他條件搜尋。</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-sm text-muted-foreground">{user.id}</TableCell>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell className="text-muted-foreground">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{user.region}</Badge>
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
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
              <Label htmlFor="sales-region">負責區域</Label>
              <select
                id="sales-region"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
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
