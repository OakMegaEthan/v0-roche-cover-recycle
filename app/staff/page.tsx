"use client"

import { useState } from "react"
import { CouponQuerySection } from "@/components/staff/coupon-query-section"
import { BatchDistributionPanel } from "@/components/staff/batch-distribution-panel"
import { SuccessDialog } from "@/components/staff/success-dialog"
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
    <main className="mx-auto max-w-7xl px-6 py-8 space-y-8">
      <div className="flex justify-end">
        <Button
          variant={showBatchPanel ? "default" : "outline"}
          onClick={() => setShowBatchPanel(!showBatchPanel)}
          className="gap-2"
        >
          <Upload className="h-4 w-4" />
          {showBatchPanel ? "關閉批次發放" : "批次發放"}
        </Button>
      </div>

      {showBatchPanel && <BatchDistributionPanel onSuccess={handleDistributionSuccess} />}

      <CouponQuerySection onDistributionSuccess={handleDistributionSuccess} />

      <SuccessDialog
        open={showSuccess}
        onOpenChange={setShowSuccess}
        count={distributionCount}
        message={successMessage}
      />
    </main>
  )
}
