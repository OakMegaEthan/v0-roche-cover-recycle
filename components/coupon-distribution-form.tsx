"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Upload, User } from "lucide-react"

interface CouponDistributionFormProps {
  onSuccess: (count: number) => void
  defaultAccountId?: string
}

export function CouponDistributionForm({ onSuccess, defaultAccountId }: CouponDistributionFormProps) {
  const [distributionType, setDistributionType] = useState<"batch" | "single">("single")
  const [selectedCoupon, setSelectedCoupon] = useState("")
  const [singleAccountId, setSingleAccountId] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (defaultAccountId) {
      setSingleAccountId(defaultAccountId)
      setDistributionType("single")
    }
  }, [defaultAccountId])

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

    if (distributionType === "batch" && !uploadedFile) {
      alert("請上傳會員名單檔案")
      return
    }

    if (distributionType === "single" && !singleAccountId.trim()) {
      alert("請輸入會員 Account ID")
      return
    }

    setIsLoading(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const count = distributionType === "batch" ? Math.floor(Math.random() * 100) + 1 : 1

    setIsLoading(false)
    onSuccess(count)

    setUploadedFile(null)
    setSingleAccountId("")
  }

  return (
    <Card className="border-border bg-card shadow-sm">
      <CardHeader className="space-y-1 border-b border-border">
        <CardTitle className="text-xl font-semibold">發放優惠券</CardTitle>
        <CardDescription className="text-muted-foreground">選擇發放對象並指定優惠券類型</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 pt-6">
        <div className="space-y-4">
          <Label className="text-sm font-medium">發放方式</Label>
          <RadioGroup
            value={distributionType}
            onValueChange={(value) => setDistributionType(value as "batch" | "single")}
            className="grid grid-cols-2 gap-4"
          >
            <div>
              <RadioGroupItem value="single" id="single" className="peer sr-only" />
              <Label
                htmlFor="single"
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-border bg-background p-6 transition-all hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent"
              >
                <User className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">單一發放</div>
                  <div className="mt-1 text-xs text-muted-foreground">輸入單一 Account ID</div>
                </div>
              </Label>
            </div>
            <div>
              <RadioGroupItem value="batch" id="batch" className="peer sr-only" />
              <Label
                htmlFor="batch"
                className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-md border-2 border-border bg-background p-6 transition-all hover:bg-accent peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-accent"
              >
                <Upload className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium">批量發放</div>
                  <div className="mt-1 text-xs text-muted-foreground">上傳 CSV / Excel</div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium">發放對象</Label>
          {distributionType === "single" ? (
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="請輸入 Account ID"
                value={singleAccountId}
                onChange={(e) => setSingleAccountId(e.target.value)}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">輸入單一會員的 Account ID</p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="cursor-pointer file:mr-4 file:cursor-pointer file:rounded-sm file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
              {uploadedFile && (
                <p className="text-sm text-muted-foreground">
                  已選擇：<span className="font-medium text-foreground">{uploadedFile.name}</span>
                </p>
              )}
              <p className="text-xs text-muted-foreground">請上傳包含 account_id 欄位的 CSV 或 Excel 檔案</p>
            </div>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="coupon-select" className="text-sm font-medium">
            選擇優惠券
          </Label>
          <Select value={selectedCoupon} onValueChange={setSelectedCoupon}>
            <SelectTrigger id="coupon-select" className="w-full">
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
          <p className="text-xs text-muted-foreground">每次發放只會發送一張優惠券給指定對象</p>
        </div>

        <div className="flex justify-end border-t border-border pt-6">
          <Button onClick={handleDistribute} disabled={isLoading} size="lg" className="min-w-[160px] font-medium">
            {isLoading ? "發放中..." : "確認發放"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
