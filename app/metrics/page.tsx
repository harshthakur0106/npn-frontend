"use client"

import { useEffect, useState } from "react"
import { callApi } from "@/lib/api"
import { Button } from "@/components/ui/button"

interface Metrics {
  emails_sent: number
  unique_email_receivers: number
  notifications_sent: number
  unique_notification_receivers: number
}

export default function MetricsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchMetrics = async () => {
    setLoading(true)
    setError("")
    try {
      const data = await callApi("/get_metrics") // ✅ fixed endpoint
      if (data) {
        setMetrics(data as Metrics)
        setLastUpdated(new Date())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch metrics")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMetrics()
  }, [])

  if (loading) return <p className="p-4">Loading metrics...</p>
  if (error) return <p className="p-4 text-red-500">{error}</p>

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Metrics Dashboard</h1>
      {metrics ? (
        <ul className="space-y-2">
          <li>📧 Emails Sent: {metrics.emails_sent}</li>
          <li>👥 Unique Email Receivers: {metrics.unique_email_receivers}</li>
          <li>🔔 Notifications Sent: {metrics.notifications_sent}</li>
          <li>👥 Unique Notification Receivers: {metrics.unique_notification_receivers}</li>
        </ul>
      ) : (
        <p>No metrics available.</p>
      )}
      {lastUpdated && (
        <p className="text-sm text-gray-500">
          Last updated: {lastUpdated.toLocaleString()}
        </p>
      )}
      <Button onClick={fetchMetrics}>Refresh</Button>
    </div>
  )
}
