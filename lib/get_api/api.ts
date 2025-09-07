const API_BASE_URL = "https://banking-marketing-agent-npn.onrender.com"

export interface ApiResponse<T = any> {
  status: string
  response: any
  success: boolean
  data?: T
  error?: string
}

export interface MarketingPlan {
  response: any
  target_audience: string
  strategy: string
  recommendations: string[]
}

export interface CampaignContent {
  subject?: string
  body: string
  message?: string
}

export interface Metrics {
  emails_sent: number
  unique_email_receivers: number
  notifications_sent: number
  unique_notification_receivers: number
  email_frequency: Record<string, number>
  notification_frequency: Record<string, number>
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return { success: true, data }
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error)
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  }

  // Marketing Plan APIs
  async generatePlan(targetAudience: string): Promise<ApiResponse<MarketingPlan>> {
    return this.request<MarketingPlan>("/api/plan", {
      method: "POST",
      body: JSON.stringify({ target_audience: targetAudience }),
    })
  }

  async reflectOnPlan(previousStrategy: string, suggestions: string): Promise<ApiResponse<MarketingPlan>> {
    return this.request<MarketingPlan>("/api/reflect", {
      method: "POST",
      body: JSON.stringify({
        previous_strategy: previousStrategy,
        suggestions: suggestions,
      }),
    })
  }

  // Campaign Content APIs
  async generateEmail(
    productToMarket: string,
    customerInfo: string,
    guidelines: string,
  ): Promise<ApiResponse<CampaignContent>> {
    return this.request<CampaignContent>("/api/write/email", {
      method: "POST",
      body: JSON.stringify({
        product_to_market: productToMarket,
        customer_info: customerInfo,
        guidelines: guidelines,
      }),
    })
  }

  async generateNotification(
    productToMarket: string,
    customerInfo: string,
    guidelines: string,
  ): Promise<ApiResponse<CampaignContent>> {
    return this.request<CampaignContent>("/api/write/notification", {
      method: "POST",
      body: JSON.stringify({
        product_to_market: productToMarket,
        customer_info: customerInfo,
        guidelines: guidelines,
      }),
    })
  }

  // Send Campaign APIs
  async sendEmail(receiver: string, subject: string, body: string): Promise<ApiResponse<{ message: string }>> {
    const payload = {
      receiver: receiver.trim(),
      subject: subject.trim(),
      body: body.trim(),
    }

    console.log("[v0] API sendEmail payload:", payload)

    if (!payload.receiver || !payload.subject || !payload.body) {
      return {
        success: false,
        error: "Missing required fields: receiver, subject, and body are all required",
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(payload.receiver)) {
      return {
        success: false,
        error: "Invalid email format for receiver",
      }
    }

    return this.request<{ message: string }>("/api/send/email", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async sendNotification(receiver: string, message: string): Promise<ApiResponse<{ message: string }>> {
    const payload = {
      receiver: receiver?.trim() || "",
      message: message?.trim() || "",
    }

    console.log("[v0] API sendNotification payload:", payload)

    if (!payload.receiver || !payload.message) {
      return {
        success: false,
        error: "Missing required fields: receiver and message are both required",
      }
    }

    return this.request<{ message: string }>("/api/send/notification", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  // Analytics API
  async getMetrics(): Promise<ApiResponse<Metrics>> {
    return this.request<Metrics>("/get_metrics")
  }
}

export const apiClient = new ApiClient()
