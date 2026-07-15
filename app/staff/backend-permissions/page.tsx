import type { Metadata } from "next"
import { BackendPermissionTable } from "@/components/staff/backend-permission-table"
import { PermissionDenied } from "@/components/staff/permission-denied"
import { ROLE_PARAM, canManagePermissions, resolveRole } from "@/lib/staff-role"

export const metadata: Metadata = {
  title: "優惠券後台權限管理 — 羅氏 e-coupon 管理",
}

export default async function BackendPermissionsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const role = resolveRole(params[ROLE_PARAM])

  // 可視角色：優惠券後台權限管理最高權限使用者。
  if (!canManagePermissions(role)) {
    return <PermissionDenied feature="優惠券後台權限管理" />
  }

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground">優惠券後台權限管理</h2>
        <p className="mt-1 text-sm text-muted-foreground">管理優惠券後台使用者的權限分級。</p>
      </div>

      <BackendPermissionTable />
    </main>
  )
}
