"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/loading-spinner"
import { callApi, formatApiResponse } from "@/lib/api"
import Link from "next/link"
import { ArrowLeft, Mail, Send, MessageSquare, TrendingUp, Clock, CheckCircle, AlertCircle, Target } from "lucide-react"
import { useResponseStore } from "@/hooks/use-response-store"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const deliveryAnalyticsData = [
  { time: "9:00", delivered: 95, opened: 42, clicked: 12, bounced: 3 },
  { time: "10:00", delivered: 98, opened: 48, clicked: 15, bounced: 2 },
  { time: "11:00", delivered: 97, opened: 52, clicked: 18, bounced: 2 },
  { time: "12:00", delivered: 99, opened: 58, clicked: 22, bounced: 1 },
  { time: "13:00", delivered: 96, opened: 55, clicked: 20, bounced: 3 },
  { time: "14:00", delivered: 98, opened: 61, clicked: 25, bounced: 2 },
]

const campaignPerformanceData = [
  { campaign: "Welcome Series", sent: 1250, delivered: 1225, opened: 612, clicked: 147 },
  { campaign: "Product Launch", sent: 2100, delivered: 2078, opened: 1039, clicked: 312 },
  { campaign: "Newsletter", sent: 3500, delivered: 3465, opened: 1386, clicked: 277 },
  { campaign: "Promotion", sent: 1800, delivered: 1782, opened: 891, clicked: 267 },
]

const engagementDistributionData = [
  { name: "Opened & Clicked", value: 25, color: "#10b981" },
  { name: "Opened Only", value: 35, color: "#3b82f6" },
  { name: "Delivered Only", value: 32, color: "#f59e0b" },
  { name: "Bounced", value: 8, color: "#ef4444" },
]

const realtimeMetrics = {
  totalSent: 8650,
  deliveryRate: 97.2,
  openRate: 42.8,
  clickRate: 12.4,
  bounceRate: 2.8,
  unsubscribeRate: 0.3,
}

