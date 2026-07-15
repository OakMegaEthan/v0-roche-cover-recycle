"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"

type CouponDetail = {
  couponName: string
  unitPrice: number
  writeOffCount: number
  lidCount: number
  amount: number
}

type RecyclingBatch = {
  id: string
  status: "reviewing" | "completed" | "cancelled"
  date: string
  coupons: CouponDetail[]
  signerName: string
  collectorName: string
  reviewedTime?: string
}

const mockBatches: RecyclingBatch[] = [
  {
    id: "RC-2025-001",
    status: "reviewing",
    date: "2025-01-10 14:25",
    coupons: [
      { couponName: "2025年父親卡", unitPrice: 300, writeOffCount: 100, lidCount: 200, amount: 30000 },
      { couponName: "2025年07月生日卡", unitPrice: 200, writeOffCount: 50, lidCount: 50, amount: 10000 },
    ],
    collectorName: "張業務",
    signerName: "王小明",
  },
  {
    id: "RC-2025-002",
    status: "completed",
    date: "2025-01-08 09:15",
    coupons: [
      { couponName: "2025年父親卡", unitPrice: 300, writeOffCount: 80, lidCount: 160, amount: 24000 },
      { couponName: "2025年08月生日卡", unitPrice: 200, writeOffCount: 25, lidCount: 50, amount: 5000 },
    ],
    collectorName: "李業務",
    signerName: "李美華",
    reviewedTime: "2025-01-09 14:30",
  },
  {
    id: "RC-2025-003",
    status: "completed",
    date: "2025-01-05 16:40",
    coupons: [
      { couponName: "2025年09月生日卡", unitPrice: 200, writeOffCount: 75, lidCount: 75, amount: 15000 },
      { couponName: "2025年父親卡", unitPrice: 300, writeOffCount: 30, lidCount: 60, amount: 9000 },
    ],
    collectorName: "陳業務",
    signerName: "張志強",
    reviewedTime: "2025-01-06 10:15",
  },
  {
    id: "RC-2025-004",
    status: "reviewing",
    date: "2025-01-03 11:30",
    coupons: [{ couponName: "2025年07月生日卡", unitPrice: 200, writeOffCount: 40, lidCount: 40, amount: 8000 }],
    collectorName: "林業務",
    signerName: "陳玉珍",
  },
  {
    id: "RC-2024-156",
    status: "completed",
    date: "2024-12-28 13:20",
    coupons: [
      { couponName: "2025年父親卡", unitPrice: 300, writeOffCount: 60, lidCount: 120, amount: 18000 },
      { couponName: "2024年12月生日卡", unitPrice: 200, writeOffCount: 35, lidCount: 35, amount: 7000 },
    ],
    collectorName: "王業務",
    signerName: "林佳慧",
    reviewedTime: "2024-12-29 16:45",
  },
  {
    id: "RC-2024-155",
    status: "cancelled",
    date: "2024-12-25 10:05",
    coupons: [
      { couponName: "2024年11月生日卡", unitPrice: 200, writeOffCount: 28, lidCount: 28, amount: 5600 },
      { couponName: "2025年父親卡", unitPrice: 300, writeOffCount: 17, lidCount: 34, amount: 5100 },
    ],
    collectorName: "黃業務",
    signerName: "黃建國",
    reviewedTime: "2024-12-26 09:20",
  },
]

const getStatusConfig = (status: RecyclingBatch["status"]) => {
  switch (status) {
    case "completed":
      return { label: "審核完成", variant: "default" as const, className: "bg-green-600 hover:bg-green-700" }
    case "cancelled":
      return {
        label: "已取消",
        variant: "secondary" as const,
        className: "bg-orange-500 hover:bg-orange-600 text-white",
      }
    case "reviewing":
    default:
      return { label: "審核中", variant: "secondary" as const }
  }
}

const formatCurrency = (amount: number) => {
  return `$${amount.toLocaleString()}`
}

export function RecyclingBatchList() {
  return (
    <Accordion type="single" collapsible className="space-y-3 md:space-y-4">
      {mockBatches.map((batch) => {
        const statusConfig = getStatusConfig(batch.status)
        const isReviewed = batch.status !== "reviewing"

        const totalWriteOff = batch.coupons.reduce((sum, c) => sum + c.writeOffCount, 0)
        const totalLids = batch.coupons.reduce((sum, c) => sum + c.lidCount, 0)
        const totalAmount = batch.coupons.reduce((sum, c) => sum + c.amount, 0)

        return (
          <AccordionItem key={batch.id} value={batch.id} className="border rounded-lg overflow-hidden bg-card">
            <AccordionTrigger className="px-4 py-4 md:px-6 hover:no-underline hover:bg-muted/50 transition-colors">
              <div className="flex flex-col w-full gap-2.5 pr-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm md:text-base font-semibold text-foreground">{batch.id}</span>
                  <Badge variant={statusConfig.variant} className={`shrink-0 text-xs ${statusConfig.className || ""}`}>
                    {statusConfig.label}
                  </Badge>
                </div>

                <div className="text-sm md:text-base text-muted-foreground self-start">回收時間：{batch.date}</div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="px-4 pb-4 md:px-6 md:pb-6 pt-2">
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm md:text-base text-muted-foreground">回收業務人員</span>
                  <span className="text-base md:text-lg font-semibold text-foreground">{batch.collectorName}</span>
                </div>

                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm md:text-base text-muted-foreground">店家簽名人員</span>
                  <span className="text-base md:text-lg font-semibold text-foreground">{batch.signerName}</span>
                </div>

                <div className="space-y-3">
                  <h3 className="text-sm md:text-base font-medium text-foreground">回收明細</h3>

                  <div className="space-y-3">
                    {batch.coupons.map((coupon, index) => (
                      <div key={index} className="border rounded-lg p-3 bg-muted/20">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-foreground text-sm md:text-base">{coupon.couponName}</span>
                          <span className="text-xs md:text-sm text-muted-foreground">
                            {formatCurrency(coupon.unitPrice)}/張
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 bg-background rounded border">
                            <div className="text-xs text-muted-foreground mb-1">銷帳</div>
                            <div className="font-semibold text-foreground text-sm">{coupon.writeOffCount} 張</div>
                          </div>
                          <div className="text-center p-2 bg-background rounded border">
                            <div className="text-xs text-muted-foreground mb-1">回收盒蓋</div>
                            <div className="font-semibold text-foreground text-sm">{coupon.lidCount} 個</div>
                          </div>
                          <div className="text-center p-2 bg-background rounded border">
                            <div className="text-xs text-muted-foreground mb-1">金額</div>
                            <div className="font-semibold text-foreground text-sm">{formatCurrency(coupon.amount)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between text-sm font-semibold pb-2 border-b border-border">
                      <span className="text-foreground">銷帳總金額</span>
                      <span className="text-foreground text-base">{formatCurrency(totalAmount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-1">
                      <span className="text-muted-foreground">銷帳優惠券總計</span>
                      <span className="font-medium text-foreground">{totalWriteOff} 張</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">回收盒蓋總計</span>
                      <span className="font-medium text-foreground">{totalLids} 個</span>
                    </div>
                  </div>

                  {isReviewed && batch.reviewedTime && (
                    <div className="flex items-center justify-between pt-2 text-sm">
                      <span className="text-muted-foreground">審核時間</span>
                      <span className="text-foreground font-medium">{batch.reviewedTime}</span>
                    </div>
                  )}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
