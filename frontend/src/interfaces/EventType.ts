export interface EventType {
    title: string
    start: string
    startTime?: string
    end?: string
    endTime?: string
    backgroundColor?: string
    priority: 'low' | 'medium' | 'high'
    allDay?: boolean
}