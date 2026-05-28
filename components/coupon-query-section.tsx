"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Search, Send } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DistributionConfirmDialog } from "@/components/distribution-confirm-dialog"

interface UsedCoupon {
  couponId: string
  couponName: string
  usedAt: string
  usedStore: string
  status: "used" | "restored"
}

interface AvailableCoupon {
  couponId: string
  name: string
  description: string
  expiryDate: string
  status: "available" | "issued"
}

interface CouponQuerySectionProps {
  onDistributionSuccess: (count: number, message?: string) => void
}

export function CouponQuerySection({ onDistributionSuccess }: CouponQuerySectionProps) {
  const [memberId, setMemberId] = useState("")
  const [usedCoupons, setUsedCoupons] = useState<UsedCoupon[]>([])
  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState<AvailableCoupon | null>(null)

  const handleSearch = async () => {
    if (!memberId.trim()) return

    setIsLoading(true)
    setHasSearched(true)

    // 模擬 API 調用
    setTimeout(() => {
      const mockUsedData: UsedCoupon[] = [
        {
          couponId: "COUP001",
          couponName: "新春優惠券",
          usedAt: "2024-01-15 14:30",
          usedStore: "台北信義店",
          status: "used",
        },
        {
          couponId: "COUP002",
          couponName: "免運券",
          usedAt: "2024-01-20 09:15",
          usedStore: "線上商城",
          status: "used",
        },
        {
          couponId: "COUP003",
          couponName: "生日禮券",
          usedAt: "2024-02-01 16:45",
          usedStore: "台中中友店",
          status: "used",
        },
        {
          couponId: "COUP004",
          couponName: "週年慶折扣券",
          usedAt: "2024-02-10 11:22",
          usedStore: "高雄夢時代店",
          status: "used",
        },
        {
          couponId: "COUP005",
          couponName: "會員專屬券",
          usedAt: "2024-02-15 13:50",
          usedStore: "桃園統領店",
          status: "used",
        },
      ]

      const mockAvailableData: AvailableCoupon[] = [
        {
          couponId: "COUP006",
          name: "新春優惠券",
          description: "全館商品 8 折優惠",
          expiryDate: "2024-03-31",
          status: "available",
        },
        {
          couponId: "COUP007",
          name: "免運券",
          description: "單筆訂單免運費",
          expiryDate: "2024-04-15",
          status: "available",
        },
        {
          couponId: "COUP008",
          name: "生日禮券",
          description: "生日月專屬 200 元折扣",
          expiryDate: "2024-05-30",
          status: "available",
        },
      ]

      setUsedCoupons(mockUsedData)
      setAvailableCoupons(mockAvailableData)
      setIsLoading(false)
    }, 1000)
  }

  const handleCouponClick = (coupon: AvailableCoupon) => {
    setSelectedCoupon(coupon)
    setShowConfirmDialog(true)
  }

  const handleConfirmDistribution = async () => {
    setShowConfirmDialog(false)

    // 模擬 API 發放請求
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onDistributionSuccess(1, `已成功發放「${selectedCoupon?.name}」給會員 ACC-${memberId}`)
    setSelectedCoupon(null)
  }

  return (
    <>
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="space-y-1 border-b border-border">
          <CardTitle className="text-xl font-semibold">會員優惠券查詢</CardTitle>
          <CardDescription className="text-muted-foreground">查詢會員的優惠券使用狀態與可發放優惠券</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          {/* 查詢輸入區 */}
          <div className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="member-search" className="text-sm font-medium">
                會員 Account ID
              </Label>
              <div className="flex items-center">
                <div className="flex h-10 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 font-mono text-sm text-muted-foreground">
                  ACC-
                </div>
                <Input
                  id="member-search"
                  type="text"
                  placeholder="請輸入會員 Account ID"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="rounded-l-none font-mono"
                />
              </div>
            </div>
            <div className="flex items-end">
              <Button onClick={handleSearch} disabled={isLoading || !memberId.trim()} size="lg" className="gap-2">
                <Search className="h-4 w-4" />
                {isLoading ? "查詢中..." : "查詢"}
              </Button>
            </div>
          </div>

          {/* 查詢結果 */}
          {hasSearched && (usedCoupons.length > 0 || availableCoupons.length > 0) && (
            <div className="border-t border-border pt-6">
              <Tabs defaultValue="used" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="used">已使用優惠券 ({usedCoupons.length})</TabsTrigger>
                  <TabsTrigger value="available">可發放優惠券 ({availableCoupons.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="used" className="mt-6 space-y-3">
                  {usedCoupons.length > 0 ? (
                    <>
                      <div className="text-sm text-muted-foreground">會員 ID: ACC-{memberId}</div>
                      <div className="overflow-hidden rounded-md border border-border">
                        <table className="w-full text-sm">
                          <thead className="border-b border-border bg-muted/50">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium">優惠券名稱</th>
                              <th className="px-4 py-3 text-left font-medium">使用時間</th>
                              <th className="px-4 py-3 text-left font-medium">使用店家</th>
                              <th className="px-4 py-3 text-left font-medium">狀態</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {usedCoupons.map((coupon) => (
                              <tr key={coupon.couponId} className="transition-colors hover:bg-muted/30">
                                <td className="px-4 py-3 font-medium">{coupon.couponName}</td>
                                <td className="px-4 py-3 text-muted-foreground">{coupon.usedAt}</td>
                                <td className="px-4 py-3 text-muted-foreground">{coupon.usedStore}</td>
                                <td className="px-4 py-3">
                                  <span className="inline-flex items-center rounded-sm bg-primary px-2 py-0.5 text-xs font-medium text-primary-foreground">
                                    已使用
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <Card className="border-border">
                      <CardContent className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">此會員尚無已使用的優惠券</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="available" className="mt-6 space-y-3">
                  {availableCoupons.length > 0 ? (
                    <>
                      <div className="text-sm text-muted-foreground">會員 ID: ACC-{memberId}</div>
                      <div className="overflow-hidden rounded-md border border-border">
                        <table className="w-full text-sm">
                          <thead className="border-b border-border bg-muted/50">
                            <tr>
                              <th className="px-4 py-3 text-left font-medium">優惠券名稱</th>
                              <th className="px-4 py-3 text-left font-medium">優惠內容</th>
                              <th className="px-4 py-3 text-left font-medium">有效期限</th>
                              <th className="w-24 px-4 py-3 text-center font-medium">操作</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            {availableCoupons.map((coupon) => (
                              <tr key={coupon.couponId} className="transition-colors hover:bg-muted/30">
                                <td className="px-4 py-3 font-medium">{coupon.name}</td>
                                <td className="px-4 py-3 text-muted-foreground">{coupon.description}</td>
                                <td className="px-4 py-3 text-muted-foreground">至 {coupon.expiryDate}</td>
                                <td className="px-4 py-3 text-center">
                                  <Button onClick={() => handleCouponClick(coupon)} size="sm" className="gap-1.5">
                                    <Send className="h-3.5 w-3.5" />
                                    發券
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </>
                  ) : (
                    <Card className="border-border">
                      <CardContent className="py-8 text-center">
                        <p className="text-sm text-muted-foreground">此會員目前無可發放的優惠券</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          )}

          {hasSearched && usedCoupons.length === 0 && availableCoupons.length === 0 && !isLoading && (
            <Card className="border-border">
              <CardContent className="py-8 text-center">
                <p className="text-sm text-muted-foreground">此會員尚無相關優惠券記錄</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <DistributionConfirmDialog
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        coupon={selectedCoupon}
        memberId={`ACC-${memberId}`}
        onConfirm={handleConfirmDistribution}
      />
    </>
  )
}
