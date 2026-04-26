"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Nav from "@/components/Nav";
import ReadinessGauge from "@/components/dart/ReadinessGauge";
import AgentCard from "@/components/dart/AgentCard";
import LiveFeed from "@/components/dart/LiveFeed";
import StationDigitalTwin from "@/components/dart/StationDigitalTwin";
import { useStationEngine } from "@/lib/dart/useStationEngine";
import type { AgentName } from "@/lib/dart/types";
import { getLine } from "@/lib/dart/lines";

const AGENT_ORDER: AgentName[] = ["safety", "cleanliness", "equipment", "revenue", "parking", "community"];

function KpiCard({ label, value, sub, color }: { label: string; value: string; sub?: string; color?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm px-4 py-3.5 shadow-xs">
      <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase">{label}</p>
      <p className="text-xl font-light mt-1 text-gray-900" style={color ? { color } : {}}>
        {value}
      </p>
      {sub && <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.round((value / max) * 100)}%`, background: color }} />
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-3">
      {children}
    </p>
  );
}

function Panel({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden ${className}`} style={style}>
      {children}
    </div>
  );
}

function PanelHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-3.5 border-b border-gray-100 flex items-center justify-between">
      {children}
    </div>
  );
}

export default function StationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getStation, isLive, toggle, tickCount } = useStationEngine(3000);
  const station = getStation(id);

  if (!station) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 font-mono text-sm">Loading station data…</p>
      </div>
    );
  }

  const { agents, events, weather, ridership, cityRoi } = station;
  const sortedAgents = AGENT_ORDER.map(n => agents[n]);
  const criticalCount = sortedAgents.filter(a => a.status === "critical").length;
  const alertCount    = sortedAgents.filter(a => a.status === "alert").length;

  const levelColor =
    station.readinessLevel === "excellent" ? "#16A34A"
    : station.readinessLevel === "good"    ? "#4CAF50"
    : station.readinessLevel === "fair"    ? "#FF6B35"
    : "#DC2626";

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F5" }}>
      <Nav />

      {/* ── Clean white page header ── */}
      <div className="pt-16 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          {/* Breadcrumb */}
          {(() => {
            const primaryLineId = station.lineIds[0];
            const primaryLine = primaryLineId ? getLine(primaryLineId) : undefined;
            return (
              <div className="flex items-center gap-2 text-[11px] font-medium mb-4">
                <Link href="/dart" className="text-gray-400 hover:text-gray-700 transition-colors flex items-center gap-1.5">
                  <ArrowLeft className="w-3 h-3" />
                  DART Network
                </Link>
                {primaryLine && (
                  <>
                    <span className="text-gray-300">/</span>
                    <Link href={`/dart/line/${primaryLine.id}`}
                      className="hover:text-gray-700 transition-colors"
                      style={{ color: primaryLine.color }}>
                      {primaryLine.name}
                    </Link>
                  </>
                )}
              </div>
            );
          })()}

          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex items-start gap-5">
              {/* Score ring */}
              <ReadinessGauge score={station.readinessScore} level={station.readinessLevel} size="md" />

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[11px] font-mono text-gray-400">{station.line}</span>
                  {station.politicalStatus !== "stable" && (
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                      Voting May 2
                    </span>
                  )}
                </div>
                <h1 className="text-[1.8rem] font-light tracking-tight text-gray-900 leading-tight">
                  {station.name}
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">{station.city}</p>
                {criticalCount > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[12px] font-medium text-red-600">{criticalCount} critical issue{criticalCount !== 1 ? "s" : ""} active</span>
                  </div>
                )}
                {alertCount > 0 && criticalCount === 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-[12px] font-medium text-amber-600">{alertCount} alert{alertCount !== 1 ? "s" : ""}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: isLive ? "#27AE60" : "#9CA3AF" }} />
                <span className="text-[11px] text-gray-400">{isLive ? "Live" : "Paused"} · #{tickCount}</span>
              </div>
              <button onClick={toggle}
                className="text-[11px] font-medium px-3 py-1.5 border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all rounded-sm">
                {isLive ? "Pause" : "Resume"}
              </button>
            </div>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5">
            <KpiCard label="Riders Today" value={ridership.today.toLocaleString()} sub={`Peak ${ridership.peakHour}`} />
            <KpiCard
              label="Revenue"
              value={`$${agents.revenue.dailyRevenue.toLocaleString()}`}
              sub={`of $${agents.revenue.dailyTarget.toLocaleString()} target`}
              color={agents.revenue.dailyRevenue >= agents.revenue.dailyTarget ? "#16A34A" : "#FF6B35"}
            />
            <KpiCard
              label="Parking"
              value={`${agents.parking.occupancyRate}%`}
              sub={`${agents.parking.totalOccupied} / ${agents.parking.totalCapacity} spaces`}
              color={agents.parking.occupancyRate > 90 ? "#DC2626" : agents.parking.occupancyRate > 75 ? "#D97706" : "#16A34A"}
            />
            <KpiCard
              label="Weather"
              value={`${weather.tempF}°F`}
              sub={`${weather.condition} · ${weather.windMph} mph`}
            />
            <KpiCard
              label="City ROI"
              value={`${cityRoi.roiRatio >= 1 ? "+" : ""}${Math.round((cityRoi.roiRatio - 1) * 100)}%`}
              sub={`$${cityRoi.serviceValueReceived.toLocaleString()} value delivered`}
              color={cityRoi.roiRatio >= 1 ? "#16A34A" : "#DC2626"}
            />
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Main column */}
          <div className="xl:col-span-2 space-y-6">

            {/* Digital Twin */}
            <StationDigitalTwin station={station} />

            {/* Agent Council */}
            <div>
              <SectionLabel>Agent Council</SectionLabel>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {sortedAgents.map(agent => (
                  <AgentCard key={agent.name} agent={agent} />
                ))}
              </div>
            </div>

            {/* Equipment */}
            <Panel>
              <PanelHeader>
                <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase">Equipment</p>
                <span className="text-[11px] font-mono text-gray-400">
                  {agents.equipment.escalatorsUp}/{agents.equipment.escalatorsTotal} escalators operational
                </span>
              </PanelHeader>
              <div className="p-5 divide-y divide-gray-50">
                {agents.equipment.elevators.map(el => (
                  <div key={el.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full"
                        style={{ background: el.operational ? "#16A34A" : "#DC2626" }} />
                      <span className="text-[13px] text-gray-700">{el.name}</span>
                    </div>
                    <div className="flex items-center gap-6 text-[11px] font-mono">
                      <span>
                        <span className="text-gray-400">Vibration  </span>
                        <span className="font-semibold"
                          style={{ color: el.vibrationIndex > 70 ? "#DC2626" : el.vibrationIndex > 50 ? "#D97706" : "#16A34A" }}>
                          {Math.round(el.vibrationIndex)}
                        </span>
                      </span>
                      <span className="font-semibold text-[11px]"
                        style={{ color: el.operational ? "#16A34A" : "#DC2626" }}>
                        {el.operational ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                ))}
                {agents.equipment.predictedFailures.length > 0 && (
                  <div className="pt-3">
                    <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-2.5">
                      Predicted Failures
                    </p>
                    {agents.equipment.predictedFailures.map(f => (
                      <div key={f.equipmentId}
                        className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                        <span className="text-[13px] text-gray-600">{f.equipmentName}</span>
                        <div className="flex items-center gap-4 text-[11px] font-mono">
                          <span className="font-semibold"
                            style={{ color: f.probability > 70 ? "#DC2626" : "#D97706" }}>
                            {f.probability}% likely
                          </span>
                          <span className="text-gray-400">
                            {f.estimatedHours === 0 ? "NOW" : `~${f.estimatedHours}h`}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Panel>

            {/* Parking */}
            <Panel>
              <PanelHeader>
                <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase">Parking</p>
                <span className="text-[11px] font-mono text-gray-400">
                  {agents.parking.parkAndRide ? "Park & Ride" : "Daily"} ·{" "}
                  {agents.parking.totalOccupied}/{agents.parking.totalCapacity}
                </span>
              </PanelHeader>
              <div className="p-5 space-y-5">
                {agents.parking.zones.map(zone => {
                  const pct = Math.round((zone.occupied / zone.capacity) * 100);
                  const color = pct > 90 ? "#DC2626" : pct > 75 ? "#D97706" : "#16A34A";
                  return (
                    <div key={zone.id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-medium text-gray-700">{zone.name}</span>
                        <div className="flex items-center gap-4 text-[11px] font-mono text-gray-500">
                          <span>{zone.occupied}/{zone.capacity}</span>
                          <span className="font-semibold" style={{ color }}>{pct}%</span>
                          <span>${zone.pricePerHour.toFixed(2)}/hr</span>
                        </div>
                      </div>
                      <Bar value={zone.occupied} max={zone.capacity} color={color} />
                      {zone.evChargers > 0 && (
                        <p className="text-[11px] text-gray-400 mt-1.5">
                          ⚡ {zone.evInUse}/{zone.evChargers} EV chargers in use
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </Panel>

            {/* Bins */}
            <Panel>
              <PanelHeader>
                <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase">
                  Bin Sensors
                </p>
                <span className="text-[11px] font-mono text-gray-500">
                  Platform Grade: <strong className="text-gray-800">{agents.cleanliness.platformGrade}</strong>
                </span>
              </PanelHeader>
              <div className="p-5 space-y-4">
                {agents.cleanliness.bins.map(bin => {
                  const color = bin.fillLevel > 85 ? "#DC2626" : bin.fillLevel > 65 ? "#D97706" : "#16A34A";
                  return (
                    <div key={bin.id}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[13px] text-gray-600">{bin.location}</span>
                        <span className="text-[12px] font-mono font-semibold" style={{ color }}>
                          {Math.round(bin.fillLevel)}%
                        </span>
                      </div>
                      <Bar value={bin.fillLevel} max={100} color={color} />
                    </div>
                  );
                })}
              </div>
            </Panel>
          </div>

          {/* Side column */}
          <div className="xl:col-span-1 space-y-5">

            {/* Live feed */}
            <div>
              <SectionLabel>Agent Activity — Live</SectionLabel>
              <Panel style={{ height: 560 }}>
                <LiveFeed events={events} maxItems={20} />
              </Panel>
            </div>

            {/* Safety */}
            <Panel>
              <PanelHeader>
                <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase">Safety</p>
              </PanelHeader>
              <div className="p-5 grid grid-cols-2 gap-4">
                {[
                  { label: "Incidents Today", value: `${agents.safety.incidentsToday}`,
                    color: agents.safety.incidentsToday > 2 ? "#DC2626" : agents.safety.incidentsToday > 0 ? "#D97706" : "#16A34A" },
                  { label: "Avg Response", value: `${agents.safety.responseTimeMin.toFixed(1)} min`,
                    color: agents.safety.responseTimeMin > 10 ? "#DC2626" : "#16A34A" },
                  { label: "Homeless Flags", value: `${agents.safety.homelessFlags}`,
                    color: agents.safety.homelessFlags > 0 ? "#DC2626" : "#16A34A" },
                  { label: "Cameras Online", value: `${agents.safety.camerasCoverage}%`,
                    color: agents.safety.camerasCoverage > 85 ? "#16A34A" : "#D97706" },
                ].map(item => (
                  <div key={item.label}>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{item.label}</p>
                    <p className="text-[16px] font-mono font-medium mt-1" style={{ color: item.color }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </Panel>

            {/* Community */}
            <Panel>
              <PanelHeader>
                <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase">Community</p>
              </PanelHeader>
              <div className="p-5">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {[
                    { label: "App Rating", value: `${agents.community.appRating.toFixed(1)} ★` },
                    { label: "Photos Shared", value: `${agents.community.photosShared}` },
                    { label: "Rider Sentiment",
                      value: `${Math.round(agents.community.riderSentiment)}/100`,
                      color: agents.community.riderSentiment > 75 ? "#16A34A" : agents.community.riderSentiment > 55 ? "#D97706" : "#DC2626" },
                    { label: "Posts Today", value: `${agents.community.postsToday}` },
                  ].map(item => (
                    <div key={item.label}>
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">{item.label}</p>
                      <p className="text-[16px] font-mono font-medium mt-1 text-gray-800"
                        style={item.color ? { color: item.color } : {}}>
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Photo Spot</p>
                  <p className="text-[12px] text-gray-600 leading-relaxed">{agents.community.activePhotoSpot}</p>
                </div>
              </div>
            </Panel>

            {/* City ROI */}
            <Panel>
              <PanelHeader>
                <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase">City ROI</p>
              </PanelHeader>
              <div className="p-5">
                {[
                  { label: "Tax Contributed / Mo", value: `$${cityRoi.taxContributed.toLocaleString()}` },
                  { label: "Service Value / Mo", value: `$${cityRoi.serviceValueReceived.toLocaleString()}` },
                  {
                    label: "ROI",
                    value: `${cityRoi.roiRatio >= 1 ? "+" : ""}${Math.round((cityRoi.roiRatio - 1) * 100)}%`,
                    color: cityRoi.roiRatio >= 1 ? "#16A34A" : "#DC2626",
                  },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                    <span className="text-[12px] text-gray-500">{item.label}</span>
                    <span className="text-[14px] font-mono font-semibold text-gray-800"
                      style={item.color ? { color: item.color } : {}}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </div>
  );
}
