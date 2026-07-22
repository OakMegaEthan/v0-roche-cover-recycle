"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Check, ChevronDown, Copy, Store } from "lucide-react"

interface StorePartner {
  /** 店家夥伴名稱，含分店括號 */
  name: string
  /** 6 位數驗證密碼 */
  passcode: string
  /** 官方帳號加入連結 */
  inviteUrl: string
}

/** Mock 店家資料；正式版由 API 依店家代號取得驗證密碼與專屬邀請連結。 */
const storePartners: StorePartner[] = [
  { name: "宏恩藥局（臺北大安）", passcode: "067420", inviteUrl: "https://urli.ai/line/q-kvJW?muid=bot-js53cv" },
  { name: "維康醫療用品（臺北中山）", passcode: "318902", inviteUrl: "https://urli.ai/line/q-kvJW?muid=bot-a71kdp" },
  { name: "杏一醫療用品（臺大榮總二分店）", passcode: "540177", inviteUrl: "https://urli.ai/line/q-kvJW?muid=bot-m28xqz" },
  { name: "躍獅連鎖藥局（新北板橋）", passcode: "725634", inviteUrl: "https://urli.ai/line/q-kvJW?muid=bot-p94vte" },
  { name: "丁丁藥局（桃園中壢）", passcode: "199058", inviteUrl: "https://urli.ai/line/q-kvJW?muid=bot-r36hwn" },
  { name: "大樹藥局（臺中西屯）", passcode: "863241", inviteUrl: "https://urli.ai/line/q-kvJW?muid=bot-t50gys" },
  { name: "佑全保健藥妝（臺南東區）", passcode: "402596", inviteUrl: "https://urli.ai/line/q-kvJW?muid=bot-w17cfb" },
  { name: "健康人生藥局（高雄左營）", passcode: "651830", inviteUrl: "https://urli.ai/line/q-kvJW?muid=bot-y82nlk" },
]

/** 與客戶確認的訊息格式，複製出去的內容即為此段文字。 */
function buildMessage(partner: StorePartner): string {
  return [
    "您的 Accu-Chek 店家夥伴的驗證資訊：",
    `店家夥伴名稱：${partner.name}`,
    `驗證密碼：${partner.passcode}`,
    `歡迎使用以下連結加入官方帳號：${partner.inviteUrl}`,
  ].join("\n")
}

export function VerificationCodeLookup() {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<StorePartner | null>(null)
  const [result, setResult] = useState<StorePartner | null>(null)
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleSelect = (partner: StorePartner) => {
    setSelected(partner)
    setOpen(false)
    // 換店家後先清掉舊結果，避免畫面上的密碼與選單不一致
    setResult(null)
    setCopied(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selected) return

    setLoading(true)
    setCopied(false)
    // 模擬API延遲
    await new Promise((resolve) => setTimeout(resolve, 600))
    setResult(selected)
    setLoading(false)
  }

  const handleCopy = async () => {
    if (!result) return
    const text = buildMessage(result)

    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // 非 HTTPS 或瀏覽器不支援 Clipboard API 時的退路
      const textarea = document.createElement("textarea")
      textarea.value = text
      textarea.setAttribute("readonly", "")
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }

    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <p className="text-sm text-foreground">請從下方選單中選擇要取得驗證密碼的店家對象</p>

          <div className="space-y-2">
            <Label htmlFor="storePartner" className="flex items-center gap-2">
              <Store className="h-4 w-4" />
              店家對象
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="storePartner"
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn("w-full justify-between h-11", !selected && "text-muted-foreground")}
                >
                  {selected?.name || "輸入店家名稱搜尋"}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
                <Command>
                  <CommandInput placeholder="輸入店家名稱搜尋" />
                  <CommandList>
                    <CommandEmpty>找不到符合的店家</CommandEmpty>
                    <CommandGroup>
                      {storePartners.map((partner) => (
                        <CommandItem key={partner.name} value={partner.name} onSelect={() => handleSelect(partner)}>
                          <Check
                            className={cn("mr-2 h-4 w-4", selected?.name === partner.name ? "opacity-100" : "opacity-0")}
                          />
                          {partner.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Button type="submit" className="w-full h-11" disabled={!selected || loading}>
            {loading ? "查詢中..." : "確認送出"}
          </Button>
        </form>
      </Card>

      {result && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">以下是店家邀請的入口與密碼：</p>

          <Card className="p-4 bg-muted/30">
            <div className="space-y-1.5 text-sm leading-relaxed text-foreground">
              <p>您的 Accu-Chek 店家夥伴的驗證資訊：</p>
              <p>店家夥伴名稱：{result.name}</p>
              <p>
                驗證密碼：<span className="font-mono font-semibold tracking-wider">{result.passcode}</span>
              </p>
              <p className="break-all">
                歡迎使用以下連結加入官方帳號：
                <a
                  href={result.inviteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2"
                >
                  {result.inviteUrl}
                </a>
              </p>
            </div>
          </Card>

          <Button type="button" variant="outline" className="w-full h-11" onClick={handleCopy}>
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                已複製
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                複製內容
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
