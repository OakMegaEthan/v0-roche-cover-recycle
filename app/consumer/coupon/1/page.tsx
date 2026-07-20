"use client"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const couponData = {
  1: {
    id: 1,
    name: "新用戶專享折扣",
    description: "首次購買享有20%折扣優惠，適用於全站商品。此優惠券僅限新用戶使用，每人限用一次。",
    validUntil: "2024-12-31",
    image: "/discount-coupon.png",
    requiredScans: 1,
  },
}

export default function CouponDetailPage() {
  const router = useRouter()
  const coupon = couponData[1]

  if (!coupon) {
    return <div>優惠券不存在</div>
  }

  const handleUseCoupon = () => {
    router.push(`/consumer/coupon/1/scanner`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-4 max-w-md mx-auto">
        {/* 返回按鈕 */}
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground ml-2">優惠券詳情</h1>
        </div>

        <div className="space-y-4">
          {/* 優惠券圖片 */}
          <div className="w-full aspect-square max-w-xs mx-auto">
            <img
              src={coupon.image || "/placeholder.svg"}
              alt={coupon.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* 優惠券名稱 */}
          <h2 className="text-xl font-bold text-foreground text-center">{coupon.name}</h2>

          {/* 說明內容 */}
          <p className="text-base text-foreground leading-relaxed">{coupon.description}</p>

          {/* 需掃描商品數量 */}
          {coupon.requiredScans > 1 && (
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">需掃描商品數量</p>
              <p className="text-base font-medium text-foreground">{coupon.requiredScans} 個商品盒蓋</p>
            </div>
          )}

          {/* 有效期限 */}
          <div className="bg-muted/50 rounded-lg p-3">
            <p className="text-sm text-muted-foreground">有效期限</p>
            <p className="text-base font-medium text-foreground">{coupon.validUntil}</p>
          </div>

          {/* 使用優惠券按鈕 */}
          <Button onClick={handleUseCoupon} className="w-full py-3 text-base font-medium" size="lg">
            使用優惠券
          </Button>

          {/* 條款內容 */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium">使用條款：</p>
            <div className="pl-2 space-y-1">
              <p>1. 此優惠券僅限新用戶使用，每人限用一次</p>
              <p>2. 優惠券使用後不可退換或轉讓</p>
              <p>3. 優惠券過期後自動失效，不可延期使用</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
