"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import type { CollectionData, SignatureData } from "@/app/page"
import { PenTool, RotateCcw, Check, Maximize2 } from "lucide-react"

interface SignatureCaptureProps {
  collectionData: CollectionData
  onComplete: (signature: SignatureData) => void
  onBack: () => void
}

export function SignatureCapture({ collectionData, onComplete, onBack }: SignatureCaptureProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [signedBy, setSignedBy] = useState("")
  const [hasSignature, setHasSignature] = useState(false)
  const [error, setError] = useState("")
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 設置畫布樣式
    ctx.strokeStyle = "#1f2937"
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // 設置畫布背景
    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // 重新設置畫布樣式
    ctx.strokeStyle = "#1f2937"
    ctx.lineWidth = isFullscreen ? 3 : 2 // 全螢幕時線條更粗
    ctx.lineCap = "round"
    ctx.lineJoin = "round"

    // 如果已有簽名，保持畫布內容
    if (!hasSignature) {
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [isFullscreen, hasSignature])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    setHasSignature(true)
    setError("")

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let x, y
    if ("touches" in e) {
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let x, y
    if ("touches" in e) {
      e.preventDefault()
      x = e.touches[0].clientX - rect.left
      y = e.touches[0].clientY - rect.top
    } else {
      x = e.clientX - rect.left
      y = e.clientY - rect.top
    }

    ctx.lineTo(x, y)
    ctx.stroke()
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.fillStyle = "#ffffff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
    setError("")
  }

  const enterFullscreen = () => {
    setIsFullscreen(true)
    // 防止頁面滾動
    document.body.style.overflow = "hidden"
  }

  const exitFullscreen = () => {
    setIsFullscreen(false)
    // 恢復頁面滾動
    document.body.style.overflow = ""
  }

  const handleComplete = () => {
    if (!hasSignature) {
      setError("請先進行簽名")
      return
    }

    if (!signedBy.trim()) {
      setError("請輸入簽名人員姓名")
      return
    }

    const canvas = canvasRef.current
    if (!canvas) return

    const signatureDataUrl = canvas.toDataURL()

    onComplete({
      signature: signatureDataUrl,
      signedBy: signedBy.trim(),
      signedAt: new Date(),
    })
  }

  const getTotalLidsRequired = () => {
    return collectionData.couponsToCollect.reduce((total, coupon) => total + coupon.lidsRequired, 0)
  }

  const getTotalAmount = () => {
    return collectionData.couponsToCollect.reduce((total, coupon) => total + coupon.totalAmount, 0)
  }

  const getTotalCouponsToSettle = () => {
    return collectionData.couponsToCollect.reduce((total, coupon) => total + coupon.quantityToSettle, 0)
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 z-50 bg-background flex flex-col">
        {/* 頂部提示區 */}
        <div className="bg-primary text-primary-foreground p-3 text-center">
          <p className="text-sm font-medium">請將手機橫向放置，讓店家人員簽名</p>
        </div>

        {/* 簽名區域 */}
        <div className="flex-1 flex flex-col p-4 landscape:p-2">
          <div className="flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Label className="flex items-center gap-2 text-base">
                <PenTool className="h-5 w-5" />
                請在下方區域簽名
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSignature}
                className="flex items-center gap-2 bg-transparent"
              >
                <RotateCcw className="h-4 w-4" />
                重簽
              </Button>
            </div>

            <div className="flex-1 border-2 border-dashed border-border rounded-lg p-2 bg-card flex items-center justify-center">
              <canvas
                ref={canvasRef}
                width={800}
                height={400}
                className="w-full h-full border-2 border-border rounded cursor-crosshair bg-white touch-none"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
              />
            </div>
          </div>

          {/* 完成按鈕 */}
          <div className="mt-4 landscape:mt-2">
            <Button
              onClick={exitFullscreen}
              size="lg"
              className="w-full flex items-center justify-center gap-2 h-12 text-base"
            >
              <Check className="h-5 w-5" />
              完成簽名
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">確認資訊並簽名</h2>
        <p className="text-muted-foreground text-sm">請確認回收資訊無誤後進行數位簽名</p>
      </div>

      <div className="bg-muted/30 rounded-lg p-4 border border-border/50">
        <h3 className="font-medium text-foreground mb-3">回收資訊確認</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">回收店家：</span>
            <span className="font-medium">{collectionData.storeName}</span>
          </div>
          <div>
            <span className="text-muted-foreground block mb-2">本次銷帳明細：</span>
            <div className="space-y-2">
              {collectionData.couponsToCollect.map((coupon, index) => (
                <div key={index} className="bg-background/50 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-sm">{coupon.couponType}</span>
                    <span className="text-xs text-muted-foreground">${coupon.unitPrice.toLocaleString()}/張</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-muted/50 rounded px-2 py-1.5">
                      <div className="text-xs text-muted-foreground">銷帳</div>
                      <div className="font-semibold text-foreground">{coupon.quantityToSettle} 張</div>
                    </div>
                    <div className="bg-muted/50 rounded px-2 py-1.5">
                      <div className="text-xs text-muted-foreground">回收盒蓋</div>
                      <div className="font-semibold text-primary">{coupon.lidsRequired} 個</div>
                    </div>
                    <div className="bg-muted/50 rounded px-2 py-1.5">
                      <div className="text-xs text-muted-foreground">金額</div>
                      <div className="font-bold text-primary">${coupon.totalAmount.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 mt-4">
            <div className="flex justify-between items-center text-sm mb-2 pb-2 border-b border-primary/10">
              <span className="font-medium">本次銷帳總金額：</span>
              <Badge className="font-bold text-base px-3 py-1.5">${getTotalAmount().toLocaleString()}</Badge>
            </div>
            <div className="flex justify-between items-center text-sm mb-2">
              <span className="font-medium">本次銷帳優惠券總計：</span>
              <Badge variant="secondary" className="font-semibold">
                {getTotalCouponsToSettle()} 張
              </Badge>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">需回收盒蓋總計：</span>
              <Badge variant="outline" className="font-semibold">
                {getTotalLidsRequired()} 個
              </Badge>
            </div>
          </div>
          {collectionData.notes && (
            <div className="pt-2 border-t border-border/50">
              <span className="text-muted-foreground">備註說明：</span>
              <p className="mt-1 text-foreground bg-muted/30 rounded p-2">{collectionData.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* 簽名人員姓名 */}
      <div className="space-y-2">
        <Label htmlFor="signedBy">店家簽名人員 *</Label>
        <Input
          id="signedBy"
          value={signedBy}
          onChange={(e) => {
            setSignedBy(e.target.value)
            if (error) setError("")
          }}
          placeholder="請輸入店家簽名人員姓名"
          className={error && !signedBy.trim() ? "border-destructive" : ""}
        />
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label className="flex items-center gap-2">
            <PenTool className="h-4 w-4" />
            數位簽名 *
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={clearSignature}
            className="flex items-center gap-2 bg-transparent"
          >
            <RotateCcw className="h-4 w-4" />
            重簽
          </Button>
        </div>

        <div className="border-2 border-dashed border-border rounded-lg p-3 bg-card">
          <canvas
            ref={canvasRef}
            width={400}
            height={150}
            className="w-full h-32 border border-border rounded cursor-crosshair bg-white touch-none"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
          <p className="text-xs text-muted-foreground text-center mt-2">請在上方區域簽名</p>
        </div>

        <Button
          type="button"
          variant="secondary"
          onClick={enterFullscreen}
          className="w-full flex items-center justify-center gap-2"
        >
          <Maximize2 className="h-4 w-4" />
          進入全螢幕簽名模式
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* 操作按鈕 */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          返回修改
        </Button>
        <Button onClick={handleComplete} className="flex-1 flex items-center gap-2">
          <Check className="h-4 w-4" />
          完成簽名
        </Button>
      </div>
    </div>
  )
}
