"use client";

import { use, useMemo } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Nav from "@/components/Nav";
import StationCard from "@/components/dart/StationCard";
import LiveFeed from "@/components/dart/LiveFeed";
import ReadinessGauge from "@/components/dart/ReadinessGauge";
import { useStationEngine } from "@/lib/dart/useStationEngine";
import { getLine, DART_LINES } from "@/lib/dart/lines";
import type { ActiveAction, AgentName, ReadinessLevel } from "@/lib/dart/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatETA(action: ActiveAction): string {
  const elapsedMs = Date.now() - new Date(action.startedAt).getTime();
  const elapsedMin = elapsedMs / 60000;
  const remaining = action.etaMinutes - elapsedMin;
  if (remaining <= 0) return "Overdue";
  if (remaining < 1) return "< 1 min";
  if (remaining < 60) return `~${Math.round(remaining)} min`;
  const hrs = Math.floor(remaining / 60);
  const mins = Math.round(remaining % 60);
  if (mins === 0) return `~${hrs}h`;
  return `~${hrs}h ${mins}m`;
}

const AGENT_LABEL: Record<AgentName, string> = {
  safety: "Safety & Security",
  cleanliness: "Cleanliness",
  equipment: "Equipment",
  revenue: "Revenue",
  parking: "Parking",
  community: "Community",
};

const STATUS_COLOR: Record<string, string> = {
  nominal: "#16A34A",
  active:  "#FF6B35",
  alert:   "#D97706",
  critical: "#DC2626",
};

const STATUS_BG: Record<string, string> = {
  nominal:  "#F0FDF4",
  active:   "#FFF7ED",
  alert:    "#FFFBEB",
  critical: "#FEF2F2",
};

