import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "羅氏盒蓋回收 — Mockup 導覽",
  description: "五個介面 mockup 的入口",
}

const mockups = [
  {
    href: "/sales",
    name: "業務盒蓋回收",
    description: "業務端回收登錄與電子簽名",
    note: "需 OTP 登入",
  },
  {
    href: "/staff",
    name: "工作人員會員優惠券查詢與發放",
    description: "會員查詢、單筆與批次發券、權限管理",
    note: "需 OTP 登入；加上 ?role=user 可切換為一般使用者（客服）視角",
  },
  {
    href: "/store/recycling-batches",
    name: "店家盒蓋回收進度檢視",
    description: "回收批次銷帳進度與優惠券狀態",
  },
  {
    href: "/consumer",
    name: "消費者優惠券使用流程",
    description: "持券、掃碼、核銷",
  },
  {
    href: "/store-verification",
    name: "店家驗證密碼查詢",
    description: "選擇店家對象，取得官方帳號邀請入口與驗證密碼",
  },
]

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-6 md:p-10">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">羅氏盒蓋回收</h1>
          <p className="text-sm md:text-base text-muted-foreground">五個介面 mockup，點擊進入各自的流程</p>
        </div>

        <div className="grid gap-4">
          {mockups.map((mockup) => (
            <Link
              key={mockup.href}
              href={mockup.href}
              className="block p-5 rounded-lg border bg-card hover:bg-accent/5 hover:border-primary/50 transition-colors"
            >
              <div className="font-semibold text-card-foreground mb-1">{mockup.name}</div>
              <div className="text-sm text-muted-foreground">{mockup.description}</div>
              {mockup.note && <div className="mt-2 text-xs text-muted-foreground/80">{mockup.note}</div>}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
