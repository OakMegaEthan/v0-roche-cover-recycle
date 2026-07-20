"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

interface DistributionConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  coupon: {
    couponId: string
    name: string
    description: string
    expiryDate: string
  } | null
  memberId: string
  onConfirm: () => void
}

export function DistributionConfirmDialog({
  open,
  onOpenChange,
  coupon,
  memberId,
  onConfirm,
}: DistributionConfirmDialogProps) {
  if (!coupon) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            確認發放優惠券
          </DialogTitle>
          <DialogDescription>請確認以下發放資訊是否正確</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">會員 Account ID</div>
            <div className="font-mono text-sm font-semibold">{memberId}</div>
          </div>

          <div className="h-px bg-border" />

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">優惠券名稱</div>
            <div className="text-sm font-medium">{coupon.name}</div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">優惠內容</div>
            <div className="text-sm">{coupon.description}</div>
          </div>

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">有效期限</div>
            <div className="text-sm">至 {coupon.expiryDate}</div>
          </div>

          <div className="rounded-md bg-muted p-3 text-xs text-muted-foreground">
            此操作將發放一張優惠券給指定會員，請確認後再繼續。
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={onConfirm}>確認發放</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
