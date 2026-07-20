import { Suspense } from "react"
import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "登入 — 羅氏盒蓋回收",
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <Suspense>
        <LoginForm />
      </Suspense>
    </main>
  )
}
