"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { KeyRound, ShieldCheck, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { ROLE_LABEL, ROLE_PARAM, canManagePermissions, resolveRole, withRole } from "@/lib/staff-role"

const NAV_ITEMS = [
  { href: "/staff", label: "會員查詢 / 優惠券發放", icon: Users, adminOnly: false },
  { href: "/staff/sales-permissions", label: "業務權限管理", icon: ShieldCheck, adminOnly: true },
  { href: "/staff/backend-permissions", label: "優惠券後台權限管理", icon: KeyRound, adminOnly: true },
]

export function StaffNav() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const role = resolveRole(searchParams.get(ROLE_PARAM))

  // AC1.10：一般使用者（客服）僅看得到會員查詢／優惠券發放與批次發放。
  const items = NAV_ITEMS.filter((item) => !item.adminOnly || canManagePermissions(role))

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">羅氏 e-coupon 管理</h1>
            <Badge variant={role === "admin" ? "default" : "secondary"}>{ROLE_LABEL[role]}</Badge>
          </div>
        </div>

        <nav className="flex gap-1 -mb-px">
          {items.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={withRole(item.href, role)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-medium transition-colors",
                  active
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </header>
  )
}
