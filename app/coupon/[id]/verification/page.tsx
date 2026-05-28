"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

// 模擬優惠券資料
const mockCouponDetails = {
  1: {
    id: 1,
    name: "新用戶專享折扣",
    description: "首次購買享有20%折扣優惠",
    validUntil: "2024-12-31",
    image: "/discount-coupon.png",
  },
  2: {
    id: 2,
    name: "免運費券",
    description: "單筆訂單滿$500即可享免運費優惠",
    validUntil: "2024-11-30",
    image: "/free-shipping-banner.png",
  },
  3: {
    id: 3,
    name: "生日特惠券",
    description: "生日月份專屬優惠，全館商品85折",
    validUntil: "2024-10-15",
    image: "/wrapped-birthday-gift.png",
  },
}

// 模擬店家資料
const mockStoreData = {
  STORE001: "星巴克咖啡 - 信義店",
  STORE002: "麥當勞 - 台北車站店",
  STORE003: "全家便利商店 - 敦化店",
}

export default function VerificationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const couponId = Number.parseInt(params.id)
  const coupon = mockCouponDetails[couponId as keyof typeof mockCouponDetails]

  const [inputValue, setInputValue] = useState("")
  const [inputMethod, setInputMethod] = useState<"code" | "phone">("code")
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedStore, setSelectedStore] = useState("")

  if (!coupon) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">優惠券不存在</p>
      </div>
    )
  }

  const handleSubmit = () => {
    if (inputValue.trim()) {
      const storeName =
        inputMethod === "code" ? mockStoreData[inputValue as keyof typeof mockStoreData] || "未知店家" : "未知店家"
      setSelectedStore(storeName)
      setShowConfirmModal(true)
    }
  }

  const isInputValid = inputValue.trim().length > 0

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto">
        {/* 返回按鈕 */}
        <div className="flex items-center p-4 border-b">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="ml-2 text-lg font-semibold">輸入門市核銷資訊</h1>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">門市核銷資訊</h2>
              <p className="text-sm text-muted-foreground">請選擇輸入方式並填寫門市資訊</p>
            </div>

            <div className="space-y-4">
              {/* Radio Button 選擇 */}
              <div className="space-y-3">
                <p className="text-sm font-medium">選擇輸入方式</p>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="inputMethod"
                      value="code"
                      checked={inputMethod === "code"}
                      onChange={(e) => setInputMethod(e.target.value as "code" | "phone")}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm">門市電話</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="inputMethod"
                      value="phone"
                      checked={inputMethod === "phone"}
                      onChange={(e) => setInputMethod(e.target.value as "code" | "phone")}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-sm">門市代碼</span>
                  </label>
                </div>
              </div>

              {/* 輸入框 */}
              <div className="space-y-3">
                <Input
                  type={inputMethod === "phone" ? "tel" : "text"}
                  placeholder={inputMethod === "code" ? "請輸入門市電話" : "請輸入門市代碼"}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="h-11 text-base"
                />
                <Button onClick={handleSubmit} className="w-full h-11" disabled={!isInputValid}>
                  確認核銷
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 確認彈窗 */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-6 w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-4 text-center">確認核銷</h3>

              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">使用優惠券</p>
                  <p className="font-medium">{coupon.name}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">核銷門市</p>
                  <p className="font-medium">{selectedStore}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">核銷方式</p>
                  <p className="font-medium">
                    {inputMethod === "code" ? `門市代碼：${inputValue}` : `門市電話：${inputValue}`}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowConfirmModal(false)} className="flex-1">
                  取消
                </Button>
                <Button
                  onClick={() => {
                    setShowConfirmModal(false)
                    router.push("/")
                  }}
                  className="flex-1"
                >
                  確認使用
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
