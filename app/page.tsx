"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MetricsCard } from "@/components/metrics-card"
import { apiClient, type Metrics } from "@/lib/get_api/api"
import { BarChart3, Mail, MessageSquare, Target, TrendingUp, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function Dashboard() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await apiClient.getMetrics()
        if (response.success && response.data) {
          setMetrics(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch metrics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [])

  const quickActions = [
    {
      title: "Create Marketing Plan",
      description: "Generate AI-powered customer segmentation and marketing strategies",
      href: "/plan",
      icon: Target,
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "View Analytics",
      description: "Monitor campaign performance and customer engagement metrics",
      href: "/metrics",
      icon: BarChart3,
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
  ]

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Marketing Dashboard</h1>
          <p className="text-foreground/70 mt-1">AI-powered marketing campaigns for enhanced customer engagement</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/plan">
              <Target className="h-4 w-4 mr-2" />
              New Campaign
            </Link>
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2"></div>
                <div className="h-3 bg-muted rounded w-32"></div>
              </CardContent>
            </Card>
          ))
        ) : metrics ? (
          <>
            <MetricsCard
              title="Total Emails Sent"
              value={metrics.emails_sent?.toLocaleString() || "0"}
              description="Across all campaigns"
              icon={Mail}
            />
            <MetricsCard
              title="Email Recipients"
              value={metrics.unique_email_receivers?.toLocaleString() || "0"}
              description="Unique customers reached"
              icon={Users}
            />
            <MetricsCard
              title="Notifications Sent"
              value={metrics.notifications_sent?.toLocaleString() || "0"}
              description="Push notifications delivered"
              icon={MessageSquare}
            />
            <MetricsCard
              title="Notification Recipients"
              value={metrics.unique_notification_receivers?.toLocaleString() || "0"}
              description="Active mobile users"
              icon={TrendingUp}
            />
          </>
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-muted-foreground">Unable to load metrics. Please try again later.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => (
            <Card key={action.title} className="group hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-2`}>
                  <action.icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base">{action.title}</CardTitle>
                <CardDescription className="text-sm">{action.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button asChild variant="ghost" className="w-full justify-between group-hover:bg-accent">
                  <Link href={action.href}>
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">Platform Overview</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                AI-Powered Segmentation
              </CardTitle>
              <CardDescription>Leverage customer data to create targeted marketing strategies</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Analyze customer behavior patterns</li>
                <li>• Generate personalized product recommendations</li>
                <li>• Create data-driven marketing plans</li>
              </ul>
              <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
                <Link href="/plan">Create Marketing Plan</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-orange-600" />
                Campaign Analytics
              </CardTitle>
              <CardDescription>Monitor and optimize campaign performance in real-time</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Track email and notification delivery rates</li>
                <li>• Measure customer engagement metrics</li>
                <li>• Analyze campaign effectiveness</li>
              </ul>
              <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
                <Link href="/metrics">View Analytics</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
