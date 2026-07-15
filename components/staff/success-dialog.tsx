"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

interface SuccessDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  count: number
  message?: string
}

export function SuccessDialog({ open, onOpenChange, count, message }: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="items-center space-y-4 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle2 className="h-10 w-10 text-primary" />
          </div>
          <DialogTitle className="text-2xl font-semibold">發放完成</DialogTitle>
          <DialogDescription className="text-base">
            {message || (
              <>
                已成功發放優惠券給 <span className="font-semibold text-foreground">{count}</span> 位會員
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => onOpenChange(false)} className="min-w-[120px]">
            確認
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
