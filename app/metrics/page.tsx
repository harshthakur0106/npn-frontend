"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/loading-spinner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useResponseStore } from "@/hooks/use-response-store"
import Link from "next/link"
import { Target, Send } from "lucide-react"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js"
import { Bar } from "react-chartjs-2"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  Title,
)

type ClusterKey = "Cluster1 (%)" | "Cluster2 (%)" | "Cluster3 (%)"

type SegmentationRecord = Record<ClusterKey, number>

type SegmentationData = Record<string, SegmentationRecord>

const CLUSTER_INFO = {
  "Cluster1 (%)": {
    name: "Cluster 1",
    customers: 9091,
    description: "Service and admin low earners",
    color: "bg-blue-100 text-blue-800 border-blue-200"
  },
  "Cluster2 (%)": {
    name: "Cluster 2", 
    customers: 5864,
    description: "High earners and highly educated",
    color: "bg-green-100 text-green-800 border-green-200"
  },
  "Cluster3 (%)": {
    name: "Cluster 3",
    customers: 7076,
    description: "Retired skilled laborers",
    color: "bg-orange-100 text-orange-800 border-orange-200"
  }
}

export default function MetricsPage() {
  const [data, setData] = useState<SegmentationData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const setResponse = useResponseStore((s) => s.setResponse)

  const handleCreateCampaign = (clusterKey: string, clusterInfo: typeof CLUSTER_INFO[keyof typeof CLUSTER_INFO]) => {
    // Store cluster information in state for the campaign page
    const campaignData = {
      targetAudience: clusterInfo.description,
      clusterName: clusterInfo.name,
      customerCount: clusterInfo.customers,
      clusterKey: clusterKey
    }
    setResponse("campaign:targetAudience", JSON.stringify(campaignData))
  }

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError("")
        const res = await fetch("/cluster-segmentation.json", { cache: "no-store" })
        if (!res.ok) throw new Error("Failed to load segmentation data")
        const json: SegmentationData = await res.json()
        setData(json)
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unexpected error")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const labels = useMemo(() => (data ? Object.keys(data) : []), [data])

  const barDatasets = useMemo(() => {
    if (!data) return []
    const clusterKeys: ClusterKey[] = ["Cluster1 (%)", "Cluster2 (%)", "Cluster3 (%)"]
    const colors = [
      { bg: "rgba(59,130,246,0.4)", border: "rgba(59,130,246,1)" }, // blue
      { bg: "rgba(34,197,94,0.4)", border: "rgba(34,197,94,1)" }, // green
      { bg: "rgba(234,88,12,0.4)", border: "rgba(234,88,12,1)" }, // orange
    ]
    return clusterKeys.map((cluster, idx) => ({
      label: cluster,
      data: labels.map((factor) => data[factor][cluster]),
      backgroundColor: colors[idx].bg,
      borderColor: colors[idx].border,
      borderWidth: 1,
    }))
  }, [data, labels])


  const barOptions = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Customer Segmentation by Factor" },
      tooltip: {
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${ctx.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { 
          callback: (tickValue: string | number) => `${tickValue}%` 
        },
        grid: { color: "rgba(148,163,184,0.2)" },
      },
      x: { grid: { display: false } },
    },
  }), [])


  if (loading) return <LoadingSpinner />
  if (error) return <p className="p-6 text-sm text-red-500">{error}</p>
  if (!data) return <p className="p-6 text-sm">No data found.</p>

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Segmentation Analytics</h1>
        <div className="text-sm text-muted-foreground">
          Total Customers: {Object.values(CLUSTER_INFO).reduce((sum, cluster) => sum + cluster.customers, 0).toLocaleString()}
        </div>
      </div>

      {/* Cluster Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(CLUSTER_INFO).map(([key, info]) => (
          <Card key={key} className="relative overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{info.name}</CardTitle>
                <Badge className={info.color}>{info.customers.toLocaleString()} customers</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{info.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">{info.customers.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">
                    {((info.customers / Object.values(CLUSTER_INFO).reduce((sum, c) => sum + c.customers, 0)) * 100).toFixed(1)}% of total customers
                  </div>
                </div>
                <Button 
                  asChild 
                  className="w-full" 
                  onClick={() => handleCreateCampaign(key, info)}
                >
                  <Link href="/plan">
                    <Target className="w-4 h-4 mr-2" />
                    Create Campaign
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Segmentation by Factor</CardTitle>
          <p className="text-sm text-muted-foreground">
            Distribution of customer segments across different demographic and behavioral factors
          </p>
        </CardHeader>
        <CardContent className="h-[500px]">
          <Bar
            data={{ labels, datasets: barDatasets }}
            options={barOptions}
          />
        </CardContent>
      </Card>

      {/* Top Factors by Cluster */}
      <Card>
        <CardHeader>
          <CardTitle>Key Characteristics by Cluster</CardTitle>
          <p className="text-sm text-muted-foreground">
            Top 5 factors that best characterize each customer segment
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(CLUSTER_INFO).map(([clusterKey, info]) => {
              const sorted = labels
                .map((factor) => ({ factor, value: data[factor][clusterKey as ClusterKey] }))
                .sort((a, b) => b.value - a.value)
                .slice(0, 5)
              return (
                <div key={clusterKey} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge className={info.color}>{info.name}</Badge>
                    <span className="text-sm text-muted-foreground">{info.customers.toLocaleString()} customers</span>
                  </div>
                  <div className="space-y-2">
                    {sorted.map(({ factor, value }, index) => (
                      <div key={factor} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-muted-foreground">#{index + 1}</span>
                          <span className="text-sm font-medium capitalize">{factor.replace('-', ' ')}</span>
                        </div>
                        <span className="text-sm font-bold">{value}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
