"use client"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

const couponData = {
  2: {
    id: 2,
    name: "買3送1優惠券",
    description: "購買3個指定商品即可獲得1個免費商品。需要掃描3個商品盒蓋來確認購買資格。",
    validUntil: "2024-10-15",
    image: "/wrapped-birthday-gift.png",
    requiredScans: 3,
  },
}

export default function CouponDetailPage() {
  const router = useRouter()
  const coupon = couponData[2]

  if (!coupon) {
    return <div>優惠券不存在</div>
  }

  const handleUseCoupon = () => {
    router.push(`/coupon/2/scanner`)
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
          <Button onClick={handleUseCoupon} className="w-full py-3 text-base font-medium" size="lg">
            使用優惠券
          </Button>

          {/* 條款內容 */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium">使用條款：</p>
            <div className="pl-2 space-y-1">
              <p>1. 需要掃描3個指定商品盒蓋才能使用此優惠券</p>
              <p>2. 免費商品將從指定商品清單中選擇</p>
              <p>3. 優惠券使用後不可退換或轉讓</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
