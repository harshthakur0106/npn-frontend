"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/loading-spinner"
import { callApi, formatApiResponse } from "@/lib/api"
import Link from "next/link"
import { ArrowLeft, RefreshCw, TrendingUp, TrendingDown, BarChart3, Target } from "lucide-react"
import { useResponseStore } from "@/hooks/use-response-store"
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"

const performanceComparisonData = [
  { metric: "Email Open Rate", before: 18, after: 28, improvement: 56 },
  { metric: "Click-through Rate", before: 3.2, after: 5.8, improvement: 81 },
  { metric: "Conversion Rate", before: 2.1, after: 4.3, improvement: 105 },
  { metric: "Social Engagement", before: 45, after: 72, improvement: 60 },
  { metric: "Lead Generation", before: 120, after: 195, improvement: 63 },
]

const strategyEffectivenessData = [
  { strategy: "Content Marketing", effectiveness: 85, impact: 92, feasibility: 78 },
  { strategy: "Social Media", effectiveness: 72, impact: 88, feasibility: 95 },
  { strategy: "Email Campaigns", effectiveness: 88, impact: 85, feasibility: 90 },
  { strategy: "Paid Advertising", effectiveness: 65, impact: 95, feasibility: 70 },
  { strategy: "SEO Optimization", effectiveness: 78, impact: 80, feasibility: 65 },
]

const improvementTrackingData = [
  { week: "Week 1", oldStrategy: 45, newStrategy: 48, target: 60 },
  { week: "Week 2", oldStrategy: 47, newStrategy: 55, target: 60 },
  { week: "Week 3", oldStrategy: 46, newStrategy: 62, target: 60 },
  { week: "Week 4", oldStrategy: 48, newStrategy: 68, target: 60 },
  { week: "Week 5", oldStrategy: 49, newStrategy: 74, target: 60 },
  { week: "Week 6", oldStrategy: 50, newStrategy: 78, target: 60 },
]

const radarData = [
  { subject: "Reach", A: 120, B: 110, fullMark: 150 },
  { subject: "Engagement", A: 98, B: 130, fullMark: 150 },
  { subject: "Conversion", A: 86, B: 130, fullMark: 150 },
  { subject: "Retention", A: 99, B: 100, fullMark: 150 },
  { subject: "ROI", A: 85, B: 90, fullMark: 150 },
  { subject: "Brand Awareness", A: 65, B: 85, fullMark: 150 },
]

export default function ReflectPage() {
  const [suggestions, setSuggestions] = useState("Add social media marketing for more engagement")
  const [previousStrategy, setPreviousStrategy] = useState("Focused only on email marketing campaigns")
  const reflectResult = useResponseStore((s) => s.responseByKey["reflect:result"] || "")
  const setResponse = useResponseStore((s) => s.setResponse)
  const clearResponse = useResponseStore((s) => s.clearResponse)
  const planResult = useResponseStore((s) => s.responseByKey["plan:result"] || "")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Auto-fill previous strategy from latest plan result if user has not typed
  useEffect(() => {
    const defaultValue = "Focused only on email marketing campaigns"
    const isUntouched = previousStrategy.trim() === "" || previousStrategy === defaultValue
    if (isUntouched && planResult) {
      setPreviousStrategy(planResult)
    }
  }, [planResult])

  const handleReflect = async () => {
    if (!suggestions.trim() || !previousStrategy.trim()) {
      setError("Please fill in both suggestions and previous strategy")
      return
    }

    setLoading(true)
    setError("")

    try {
      const data = await callApi("/api/reflect", {
        suggestions: suggestions,
        previous_strategy: previousStrategy,
      })
      if (data) {
        setResponse("reflect:result", formatApiResponse(data.response.content))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate reflection")
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
        </div>

    

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Strategy Input</CardTitle>
              <CardDescription>Provide your suggestions and previous strategy for improvement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="suggestions">New Suggestions</Label>
                <Textarea
                  id="suggestions"
                  value={suggestions}
                  onChange={(e) => setSuggestions(e.target.value)}
                  placeholder="What improvements or new ideas do you want to incorporate?"
                  className="min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="previous">Previous Strategy</Label>
                <Textarea
                  id="previous"
                  value={previousStrategy}
                  onChange={(e) => setPreviousStrategy(e.target.value)}
                  placeholder="Describe your current or previous marketing strategy"
                  className="min-h-[100px]"
                />
              </div>

              {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

              <Button onClick={handleReflect} className="w-full" disabled={loading}>
                Generate Reflection
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Improved Strategy</CardTitle>
              <CardDescription>Your refined marketing strategy will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Button
                  variant="outline"
                  onClick={() => setPreviousStrategy(planResult)}
                  disabled={!planResult}
                >
                  Use latest plan
                </Button>
                <Button
                  variant="outline"
                  onClick={() => clearResponse("reflect:result")}
                  disabled={!reflectResult}
                >
                  Clear reflection
                </Button>
              </div>
              {reflectResult ? (
                <div className="space-y-4">
                  <pre className="whitespace-pre-wrap text-sm bg-muted p-4 rounded-md overflow-auto max-h-96">
                    {reflectResult}
                  </pre>
                  <div className="flex space-x-2">
                    <Button asChild variant="outline">
                      <Link href="/plan">Create New Plan</Link>
                    </Button>
                    <Button asChild>
                      <Link href="/write">Write Content</Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <RefreshCw className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Generate a reflection to see results here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Performance Comparison</CardTitle>
              <CardDescription>Before vs. after strategy implementation</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={performanceComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="metric" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="before" fill="#ef4444" name="Before" />
                  <Bar dataKey="after" fill="#10b981" name="After" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strategy Effectiveness Radar</CardTitle>
              <CardDescription>Multi-dimensional strategy analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis />
                  <Radar name="Previous" dataKey="A" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} />
                  <Radar name="Improved" dataKey="B" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div> */}

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Improvement Tracking</CardTitle>
              <CardDescription>Weekly performance comparison over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={improvementTrackingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="oldStrategy" stroke="#ef4444" name="Old Strategy" />
                  <Line type="monotone" dataKey="newStrategy" stroke="#10b981" name="New Strategy" />
                  <Line type="monotone" dataKey="target" stroke="#3b82f6" strokeDasharray="5 5" name="Target" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Strategy Effectiveness Matrix</CardTitle>
              <CardDescription>Impact vs. feasibility analysis of different strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {strategyEffectivenessData.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">{item.strategy}</span>
                      <span className="text-sm text-muted-foreground">{item.effectiveness}% effective</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="flex justify-between">
                          <span>Effectiveness</span>
                          <span>{item.effectiveness}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${item.effectiveness}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>Impact</span>
                          <span>{item.impact}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${item.impact}%` }} />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <span>Feasibility</span>
                          <span>{item.feasibility}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${item.feasibility}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  )
}
