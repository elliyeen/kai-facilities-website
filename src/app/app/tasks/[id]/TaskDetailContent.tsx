'use client'

import { useState } from 'react'
import { notFound } from 'next/navigation'
import AppHeader from '@/components/app/AppHeader'
import PriorityBadge from '@/components/app/PriorityBadge'
import StatusPill from '@/components/app/StatusPill'
import PhotoUploadField from '@/components/app/PhotoUploadField'
import { getTask, formatDueTime, formatRelativeTime } from '@/lib/app/data'
import { MapPin, Clock, User, Camera, Check, Link as LinkIcon } from 'lucide-react'

export default function TaskDetailContent({ id }: { id: string }) {
  const task = getTask(id)
  if (!task) notFound()

  const [note, setNote]       = useState('')
  const [done, setDone]       = useState(task.status === 'done')
  const [started, setStarted] = useState(task.status === 'in_progress' || task.status === 'done')
  const overdue = !done && new Date(task.dueAt) < new Date()

  return (
    <div>
      <AppHeader title={task.id.toUpperCase()} showBack backHref="/app/tasks" />

      <div className="max-w-2xl md:max-w-none">
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-center gap-2 flex-wrap">
            <PriorityBadge priority={task.priority} size="md" />
            <StatusPill status={done ? 'done' : started ? 'in_progress' : task.status} />
            {task.photoRequired && (
              <span className="flex items-center gap-1 text-[10px] border border-gray-200 px-2 py-0.5 text-gray-500">
                <Camera className="w-2.5 h-2.5" />
                Photo required
              </span>
            )}
          </div>
          <h1 className={`mt-2 text-[16px] font-medium leading-snug ${done ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {task.title}
          </h1>
          <p className="mt-1.5 text-[13px] text-gray-500 leading-relaxed">{task.description}</p>

          <div className="mt-4 space-y-2">
            {[
              { Icon: User,     label: task.assignedTo },
              { Icon: MapPin,   label: task.stationName },
              {
                Icon: Clock,
                label: done && task.completedAt
                  ? `Completed ${formatRelativeTime(task.completedAt)}`
                  : `Due ${formatDueTime(task.dueAt)}`,
                urgent: overdue,
              },
              ...(task.workOrderId ? [{ Icon: LinkIcon, label: `Work order: ${task.workOrderId}` }] : []),
            ].map(({ Icon, label, urgent }, i) => (
              <div key={i} className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${urgent ? 'text-red-500' : 'text-gray-400'}`} />
                <span className={`text-[13px] ${urgent ? 'text-red-600 font-medium' : 'text-gray-600'}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {task.notes && (
          <div className="px-4 py-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400 mb-2">Notes</div>
            <div className="bg-white border border-gray-100 px-4 py-3 text-[13px] text-gray-700 italic">
              &ldquo;{task.notes}&rdquo;
            </div>
          </div>
        )}

        {!done && (
          <div className="px-4 py-3 space-y-3">
            <div className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400 mb-1">Update task</div>

            {!started && (
              <button
                onClick={() => setStarted(true)}
                className="w-full min-h-[48px] border-2 border-[#FF6B35] text-[#FF6B35] text-[14px] font-medium hover:bg-[#FF6B35]/5 transition-colors"
              >
                Start task
              </button>
            )}

            {started && (
              <>
                <textarea
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="Add completion notes…"
                  rows={3}
                  className="w-full border border-gray-200 px-3 py-2.5 text-[13px] text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-400 resize-none"
                  aria-label="Completion notes"
                />
                {task.photoRequired && <PhotoUploadField label="Completion photo" required />}
                <button
                  onClick={() => { if (note.trim()) setDone(true) }}
                  disabled={!note.trim()}
                  className="w-full min-h-[52px] bg-[#16A34A] text-white text-[14px] font-medium flex items-center justify-center gap-2 hover:bg-green-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  Mark complete
                </button>
              </>
            )}
          </div>
        )}

        {done && (
          <div className="mx-4 my-3 bg-green-50 border border-green-100 px-4 py-3.5 flex items-center gap-2">
            <Check className="w-4 h-4 text-green-600" />
            <span className="text-[13px] text-green-700 font-medium">Task completed</span>
          </div>
        )}
      </div>
    </div>
  )
}
