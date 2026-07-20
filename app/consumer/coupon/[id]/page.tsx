"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

const mockCouponDetails = {
  1: {
    id: 1,
    name: "新用戶專享折扣",
    description:
      "首次購買享有20%折扣優惠，適用於全站商品，讓您輕鬆享受購物樂趣。此優惠券僅限新用戶使用，請把握機會體驗我們的優質服務。",
    validUntil: "2024-12-31",
    image: "/discount-coupon.png",
    requiredScans: 1,
  },
  2: {
    id: 2,
    name: "買3送1優惠券",
    description: "購買三個指定商品即可獲得一個免費商品，讓您享受更多優惠。需要掃描三個商品盒蓋才能使用此優惠券。",
    validUntil: "2024-10-15",
    image: "/wrapped-birthday-gift.png",
    requiredScans: 3,
  },
}

export default function CouponDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const couponId = Number.parseInt(params.id)
  const coupon = mockCouponDetails[couponId as keyof typeof mockCouponDetails]

  if (!coupon) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">優惠券不存在</p>
      </div>
    )
  }

  const handleUseCoupon = () => {
    router.push(`/consumer/coupon/${couponId}/scanner`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* 返回按鈕 */}
        <div className="flex items-center p-4 border-b">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="ml-2 text-lg font-semibold">優惠券詳情</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* 優惠券圖片 - 1:1 比例，高度適中 */}
          <div className="w-full">
            <img
              src={coupon.image || "/placeholder.svg"}
              alt={coupon.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>

          {/* 優惠券資訊 */}
          <div className="space-y-4">
            {/* 優惠券名稱 */}
            <h2 className="text-xl font-bold text-foreground">{coupon.name}</h2>

            {/* 說明內容 */}
            <p className="text-base text-foreground leading-relaxed">{coupon.description}</p>

            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">需掃描商品數量</p>
              <p className="text-base font-medium text-foreground">{coupon.requiredScans} 個商品盒蓋</p>
            </div>

            {/* 有效期限 */}
            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">有效期限</p>
              <p className="text-base font-medium text-foreground">{coupon.validUntil}</p>
            </div>

            {/* 使用優惠券按鈕 */}
            <Button onClick={handleUseCoupon} className="w-full h-12 text-base font-medium" size="lg">
              使用優惠券
            </Button>

            {/* 條款內容 */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">使用條款</h3>
              <div className="text-xs text-muted-foreground space-y-1 leading-relaxed">
                <p>1. 此優惠券僅限單次使用，使用後即失效</p>
                <p>2. 優惠券不得與其他促銷活動合併使用</p>
                <p>3. 優惠券過期後將自動失效，無法延期使用</p>
                <p>4. 需要掃描 {coupon.requiredScans} 個有效商品盒蓋才能完成優惠券使用</p>
                <p>5. 如有任何爭議，本公司保留最終解釋權</p>
                <p>6. 優惠券不得轉讓或兌換現金</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
