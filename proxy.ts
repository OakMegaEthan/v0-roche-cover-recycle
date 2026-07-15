import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { LOGIN_PATH, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, isProtectedPath } from "@/lib/mock-auth"

export default function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  const session = request.cookies.get(SESSION_COOKIE)

  // AC1.1 / AC1.3：未曾登入、或無有效 Cookie（逾期、損毀、快取被清除）→ 導向 OTP 登入頁。
  if (!session?.value) {
    const loginUrl = new URL(LOGIN_PATH, request.url)
    loginUrl.searchParams.set("redirect", `${pathname}${search}`)
    return NextResponse.redirect(loginUrl)
  }

  // AC1.2：已登入的瀏覽器直接進入功能頁面，並順延效期（15 天以「未造訪／操作」起算）。
  const response = NextResponse.next()
  response.cookies.set({
    name: SESSION_COOKIE,
    value: session.value,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
  })
  return response
}

export const config = {
  matcher: ["/sales/:path*", "/staff/:path*"],
}
