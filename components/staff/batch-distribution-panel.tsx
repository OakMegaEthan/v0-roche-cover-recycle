"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BatchDistributionPanelProps {
  onSuccess: (count: number, message?: string) => void
}

export function BatchDistributionPanel({ onSuccess }: BatchDistributionPanelProps) {
  const [selectedCoupon, setSelectedCoupon] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const availableCoupons = [
    { id: "COUPON_001", name: "新用戶折扣券 - 100元" },
    { id: "COUPON_002", name: "會員專屬 - 200元" },
    { id: "COUPON_003", name: "生日禮券 - 50元" },
    { id: "COUPON_004", name: "滿千折百" },
  ]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ]
      if (validTypes.includes(file.type) || file.name.endsWith(".csv") || file.name.endsWith(".xlsx")) {
        setUploadedFile(file)
      } else {
        alert("請上傳 CSV 或 Excel 檔案")
      }
    }
  }

  const handleDistribute = async () => {
    if (!selectedCoupon) {
      alert("請選擇優惠券")
      return
    }

    if (!uploadedFile) {
      alert("請上傳會員名單檔案")
      return
    }

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const count = Math.floor(Math.random() * 100) + 1

    setIsLoading(false)
    onSuccess(count, `已成功批次發放 ${count} 張優惠券`)

    setUploadedFile(null)
    setSelectedCoupon("")
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="space-y-1 border-b border-border">
        <CardTitle className="text-xl font-semibold">批次發放優惠券</CardTitle>
        <CardDescription className="text-muted-foreground">上傳會員名單檔案進行批量發放</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium">上傳會員名單</Label>
          <div className="space-y-2">
            <Input
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileChange}
              className="cursor-pointer file:mr-4 file:cursor-pointer file:rounded-sm file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
            />
            {uploadedFile && (
              <p className="text-sm text-muted-foreground">
                已選擇：<span className="font-medium text-foreground">{uploadedFile.name}</span>
              </p>
            )}
            <p className="text-xs text-muted-foreground">請上傳包含 account_id 欄位的 CSV 或 Excel 檔案</p>
          </div>
        </div>

        <div className="space-y-3">
          <Label htmlFor="batch-coupon-select" className="text-sm font-medium">
            選擇優惠券
          </Label>
          <Select value={selectedCoupon} onValueChange={setSelectedCoupon}>
            <SelectTrigger id="batch-coupon-select" className="w-full">
              <SelectValue placeholder="請選擇要發放的優惠券" />
            </SelectTrigger>
            <SelectContent>
              {availableCoupons.map((coupon) => (
                <SelectItem key={coupon.id} value={coupon.id}>
                  {coupon.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">每次發放只會發送一張優惠券給名單中的每位會員</p>
        </div>

        <div className="flex justify-end border-t border-border pt-6">
          <Button onClick={handleDistribute} disabled={isLoading} size="lg" className="min-w-[160px] font-medium">
            {isLoading ? "發放中..." : "確認批次發放"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
