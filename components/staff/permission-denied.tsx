import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ROLE_PARAM } from "@/lib/staff-role"

/**
 * 無權限阻擋畫面。文案待客戶確認，暫以語意清晰、一般使用者可理解為原則撰寫。
 */
export function PermissionDenied({ feature }: { feature: string }) {
  return (
    <div className="mx-auto max-w-7xl px-6 py-16">
      <div className="mx-auto flex max-w-md flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Lock className="h-6 w-6 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">沒有檢視「{feature}」的權限</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          這項功能僅限管理者使用。如需存取權限，請聯繫系統管理者為你開通。
        </p>
        <Button asChild variant="outline" className="mt-6">
          <Link href={`/staff?${ROLE_PARAM}=user`}>回到會員查詢</Link>
        </Button>
      </div>
    </div>
  )
}
