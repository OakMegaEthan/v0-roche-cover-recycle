"use client"

import { useState } from "react"
import { CouponCollectionForm } from "@/components/sales/coupon-collection-form"
import { SignatureCapture } from "@/components/sales/signature-capture"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building2, Receipt, PenTool } from "lucide-react"

export interface AvailableCoupon {
  couponType: string // 優惠券類型名稱
  availableQuantity: number // 可銷帳數量
  lidRatio: number // 優惠券:盒蓋比例（demo用1:1，未來從API取得）
  unitPrice: number // 每張優惠券的銷帳金額
}

export interface CouponToCollect {
  couponType: string
  quantityToSettle: number // 本次要銷帳的數量
  lidsRequired: number // 需要回收的盒蓋數量
  unitPrice: number // 每張優惠券的銷帳金額
  totalAmount: number // 本次銷帳總金額
}

export interface CollectionData {
  storeName: string
  couponsToCollect: CouponToCollect[]
  notes?: string
}

export interface SignatureData {
  signature: string
  signedBy: string
  signedAt: Date
}

export default function CouponCollectionPage() {
  const [step, setStep] = useState<"form" | "signature" | "complete">("form")
  const [collectionData, setCollectionData] = useState<CollectionData | null>(null)
  const [signatureData, setSignatureData] = useState<SignatureData | null>(null)

  const handleFormSubmit = (data: CollectionData) => {
    setCollectionData(data)
    setStep("signature")
  }

  const handleSignatureComplete = (signature: SignatureData) => {
    setSignatureData(signature)
    setStep("complete")
  }

  const handleStartNew = () => {
    setStep("form")
    setCollectionData(null)
    setSignatureData(null)
  }

  const getStepIcon = (currentStep: string) => {
    switch (currentStep) {
      case "form":
        return <Building2 className="h-5 w-5" />
      case "signature":
        return <PenTool className="h-5 w-5" />
      default:
        return <Receipt className="h-5 w-5" />
    }
  }

  const getStepStatus = (targetStep: string) => {
    const steps = ["form", "signature", "complete"]
    const currentIndex = steps.indexOf(step)
    const targetIndex = steps.indexOf(targetStep)

    if (targetIndex < currentIndex) return "completed"
    if (targetIndex === currentIndex) return "current"
    return "upcoming"
  }

  const getTotalLidsRequired = () => {
    if (!collectionData) return 0
    return collectionData.couponsToCollect.reduce((total, coupon) => total + coupon.lidsRequired, 0)
  }

  const getTotalAmount = () => {
    if (!collectionData) return 0
    return collectionData.couponsToCollect.reduce((total, coupon) => total + coupon.totalAmount, 0)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2 text-balance">盒蓋回收系統</h1>
        </div>

        {/* Progress Steps - 縮小進度條高度，減少空間佔用 */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-3">
            {[
              { key: "form", label: "填寫資料" },
              { key: "signature", label: "確認簽名" },
            ].map((stepItem, index) => (
              <div key={stepItem.key} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors
                    ${
                      getStepStatus(stepItem.key) === "completed"
                        ? "bg-primary border-primary text-primary-foreground"
                        : getStepStatus(stepItem.key) === "current"
                          ? "bg-accent border-accent text-accent-foreground"
                          : "bg-muted border-border text-muted-foreground"
                    }
                  `}
                  >
                    {getStepIcon(stepItem.key)}
                  </div>
                  <span
                    className={`ml-1.5 text-xs font-medium ${
                      getStepStatus(stepItem.key) === "current" ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {stepItem.label}
                  </span>
                </div>
                {index < 1 && (
                  <div
                    className={`w-6 h-0.5 mx-3 ${
                      getStepStatus("signature") === "completed" ? "bg-primary" : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content - 移除shadow-lg，改為更適合手機的設計 */}
        <Card className="p-4">
          {step === "form" && <CouponCollectionForm onSubmit={handleFormSubmit} />}

          {step === "signature" && collectionData && (
            <SignatureCapture
              collectionData={collectionData}
              onComplete={handleSignatureComplete}
              onBack={() => setStep("form")}
            />
          )}

          {step === "complete" && collectionData && signatureData && (
            <div className="text-center py-6">
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Receipt className="h-8 w-8 text-primary" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">回收完成</h2>
                <p className="text-muted-foreground">盒蓋回收記錄已建立</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 mb-6 text-left">
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">回收店家：</span>
                    <span className="font-medium">{collectionData.storeName}</span>
                  </div>

                  <div className="space-y-2">
                    <span className="text-muted-foreground">本次銷帳明細：</span>
                    <div className="space-y-2 ml-2">
                      {collectionData.couponsToCollect.map((coupon, index) => (
                        <div key={index} className="bg-background/50 rounded p-3 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{coupon.couponType}</span>
                            <Badge variant="secondary" className="font-semibold">
                              {coupon.quantityToSettle} 張
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>單價 ${coupon.unitPrice.toLocaleString()}</span>
                            <span className="font-medium text-foreground">${coupon.totalAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>需回收盒蓋</span>
                            <span className="font-medium text-foreground">{coupon.lidsRequired} 個</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between border-t pt-2 mt-2 bg-primary/5 px-2 py-1 rounded">
                    <span className="text-muted-foreground font-medium">銷帳總金額：</span>
                    <span className="font-bold text-primary text-base">${getTotalAmount().toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-muted-foreground font-medium">總計回收盒蓋：</span>
                    <span className="font-bold text-primary">{getTotalLidsRequired()} 個</span>
                  </div>

                  {collectionData.notes && (
                    <div className="pt-2 border-t">
                      <span className="text-muted-foreground">備註說明：</span>
                      <p className="mt-1 text-foreground bg-background/50 rounded p-2">{collectionData.notes}</p>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span className="text-muted-foreground">簽名人員：</span>
                    <span className="font-medium">{signatureData.signedBy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">完成時間：</span>
                    <span className="font-medium">{signatureData.signedAt.toLocaleString("zh-TW")}</span>
                  </div>
                </div>
              </div>

              <Badge variant="secondary" className="mb-6">
                記錄編號：CR-{Date.now().toString().slice(-8)}
              </Badge>

              <button
                onClick={handleStartNew}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                開始新的回收作業
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
