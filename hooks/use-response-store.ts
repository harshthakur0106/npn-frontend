'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type ChatRole = 'user' | 'assistant' | 'system'

export type Message = {
	id: string
	role: ChatRole
	content: string
	createdAt: number
}

type ResponseState = {
	// Arbitrary text response by a logical key (e.g., route, thread id)
	responseByKey: Record<string, string>
	// Optional chat-style history per key
	messagesByKey: Record<string, Message[]>

	// Lightweight local metrics overlay (persists) for immediate UI feedback
	counters: {
		emailsSentDelta: number
		notificationsSentDelta: number
	}

	setResponse: (key: string, value: string) => void
	clearResponse: (key: string) => void
	addMessage: (
		key: string,
		message: { role: ChatRole; content: string; id?: string; createdAt?: number }
	) => void
	clearMessages: (key: string) => void
	// Metrics counters
	incrementEmailsSent: (by?: number) => void
	incrementNotificationsSent: (by?: number) => void
	resetCounters: () => void
	resetAll: () => void
}

function generateId(prefix: string = 'msg'): string {
	return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`
}

export const useResponseStore = create<ResponseState>()(
	persist(
		(set, get) => ({
			responseByKey: {},
			messagesByKey: {},
			counters: { emailsSentDelta: 0, notificationsSentDelta: 0 },

			setResponse: (key, value) =>
				set((state) => ({
					responseByKey: { ...state.responseByKey, [key]: value },
				})),

			clearResponse: (key) =>
				set((state) => {
					const next = { ...state.responseByKey }
					delete next[key]
					return { responseByKey: next }
				}),

			addMessage: (key, message) => {
				const id = message.id ?? generateId('msg')
				const createdAt = message.createdAt ?? Date.now()
				const nextMessage: Message = {
					id,
					role: message.role,
					content: message.content,
					createdAt,
				}
				set((state) => {
					const existing = state.messagesByKey[key] ?? []
					return { messagesByKey: { ...state.messagesByKey, [key]: [...existing, nextMessage] } }
				})
			},

			clearMessages: (key) =>
				set((state) => {
					const next = { ...state.messagesByKey }
					delete next[key]
					return { messagesByKey: next }
				}),

			incrementEmailsSent: (by = 1) =>
				set((state) => ({ counters: { ...state.counters, emailsSentDelta: state.counters.emailsSentDelta + by } })),

			incrementNotificationsSent: (by = 1) =>
				set((state) => ({ counters: { ...state.counters, notificationsSentDelta: state.counters.notificationsSentDelta + by } })),

			resetCounters: () => set((state) => ({ counters: { emailsSentDelta: 0, notificationsSentDelta: 0 } })),

			resetAll: () => set({ responseByKey: {}, messagesByKey: {}, counters: { emailsSentDelta: 0, notificationsSentDelta: 0 } }),
		}),
		{
			name: 'response-store',
			version: 1,
			storage: createJSONStorage(() =>
				typeof window !== 'undefined' ? window.localStorage : (undefined as unknown as Storage)
			),
		}
	)
)

// Convenience helpers for common scenarios
export const responseKey = {
	global: 'global',
	byRoute: (pathname: string) => `route:${pathname}`,
}


