import type React from "react"
import { Suspense } from "react"
import { StaffNav } from "@/components/staff/staff-nav"
import "./theme.css"

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<div className="h-[105px] border-b border-border bg-card" />}>
        <StaffNav />
      </Suspense>
      {children}
    </div>
  )
}
