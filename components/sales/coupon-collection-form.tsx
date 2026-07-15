"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { CollectionData, AvailableCoupon, CouponToCollect } from "@/app/page"
import { Building2, Receipt, ChevronDown, Check, AlertCircle } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface CouponCollectionFormProps {
  onSubmit: (data: CollectionData) => void
}

export function CouponCollectionForm({ onSubmit }: CouponCollectionFormProps) {
  const [storeName, setStoreName] = useState("")
  const [open, setOpen] = useState(false)
  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>([])
  const [couponsToCollect, setCouponsToCollect] = useState<CouponToCollect[]>([])
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const storeOptions = [
    "維康醫療用品",
    "杏一醫療用品",
    "躍獅連鎖藥局",
    "丁丁藥局",
    "大樹藥局",
    "啄木鳥藥局",
    "佑全保健藥妝",
    "屈臣氏藥局",
    "康是美藥妝店",
    "健康人生藥局",
    "長青連鎖藥局",
    "宏恩醫療器材",
    "安心藥局",
    "仁愛藥局",
    "信安藥局",
  ]

  const fetchAvailableCoupons = async (store: string) => {
    setLoading(true)
    // 模擬API延遲
    await new Promise((resolve) => setTimeout(resolve, 800))

    const mockData: AvailableCoupon[] = [
      { couponType: "2025年父親卡", availableQuantity: 100, lidRatio: 2, unitPrice: 300 },
      { couponType: "2025年07月生日卡", availableQuantity: 50, lidRatio: 1, unitPrice: 200 },
      { couponType: "2025年08月生日卡", availableQuantity: 30, lidRatio: 1, unitPrice: 200 },
      { couponType: "2025年09月生日卡", availableQuantity: 75, lidRatio: 1, unitPrice: 200 },
    ]

    setAvailableCoupons(mockData)
    // 初始化要銷帳的優惠券列表
    setCouponsToCollect(
      mockData.map((coupon) => ({
        couponType: coupon.couponType,
        quantityToSettle: 0,
        lidsRequired: 0,
        unitPrice: coupon.unitPrice,
        totalAmount: 0,
      })),
    )
    setLoading(false)
  }

  const handleStoreSelect = (selectedStore: string) => {
    setStoreName(selectedStore)
    setOpen(false)
    if (errors.storeName) setErrors((prev) => ({ ...prev, storeName: "" }))

    // 查詢該店家的可銷帳優惠券
    fetchAvailableCoupons(selectedStore)
  }

  const handleQuantityChange = (couponType: string, quantityToSettle: number) => {
    const availableCoupon = availableCoupons.find((c) => c.couponType === couponType)
    if (!availableCoupon) return

    // 確保不超過可銷帳數量
    const validQuantity = Math.min(Math.max(0, quantityToSettle), availableCoupon.availableQuantity)

    // 計算需要的盒蓋數量（使用比例，demo為1:1）
    const lidsRequired = validQuantity * availableCoupon.lidRatio

    const totalAmount = validQuantity * availableCoupon.unitPrice

    setCouponsToCollect((prev) =>
      prev.map((coupon) =>
        coupon.couponType === couponType
          ? { ...coupon, quantityToSettle: validQuantity, lidsRequired, totalAmount }
          : coupon,
      ),
    )

    if (errors.coupons) {
      setErrors((prev) => ({ ...prev, coupons: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!storeName) newErrors.storeName = "請選擇回收店家"

    const validCoupons = couponsToCollect.filter((coupon) => coupon.quantityToSettle > 0)
    if (validCoupons.length === 0) {
      newErrors.coupons = "請至少輸入一種優惠券的銷帳數量"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      const validCoupons = couponsToCollect.filter((coupon) => coupon.quantityToSettle > 0)
      onSubmit({
        storeName,
        couponsToCollect: validCoupons,
        notes,
      })
    }
  }

  const getTotalLidsRequired = () => {
    return couponsToCollect.reduce((total, coupon) => total + coupon.lidsRequired, 0)
  }

  const getTotalCouponsToSettle = () => {
    return couponsToCollect.reduce((total, coupon) => total + coupon.quantityToSettle, 0)
  }

  const getTotalAmount = () => {
    return couponsToCollect.reduce((total, coupon) => total + coupon.totalAmount, 0)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">填寫回收資訊</h2>
        <p className="text-muted-foreground text-sm">請選擇店家並確認銷帳數量</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="storeName" className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          回收店家 *
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={cn(
                "w-full justify-between",
                !storeName && "text-muted-foreground",
                errors.storeName && "border-destructive",
              )}
            >
              {storeName || "選擇店家..."}
              <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
            <Command>
              <CommandInput placeholder="搜尋店家..." />
              <CommandList>
                <CommandEmpty>找不到符合的店家</CommandEmpty>
                <CommandGroup>
                  {storeOptions.map((store) => (
                    <CommandItem key={store} value={store} onSelect={() => handleStoreSelect(store)}>
                      <Check className={cn("mr-2 h-4 w-4", storeName === store ? "opacity-100" : "opacity-0")} />
                      {store}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        {errors.storeName && <p className="text-sm text-destructive">{errors.storeName}</p>}
      </div>

      {storeName && (
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Receipt className="h-4 w-4" />
            可銷帳優惠券 *
          </Label>

          {loading ? (
            <div className="text-center py-8 text-muted-foreground">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-2" />
              <p className="text-sm">查詢中...</p>
            </div>
          ) : availableCoupons.length > 0 ? (
            <>
              <div className="space-y-3">
                {availableCoupons.map((availableCoupon) => {
                  const couponData = couponsToCollect.find((c) => c.couponType === availableCoupon.couponType)
                  return (
                    <div key={availableCoupon.couponType} className="bg-muted/30 rounded-lg p-3 space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <p className="font-medium text-sm">{availableCoupon.couponType}</p>
                          <p className="text-xs text-muted-foreground">
                            可銷帳：{availableCoupon.availableQuantity} 張
                            <span className="ml-2 text-primary font-medium">(${availableCoupon.unitPrice}/張)</span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1">
                          <Label htmlFor={`quantity-${availableCoupon.couponType}`} className="text-xs mb-1 block">
                            本次銷帳數量
                          </Label>
                          <Input
                            id={`quantity-${availableCoupon.couponType}`}
                            type="number"
                            min="0"
                            max={availableCoupon.availableQuantity}
                            value={couponData?.quantityToSettle || ""}
                            onChange={(e) =>
                              handleQuantityChange(availableCoupon.couponType, Number.parseInt(e.target.value) || 0)
                            }
                            placeholder="0"
                            className="h-9 text-center"
                          />
                        </div>
                        <div className="text-center pt-5">
                          <span className="text-muted-foreground">=</span>
                        </div>
                        <div className="flex-1">
                          <Label className="text-xs mb-1 block">需回收盒蓋</Label>
                          <div className="h-9 bg-background rounded border flex items-center justify-center">
                            <span className="font-semibold text-primary">{couponData?.lidsRequired || 0} 個</span>
                          </div>
                        </div>
                      </div>

                      {couponData && couponData.quantityToSettle > 0 && (
                        <div className="bg-primary/5 rounded px-2 py-1.5 flex justify-between items-center">
                          <span className="text-xs text-muted-foreground">銷帳金額</span>
                          <span className="text-sm font-bold text-primary">
                            ${couponData.totalAmount.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>

              {getTotalCouponsToSettle() > 0 && (
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <div className="flex justify-between items-center text-sm mb-2 pb-2 border-b">
                    <span className="font-medium">本次銷帳總金額：</span>
                    <Badge className="font-bold text-base px-3 py-1">${getTotalAmount().toLocaleString()}</Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-medium">本次銷帳優惠券總計：</span>
                    <Badge variant="secondary" className="font-semibold">
                      {getTotalCouponsToSettle()} 張
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center text-sm mt-2">
                    <span className="font-medium">需回收盒蓋總計：</span>
                    <Badge variant="outline" className="font-semibold">
                      {getTotalLidsRequired()} 個
                    </Badge>
                  </div>
                </div>
              )}

              {errors.coupons && <p className="text-sm text-destructive">{errors.coupons}</p>}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">此店家目前沒有可銷帳的優惠券</p>
            </div>
          )}
        </div>
      )}

      {/* 備註 */}
      {storeName && availableCoupons.length > 0 && (
        <div className="space-y-2">
          <Label htmlFor="notes">備註說明</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="請輸入其他相關說明（選填）"
            rows={3}
          />
        </div>
      )}

      {storeName && availableCoupons.length > 0 && (
        <Button type="submit" className="w-full" size="lg">
          確認並進行簽名
        </Button>
      )}
    </form>
  )
}