function levelColor(level: ReadinessLevel): string {
  return level === "excellent" ? "#16A34A"
    : level === "good" ? "#4CAF50"
    : level === "fair" ? "#FF6B35"
    : "#DC2626";
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function LinePage({ params }: { params: Promise<{ lineId: string }> }) {
  const { lineId } = use(params);
  const line = getLine(lineId);
  const { stations, isLive, toggle, tickCount } = useStationEngine(3000);

  const lineStations = useMemo(
    () => stations.filter(s => s.lineIds.includes(lineId)),
    [stations, lineId]
  );

  const lineScore = useMemo(
    () => lineStations.length > 0
      ? Math.round(lineStations.reduce((s, st) => s + st.readinessScore, 0) / lineStations.length)
      : 0,
    [lineStations]
  );

  const lineLevel: ReadinessLevel = lineScore >= 90 ? "excellent"
    : lineScore >= 75 ? "good"
    : lineScore >= 60 ? "fair"
    : "at-risk";

  const lineEvents = useMemo(
    () => lineStations
      .flatMap(s => s.events.map(e => ({ ...e, _stationId: s.id })))
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 24),
    [lineStations]
  );

  // Gather all active actions across all stations
  const activeActions = useMemo(() => {
    const actions: {
      stationName: string;
      stationId: string;
      agentName: AgentName;
      action: ActiveAction;
      status: string;
    }[] = [];
    for (const station of lineStations) {
      for (const [agentKey, agent] of Object.entries(station.agents)) {
        if (agent.activeAction) {
          actions.push({
            stationName: station.shortName,
            stationId: station.id,
            agentName: agentKey as AgentName,
            action: agent.activeAction,
            status: agent.status,
          });
        }
      }
    }
    return actions;
  }, [lineStations]);

  const totalIssues = lineStations.reduce(
    (s, st) => s + Object.values(st.agents).filter(a => a.status === "critical" || a.status === "alert").length, 0
  );
  const totalRidership = lineStations.reduce((s, st) => s + st.ridership.today, 0);

  if (!line) {
    return (
      <div className="min-h-screen" style={{ background: "#F7F7F5" }}>
        <Nav />
        <div className="pt-16 flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-400 font-mono text-sm mb-4">Line not found: {lineId}</p>
            <p className="text-[11px] text-gray-400 mb-4">Available lines:</p>
            <div className="flex gap-3 justify-center">
              {DART_LINES.map(l => (
                <Link key={l.id} href={`/dart/line/${l.id}`}
                  className="text-[11px] px-3 py-1.5 border border-gray-200 text-gray-600 hover:border-gray-400 rounded-sm">
                  {l.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F5" }}>
      <Nav />

      {/* ── Page header ── */}
      <div className="pt-16 bg-white border-b border-gray-200">
        {/* Line color accent */}
        <div className="h-1 w-full" style={{ background: line.color }} />

        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5">
          {/* Breadcrumb */}
          <Link href="/dart"
            className="inline-flex items-center gap-1.5 text-[11px] font-medium text-gray-400 hover:text-gray-700 transition-colors mb-4">
            <ArrowLeft className="w-3 h-3" />
            DART Network
          </Link>

          <div className="flex items-start justify-between flex-wrap gap-6">
            <div className="flex items-start gap-5">
              <ReadinessGauge score={lineScore} level={lineLevel} size="md" />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-semibold tracking-[0.3em] uppercase px-2 py-0.5 rounded-full"
                    style={{ color: line.color, background: line.bgColor, border: `1px solid ${line.borderColor}` }}>
                    {line.shortName} Line
                  </span>
                </div>
                <h1 className="text-[1.8rem] font-light tracking-tight text-gray-900 leading-tight">
                  {line.name}
                </h1>
                <p className="text-sm text-gray-400 mt-0.5">{line.route} · {line.mileage} mi</p>
                {totalIssues > 0 && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[12px] font-medium text-red-600">
                      {totalIssues} active issue{totalIssues !== 1 ? "s" : ""} across {lineStations.length} station{lineStations.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Controls */}
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
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
            {[
              { label: "Line Health", value: `${lineScore}`, sub: lineLevel },
              { label: "Stations", value: `${lineStations.length}`, sub: `${line.totalStations - lineStations.length} not yet monitored` },
              { label: "Riders Today", value: totalRidership.toLocaleString(), sub: "across monitored stations" },
              { label: "Active Issues", value: `${totalIssues}`, sub: activeActions.length > 0 ? `${activeActions.length} actions in progress` : "All clear",
                color: totalIssues > 4 ? "#DC2626" : totalIssues > 1 ? "#D97706" : "#16A34A" },
            ].map(stat => (
              <div key={stat.label} className="bg-white border border-gray-200 rounded-sm px-4 py-3.5 shadow-xs">
                <p className="text-xs font-semibold tracking-[0.15em] text-gray-400 uppercase">{stat.label}</p>
                <p className="text-xl font-light mt-1 text-gray-900" style={stat.color ? { color: stat.color } : {}}>
                  {stat.value}
                </p>
                {stat.sub && <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{stat.sub}</p>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left / main column */}
          <div className="xl:col-span-2 space-y-6">

            {/* ── Active Agent Actions ── */}
            {activeActions.length > 0 && (
              <div>
                <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-3">
                  Agent Actions In Progress — {activeActions.length} active
                </p>
                <div className="bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden">
                  <div className="divide-y divide-gray-50">
                    {activeActions.map((item, i) => {
                      const eta = formatETA(item.action);
                      const isOverdue = eta === "Overdue";
                      const statusColor = STATUS_COLOR[item.status] ?? "#6B7280";
                      const statusBg = STATUS_BG[item.status] ?? "#F9FAFB";
                      return (
                        <div key={i} className="px-5 py-3.5 flex items-center gap-4">
                          {/* Pulse dot */}
                          <div className="relative flex-shrink-0">
                            <div className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
                            <div className="absolute inset-0 rounded-full animate-ping"
                              style={{ background: statusColor, opacity: 0.35 }} />
                          </div>

                          {/* Station + agent */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 mb-0.5">
                              <Link href={`/dart/station/${item.stationId}`}
                                className="text-[11px] font-semibold text-gray-700 hover:text-black transition-colors">
                                {item.stationName}
                              </Link>
                              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm"
                                style={{ color: statusColor, background: statusBg }}>
                                {AGENT_LABEL[item.agentName]}
                              </span>
                            </div>
                            <p className="text-[12px] text-gray-500 leading-relaxed">
                              {item.action.description}
                            </p>
                          </div>

                          {/* ETA badge */}
                          <div className="flex-shrink-0 text-right">
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-0.5">ETA</p>
                            <span className="text-[13px] font-mono font-semibold"
                              style={{ color: isOverdue ? "#DC2626" : statusColor }}>
                              {eta}
                            </span>
                          </div>

                          {/* Drill-down link */}
                          <Link href={`/dart/station/${item.stationId}`}
                            className="flex-shrink-0 text-[10px] font-medium text-gray-300 hover:text-gray-600 transition-colors uppercase tracking-wider">
                            Details →
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ── Stations ── */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase">
                  Stations on {line.name} — {lineStations.length} monitored
                </p>
                <p className="text-[11px] text-gray-400">
                  {lineStations.filter(s => ["excellent", "good"].includes(s.readinessLevel)).length}/{lineStations.length} nominal
                </p>
              </div>
              <div className="space-y-4">
                {lineStations.map(station => (
                  <StationCard key={station.id} station={station} />
                ))}
              </div>

              {lineStations.length === 0 && (
                <div className="bg-white border border-gray-200 rounded-sm p-8 text-center shadow-xs">
                  <p className="text-sm text-gray-400">No monitored stations on this line yet.</p>
                </div>
              )}
            </div>

            {/* ── Line health summary ── */}
            <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase">
                  Station Health Summary
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50/60">
                      {["Station", "Score", "Safety", "Equipment", "Cleanliness", "Revenue", "Issues"].map(h => (
                        <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {lineStations.map(s => {
                      const issues = Object.values(s.agents).filter(a => a.status === "critical" || a.status === "alert").length;
                      return (
                        <tr key={s.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3">
                            <Link href={`/dart/station/${s.id}`}
                              className="text-[13px] font-medium text-gray-800 hover:text-black transition-colors">
                              {s.shortName}
                            </Link>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-[13px] font-mono font-semibold"
                              style={{ color: levelColor(s.readinessLevel) }}>
                              {s.readinessScore}
                            </span>
                          </td>
                          {(["safety", "equipment", "cleanliness", "revenue"] as const).map(agent => (
                            <td key={agent} className="px-4 py-3">
                              <span className="text-[11px] font-mono font-semibold"
                                style={{ color: STATUS_COLOR[s.agents[agent].status] }}>
                                {Math.round(s.agents[agent].score)}
                              </span>
                            </td>
                          ))}
                          <td className="px-4 py-3">
                            <span className="text-[11px] font-mono font-semibold"
                              style={{ color: issues > 0 ? "#DC2626" : "#16A34A" }}>
                              {issues > 0 ? `${issues} open` : "None"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right column: live feed */}
          <div className="xl:col-span-1">
            <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-3">
              Agent Activity — {line.shortName} Line Live
            </p>
            <div className="bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden" style={{ height: 640 }}>
              <LiveFeed events={lineEvents} maxItems={24} />
            </div>

            {/* Other lines */}
            <div className="mt-5">
              <p className="text-xs font-semibold tracking-[0.2em] text-gray-400 uppercase mb-3">
                Other Lines
              </p>
              <div className="space-y-2">
                {DART_LINES.filter(l => l.id !== lineId).map(l => (
                  <Link key={l.id} href={`/dart/line/${l.id}`}
                    className="flex items-center justify-between bg-white border border-gray-200 rounded-sm px-4 py-3 hover:border-gray-400 hover:shadow-xs transition-all group shadow-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                      <span className="text-[13px] font-medium text-gray-700 group-hover:text-black">{l.name}</span>
                    </div>
                    <span className="text-[10px] text-gray-400 group-hover:text-gray-600 uppercase tracking-wider">View →</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
