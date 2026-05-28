"use client"

import { useState } from "react"
import { CouponQuerySection } from "@/components/coupon-query-section"
import { BatchDistributionPanel } from "@/components/batch-distribution-panel"
import { SuccessDialog } from "@/components/success-dialog"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

export default function CouponAdminPage() {
  const [showSuccess, setShowSuccess] = useState(false)
  const [distributionCount, setDistributionCount] = useState(0)
  const [successMessage, setSuccessMessage] = useState("")
  const [showBatchPanel, setShowBatchPanel] = useState(false)

  const handleDistributionSuccess = (count: number, message?: string) => {
    setDistributionCount(count)
    setSuccessMessage(message || "")
    setShowSuccess(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-foreground">羅氏 e-coupon 管理</h1>
            </div>
            <Button
              variant={showBatchPanel ? "default" : "outline"}
              onClick={() => setShowBatchPanel(!showBatchPanel)}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              {showBatchPanel ? "關閉批次發放" : "批次發放"}
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
        {showBatchPanel && <BatchDistributionPanel onSuccess={handleDistributionSuccess} />}

        <CouponQuerySection onDistributionSuccess={handleDistributionSuccess} />
      </main>

      <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        count={distributionCount}
        message={successMessage}
      />
    </div>
  )
}
