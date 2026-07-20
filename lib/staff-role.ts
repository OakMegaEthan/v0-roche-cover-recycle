/**
 * 優惠券後台權限分級（mock）。
 *
 * 真實系統的身份應由登入者帳號決定；此處為介面 demo，改以 URL param 指定：
 *   ?role=user  → 一般使用者（客服）：僅會員查詢／優惠券發放、批次發放
 *   無 param    → 管理者：完整功能
 */

export type StaffRole = "admin" | "user"

export const ROLE_PARAM = "role"

export const ROLE_LABEL: Record<StaffRole, string> = {
  admin: "管理者",
  user: "一般使用者（客服）",
}

export function resolveRole(value?: string | string[] | null): StaffRole {
  const raw = Array.isArray(value) ? value[0] : value
  return raw === "user" ? "user" : "admin"
}

export function canManagePermissions(role: StaffRole): boolean {
  return role === "admin"
}

/** 導覽時保留目前身份，避免點一下就跳回預設的管理者視角。 */
export function withRole(href: string, role: StaffRole): string {
  return role === "admin" ? href : `${href}?${ROLE_PARAM}=user`
}
