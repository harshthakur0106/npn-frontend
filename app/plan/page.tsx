"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { LoadingSpinner } from "@/components/loading-spinner"
import { callApi, formatApiResponse } from "@/lib/api"
import Link from "next/link"
import { ArrowLeft, Target, TrendingUp, Users, DollarSign } from "lucide-react"
import { useResponseStore } from "@/hooks/use-response-store"
import {
  PieChart,
  Pie,
  Cell,
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
} from "recharts"

const audienceSegmentData = [
  { name: "Small Business", value: 35, color: "#3b82f6" },
  { name: "Startups", value: 28, color: "#10b981" },
  { name: "Enterprise", value: 22, color: "#f59e0b" },
  { name: "Freelancers", value: 15, color: "#ef4444" },
]

const channelEffectivenessData = [
  { channel: "Email", effectiveness: 85, cost: 120, roi: 340 },
  { channel: "Social Media", effectiveness: 72, cost: 200, roi: 280 },
  { channel: "Content Marketing", effectiveness: 68, cost: 150, roi: 320 },
  { channel: "Paid Ads", effectiveness: 65, cost: 300, roi: 220 },
  { channel: "SEO", effectiveness: 78, cost: 100, roi: 380 },
]

const budgetAllocationData = [
  { category: "Content Creation", amount: 3500, percentage: 35 },
  { category: "Advertising", amount: 3000, percentage: 30 },
  { category: "Tools & Software", amount: 1500, percentage: 15 },
  { category: "Analytics", amount: 1000, percentage: 10 },
  { category: "Other", amount: 1000, percentage: 10 },
]

const marketTrendsData = [
  { month: "Jan", engagement: 65, conversion: 12, reach: 8500 },
  { month: "Feb", engagement: 68, conversion: 14, reach: 9200 },
  { month: "Mar", engagement: 72, conversion: 16, reach: 10100 },
  { month: "Apr", engagement: 75, conversion: 18, reach: 11300 },
  { month: "May", engagement: 78, conversion: 20, reach: 12800 },
  { month: "Jun", engagement: 82, conversion: 22, reach: 14200 },
]

export default function PlanPage() {
  const [targetAudience, setTargetAudience] = useState("Small business owners in retail")
  const planResult = useResponseStore((s) => s.responseByKey["plan:result"] || "")
  const campaignTargetAudience = useResponseStore((s) => s.responseByKey["campaign:targetAudience"] || "")
  const setResponse = useResponseStore((s) => s.setResponse)
  const clearResponse = useResponseStore((s) => s.clearResponse)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [targetAudienceInfo, setTargetAudienceInfo] = useState<{
    targetAudience: string
    clusterName: string
    customerCount: number
    clusterKey: string
  } | null>(null)

  // Load target audience info from analytics page
  useEffect(() => {
    if (campaignTargetAudience) {
      try {
        const parsed = JSON.parse(campaignTargetAudience)
        setTargetAudienceInfo(parsed)
        // Pre-fill target audience with cluster info
        setTargetAudience(`${parsed.clusterName} - ${parsed.targetAudience} (${parsed.customerCount.toLocaleString()} customers)`)
      } catch (e) {
        console.error("Failed to parse campaign target audience:", e)
      }
    }
  }, [campaignTargetAudience])

  const handlePlan = async () => {
    if (!targetAudience.trim()) {
      setError("Please enter a target audience")
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = await callApi("/api/plan", { target_audience: targetAudience })
      if (data) {
        setResponse("plan:result", formatApiResponse(data.response.content))
        console.log("Plan generation response:", data.response.content)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate plan")
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
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Marketing Plan Generator</h1>
          </div>
          <p className="text-muted-foreground">Create targeted marketing strategies with data-driven insights</p>
          
          {targetAudienceInfo && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Selected Target Audience</span>
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
                  setTargetAudience("Small business owners in retail")
                }}
              >
                Clear Target Audience
              </Button>
            </div>
          )}
        </div>

      

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Target Audience</CardTitle>
              <CardDescription>Describe your target audience to generate a customized marketing plan</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="audience">Target Audience Description</Label>
                <Textarea
                  id="audience"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g., Small business owners in retail, Tech startups, Healthcare professionals..."
                  className="min-h-[100px]"
                />
              </div>

              {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

              <Button onClick={handlePlan} className="w-full" disabled={loading}>
                Generate Marketing Plan
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generated Plan</CardTitle>
              <CardDescription>Your AI-generated marketing strategy will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              {planResult ? (
                <div className="space-y-4">
                  <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md overflow-auto max-h-96">
                    {planResult}
                  </pre>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline">
                      <Link href="/reflect">Refine Plan</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/write">Write Content</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Generate a plan to see results here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Audience Segmentation</CardTitle>
              <CardDescription>Distribution of your target audience segments</CardDescription>
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

          <Card>
            <CardHeader>
              <CardTitle>Channel Effectiveness</CardTitle>
              <CardDescription>Performance metrics across marketing channels</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={channelEffectivenessData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="channel" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="effectiveness" fill="#3b82f6" name="Effectiveness %" />
                  <Bar dataKey="roi" fill="#10b981" name="ROI %" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Budget Allocation</CardTitle>
              <CardDescription>Recommended budget distribution across categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgetAllocationData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-4 h-4 rounded-full bg-blue-500"
                        style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                      />
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold">${item.amount.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">{item.percentage}%</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
              <CardDescription>6-month performance trends and projections</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={marketTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="engagement" stroke="#3b82f6" name="Engagement %" />
                  <Line type="monotone" dataKey="conversion" stroke="#10b981" name="Conversion %" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  )
}