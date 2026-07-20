"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Mail, Pencil, RotateCw, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import {
  FIXED_OTP,
  OTP_LENGTH,
  OTP_RESEND_COOLDOWN_SECONDS,
  OTP_TTL_SECONDS,
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  isValidEmail,
  safeRedirect,
} from "@/lib/mock-auth"

type Step = "email" | "otp"

function formatSeconds(total: number) {
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, "0")}`
}

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = safeRedirect(searchParams.get("redirect"))

  const [step, setStep] = useState<Step>("email")
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const [otp, setOtp] = useState("")
  const [otpError, setOtpError] = useState("")
  const [sentAt, setSentAt] = useState<number | null>(null)
  const [now, setNow] = useState(() => Date.now())
  const otpInputRef = useRef<HTMLInputElement>(null)

  // 驅動效期與重新發送倒數。
  useEffect(() => {
    if (step !== "otp") return
    const timer = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(timer)
  }, [step])

  const elapsed = sentAt === null ? 0 : Math.floor((now - sentAt) / 1000)
  const expiresIn = Math.max(0, OTP_TTL_SECONDS - elapsed)
  const resendIn = Math.max(0, OTP_RESEND_COOLDOWN_SECONDS - elapsed)
  const isExpired = step === "otp" && expiresIn === 0

  const canSubmitOtp = useMemo(() => otp.length === OTP_LENGTH && !isExpired, [otp, isExpired])

  function sendOtp() {
    // AC1.4：未輸入或格式錯誤時顯示錯誤文字，且不發送 OTP。
    if (!email.trim()) {
      setEmailError("請輸入 email")
      return
    }
    if (!isValidEmail(email)) {
      setEmailError("email 格式不正確，請確認後再送出")
      return
    }

    // AC1.5：格式正確才發送，並進入 OTP 輸入狀態。
    setEmailError("")
    setOtp("")
    setOtpError("")
    setSentAt(Date.now())
    setNow(Date.now())
    setStep("otp")
  }

  // AC1.9：重新發送 OTP、清空已輸入 OTP，並重新起算效期與冷卻。
  function resendOtp() {
    if (resendIn > 0) return
    setOtp("")
    setOtpError("")
    setSentAt(Date.now())
    setNow(Date.now())
    otpInputRef.current?.focus()
  }

  // AC1.8：解鎖 email 欄位、清空已輸入 OTP，回到輸入狀態。
  function editEmail() {
    setStep("email")
    setOtp("")
    setOtpError("")
    setSentAt(null)
  }

  function submitOtp() {
    if (!canSubmitOtp) return

    if (isExpired) {
      setOtpError("驗證碼已逾期，請按「重新發送」取得新的驗證碼")
      return
    }
    // 無次數限制：驗證失敗不鎖定，可持續嘗試。
    if (otp !== FIXED_OTP) {
      setOtpError("驗證碼不正確，請確認後再試一次")
      setOtp("")
      return
    }

    // AC1.7：驗證通過，寫入 session cookie 後導向功能頁面。
    const value = encodeURIComponent(JSON.stringify({ email: email.trim(), loginAt: Date.now() }))
    document.cookie = `${SESSION_COOKIE}=${value}; max-age=${SESSION_MAX_AGE_SECONDS}; path=/; samesite=lax`
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <ShieldCheck className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">身份驗證</h1>
        <p className="mt-1 text-sm text-muted-foreground">請以 email 取得一次性驗證碼後登入</p>
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="請輸入 email"
            value={email}
            // AC1.8：OTP 狀態下 email 欄位為鎖定，需按「修改資料」才能編輯。
            readOnly={step === "otp"}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? "email-error" : undefined}
            className={step === "otp" ? "bg-muted text-muted-foreground" : undefined}
            onChange={(e) => {
              setEmail(e.target.value)
              if (emailError) setEmailError("")
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && step === "email") sendOtp()
            }}
          />
          {emailError && (
            <p id="email-error" className="text-sm text-destructive">
              {emailError}
            </p>
          )}
        </div>

        {step === "email" && (
          <Button className="mt-6 w-full" onClick={sendOtp}>
            發送驗證碼
          </Button>
        )}

        {step === "otp" && (
          <div className="mt-6 space-y-6">
            {/* AC1.5：系統顯示 email 已發送。 */}
            <div className="flex items-start gap-3 rounded-md border border-primary/20 bg-primary/5 p-3">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div className="text-sm">
                <p className="font-medium text-foreground">驗證碼已發送</p>
                <p className="text-muted-foreground">
                  請至 {email} 收取 {OTP_LENGTH} 位數驗證碼
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="otp">驗證碼</Label>
              <InputOTP
                id="otp"
                ref={otpInputRef}
                maxLength={OTP_LENGTH}
                value={otp}
                onChange={(value) => {
                  setOtp(value)
                  if (otpError) setOtpError("")
                }}
                // 手機開啟時顯示數字鍵盤。
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={isExpired}
                onComplete={() => {
                  if (!isExpired) submitOtp()
                }}
              >
                <InputOTPGroup className="w-full justify-between">
                  {Array.from({ length: OTP_LENGTH }).map((_, i) => (
                    <InputOTPSlot key={i} index={i} className="h-12 w-12 text-lg" />
                  ))}
                </InputOTPGroup>
              </InputOTP>

              <div className="flex items-center justify-between text-sm">
                {isExpired ? (
                  <span className="text-destructive">驗證碼已逾期</span>
                ) : (
                  <span className="text-muted-foreground">驗證碼將於 {formatSeconds(expiresIn)} 後失效</span>
                )}
              </div>

              {otpError && <p className="text-sm text-destructive">{otpError}</p>}
            </div>

            {/* AC1.6：未滿 6 碼時「確認登入」為 disable。 */}
            <Button className="w-full" disabled={!canSubmitOtp} onClick={submitOtp}>
              確認登入
            </Button>

            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={editEmail}>
                <Pencil className="h-3.5 w-3.5" />
                修改資料
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                disabled={resendIn > 0}
                onClick={resendOtp}
              >
                <RotateCw className="h-3.5 w-3.5" />
                {resendIn > 0 ? `重新發送（${resendIn}s）` : "重新發送"}
              </Button>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 rounded-md border border-dashed bg-muted/40 p-3 text-center text-xs text-muted-foreground">
        Mock 展示環境：不會實際寄送 email，驗證碼固定為{" "}
        <span className="font-mono font-semibold text-foreground">{FIXED_OTP}</span>
      </p>
    </div>
  )
}
