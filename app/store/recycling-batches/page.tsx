import type { Metadata } from "next"
import { RecyclingBatchList } from "@/components/store/recycling-batch-list"
import { CouponStatusPanel } from "@/components/store/coupon-status-panel"

export const metadata: Metadata = {
  title: "羅氏血糖機 e-coupon 回收查詢",
  description: "檢視盒蓋回收批次的審核狀態與銷帳進度",
}

const mockStore = {
  name: "杏一醫療用品 台大榮總二分店",
}

export default function RecyclingBatchesPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">羅氏血糖機 e-coupon 回收查詢</h1>
          <p className="text-sm md:text-base text-muted-foreground">檢視每次回收批次的盒蓋銷帳進度</p>
        </div>

        <div className="mb-4 p-4 bg-muted/30 rounded-lg border">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">店家身份：</span>
            <span className="text-sm md:text-base font-semibold text-foreground">{mockStore.name}</span>
          </div>
        </div>

        <div className="mb-6">
          <CouponStatusPanel />
        </div>

        <RecyclingBatchList />
      </div>
    </main>
  )
}
