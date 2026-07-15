"use client"

import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface ScannedItem {
  name: string
  serialNumber: string
}

const mockCouponDetails = {
  1: {
    id: 1,
    name: "新用戶專享折扣",
    description: "首次購買享有20%折扣優惠",
    validUntil: "2024-12-31",
    image: "/discount-coupon.png",
    requiredScans: 1,
  },
  2: {
    id: 2,
    name: "買3送1優惠券",
    description: "購買三個指定商品即可獲得一個免費商品",
    validUntil: "2024-10-15",
    image: "/wrapped-birthday-gift.png",
    requiredScans: 3,
  },
  3: {
    id: 3,
    name: "生日特惠券",
    description: "生日月份專屬優惠，全館商品85折",
    validUntil: "2024-10-15",
    image: "/wrapped-birthday-gift.png",
    requiredScans: 1,
  },
  4: {
    id: 4,
    name: "買三送一優惠券",
    description: "購買三個指定商品即可獲得一個免費商品",
    validUntil: "2024-12-31",
    image: "/summer-sale-display.png",
    requiredScans: 3,
  },
  5: {
    id: 5,
    name: "VIP會員專屬",
    description: "VIP會員限定優惠，購買兩件商品享受特別折扣",
    validUntil: "2024-11-15",
    image: "/vip-member.png",
    requiredScans: 2,
  },
}

export default function CouponScannerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const couponId = Number.parseInt(params.id)
  const coupon = mockCouponDetails[couponId as keyof typeof mockCouponDetails]

  const [scannedCount, setScannedCount] = useState(0)
  const [scannedItems, setScannedItems] = useState<ScannedItem[]>([])

  if (!coupon) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">優惠券不存在</p>
      </div>
    )
  }

  const generateMockProduct = (index: number): ScannedItem => {
    const products = [
      { name: "優勝血糖機試紙 x1", serialNumber: "PA5zwYg67" },
      { name: "智航血糖機試紙 x1", serialNumber: "GE5Z7Xi4J" },
      { name: "維他命C錠 x1", serialNumber: "CV3pQ7r45" },
      { name: "感冒糖漿 x1", serialNumber: "MZ9tL6w23" },
      { name: "OK繃 x1", serialNumber: "AD4sF8h12" },
    ]
    return products[index % products.length]
  }

  const handleScannerClick = () => {
    const newScannedCount = scannedCount + 1
    const newScannedItem = generateMockProduct(scannedCount)

    setScannedCount(newScannedCount)
    setScannedItems([...scannedItems, newScannedItem])

    if (newScannedCount >= coupon.requiredScans) {
      setTimeout(() => {
        router.push(`/consumer/coupon/${couponId}/verification`)
      }, 1000) // 短暫延遲讓用戶看到完成狀態
    }
  }

  const handleRemoveScannedItem = (indexToRemove: number) => {
    const newScannedItems = scannedItems.filter((_, index) => index !== indexToRemove)
    setScannedItems(newScannedItems)
    setScannedCount(newScannedItems.length)
  }

  const isCompleted = scannedCount >= coupon.requiredScans

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* 返回按鈕 */}
        <div className="flex items-center p-4 border-b">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="ml-2 text-lg font-semibold">掃描優惠券</h1>
        </div>

        <div className="p-4 space-y-6">
          {/* 正在使用的優惠券名稱 */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-foreground">正在使用</h2>
            <p className="text-base text-muted-foreground mt-1">{coupon.name}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">掃描進度</span>
              <span className="text-sm font-bold text-foreground">
                {scannedCount}/{coupon.requiredScans}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(scannedCount / coupon.requiredScans) * 100}%` }}
              ></div>
            </div>
            {isCompleted && (
              <div className="flex items-center mt-2 text-green-600">
                <CheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">掃描完成！</span>
              </div>
            )}
          </div>

          {scannedItems.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">已掃描商品</h3>
              <div className="space-y-1">
                {scannedItems.map((item, index) => (
                  <div key={index} className="flex items-center justify-between bg-muted/30 rounded-lg p-3">
                    <div className="flex items-start flex-1">
                      <CheckCircle className="w-4 h-4 mr-2 text-green-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">序號: {item.serialNumber}</div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveScannedItem(index)}
                      className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600 flex-shrink-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div
              className={`relative bg-black rounded-lg overflow-hidden aspect-square transition-opacity ${
                isCompleted ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:opacity-90"
              }`}
              onClick={isCompleted ? undefined : handleScannerClick}
            >
              <img src="/placeholder-6gkxr.png" alt="QR Code Scanner" className="w-full h-full object-cover" />

              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-48 h-48 border-2 border-white rounded-lg relative ${isCompleted ? "border-green-500" : ""}`}
                >
                  <div
                    className={`absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 rounded-tl-lg ${isCompleted ? "border-green-500" : "border-blue-500"}`}
                  ></div>
                  <div
                    className={`absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 rounded-tr-lg ${isCompleted ? "border-green-500" : "border-blue-500"}`}
                  ></div>
                  <div
                    className={`absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 rounded-bl-lg ${isCompleted ? "border-green-500" : "border-blue-500"}`}
                  ></div>
                  <div
                    className={`absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 rounded-br-lg ${isCompleted ? "border-green-500" : "border-blue-500"}`}
                  ></div>
                </div>
              </div>

              {!isCompleted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-0.5 bg-blue-500 opacity-80 animate-pulse"></div>
                </div>
              )}

              {isCompleted && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <CheckCircle className="w-16 h-16 text-green-500" />
                </div>
              )}
            </div>

            <div className="text-center px-4">
              {!isCompleted ? (
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {coupon.requiredScans > 1
                    ? `請掃描第 ${scannedCount + 1} 個商品盒蓋 (共需 ${coupon.requiredScans} 個)`
                    : "掃描盒蓋後將消耗優惠券，請由店家人員進行操作"}
                </p>
              ) : (
                <p className="text-sm text-green-600 font-medium leading-relaxed">
                  所有商品掃描完成！正在進入核銷頁面...
                </p>
              )}
            </div>
          </div>

          <div className="pt-4">
            <Button variant="outline" onClick={() => router.back()} className="w-full h-12 text-base">
              取消使用
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
