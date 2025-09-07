// Shared API utilities for marketing agent
const BASE_URL = "https://banking-marketing-agent-npn.onrender.com"

export interface ApiResponse {
  reply?: string
  body?: string
  status?: string
  message?: string
  result?: string
  [key: string]: any
}

export const callApi = async (endpoint: string, payload?: object): Promise<ApiResponse | null> => {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: payload ? "POST" : "GET",
      headers: { "Content-Type": "application/json" },
      body: payload ? JSON.stringify(payload) : undefined,
    })

    if (!res.ok) {
      throw new Error(`API error: ${res.status}`)
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("API call failed:", error)
    throw error
  }
}

export const formatApiResponse = (data: ApiResponse): string => {
  return data.reply || data.body || data.message || JSON.stringify(data, null, 2)
}
