"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

type CouponStatus = {
  name: string
  used: number
  remaining: number
  lidsRequired: number
  deadline: string
}

const mockCouponStatuses: CouponStatus[] = [
  {
    name: "2025年父親卡",
    used: 150,
    remaining: 20,
    lidsRequired: 40,
    deadline: "2025-12-31",
  },
  {
    name: "2025年07月生日卡",
    used: 80,
    remaining: 10,
    lidsRequired: 20,
    deadline: "2025-08-31",
  },
  {
    name: "2025年08月生日卡",
    used: 30,
    remaining: 15,
    lidsRequired: 30,
    deadline: "2025-09-30",
  },
  {
    name: "2025年09月生日卡",
    used: 23,
    remaining: 52,
    lidsRequired: 104,
    deadline: "2025-10-31",
  },
]

export function CouponStatusPanel() {
  return (
    <Accordion type="single" collapsible defaultValue="coupon-status">
      <AccordionItem value="coupon-status" className="border rounded-lg overflow-hidden bg-card">
        <AccordionTrigger className="px-4 py-4 md:px-6 hover:no-underline hover:bg-muted/50 transition-colors">
          <span className="font-semibold text-foreground text-sm md:text-base">優惠券使用狀況</span>
        </AccordionTrigger>
        <AccordionContent className="px-4 pb-4 md:px-6 md:pb-5 pt-1">
          <div className="grid grid-cols-2 gap-3">
            {mockCouponStatuses.map((coupon, index) => (
              <div key={index} className="border rounded-lg p-3 bg-muted/20 space-y-2">
                <p className="text-sm font-semibold text-foreground leading-snug">{coupon.name}</p>
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">已使用</span>
                    <span className="text-xs font-medium text-foreground">{coupon.used} 張</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">剩餘可回收</span>
                    <span className="text-xs font-medium text-foreground">{coupon.remaining} 張</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">需回收盒蓋</span>
                    <span className="text-xs font-medium text-foreground">{coupon.lidsRequired} 個</span>
                  </div>
                  <div className="flex items-center justify-between gap-2 pt-1 border-t">
                    <span className="text-xs text-muted-foreground">回收期限</span>
                    <span className="text-xs font-medium text-foreground">{coupon.deadline}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
