import { notFound } from 'next/navigation'
import Link from 'next/link'
import AppHeader from '@/components/app/AppHeader'
import { STATIONS, getStation, INCIDENTS, WORK_ORDERS, formatRelativeTime } from '@/lib/app/data'

export function generateStaticParams() {
  return STATIONS.map(s => ({ id: s.id }))
}
import { MapPin, Clock, AlertCircle, Wrench, ChevronRight } from 'lucide-react'
import PriorityBadge from '@/components/app/PriorityBadge'
import StatusPill from '@/components/app/StatusPill'

function scoreColor(score: number) {
  if (score >= 90) return '#16A34A'
  if (score >= 75) return '#FF6B35'
  if (score >= 60) return '#D97706'
  return '#DC2626'
}

export default async function StationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const station = getStation(id)
  if (!station) notFound()

  const incidents = INCIDENTS.filter(i => i.stationId === id && i.status !== 'closed' && i.status !== 'resolved')
  const orders = WORK_ORDERS.filter(wo => wo.stationId === id && wo.status !== 'completed' && wo.status !== 'cancelled')
  const color = scoreColor(station.score)

  return (
    <div>
      <AppHeader
        title={station.shortName}
        showBack
        backHref="/app/stations"
        rightSlot={
          <Link href="/app/incidents/new" className="text-[12px] font-medium text-[#FF6B35] border border-[#FF6B35] px-3 py-1.5 min-h-[36px] flex items-center">
            + Incident
          </Link>
        }
      />

      <div className="max-w-2xl md:max-w-none">
        {/* Station hero */}
        <div className="bg-white border-b border-gray-100 px-4 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[18px] font-medium text-gray-900">{station.name}</h1>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full" style={{ background: station.lineColor }} />
                <span className="text-[12px] text-gray-500">{station.line}</span>
                <span className="text-gray-300">·</span>
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-[12px] text-gray-500">{station.location}</span>
              </div>
              <div className="flex items-center gap-1 mt-1 text-[11px] text-gray-400">
                <Clock className="w-3 h-3" />
                Inspected {station.lastInspected}
              </div>
            </div>

            {/* Big score */}
            <div className="text-right flex-shrink-0">
              <div className="text-[3.5rem] font-thin leading-none" style={{ color }}>{station.score}</div>
              <div className="text-[10px] uppercase tracking-[0.1em] text-gray-400">readiness</div>
            </div>
          </div>

          {/* Score bar */}
          <div className="mt-4 h-1.5 bg-gray-100">
            <div className="h-full" style={{ width: `${station.score}%`, background: color }} />
          </div>
        </div>

        {/* Agent score breakdown */}
        <div className="bg-white border-b border-gray-100">
          <div className="px-4 py-3 border-b border-gray-50">
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-400">Agent scores</span>
          </div>
          <div className="grid grid-cols-3 divide-x divide-gray-100">
            {[
              { label: 'Safety',      val: station.safetyScore },
              { label: 'Cleanliness', val: station.cleanlinessScore },
              { label: 'Maintenance', val: station.maintenanceScore },
            ].map(({ label, val }) => {
              const c = scoreColor(val)
              return (
                <div key={label} className="px-4 py-3.5">
                  <div className="text-[22px] font-thin" style={{ color: c }}>{val}</div>
                  <div className="text-[10px] uppercase tracking-[0.06em] text-gray-400 mt-0.5">{label}</div>
                  <div className="mt-2 h-0.5 bg-gray-100">
                    <div style={{ width: `${val}%`, background: c }} className="h-full" />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Active incidents */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 flex items-center gap-1.5">
              <AlertCircle className="w-3 h-3" /> Active incidents ({incidents.length})
            </span>
            <Link href="/app/incidents" className="text-[11px] text-gray-400 hover:text-gray-700 flex items-center gap-0.5">
              All <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          {incidents.length === 0 ? (
            <div className="py-6 text-center text-[13px] text-gray-400 bg-white border border-gray-100">
              No active incidents
            </div>
          ) : (
            <div className="space-y-2">
              {incidents.map(inc => (
                <div key={inc.id} className="bg-white border border-gray-100 border-l-4 px-4 py-3"
                  style={{ borderLeftColor: inc.priority === 'critical' ? '#DC2626' : inc.priority === 'high' ? '#FF6B35' : '#D97706' }}>
                  <div className="flex items-start gap-2">
                    <PriorityBadge priority={inc.priority} />
                    <StatusPill status={inc.status} />
                  </div>
                  <div className="mt-1.5 text-[13px] font-medium text-gray-900">{inc.title}</div>
                  <div className="mt-1 text-[11px] text-gray-400">
                    {inc.reportedBy} · {formatRelativeTime(inc.createdAt)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Open work orders */}
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 flex items-center gap-1.5">
              <Wrench className="w-3 h-3" /> Open work orders ({orders.length})
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="py-6 text-center text-[13px] text-gray-400 bg-white border border-gray-100">
              No open work orders
            </div>
          ) : (
            <div className="space-y-2">
              {orders.map(wo => (
                <Link key={wo.id} href={`/app/work-orders/${wo.id}`}
                  className="flex items-center gap-3 bg-white border border-gray-100 px-4 py-3 hover:border-gray-200 transition-colors">
                  <Wrench className="w-4 h-4 text-gray-300 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium text-gray-900 truncate">{wo.title}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <PriorityBadge priority={wo.priority} />
                      <StatusPill status={wo.status} />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
