"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LoadingSpinner } from "@/components/loading-spinner"
import { callApi, formatApiResponse } from "@/lib/api"
import Link from "next/link"
import { useResponseStore } from "@/hooks/use-response-store"
import { useEffect } from "react"
import { ArrowLeft, Mail, Bell, PenTool, TrendingUp, Eye, MousePointer, Users } from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const contentPerformanceData = [
  { type: "Email Subject A", openRate: 28, clickRate: 5.2, conversionRate: 2.8 },
  { type: "Email Subject B", openRate: 35, clickRate: 7.1, conversionRate: 4.2 },
  { type: "Notification A", openRate: 45, clickRate: 12.3, conversionRate: 6.1 },
  { type: "Notification B", openRate: 52, clickRate: 15.8, conversionRate: 8.4 },
]

const engagementPredictionData = [
  { hour: "9 AM", email: 65, notification: 45 },
  { hour: "12 PM", email: 78, notification: 62 },
  { hour: "3 PM", email: 72, notification: 58 },
  { hour: "6 PM", email: 85, notification: 75 },
  { hour: "9 PM", email: 68, notification: 52 },
]

const audienceSegmentData = [
  { name: "Engaged Users", value: 42, color: "#10b981" },
  { name: "New Subscribers", value: 28, color: "#3b82f6" },
  { name: "Inactive Users", value: 20, color: "#f59e0b" },
  { name: "VIP Customers", value: 10, color: "#8b5cf6" },
]

const contentOptimizationData = [
  { metric: "Subject Line Length", optimal: "6-10 words", current: "8 words", score: 95 },
  { metric: "Call-to-Action", optimal: "Action-oriented", current: "Strong", score: 88 },
  { metric: "Personalization", optimal: "High", current: "Medium", score: 72 },
  { metric: "Send Time", optimal: "6-8 PM", current: "7 PM", score: 100 },
  { metric: "Content Length", optimal: "150-200 words", current: "180 words", score: 92 },
]

