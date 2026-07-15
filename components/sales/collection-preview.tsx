"use client"

import { Button } from "@/components/ui/button"
import type { CollectionData } from "@/app/page"
import { Building2, MapPin, Receipt, User, MessageSquare, Calendar } from "lucide-react"

interface CollectionPreviewProps {
  data: CollectionData
  onConfirm: () => void
  onBack: () => void
}

export function CollectionPreview({ data, onConfirm, onBack }: CollectionPreviewProps) {
  const currentDate = new Date().toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">確認回收資訊</h2>
        <p className="text-muted-foreground">請確認以下資訊無誤後，進行店家簽名確認</p>
      </div>

      {/* 預覽卡片 */}
      <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl p-6 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground">優惠券回收單</h3>
          <div className="text-sm text-muted-foreground flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {currentDate}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 店家資訊 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">回收店家</p>
                <p className="font-medium text-foreground">{data.storeName}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">店家地址</p>
                <p className="font-medium text-foreground">{data.storeAddress}</p>
              </div>
            </div>
          </div>

          {/* 回收資訊 */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Receipt className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">盒蓋產品類型</p>
                <p className="font-medium text-foreground">{data.couponType}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Receipt className="h-5 w-5 text-accent mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">回收數量</p>
                <p className="font-medium text-foreground text-xl">
                  {data.quantity} <span className="text-base">張</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 業務人員 */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">業務人員</p>
              <p className="font-medium text-foreground">{data.collectorName}</p>
            </div>
          </div>
        </div>

        {/* 備註 */}
        {data.notes && (
          <div className="mt-4 pt-4 border-t border-border/50">
            <div className="flex items-start gap-3">
              <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">備註說明</p>
                <p className="font-medium text-foreground">{data.notes}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 重要提醒 */}
      <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
        <h4 className="font-medium text-accent mb-2">📋 確認提醒</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• 請確認店家名稱與地址正確無誤</li>
          <li>• 請確認優惠券類型與實際回收盒蓋類型相符</li>
          <li>• 請確認回收數量與實際清點數量一致</li>
          <li>• 確認無誤後將請店家人員進行數位簽名</li>
        </ul>
      </div>

      {/* 操作按鈕 */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={onBack} className="flex-1 bg-transparent">
          返回修改
        </Button>
        <Button onClick={onConfirm} className="flex-1">
          確認無誤，進行簽名
        </Button>
      </div>
    </div>
  )
}
