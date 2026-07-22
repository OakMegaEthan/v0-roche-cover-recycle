import type { Metadata } from "next"
import { VerificationCodeLookup } from "@/components/store-verification/verification-code-lookup"

export const metadata: Metadata = {
  title: "店家驗證密碼查詢",
  description: "選擇店家對象，取得該店家的官方帳號邀請入口與驗證密碼",
}

export default function StoreVerificationPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 md:py-8 max-w-md">
        <VerificationCodeLookup />
      </div>
    </main>
  )
}
