export interface EventType {
    title: string
    start: string
    end?: string
    backgroundColor?: string
    priority: 'low' | 'medium' | 'high'
}