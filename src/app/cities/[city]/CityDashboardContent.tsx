"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Nav from "@/components/Nav";
import StationCard from "@/components/dart/StationCard";
import ReadinessGauge from "@/components/dart/ReadinessGauge";
import LiveFeed from "@/components/dart/LiveFeed";
import { useStationEngine } from "@/lib/dart/useStationEngine";

const CITY_CONFIGS = {
  dallas: {
    name: "Dallas",
    fullName: "City of Dallas",
    color: "#FF6B35",
    stationIds: ["mockingbird"],
  },
  plano: {
    name: "Plano",
    fullName: "City of Plano",
    color: "#27AE60",
    stationIds: ["downtown-plano"],
  },
  addison: {
    name: "Addison",
    fullName: "City of Addison",
    color: "#0057A8",
    stationIds: ["addison"],
  },
} as const;

type CitySlug = keyof typeof CITY_CONFIGS;

export default function CityDashboardPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = use(params);
  const { stations, isLive, toggle, tickCount } = useStationEngine(3000);

  const cfg = CITY_CONFIGS[citySlug as CitySlug];
  const otherCities = Object.entries(CITY_CONFIGS).filter(([slug]) => slug !== citySlug) as [CitySlug, typeof CITY_CONFIGS[CitySlug]][];

  if (!cfg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400 font-mono text-sm">City not found.</p>
      </div>
    );
  }

  const cityStations = stations.filter(s => (cfg.stationIds as readonly string[]).includes(s.id));
  const allEvents = cityStations.flatMap(s => s.events).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const totalRiders  = cityStations.reduce((n, s) => n + s.ridership.today, 0);
  const totalRevenue = cityStations.reduce((n, s) => n + s.agents.revenue.dailyRevenue, 0);
  const avgScore     = cityStations.length > 0
    ? Math.round(cityStations.reduce((n, s) => n + s.readinessScore, 0) / cityStations.length)
    : 0;
  const avgLevel = cityStations[0]?.readinessLevel ?? "fair";
  const roiRatio = cityStations[0]?.cityRoi.roiRatio ?? 1;
  const roiPct   = Math.round((roiRatio - 1) * 100);
  const isVoting = cityStations.some(s => s.politicalStatus === "voting");

  return (
    <div className="min-h-screen" style={{ background: "#F7F7F5" }}>
      <Nav />

      {/* City accent stripe */}
      <div className="pt-16" style={{ borderBottom: `3px solid ${cfg.color}` }}>
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
            {/* Back + city switcher row */}
            <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
              <Link
                href="/cities"
                className="inline-flex items-center gap-2 text-base font-semibold text-gray-800 hover:text-black transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                City Portal
              </Link>

              {/* Switch city */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium tracking-[0.2em] text-gray-400 uppercase">Switch city:</span>
                {otherCities.map(([slug, other]) => (
                  <Link
                    key={slug}
                    href={`/cities/${slug}`}
                    className="text-[12px] font-semibold px-3 py-1 border rounded-sm transition-all duration-150"
                    style={{ color: other.color, borderColor: other.color }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = other.color;
                      el.style.color = "white";
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.background = "transparent";
                      el.style.color = other.color;
                    }}
                  >
                    {other.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* City header */}
            <div className="flex items-start justify-between flex-wrap gap-6">
              <div>
                <p className="text-[10px] font-medium tracking-[0.35em] text-gray-400 uppercase mb-1">
                  City Account
                </p>
                <h1 className="text-3xl font-light tracking-tight text-gray-900">
                  {cfg.fullName}
                </h1>
                {isVoting && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-[12px] font-medium text-red-600">Proceeding to May 2 DART withdrawal vote</span>
                  </div>
                )}
              </div>

              {/* Live controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: isLive ? "#27AE60" : "#9CA3AF" }} />
                  <span className="text-[11px] text-gray-400">{isLive ? "Live" : "Paused"} · #{tickCount}</span>
                </div>
                <button
                  onClick={toggle}
                  className="text-[11px] font-medium px-3 py-1.5 border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-gray-900 transition-all rounded-sm"
                >
                  {isLive ? "Pause" : "Resume"}
                </button>
              </div>
            </div>

            {/* KPI strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
              {[
                { label: "Riders Today",    value: totalRiders.toLocaleString() },
                { label: "Revenue Today",   value: `$${totalRevenue.toLocaleString()}` },
                {
                  label: "City ROI",
                  value: `${roiRatio >= 1 ? "+" : ""}${roiPct}%`,
                  color: roiRatio >= 1 ? "#16A34A" : "#DC2626",
                },
                { label: "Stations Active", value: `${cityStations.length}` },
              ].map(kpi => (
                <div key={kpi.label} className="bg-gray-50 border border-gray-100 rounded-sm px-4 py-3">
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase">{kpi.label}</p>
                  <p className="text-xl font-light mt-1 text-gray-900" style={kpi.color ? { color: kpi.color } : {}}>
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-7">
        {cityStations.length === 0 ? (
          <p className="text-gray-400 font-mono text-sm">Loading station data…</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: stations + ROI table */}
            <div className="lg:col-span-2 space-y-5">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
                Your Stations
              </p>
              {cityStations.map(station => (
                <StationCard key={station.id} station={station} />
              ))}

              {/* ROI detail */}
              <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-xs">
                <div className="px-5 py-3.5 border-b border-gray-100">
                  <p className="text-[11px] font-semibold tracking-[0.25em] text-gray-400 uppercase">
                    City ROI — 1% Sales Tax Analysis
                  </p>
                </div>
                {cityStations.map(s => {
                  const { taxContributed, serviceValueReceived, roiRatio: r } = s.cityRoi;
                  return (
                    <div key={s.id} className="px-5 py-4 space-y-3">
                      {[
                        { label: "Tax Contributed / Mo",  value: `$${taxContributed.toLocaleString()}` },
                        { label: "Service Value / Mo",     value: `$${serviceValueReceived.toLocaleString()}` },
                        {
                          label: "ROI",
                          value: `${r >= 1 ? "+" : ""}${Math.round((r - 1) * 100)}%`,
                          color: r >= 1 ? "#16A34A" : "#DC2626",
                        },
                      ].map(row => (
                        <div key={row.label} className="flex items-center justify-between border-b border-gray-50 pb-3 last:border-0 last:pb-0">
                          <span className="text-[13px] text-gray-500">{row.label}</span>
                          <span className="text-[15px] font-mono font-semibold text-gray-800"
                            style={row.color ? { color: row.color } : {}}>
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>

              {/* Score summary */}
              <div className="bg-white border border-gray-200 rounded-sm p-5 flex items-center gap-5 shadow-xs">
                <ReadinessGauge score={avgScore} level={avgLevel} size="md" />
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-gray-400 uppercase mb-1">
                    Station Readiness
                  </p>
                  <p className="text-2xl font-light text-gray-900 capitalize">{avgLevel}</p>
                  <p className="text-[12px] text-gray-400 mt-1">Composite score across {cityStations.length} station{cityStations.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
            </div>

            {/* Right: live feed */}
            <div className="lg:col-span-1">
              <p className="text-[11px] font-semibold tracking-[0.25em] text-gray-400 uppercase mb-3">
                Agent Activity — Live
              </p>
              <div className="bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden" style={{ height: 580 }}>
                <LiveFeed events={allEvents} maxItems={20} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
