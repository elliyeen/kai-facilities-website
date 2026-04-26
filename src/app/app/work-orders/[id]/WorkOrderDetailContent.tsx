'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import AppHeader from '@/components/app/AppHeader'
import PriorityBadge from '@/components/app/PriorityBadge'
import StatusPill from '@/components/app/StatusPill'
import PhotoUploadField from '@/components/app/PhotoUploadField'
import { getWorkOrder, TASKS, formatRelativeTime, formatDueTime } from '@/lib/app/data'
import { MapPin, Clock, User, ClipboardList, Check, Wrench } from 'lucide-react'
import TaskDetailCard from '@/components/app/TaskDetailCard'

export default function WorkOrderDetailContent({ id }: { id: string }) {
  const order = getWorkOrder(id)
  if (!order) notFound()

  const tasks = TASKS.filter(t => t.workOrderId === id)
  const [note, setNote]   = useState('')
  const [closed, setClosed] = useState(order.status === 'completed')
  const overdue = new Date(order.dueAt) < new Date() && !closed

  return (
    <div>
      <AppHeader title={order.id.toUpperCase()} showBack backHref="/app/work-orders" />

      <div className="max-w-2xl md:max-w-none">
        {/* Header card */}
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-start gap-2 flex-wrap">
            <PriorityBadge priority={order.priority} size="md" />
            <StatusPill status={closed ? 'completed' : order.status} />
            <span className="text-[11px] text-gray-400 border border-gray-200 px-2 py-0.5 capitalize">{order.category}</span>
          </div>
          <h1 className="mt-2 text-[16px] font-medium text-gray-900 leading-snug">{order.title}</h1>
          <p className="mt-1.5 text-[13px] text-gray-500 leading-relaxed">{order.description}</p>

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            {[
              { Icon: MapPin, label: 'Station',   value: order.stationName },
              { Icon: User,   label: 'Assigned',  value: order.assignedTo ?? order.assignedTeam ?? 'Unassigned' },
              { Icon: Clock,  label: 'Due',        value: formatDueTime(order.dueAt), urgent: overdue },
              { Icon: Wrench, label: 'Est. hours', value: order.estimatedHours ? `${order.estimatedHours}h` : 'TBD' },
            ].map(({ Icon, label, value, urgent }) => (
              <div key={label} className="flex items-start gap-2">
                <Icon className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${urgent ? 'text-red-500' : 'text-gray-400'}`} />
                <div>
                  <div className="text-[10px] text-gray-400 uppercase tracking-[0.05em]">{label}</div>
                  <div className={`text-[13px] font-medium ${urgent ? 'text-red-600' : 'text-gray-800'}`}>{value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {tasks.length > 0 && (
          <div className="px-4 py-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400 mb-2.5 flex items-center gap-1.5">
              <ClipboardList className="w-3 h-3" /> Tasks ({tasks.length})
            </div>
            <div className="space-y-2">
              {tasks.map(task => <TaskDetailCard key={task.id} task={task} compact />)}
            </div>
          </div>
        )}

        {order.notes.length > 0 && (
          <div className="px-4 py-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400 mb-2.5">Activity</div>
            <div className="space-y-2">
              {order.notes.map((n, i) => (
                <div key={i} className="bg-white border border-gray-100 px-4 py-3 text-[13px] text-gray-700">{n}</div>
              ))}
            </div>
          </div>
        )}

        {!closed && (
          <div className="px-4 py-3 space-y-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400 mb-1">Close work order</div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add completion notes…"
              rows={3}
              className="w-full border border-gray-200 px-3 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-none"
              aria-label="Completion notes"
            />
            <PhotoUploadField label="Completion photo" />
            <button
              onClick={() => { if (note.trim()) setClosed(true) }}
              disabled={!note.trim()}
              className="w-full min-h-[52px] bg-[#16A34A] text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Check className="w-4 h-4" />
              Mark complete
            </button>
          </div>
        )}

        {closed && (
          <div className="px-4 py-4 mx-4 my-3 bg-green-50 border border-green-100 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-[13px] text-green-700 font-medium">Work order completed</span>
            {order.completedAt && (
              <span className="text-[11px] text-green-500 ml-auto">{formatRelativeTime(order.completedAt)}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