export default function SendPage() {
  const [emailData, setEmailData] = useState({
    receiver: "",
    subject: "",
    body: "",
  })

  const [notificationData, setNotificationData] = useState({
    receiver: "",
    message: "",
  })

  const emailResult = useResponseStore((s) => s.responseByKey["send:email"] || "")
  const notificationResult = useResponseStore((s) => s.responseByKey["send:notification"] || "")
  const setResponse = useResponseStore((s) => s.setResponse)
  const clearResponse = useResponseStore((s) => s.clearResponse)
  const generatedWriteEmail = useResponseStore((s) => s.responseByKey["write:email"] || "")
  const campaignTargetAudience = useResponseStore((s) => s.responseByKey["campaign:targetAudience"] || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [targetAudienceInfo, setTargetAudienceInfo] = useState<{
    targetAudience: string
    clusterName: string
    customerCount: number
    clusterKey: string
  } | null>(null)

  // Prefill email body from generated Write email if user hasn't typed
  useEffect(() => {
    const isUntouched = emailData.body.trim() === ""
    if (isUntouched && generatedWriteEmail) {
      setEmailData((prev) => ({ ...prev, body: generatedWriteEmail }))
    }
  }, [generatedWriteEmail])

  // Load target audience info from analytics page
  useEffect(() => {
    if (campaignTargetAudience) {
      try {
        const parsed = JSON.parse(campaignTargetAudience)
        setTargetAudienceInfo(parsed)
        // Pre-fill email subject with cluster info
        if (!emailData.subject.trim()) {
          setEmailData(prev => ({
            ...prev,
            subject: `Campaign for ${parsed.clusterName} - ${parsed.targetAudience}`
          }))
        }
      } catch (e) {
        console.error("Failed to parse campaign target audience:", e)
      }
    }
  }, [campaignTargetAudience])

  const handleSendEmail = async () => {
    if (!emailData.receiver.trim() || !emailData.subject.trim() || !emailData.body.trim()) {
      setError("Please fill in all email fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = await callApi("/api/send/email", emailData)
      if (data) {
        setResponse("send:email", formatApiResponse(data))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send email")
    } finally {
      setLoading(false)
    }
  }

  const handleSendNotification = async () => {
    if (!notificationData.receiver.trim() || !notificationData.message.trim()) {
      setError("Please fill in all notification fields")
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = await callApi("/api/send/notification", notificationData)
      if (data) {
        setResponse("send:notification", formatApiResponse(data))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send notification")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {loading && <LoadingSpinner />}

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
              <Send className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Send Messages</h1>
          </div>
          <p className="text-muted-foreground">Send and track your marketing campaigns with real-time analytics</p>
          
          {targetAudienceInfo && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Target Audience</span>
              </div>
              <div className="text-sm text-blue-800">
                <div className="font-medium">{targetAudienceInfo.clusterName} - {targetAudienceInfo.targetAudience}</div>
                <div className="text-blue-600">{targetAudienceInfo.customerCount.toLocaleString()} customers</div>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={() => {
                  setTargetAudienceInfo(null)
                  clearResponse("campaign:targetAudience")
                }}
              >
                Clear Target Audience
              </Button>
            </div>
          )}
        </div>


        <Tabs defaultValue="email" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="notification" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Notification</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Send Email</span>
                  </CardTitle>
                  <CardDescription>Send marketing emails to your recipients</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email-receiver">Receiver Email</Label>
                    <Input
                      id="email-receiver"
                      type="email"
                      value={emailData.receiver}
                      onChange={(e) => setEmailData({ ...emailData, receiver: e.target.value })}
                      placeholder="recipient@example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email-subject">Subject</Label>
                    <Input
                      id="email-subject"
                      value={emailData.subject}
                      onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                      placeholder="Email subject line"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email-body">Email Body</Label>
                    <div className="flex items-center gap-2 mb-2">
                      <Button
                        variant="outline"
                        onClick={() => setEmailData((prev) => ({ ...prev, body: generatedWriteEmail }))}
                        disabled={!generatedWriteEmail}
                      >
                        Use latest generated email
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => clearResponse("send:email")}
                        disabled={!emailResult}
                      >
                        Clear send result
                      </Button>
                    </div>
                    <Textarea
                      id="email-body"
                      value={emailData.body}
                      onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                      placeholder="Your email content here..."
                      className="min-h-[150px]"
                    />
                  </div>

                  {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

                  <Button onClick={handleSendEmail} className="w-full" disabled={loading}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Send Result</CardTitle>
                  <CardDescription>Email sending status will appear here</CardDescription>
                </CardHeader>
                <CardContent>
                  {emailResult ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                        <pre className="whitespace-pre-wrap text-sm text-green-800">{emailResult}</pre>
                      </div>
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <Link href="/write">Write Another Email</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Send an email to see results here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

           
          </TabsContent>

          <TabsContent value="notification" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="w-5 h-5" />
                    <span>Send Notification</span>
                  </CardTitle>
                  <CardDescription>Send notifications via Telegram</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="notif-receiver">Receiver (Telegram ID)</Label>
                    <Input
                      id="notif-receiver"
                      value={notificationData.receiver}
                      onChange={(e) => setNotificationData({ ...notificationData, receiver: e.target.value })}
                      placeholder="Telegram user ID or chat ID"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notif-message">Message</Label>
                    <Textarea
                      id="notif-message"
                      value={notificationData.message}
                      onChange={(e) => setNotificationData({ ...notificationData, message: e.target.value })}
                      placeholder="Your notification message here..."
                      className="min-h-[150px]"
                    />
                  </div>

                  {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

                  <Button onClick={handleSendNotification} className="w-full" disabled={loading}>
                    <Send className="w-4 h-4 mr-2" />
                    Send Notification
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Send Result</CardTitle>
                  <CardDescription>Notification sending status will appear here</CardDescription>
                </CardHeader>
                <CardContent>
                  {notificationResult ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                        <pre className="whitespace-pre-wrap text-sm text-green-800">{notificationResult}</pre>
                      </div>
                      <Button asChild variant="outline" className="w-full bg-transparent">
                        <Link href="/write">Write Another Notification</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Send a notification to see results here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

        
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
