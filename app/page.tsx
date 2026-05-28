"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

const mockCoupons = {
  available: [
    {
      id: 1,
      name: "新用戶專享折扣",
      description: "首次購買享有20%折扣優惠，適用於全站商品",
      validUntil: "2024-12-31",
      image: "/discount-coupon.png",
      requiredScans: 1, // 需要掃描1個盒蓋
    },
    {
      id: 2,
      name: "買3送1優惠券",
      description: "購買3個指定商品即可獲得1個免費商品",
      validUntil: "2024-10-15",
      image: "/wrapped-birthday-gift.png",
      requiredScans: 3, // 需要掃描3個盒蓋
    },
  ],
  used: [],
}

export default function CouponListPage() {
  const [activeTab, setActiveTab] = useState("available")
  const router = useRouter()

  const handleCouponClick = (couponId: number) => {
    router.push(`/coupon/${couponId}`)
  }

  const CouponCard = ({ coupon, isUsed = false }: { coupon: any; isUsed?: boolean }) => (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${isUsed ? "opacity-60" : ""}`}
      onClick={() => handleCouponClick(coupon.id)}
    >
      <CardContent className="p-3">
        <div className="flex gap-3">
          {/* 左側正方形圖片預覽 */}
          <div className="flex-shrink-0">
            <img
              src={coupon.image || "/placeholder.svg"}
              alt={coupon.name}
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>

          {/* 右側資訊 */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-semibold text-base text-foreground leading-tight flex-1">{coupon.name}</h3>
              {coupon.requiredScans > 1 && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5 flex-shrink-0">
                  需掃描 {coupon.requiredScans} 個
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{coupon.description}</p>
            <p className="text-xs text-muted-foreground">有效期限：{coupon.validUntil}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-4 max-w-md mx-auto">
        <h1 className="text-xl font-bold text-foreground mb-4">我的優惠券</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="available" className="text-sm">
              可使用
            </TabsTrigger>
            <TabsTrigger value="used" className="text-sm">
              已使用
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="mt-0">
            <div className="space-y-3">
              {mockCoupons.available.map((coupon) => (
                <CouponCard key={coupon.id} coupon={coupon} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="used" className="mt-0">
            <div className="space-y-3">
              <div className="text-center py-8">
                <p className="text-muted-foreground">暫無已使用的優惠券</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