export default function WritePage() {
  const [emailData, setEmailData] = useState({
    product: "AI-powered marketing assistant",
    customer: "Tech startups looking to scale customer engagement",
    guidelines: "Keep the tone professional but engaging",
  })

  const [notificationData, setNotificationData] = useState({
    product: "Discounted subscription plan",
    customer: "Existing premium users",
    guidelines: "Make it short and persuasive",
  })

  // Persisted results across navigation
  const emailResult = useResponseStore((s) => s.responseByKey["write:email"] || "")
  const notificationResult = useResponseStore((s) => s.responseByKey["write:notification"] || "")
  const setResponse = useResponseStore((s) => s.setResponse)
  const clearResponse = useResponseStore((s) => s.clearResponse)
  const reflectResult = useResponseStore((s) => s.responseByKey["reflect:result"] || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Auto-fill guidelines from reflect result if user has not changed defaults
  useEffect(() => {
    const defaultValue = "Keep the tone professional but engaging"
    const isUntouched = emailData.guidelines.trim() === "" || emailData.guidelines === defaultValue
    if (isUntouched && reflectResult) {
      setEmailData((prev) => ({ ...prev, guidelines: reflectResult }))
    }
  }, [reflectResult])

  const handleWriteEmail = async () => {
    if (!emailData.product.trim() || !emailData.customer.trim()) {
      setError("Please fill in product and customer information for email")
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = await callApi("/api/write/email", {
        product_to_market: emailData.product,
        customer_info: emailData.customer,
        guidelines: emailData.guidelines,
      })
      if (data) {
        setResponse("write:email", formatApiResponse(data.response.body))

      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate email")
    } finally {
      setLoading(false)
    }
  }

  const handleWriteNotification = async () => {
    if (!notificationData.product.trim() || !notificationData.customer.trim()) {
      setError("Please fill in product and customer information for notification")
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = await callApi("/api/write/notification", {
        product_to_market: notificationData.product,
        customer_info: notificationData.customer,
        guidelines: notificationData.guidelines,
      })
      if (data) {
        setResponse("write:notification", formatApiResponse(data))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate notification")
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
          <p className="text-muted-foreground">Generate optimized marketing content with performance insights</p>
        </div>



        <Tabs defaultValue="email" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </TabsTrigger>
            <TabsTrigger value="notification" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notification</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Mail className="w-5 h-5" />
                    <span>Email Content</span>
                  </CardTitle>
                  <CardDescription>Generate marketing emails for your products</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="email-product">Product to Market</Label>
                    <Input
                      id="email-product"
                      value={emailData.product}
                      onChange={(e) => setEmailData({ ...emailData, product: e.target.value })}
                      placeholder="e.g., AI-powered marketing assistant"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email-customer">Customer Information</Label>
                    <Textarea
                      id="email-customer"
                      value={emailData.customer}
                      onChange={(e) => setEmailData({ ...emailData, customer: e.target.value })}
                      placeholder="Describe your target customers"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email-guidelines">Guidelines (Optional)</Label>
                    <Textarea
                      id="email-guidelines"
                      value={emailData.guidelines}
                      onChange={(e) => setEmailData({ ...emailData, guidelines: e.target.value })}
                      placeholder="Any specific tone or style requirements"
                      className="min-h-[60px]"
                    />
                  </div>

                  {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

                  <Button onClick={handleWriteEmail} className="w-full" disabled={loading}>
                    Generate Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Generated Email</CardTitle>
                  <CardDescription>Your marketing email will appear here</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Button
                      variant="outline"
                      onClick={() => setEmailData((prev) => ({ ...prev, guidelines: reflectResult }))}
                      disabled={!reflectResult}
                    >
                      Use latest reflection
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => clearResponse("write:email")}
                      disabled={!emailResult}
                    >
                      Clear email
                    </Button>
                  </div>
                  {emailResult ? (
                    <div className="space-y-4">
                      <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md overflow-auto max-h-96">
                        {emailResult}
                      </pre>
                      <Button asChild className="w-full">
                        <Link href="/send">Send Email</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Generate an email to see results here</p>
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
                    <Bell className="w-5 h-5" />
                    <span>Notification Content</span>
                  </CardTitle>
                  <CardDescription>Generate push notifications for your campaigns</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="notif-product">Product to Market</Label>
                    <Input
                      id="notif-product"
                      value={notificationData.product}
                      onChange={(e) => setNotificationData({ ...notificationData, product: e.target.value })}
                      placeholder="e.g., Discounted subscription plan"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notif-customer">Customer Information</Label>
                    <Textarea
                      id="notif-customer"
                      value={notificationData.customer}
                      onChange={(e) => setNotificationData({ ...notificationData, customer: e.target.value })}
                      placeholder="Describe your target customers"
                      className="min-h-[80px]"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notif-guidelines">Guidelines (Optional)</Label>
                    <Textarea
                      id="notif-guidelines"
                      value={notificationData.guidelines}
                      onChange={(e) => setNotificationData({ ...notificationData, guidelines: e.target.value })}
                      placeholder="Any specific tone or style requirements"
                      className="min-h-[60px]"
                    />
                  </div>

                  {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

                  <Button onClick={handleWriteNotification} className="w-full" disabled={loading}>
                    Generate Notification
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Generated Notification</CardTitle>
                  <CardDescription>Your push notification will appear here</CardDescription>
                </CardHeader>
                <CardContent>
                  {notificationResult ? (
                    <div className="space-y-4">
                      <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md overflow-auto max-h-96">
                        {notificationResult}
                      </pre>
                      <Button asChild className="w-full">
                        <Link href="/send">Send Notification</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Generate a notification to see results here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Target Audience Distribution</CardTitle>
                  <CardDescription>Breakdown of your notification recipients</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={audienceSegmentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {audienceSegmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
