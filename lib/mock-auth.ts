/**
 * Mock 登入機制。此為介面 demo，無後端：驗證碼固定為 FIXED_OTP，
 * session 僅存在瀏覽器 cookie，不具任何實際安全性。
 */

export const SESSION_COOKIE = "roche_mock_session"

/** Cookie 登入效期 15 日（逾 15 天未造訪 / 操作即失效，每次造訪順延）。 */
export const SESSION_MAX_AGE_DAYS = 15
export const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_DAYS * 24 * 60 * 60

/** OTP 規則：6 位數字、效期 3 分鐘、重新發送等待 1 分鐘、無次數限制。 */
export const OTP_LENGTH = 6
export const OTP_TTL_SECONDS = 3 * 60
export const OTP_RESEND_COOLDOWN_SECONDS = 60

/** Mock 環境的固定驗證碼。 */
export const FIXED_OTP = "123456"

export const LOGIN_PATH = "/login"

/** 需要登入才能進入的功能區。 */
export const PROTECTED_PREFIXES = ["/sales", "/staff"]

export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

/**
 * 只接受站內絕對路徑，避免 ?redirect= 被塞入外部網址。
 * `//host` 與 `/\host` 會被瀏覽器當成協定相對網址，一併擋掉。
 */
export function safeRedirect(target: string | null | undefined, fallback = "/"): string {
  if (!target) return fallback
  if (!target.startsWith("/")) return fallback
  if (target.startsWith("//") || target.startsWith("/\\")) return fallback
  return target
}
