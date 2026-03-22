"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";

const StationMapGL = dynamic(() => import("./StationMapGL"), { ssr: false });

/* ─── Types ──────────────────────────────────────── */
type Status  = "good" | "warning" | "critical" | "deploying" | "closed";
type View    = "command" | "stations" | "inspect" | "report" | "asset_elevators" | "asset_cameras" | "asset_stairwells" | "asset_trash_cans" | "asset_bus_covers" | "intelligence";
type AssetKey = "elevators" | "cameras" | "stairwells" | "trash_cans" | "bus_covers";
type InspVal = "pass" | "fail" | "na" | null;

interface Issue { key: string; label: string; icon: string; priority: "critical"|"high"|"standard"; }
interface StaffMember { name: string; role: string; status: "On Task"|"En Route"|"Available"; detail: string; }
interface AssetEntry { elevators: number; elevators_ok: number; cameras: number; cameras_ok: number; stairwells: number; stairwells_ok: number; trash_cans: number; trash_cans_ok: number; bus_covers: number; bus_covers_ok: number; }
interface Station {
  id: string; name: string; score: number; status: Status;
  issues: string[]; lastInspected: string; staff: StaffMember[];
  lineId: string; lineColor: string; lineName: string;
  city: string; closure?: string;
}
interface Line { name: string; sub: string; color: string; stations: Station[]; }
interface InspItem    { id: string; name: string; desc: string; priority: "critical"|"high"|"standard"; }
interface InspSection { id: string; title: string; items: InspItem[]; }

/* ─── Design tokens ─────────────────────────────── */
const T = {
  bg:         "#F7F5F0",
  panel:      "#FFFFFF",
  border:     "#E8EAED",
  borderHard: "#C4C8CF",
  text:       "#111827",
  textSub:    "#374151",
  textMuted:  "#6B7280",
  gold:       "#C9A84C",
  goldLight:  "#F0D98A",
  shadow:     "0 1px 3px rgba(0,0,0,0.07)",
  shadowMd:   "0 2px 8px rgba(0,0,0,0.09)",
};

/* ─── Issue definitions ─────────────────────────── */
const ISSUES: Record<string, Issue> = {
  cleaning_overdue: { key:"cleaning_overdue", label:"Cleaning Overdue",       icon:"CLN", priority:"high"     },
  restroom_closed:  { key:"restroom_closed",  label:"Restroom Out of Service", icon:"RST", priority:"critical" },
  elevator_down:    { key:"elevator_down",    label:"Elevator Down",           icon:"ELV", priority:"critical" },
  graffiti:         { key:"graffiti",         label:"Graffiti/Vandalism",      icon:"GRF", priority:"high"     },
  lighting_fault:   { key:"lighting_fault",   label:"Lighting Fault",          icon:"LGT", priority:"high"     },
  escalator_maint:  { key:"escalator_maint",  label:"Escalator Maintenance",   icon:"ESC", priority:"standard" },
  debris:           { key:"debris",           label:"Debris on Platform",      icon:"DEB", priority:"standard" },
  crew_delayed:     { key:"crew_delayed",     label:"Crew Deployment Delayed", icon:"DLY", priority:"high"     },
  camera_offline:   { key:"camera_offline",   label:"Camera Offline",          icon:"CAM", priority:"critical" },
  safety:           { key:"safety",           label:"Safety Concern",          icon:"SFY", priority:"critical" },
  smell:            { key:"smell",            label:"Odor/Sanitation",          icon:"SNL", priority:"high"     },
  litter:           { key:"litter",           label:"Litter on Platform",       icon:"LIT", priority:"standard" },
  vandalism:        { key:"vandalism",        label:"Vandalism",                icon:"VND", priority:"high"     },
  lighting:         { key:"lighting",         label:"Lighting Issue",           icon:"LGT", priority:"high"     },
};

/* ─── Asset data ────────────────────────────────── */
const ASSETS: Record<string, AssetEntry> = {
  pearl:             { elevators:2,elevators_ok:2, cameras:8,cameras_ok:8,   stairwells:4,stairwells_ok:4, trash_cans:12,trash_cans_ok:12, bus_covers:2,bus_covers_ok:2 },
  akard:             { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:1,bus_covers_ok:1 },
  "st-paul":         { elevators:2,elevators_ok:2, cameras:6,cameras_ok:5,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "city-place":      { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:4,stairwells_ok:4, trash_cans:10,trash_cans_ok:10, bus_covers:2,bus_covers_ok:2 },
  "cityplace-up":    { elevators:2,elevators_ok:1, cameras:8,cameras_ok:6,   stairwells:4,stairwells_ok:4, trash_cans:10,trash_cans_ok:8,  bus_covers:2,bus_covers_ok:2 },
  victory:           { elevators:3,elevators_ok:3, cameras:10,cameras_ok:9,  stairwells:5,stairwells_ok:5, trash_cans:14,trash_cans_ok:13, bus_covers:3,bus_covers_ok:3 },
  mockingbird:       { elevators:2,elevators_ok:2, cameras:8,cameras_ok:8,   stairwells:4,stairwells_ok:4, trash_cans:11,trash_cans_ok:11, bus_covers:2,bus_covers_ok:2 },
  smu:               { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:2,bus_covers_ok:2 },
  "park-lane":       { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:1,bus_covers_ok:1 },
  "lbj-central":     { elevators:3,elevators_ok:1, cameras:10,cameras_ok:7,  stairwells:5,stairwells_ok:4, trash_cans:14,trash_cans_ok:11, bus_covers:3,bus_covers_ok:2 },
  "forest-lane":     { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "north-carrollton":{ elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:2,bus_covers_ok:2 },
  buckner:           { elevators:1,elevators_ok:1, cameras:5,cameras_ok:5,   stairwells:2,stairwells_ok:2, trash_cans:7,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  hatcher:           { elevators:1,elevators_ok:1, cameras:5,cameras_ok:4,   stairwells:2,stairwells_ok:2, trash_cans:7,trash_cans_ok:6,   bus_covers:1,bus_covers_ok:1 },
  lawnview:          { elevators:1,elevators_ok:1, cameras:5,cameras_ok:5,   stairwells:2,stairwells_ok:2, trash_cans:7,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  "fair-park":       { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:10,trash_cans_ok:10, bus_covers:2,bus_covers_ok:2 },
  baylor:            { elevators:3,elevators_ok:3, cameras:9,cameras_ok:9,   stairwells:4,stairwells_ok:4, trash_cans:12,trash_cans_ok:12, bus_covers:2,bus_covers_ok:2 },
  "deep-ellum":      { elevators:2,elevators_ok:2, cameras:8,cameras_ok:8,   stairwells:3,stairwells_ok:3, trash_cans:11,trash_cans_ok:10, bus_covers:2,bus_covers_ok:2 },
  convention:        { elevators:4,elevators_ok:4, cameras:14,cameras_ok:14, stairwells:6,stairwells_ok:6, trash_cans:18,trash_cans_ok:18, bus_covers:4,bus_covers_ok:4 },
  "union-g":         { elevators:4,elevators_ok:4, cameras:12,cameras_ok:12, stairwells:6,stairwells_ok:6, trash_cans:16,trash_cans_ok:15, bus_covers:3,bus_covers_ok:3 },
  cedars:            { elevators:1,elevators_ok:1, cameras:5,cameras_ok:5,   stairwells:2,stairwells_ok:2, trash_cans:7,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  ledbetter:         { elevators:1,elevators_ok:1, cameras:5,cameras_ok:5,   stairwells:2,stairwells_ok:2, trash_cans:7,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  kiest:             { elevators:2,elevators_ok:1, cameras:6,cameras_ok:5,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  illinois:          { elevators:1,elevators_ok:1, cameras:5,cameras_ok:5,   stairwells:2,stairwells_ok:2, trash_cans:7,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  morrell:           { elevators:1,elevators_ok:1, cameras:5,cameras_ok:5,   stairwells:2,stairwells_ok:2, trash_cans:7,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  westmoreland:      { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  hampton:           { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  inwood:            { elevators:2,elevators_ok:2, cameras:8,cameras_ok:8,   stairwells:3,stairwells_ok:3, trash_cans:10,trash_cans_ok:10, bus_covers:2,bus_covers_ok:2 },
  market:            { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:2,bus_covers_ok:2 },
  "victory-b":       { elevators:3,elevators_ok:3, cameras:10,cameras_ok:9,  stairwells:5,stairwells_ok:5, trash_cans:14,trash_cans_ok:12, bus_covers:3,bus_covers_ok:3 },
  "pearl-b":         { elevators:2,elevators_ok:2, cameras:8,cameras_ok:8,   stairwells:4,stairwells_ok:4, trash_cans:12,trash_cans_ok:12, bus_covers:2,bus_covers_ok:2 },
  "dfw-a":           { elevators:6,elevators_ok:6, cameras:20,cameras_ok:20, stairwells:8,stairwells_ok:8, trash_cans:24,trash_cans_ok:24, bus_covers:4,bus_covers_ok:4 },
  "belt-line":       { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "las-colinas":     { elevators:3,elevators_ok:2, cameras:10,cameras_ok:7,  stairwells:4,stairwells_ok:4, trash_cans:12,trash_cans_ok:9,  bus_covers:2,bus_covers_ok:2 },
  irving:            { elevators:3,elevators_ok:3, cameras:10,cameras_ok:10, stairwells:4,stairwells_ok:4, trash_cans:12,trash_cans_ok:12, bus_covers:2,bus_covers_ok:2 },
  "north-lake":      { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  bachman:           { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:2,bus_covers_ok:2 },
  "love-o":          { elevators:2,elevators_ok:2, cameras:8,cameras_ok:8,   stairwells:3,stairwells_ok:3, trash_cans:10,trash_cans_ok:10, bus_covers:2,bus_covers_ok:2 },
  "dfw-b":           { elevators:6,elevators_ok:6, cameras:20,cameras_ok:19, stairwells:8,stairwells_ok:8, trash_cans:24,trash_cans_ok:23, bus_covers:4,bus_covers_ok:4 },
  /* ── Green Line ── */
  "lake-june":             { elevators:1,elevators_ok:1, cameras:5,cameras_ok:5,   stairwells:2,stairwells_ok:2, trash_cans:7,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  "mlk":                   { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "pearl-g":               { elevators:2,elevators_ok:2, cameras:8,cameras_ok:8,   stairwells:4,stairwells_ok:4, trash_cans:12,trash_cans_ok:12, bus_covers:2,bus_covers_ok:2 },
  "st-paul-g":             { elevators:2,elevators_ok:2, cameras:6,cameras_ok:5,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "akard-g":               { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:1,bus_covers_ok:1 },
  "west-end-g":            { elevators:2,elevators_ok:2, cameras:8,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:10,trash_cans_ok:9,  bus_covers:2,bus_covers_ok:2 },
  "victory-g":             { elevators:3,elevators_ok:3, cameras:10,cameras_ok:10, stairwells:5,stairwells_ok:5, trash_cans:14,trash_cans_ok:14, bus_covers:3,bus_covers_ok:3 },
  "market-center-g":       { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:2,bus_covers_ok:2 },
  "sw-medical":            { elevators:3,elevators_ok:2, cameras:9,cameras_ok:7,   stairwells:4,stairwells_ok:4, trash_cans:11,trash_cans_ok:9,  bus_covers:2,bus_covers_ok:1 },
  "inwood-g":              { elevators:2,elevators_ok:2, cameras:8,cameras_ok:8,   stairwells:3,stairwells_ok:3, trash_cans:10,trash_cans_ok:10, bus_covers:2,bus_covers_ok:2 },
  "burbank":               { elevators:1,elevators_ok:1, cameras:5,cameras_ok:5,   stairwells:2,stairwells_ok:2, trash_cans:7,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  "bachman-g":             { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:2,bus_covers_ok:2 },
  "walnut-hill":           { elevators:2,elevators_ok:1, cameras:6,cameras_ok:5,   stairwells:3,stairwells_ok:2, trash_cans:8,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  "royal-lane":            { elevators:1,elevators_ok:1, cameras:5,cameras_ok:5,   stairwells:2,stairwells_ok:2, trash_cans:7,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  "farmers-branch":        { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "downtown-carrollton":   { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:2,bus_covers_ok:2 },
  "trinity-mills":         { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "north-carrollton-frank":{ elevators:3,elevators_ok:3, cameras:10,cameras_ok:10, stairwells:4,stairwells_ok:4, trash_cans:12,trash_cans_ok:12, bus_covers:2,bus_covers_ok:2 },
  /* ── Blue Line ── */
  "unt-dallas":            { elevators:2,elevators_ok:2, cameras:8,cameras_ok:8,   stairwells:3,stairwells_ok:3, trash_cans:10,trash_cans_ok:10, bus_covers:2,bus_covers_ok:2 },
  "camp-wisdom":           { elevators:1,elevators_ok:1, cameras:5,cameras_ok:5,   stairwells:2,stairwells_ok:2, trash_cans:7,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  "va-medical":            { elevators:3,elevators_ok:3, cameras:10,cameras_ok:10, stairwells:4,stairwells_ok:4, trash_cans:12,trash_cans_ok:12, bus_covers:2,bus_covers_ok:2 },
  "eight-blue":            { elevators:2,elevators_ok:2, cameras:7,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "cedars-blue":           { elevators:2,elevators_ok:1, cameras:6,cameras_ok:3,   stairwells:3,stairwells_ok:2, trash_cans:8,trash_cans_ok:5,   bus_covers:1,bus_covers_ok:1 },
  "convention-blue":       { elevators:4,elevators_ok:0, cameras:14,cameras_ok:8,  stairwells:6,stairwells_ok:4, trash_cans:18,trash_cans_ok:0,  bus_covers:4,bus_covers_ok:0 },
  "union-blue":            { elevators:4,elevators_ok:4, cameras:12,cameras_ok:12, stairwells:6,stairwells_ok:6, trash_cans:16,trash_cans_ok:15, bus_covers:3,bus_covers_ok:3 },
  "west-end-blue":         { elevators:2,elevators_ok:2, cameras:8,cameras_ok:8,   stairwells:3,stairwells_ok:3, trash_cans:10,trash_cans_ok:10, bus_covers:2,bus_covers_ok:2 },
  "akard-blue":            { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "st-paul-blue":          { elevators:2,elevators_ok:1, cameras:6,cameras_ok:4,   stairwells:3,stairwells_ok:2, trash_cans:9,trash_cans_ok:6,   bus_covers:1,bus_covers_ok:1 },
  "pearl-blue":            { elevators:3,elevators_ok:3, cameras:10,cameras_ok:10, stairwells:4,stairwells_ok:4, trash_cans:12,trash_cans_ok:12, bus_covers:2,bus_covers_ok:2 },
  "cityplace-blue":        { elevators:2,elevators_ok:2, cameras:8,cameras_ok:8,   stairwells:4,stairwells_ok:4, trash_cans:10,trash_cans_ok:10, bus_covers:2,bus_covers_ok:2 },
  "mockingbird-blue":      { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:2,bus_covers_ok:2 },
  "white-rock":            { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "lake-highlands":        { elevators:2,elevators_ok:2, cameras:6,cameras_ok:5,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:7,   bus_covers:1,bus_covers_ok:1 },
  "lbj-skillman":          { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:1,bus_covers_ok:1 },
  "forest-jupiter":        { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "downtown-garland":      { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:2,bus_covers_ok:2 },
  "downtown-rowlett":      { elevators:3,elevators_ok:3, cameras:9,cameras_ok:9,   stairwells:4,stairwells_ok:4, trash_cans:11,trash_cans_ok:11, bus_covers:2,bus_covers_ok:2 },
  /* ── Silver Line ── */
  "shiloh-sl":             { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "12th-street-sl":        { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "cityline-bush-sl":      { elevators:3,elevators_ok:3, cameras:9,cameras_ok:9,   stairwells:4,stairwells_ok:4, trash_cans:11,trash_cans_ok:11, bus_covers:2,bus_covers_ok:2 },
  "ut-dallas-sl":          { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:2,bus_covers_ok:2 },
  "knoll-trail":           { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:8,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "addison-sl":            { elevators:3,elevators_ok:3, cameras:10,cameras_ok:10, stairwells:4,stairwells_ok:4, trash_cans:12,trash_cans_ok:12, bus_covers:2,bus_covers_ok:2 },
  "downtown-carrollton-sl":{ elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:2,bus_covers_ok:2 },
  "cypress-waters":        { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:2,bus_covers_ok:2 },
  "dfw-north-sl":          { elevators:4,elevators_ok:4, cameras:12,cameras_ok:12, stairwells:5,stairwells_ok:5, trash_cans:14,trash_cans_ok:14, bus_covers:3,bus_covers_ok:3 },
  "dfw-terminal-b-sl":     { elevators:6,elevators_ok:6, cameras:20,cameras_ok:20, stairwells:8,stairwells_ok:8, trash_cans:24,trash_cans_ok:24, bus_covers:4,bus_covers_ok:4 },
};

/* ─── Station coordinates [lng, lat] ────────────── */
/* Source: official DART GTFS stops.txt              */
const COORDS: Record<string, [number, number]> = {
  // ── Red Line ─────────────────────────────────────
  "westmoreland":   [-96.871727, 32.719758], "hampton":        [-96.855532, 32.726333],
  "tyler-vernon":   [-96.838390, 32.733140], "zoo":            [-96.812896, 32.740771],
  "8th-corinth-r":  [-96.798474, 32.748082], "cedars-r":       [-96.793253, 32.768574],
  "convention-r":   [-96.802992, 32.772481], "union-r":        [-96.808201, 32.776208],
  "west-end-r":     [-96.805443, 32.780915], "akard":          [-96.800633, 32.781893],
  "st-paul":        [-96.797026, 32.784296], "pearl":          [-96.794310, 32.786618],
  "cityplace-up":   [-96.793176, 32.805424], "smu":            [-96.774939, 32.837828],
  "lovers-lane":    [-96.771758, 32.848601], "park-lane":      [-96.765899, 32.872513],
  "walnut-hill-r":  [-96.764931, 32.882650], "forest-lane":    [-96.761680, 32.908604],
  "lbj-central":    [-96.752235, 32.918254], "spring-valley":  [-96.737424, 32.940852],
  "arapaho-center": [-96.722981, 32.963447], "galatyn-park":   [-96.710953, 32.985226],
  "cityline-bush":  [-96.703144, 33.002166], "12th-street":    [-96.701066, 33.014360],
  "downtown-plano": [-96.700898, 33.020856], "parker-road":    [-96.700736, 33.033454],
  // ── Green Line ───────────────────────────────────
  "buckner":                [-96.685108, 32.718478], "lake-june":              [-96.709432, 32.732335],
  "lawnview":               [-96.720388, 32.765606], "hatcher":                [-96.742471, 32.766323],
  "mlk":                    [-96.764576, 32.773757], "fair-park":              [-96.765928, 32.782058],
  "baylor":                 [-96.782132, 32.786495], "deep-ellum":             [-96.788532, 32.785866],
  "pearl-g":                [-96.794310, 32.786618], "st-paul-g":              [-96.797026, 32.784296],
  "akard-g":                [-96.800633, 32.781893], "west-end-g":             [-96.805443, 32.780915],
  "victory-g":              [-96.812513, 32.789607], "market-center-g":        [-96.823713, 32.804635],
  "sw-medical":             [-96.833204, 32.813602], "inwood-g":               [-96.833361, 32.822243],
  "burbank":                [-96.862176, 32.842971], "bachman-g":              [-96.877344, 32.853778],
  "walnut-hill":            [-96.883811, 32.882120], "royal-lane":             [-96.888110, 32.896055],
  "farmers-branch":         [-96.896238, 32.921962], "downtown-carrollton":    [-96.908277, 32.954443],
  "trinity-mills":          [-96.926476, 32.980876], "north-carrollton-frank": [-96.936753, 32.991611],
  // ── Blue Line ────────────────────────────────────
  "unt-dallas":      [-96.801091, 32.654057], "camp-wisdom":     [-96.788100, 32.666638],
  "ledbetter":       [-96.788812, 32.683394], "va-medical":      [-96.792986, 32.693641],
  "kiest":           [-96.801175, 32.707113], "illinois-tc":     [-96.805162, 32.723302],
  "morrell":         [-96.802604, 32.739860], "eight-blue":      [-96.798474, 32.748082],
  "cedars-blue":     [-96.793253, 32.768574], "convention-blue": [-96.802992, 32.772481],
  "union-blue":      [-96.808201, 32.776208], "west-end-blue":   [-96.805443, 32.780915],
  "akard-blue":      [-96.800633, 32.781893], "st-paul-blue":    [-96.797026, 32.784296],
  "pearl-blue":      [-96.794310, 32.786618], "cityplace-blue":  [-96.793176, 32.805424],
  "mockingbird-blue":[-96.774939, 32.837828], "white-rock":      [-96.732732, 32.855791],
  "lake-highlands":  [-96.730452, 32.879487], "lbj-skillman":    [-96.712139, 32.897924],
  "forest-jupiter":  [-96.679457, 32.908056], "downtown-garland":[-96.635369, 32.916319],
  "downtown-rowlett":[-96.563388, 32.904111],
  // ── Orange Line ──────────────────────────────────
  "parker-road-o":    [-96.700736, 33.033454], "downtown-plano-o": [-96.700898, 33.020856],
  "12th-street-o":    [-96.701066, 33.014360], "cityline-bush-o":  [-96.703144, 33.002166],
  "galatyn-park-o":   [-96.710953, 32.985226], "arapaho-center-o": [-96.722981, 32.963447],
  "spring-valley-o":  [-96.737424, 32.940852], "lbj-central-o":    [-96.752235, 32.918254],
  "forest-ln-o":      [-96.761680, 32.908604], "walnut-hill-o":    [-96.764931, 32.882650],
  "park-lane-o":      [-96.765899, 32.872513], "lovers-lane-o":    [-96.771758, 32.848601],
  "smu-o":            [-96.774939, 32.837828], "cityplace-o":      [-96.793176, 32.805424],
  "pearl-o":          [-96.794310, 32.786618], "st-paul-o":        [-96.797026, 32.784296],
  "akard-o":          [-96.800633, 32.781893], "west-end-o":       [-96.805443, 32.780915],
  "victory-o":        [-96.812513, 32.789607], "market-center-o":  [-96.823713, 32.804635],
  "sw-medical-o":     [-96.833204, 32.813602], "love-o":           [-96.833361, 32.822243],
  "burbank-o":        [-96.862176, 32.842971], "bachman":          [-96.877344, 32.853778],
  "univ-dallas":      [-96.915006, 32.849085], "las-colinas":      [-96.933574, 32.868572],
  "irving":           [-96.938558, 32.876891], "hidden-ridge":     [-96.955159, 32.882109],
  "north-lake":       [-96.967119, 32.875197], "belt-line":        [-96.986505, 32.888023],
  "dfw-a":            [-97.039504, 32.907386], "dfw-b":            [-97.039504, 32.907386],
  // ── Silver Line ──────────────────────────────────
  "shiloh-sl":              [-96.665722, 33.012603], "12th-street-sl":         [-96.698598, 33.015407],
  "cityline-bush-sl":       [-96.703144, 33.002166], "ut-dallas-sl":           [-96.750008, 32.996459],
  "knoll-trail":            [-96.817617, 32.962884], "addison-sl":             [-96.828258, 32.958982],
  "downtown-carrollton-sl": [-96.908107, 32.955670], "cypress-waters":         [-96.983242, 32.950699],
  "dfw-north-sl":           [-97.054193, 32.933913], "dfw-terminal-b-sl":      [-97.041243, 32.906306],
};

/* ─── Station builder ───────────────────────────── */
const mk = (id:string,name:string,score:number,status:Status,issues:string[],last:string,staff:StaffMember[],lid:string,lc:string,ln:string,city:string,closure?:string):Station =>
  ({id,name,score,status,issues,lastInspected:last,staff,lineId:lid,lineColor:lc,lineName:ln,city,closure});

const RED: Station[] = [
  mk("westmoreland",  "Westmoreland",        74,"warning",  ["debris","cleaning_overdue"],                           "18 min ago", [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("hampton",       "Hampton",             70,"warning",  ["debris","cleaning_overdue"],                           "22 min ago", [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("tyler-vernon",  "Tyler/Vernon",        66,"warning",  ["cleaning_overdue","lighting_fault"],                   "25 min ago", [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("zoo",           "Zoo",                 78,"good",     [],                                                       "11 min ago", [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("8th-corinth-r", "8th & Corinth",       71,"warning",  ["cleaning_overdue"],                                    "19 min ago", [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("cedars-r",      "Cedars",              38,"critical", ["safety","cleaning_overdue","graffiti","debris","lighting_fault"], "41 min ago", [],                                                                      "red","#DA291C","Red Line","Dallas"),
  mk("convention-r",  "Convention Center",    0,"closed",   ["safety","lighting_fault"],                              "N/A",        [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("union-r",       "EBJ Union Station",   79,"deploying",["debris","cleaning_overdue"],                            "14 min ago", [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("west-end-r",    "West End",            82,"good",     [],                                                       "9 min ago",  [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("akard",         "Akard",               68,"warning",  ["cleaning_overdue","debris"],                            "15 min ago", [{name:"Rosa M.",  role:"Inspector",  status:"Available",detail:""}],              "red","#DA291C","Red Line","Dallas"),
  mk("st-paul",       "St. Paul",            44,"critical", ["safety","graffiti","cleaning_overdue","lighting_fault"],"38 min ago", [{name:"James W.",role:"Maintenance",status:"On Task",  detail:"Safety sweep"}],  "red","#DA291C","Red Line","Dallas"),
  mk("pearl",         "Pearl/Arts District", 92,"good",     [],                                                       "1 min ago",  [{name:"David R.", role:"Cleaner",    status:"On Task",  detail:"Platform sweep"}], "red","#DA291C","Red Line","Dallas"),
  mk("cityplace-up",  "CityPlace/Uptown",    87,"good",     [],                                                       "8 min ago",  [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("smu",           "SMU/Mockingbird",     55,"deploying",["cleaning_overdue","debris"],                            "27 min ago", [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("lovers-lane",   "Lovers Lane",         83,"good",     [],                                                       "6 min ago",  [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("park-lane",     "Park Lane",           41,"critical", ["safety","cleaning_overdue","graffiti","lighting_fault"],"35 min ago", [{name:"Priya K.",role:"Field Tech", status:"En Route", detail:"ETA 5 min"}],     "red","#DA291C","Red Line","Dallas"),
  mk("walnut-hill-r", "Walnut Hill",         78,"warning",  ["debris"],                                              "17 min ago", [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("forest-lane",   "Forest Lane",         73,"warning",  ["debris"],                                              "20 min ago", [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("lbj-central",   "LBJ/Central",         61,"warning",  ["cleaning_overdue","debris"],                           "24 min ago", [{name:"Aisha B.",role:"Field Tech",status:"En Route",detail:"ETA 4 min"}],        "red","#DA291C","Red Line","Dallas"),
  mk("spring-valley", "Spring Valley",       34,"critical", ["safety","cleaning_overdue","graffiti","lighting_fault"],"44 min ago", [],                                                                                 "red","#DA291C","Red Line","Dallas"),
  mk("arapaho-center","Arapaho Center",      91,"good",     [],                                                       "7 min ago",  [],                                                                                 "red","#DA291C","Red Line","Richardson"),
  mk("galatyn-park",  "Galatyn Park",        85,"good",     [],                                                       "5 min ago",  [],                                                                                 "red","#DA291C","Red Line","Richardson"),
  mk("cityline-bush", "CityLine/Bush",       88,"good",     [],                                                       "4 min ago",  [],                                                                                 "red","#DA291C","Red Line","Richardson"),
  mk("12th-street",   "12th Street",         80,"good",     [],                                                       "10 min ago", [],                                                                                 "red","#DA291C","Red Line","Plano"),
  mk("downtown-plano","Downtown Plano",      84,"good",     [],                                                       "8 min ago",  [],                                                                                 "red","#DA291C","Red Line","Plano"),
  mk("parker-road",   "Parker Road",         88,"good",     [],                                                       "6 min ago",  [],                                                                                 "red","#DA291C","Red Line","Plano"),
];
const GREEN: Station[] = [
  mk("buckner",                "Buckner",                          93,"good",     [],                                        "8 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("lake-june",              "Lake June",                        91,"good",     [],                                        "6 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("lawnview",               "Lawnview",                         94,"good",     [],                                        "4 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("hatcher",                "Hatcher",                          88,"warning",  ["graffiti"],                              "15 min ago", [],"green","#00A84F","Green Line","Dallas"),
  mk("mlk",                    "MLK Jr.",                          92,"good",     [],                                        "7 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("fair-park",              "Fair Park",                        96,"good",     [],                                        "3 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("baylor",                 "Baylor University Med Ctr",        94,"good",     [],                                        "5 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("deep-ellum",             "Deep Ellum",                       90,"good",     [],                                        "11 min ago", [],"green","#00A84F","Green Line","Dallas"),
  mk("pearl-g",                "Pearl/Arts District",              97,"good",     [],                                        "2 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("st-paul-g",              "St. Paul",                         87,"warning",  ["cleaning_overdue"],                      "13 min ago", [],"green","#00A84F","Green Line","Dallas"),
  mk("akard-g",                "Akard",                            95,"good",     [],                                        "4 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("west-end-g",             "West End",                         89,"warning",  ["debris"],                                "10 min ago", [],"green","#00A84F","Green Line","Dallas"),
  mk("victory-g",              "Victory",                          96,"good",     [],                                        "3 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("market-center-g",        "Market Center",                    93,"good",     [],                                        "6 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("sw-medical",             "SW Medical District/Parkland",     72,"critical", ["elevator_down","camera_offline"],         "27 min ago", [{name:"Carlos M.",role:"Field Tech",status:"En Route",detail:"ETA 3 min"}],"green","#00A84F","Green Line","Dallas"),
  mk("inwood-g",               "Inwood/Love Field",                98,"good",     [],                                        "1 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("burbank",                "Burbank",                          91,"good",     [],                                        "8 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("bachman-g",              "Bachman",                          94,"good",     [],                                        "5 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("walnut-hill",            "Walnut Hill/Denton",               78,"warning",  ["elevator_down","lighting_fault"],         "19 min ago", [{name:"Tina L.",role:"Maintenance",status:"On Task",detail:"Elevator inspection"}],"green","#00A84F","Green Line","Dallas"),
  mk("royal-lane",             "Royal Lane",                       93,"good",     [],                                        "6 min ago",  [],"green","#00A84F","Green Line","Dallas"),
  mk("farmers-branch",         "Farmers Branch",                   95,"good",     [],                                        "4 min ago",  [],"green","#00A84F","Green Line","Farmers Branch"),
  mk("downtown-carrollton",    "Downtown Carrollton",              97,"good",     [],                                        "2 min ago",  [],"green","#00A84F","Green Line","Carrollton"),
  mk("trinity-mills",          "Trinity Mills",                    92,"good",     [],                                        "7 min ago",  [],"green","#00A84F","Green Line","Carrollton"),
  mk("north-carrollton-frank", "N. Carrollton/Frankford",          99,"good",     [],                                        "1 min ago",  [],"green","#00A84F","Green Line","Carrollton"),
];
const BLUE: Station[] = [
  mk("unt-dallas",        "UNT Dallas",          80,"good",     [],                                      "4 min ago",  [],"blue","#0076CE","Blue Line","Dallas"),
  mk("camp-wisdom",       "Camp Wisdom",         76,"good",     [],                                      "7 min ago",  [],"blue","#0076CE","Blue Line","Dallas"),
  mk("ledbetter",         "Ledbetter",           72,"warning",  ["smell","litter"],                      "20 min ago", [],"blue","#0076CE","Blue Line","Dallas"),
  mk("va-medical",        "VA Medical Center",   84,"good",     [],                                      "2 min ago",  [],"blue","#0076CE","Blue Line","Dallas"),
  mk("kiest",             "Kiest",               69,"warning",  ["litter"],                              "18 min ago", [],"blue","#0076CE","Blue Line","Dallas"),
  mk("illinois-tc",       "Illinois TC",         74,"warning",  ["smell"],                               "15 min ago", [],"blue","#0076CE","Blue Line","Dallas"),
  mk("morrell",           "Morrell",             70,"warning",  ["litter","lighting"],                   "22 min ago", [],"blue","#0076CE","Blue Line","Dallas"),
  mk("eight-blue",        "8th & Corinth",       71,"warning",  ["smell"],                               "14 min ago", [],"blue","#0076CE","Blue Line","Dallas"),
  mk("cedars-blue",       "Cedars",              42,"critical", ["safety","smell","vandalism","litter","lighting"], "31 min ago", [],"blue","#0076CE","Blue Line","Dallas"),
  mk("convention-blue",   "Convention Center",    0,"closed",   ["safety","lighting"],                   "—",          [],"blue","#0076CE","Blue Line","Dallas","Closed Jan 5 2026 — KBHCC redevelopment. Est. reopening 2029. Use EBJ Union Station or Akard."),
  mk("union-blue",        "EBJ Union Station",   82,"deploying",["litter"],                              "3 min ago",  [],"blue","#0076CE","Blue Line","Dallas"),
  mk("west-end-blue",     "West End",            83,"good",     [],                                      "6 min ago",  [],"blue","#0076CE","Blue Line","Dallas"),
  mk("akard-blue",        "Akard",               70,"warning",  ["litter","smell"],                      "12 min ago", [],"blue","#0076CE","Blue Line","Dallas"),
  mk("st-paul-blue",      "St. Paul",            48,"critical", ["safety","smell","lighting"],            "28 min ago", [],"blue","#0076CE","Blue Line","Dallas"),
  mk("pearl-blue",        "Pearl/Arts District", 92,"good",     [],                                      "1 min ago",  [],"blue","#0076CE","Blue Line","Dallas"),
  mk("cityplace-blue",    "CityPlace/Uptown",    87,"good",     [],                                      "5 min ago",  [],"blue","#0076CE","Blue Line","Dallas"),
  mk("mockingbird-blue",  "SMU/Mockingbird",     77,"good",     [],                                      "4 min ago",  [],"blue","#0076CE","Blue Line","Dallas"),
  mk("white-rock",        "White Rock",          88,"good",     [],                                      "6 min ago",  [],"blue","#0076CE","Blue Line","Dallas"),
  mk("lake-highlands",    "Lake Highlands",      91,"good",     [],                                      "9 min ago",  [],"blue","#0076CE","Blue Line","Dallas"),
  mk("lbj-skillman",      "LBJ/Skillman",        66,"warning",  ["litter"],                              "16 min ago", [],"blue","#0076CE","Blue Line","Dallas"),
  mk("forest-jupiter",    "Forest/Jupiter",      42,"critical", ["safety","vandalism","smell","lighting"],"30 min ago", [],"blue","#0076CE","Blue Line","Garland"),
  mk("downtown-garland",  "Downtown Garland",    75,"warning",  ["litter"],                              "11 min ago", [],"blue","#0076CE","Blue Line","Garland"),
  mk("downtown-rowlett",  "Downtown Rowlett",    85,"good",     [],                                      "3 min ago",  [],"blue","#0076CE","Blue Line","Rowlett"),
];
const ORANGE: Station[] = [
  mk("parker-road-o",    "Parker Road",                      99,"good",    [],                             "1 min ago",  [],"orange","#F77F00","Orange Line","Plano"),
  mk("downtown-plano-o", "Downtown Plano",                   93,"good",    [],                             "6 min ago",  [],"orange","#F77F00","Orange Line","Plano"),
  mk("12th-street-o",    "12th Street",                      90,"good",    [],                             "9 min ago",  [],"orange","#F77F00","Orange Line","Plano"),
  mk("cityline-bush-o",  "Cityline/Bush",                    97,"good",    [],                             "2 min ago",  [],"orange","#F77F00","Orange Line","Richardson"),
  mk("galatyn-park-o",   "Galatyn Park",                     96,"good",    [],                             "3 min ago",  [],"orange","#F77F00","Orange Line","Richardson"),
  mk("arapaho-center-o", "Arapaho Center",                   92,"good",    [],                             "8 min ago",  [],"orange","#F77F00","Orange Line","Richardson"),
  mk("spring-valley-o",  "Spring Valley",                    95,"good",    [],                             "4 min ago",  [],"orange","#F77F00","Orange Line","Dallas"),
  mk("lbj-central-o",    "LBJ/Central",                      73,"critical",["elevator_down","lighting_fault","camera_offline"],"22 min ago",[{name:"Aisha B.",role:"Field Tech",status:"En Route",detail:"ETA 4 min"}],"orange","#F77F00","Orange Line","Dallas"),
  mk("forest-ln-o",      "Forest Lane",                      94,"good",    [],                             "6 min ago",  [],"orange","#F77F00","Orange Line","Dallas"),
  mk("walnut-hill-o",    "Walnut Hill",                      89,"warning", ["lighting_fault"],             "17 min ago", [],"orange","#F77F00","Orange Line","Dallas"),
  mk("park-lane-o",      "Park Lane",                        91,"good",    [],                             "14 min ago", [],"orange","#F77F00","Orange Line","Dallas"),
  mk("lovers-lane-o",    "Lovers Lane",                      94,"good",    [],                             "5 min ago",  [],"orange","#F77F00","Orange Line","Dallas"),
  mk("smu-o",            "SMU/Mockingbird",                  93,"good",    [],                             "9 min ago",  [],"orange","#F77F00","Orange Line","Dallas"),
  mk("cityplace-o",      "Cityplace/Uptown",                 71,"critical",["restroom_closed","crew_delayed"],"31 min ago",[{name:"Priya K.",role:"Field Tech",status:"En Route",detail:"ETA 2 min"}],"orange","#F77F00","Orange Line","Dallas"),
  mk("pearl-o",          "Pearl/Arts District",              98,"good",    [],                             "1 min ago",  [],"orange","#F77F00","Orange Line","Dallas"),
  mk("st-paul-o",        "St. Paul",                         87,"warning", ["cleaning_overdue"],           "12 min ago", [],"orange","#F77F00","Orange Line","Dallas"),
  mk("akard-o",          "Akard",                            96,"good",    [],                             "7 min ago",  [],"orange","#F77F00","Orange Line","Dallas"),
  mk("west-end-o",       "West End",                         93,"good",    [],                             "6 min ago",  [],"orange","#F77F00","Orange Line","Dallas"),
  mk("victory-o",        "Victory",                          96,"good",    [],                             "3 min ago",  [],"orange","#F77F00","Orange Line","Dallas"),
  mk("market-center-o",  "Market Center",                    93,"good",    [],                             "6 min ago",  [],"orange","#F77F00","Orange Line","Dallas"),
  mk("sw-medical-o",     "SW Medical District/Parkland",     72,"critical",["elevator_down","camera_offline"],"27 min ago",[{name:"Carlos M.",role:"Field Tech",status:"En Route",detail:"ETA 3 min"}],"orange","#F77F00","Orange Line","Dallas"),
  mk("love-o",           "Inwood/Love Field",                98,"good",    [],                             "1 min ago",  [],"orange","#F77F00","Orange Line","Dallas"),
  mk("burbank-o",        "Burbank",                          91,"good",    [],                             "8 min ago",  [],"orange","#F77F00","Orange Line","Dallas"),
  mk("bachman",          "Bachman",                          94,"good",    [],                             "4 min ago",  [],"orange","#F77F00","Orange Line","Dallas"),
  mk("univ-dallas",      "University of Dallas",             90,"good",    [],                             "10 min ago", [],"orange","#F77F00","Orange Line","Irving"),
  mk("las-colinas",      "Las Colinas Urban Ctr",            72,"critical",["restroom_closed","graffiti"], "28 min ago", [],"orange","#F77F00","Orange Line","Irving"),
  mk("irving",           "Irving Convention Ctr",            91,"good",    [],                             "7 min ago",  [],"orange","#F77F00","Orange Line","Irving"),
  mk("hidden-ridge",     "Hidden Ridge",                     95,"good",    [],                             "5 min ago",  [],"orange","#F77F00","Orange Line","Irving"),
  mk("north-lake",       "Dallas College Northlake Campus",  88,"good",    [],                             "11 min ago", [],"orange","#F77F00","Orange Line","Irving"),
  mk("belt-line",        "Belt Line",                        95,"good",    [],                             "6 min ago",  [],"orange","#F77F00","Orange Line","Irving"),
  mk("dfw-a",            "DFW Airport T-A",                  97,"good",    [],                             "3 min ago",  [],"orange","#F77F00","Orange Line","DFW Airport"),
  mk("dfw-b",            "DFW Airport T-B",                  96,"good",    [],                             "5 min ago",  [],"orange","#F77F00","Orange Line","DFW Airport"),
];
const SILVER: Station[] = [
  mk("shiloh-sl",              "Shiloh Rd",                96,"good",[],"4 min ago", [],"silver","#8C9BAB","Silver Line","Plano"),
  mk("12th-street-sl",         "12th Street",              93,"good",[],"8 min ago", [],"silver","#8C9BAB","Silver Line","Plano"),
  mk("cityline-bush-sl",       "Cityline/Bush",            97,"good",[],"2 min ago", [],"silver","#8C9BAB","Silver Line","Richardson"),
  mk("ut-dallas-sl",           "UT Dallas",                91,"good",[],"12 min ago",[],"silver","#8C9BAB","Silver Line","Richardson"),
  mk("knoll-trail",            "Knoll Trail",              95,"good",[],"6 min ago", [],"silver","#8C9BAB","Silver Line","Dallas"),
  mk("addison-sl",             "Addison",                  94,"good",[],"5 min ago", [],"silver","#8C9BAB","Silver Line","Addison"),
  mk("downtown-carrollton-sl", "Downtown Carrollton",      92,"good",[],"9 min ago", [],"silver","#8C9BAB","Silver Line","Carrollton"),
  mk("cypress-waters",         "Cypress Waters",           98,"good",[],"1 min ago", [],"silver","#8C9BAB","Silver Line","Coppell"),
  mk("dfw-north-sl",           "DFW North",                96,"good",[],"3 min ago", [],"silver","#8C9BAB","Silver Line","DFW Airport"),
  mk("dfw-terminal-b-sl",      "DFW Terminal B",           99,"good",[],"1 min ago", [],"silver","#8C9BAB","Silver Line","DFW Airport"),
];

const LINES: Record<string, Line> = {
  red:    { name:"Red Line",    sub:"Westmoreland — Parker Rd", color:"#DA291C", stations:RED    },
  green:  { name:"Green Line",  sub:"Buckner — N. Carrollton/Frankford", color:"#00A84F", stations:GREEN  },
  blue:   { name:"Blue Line",   sub:"UNT Dallas → Downtown Rowlett • 23 Stations", color:"#0076CE", stations:BLUE   },
  orange: { name:"Orange Line", sub:"Parker Road — DFW Airport", color:"#F77F00", stations:ORANGE },
  silver: { name:"Silver Line", sub:"Shiloh Rd — DFW Terminal B", color:"#8C9BAB", stations:SILVER },
};
const ALL_STATIONS = Object.values(LINES).flatMap(l => l.stations);

/* ─── Asset metadata ─────────────────────────────── */
const ASSET_META: Record<AssetKey, { label: string; desc: string; icon: string }> = {
  elevators:  { label:"Elevators",  desc:"Uptime · coverage · maintenance",        icon:"ELV" },
  cameras:    { label:"Cameras",    desc:"Coverage · blind spots · recording",     icon:"CAM" },
  stairwells: { label:"Stairwells", desc:"Safety · lighting · cleanliness",        icon:"STR" },
  trash_cans: { label:"Trash Cans", desc:"Capacity · overflow · sanitation",       icon:"TRS" },
  bus_covers: { label:"Bus Covers", desc:"Shelter integrity · lighting · signage", icon:"BUS" },
};

/* ─── AI Intelligence data ───────────────────────── */
interface AIPrediction {
  id: string; station: string; lineColor: string; lineName: string;
  type: string; horizon: string; confidence: number;
  category: "cleaning" | "maintenance" | "staffing" | "security";
  impact: "critical" | "high" | "medium";
}
const AI_PREDICTIONS: AIPrediction[] = [
  { id:"p1",  station:"Cityplace/Uptown", lineColor:"#DA291C", lineName:"Red",    type:"Restroom saturation",      horizon:"22 min",  confidence:97, category:"cleaning",    impact:"critical" },
  { id:"p2",  station:"LBJ/Central",      lineColor:"#DA291C", lineName:"Red",    type:"Elevator failure risk",    horizon:"1h 08m",  confidence:89, category:"maintenance", impact:"critical" },
  { id:"p3",  station:"SW Medical",       lineColor:"#00A84F", lineName:"Green",  type:"Platform cleaning surge",  horizon:"35 min",  confidence:92, category:"cleaning",    impact:"high"     },
  { id:"p4",  station:"Las Colinas",      lineColor:"#F77F00", lineName:"Orange", type:"Security coverage gap",    horizon:"47 min",  confidence:84, category:"security",    impact:"high"     },
  { id:"p5",  station:"Walnut Hill",      lineColor:"#00A84F", lineName:"Green",  type:"Elevator degradation",     horizon:"2h 15m",  confidence:79, category:"maintenance", impact:"high"     },
  { id:"p6",  station:"Victory",          lineColor:"#DA291C", lineName:"Red",    type:"Crew staffing gap",        horizon:"1h 30m",  confidence:86, category:"staffing",    impact:"high"     },
  { id:"p7",  station:"Kiest",            lineColor:"#0076CE", lineName:"Blue",   type:"Escalator degradation",    horizon:"3h 10m",  confidence:71, category:"maintenance", impact:"medium"   },
  { id:"p8",  station:"8th & Corinth",    lineColor:"#0076CE", lineName:"Blue",   type:"Debris accumulation",      horizon:"55 min",  confidence:88, category:"cleaning",    impact:"medium"   },
  { id:"p9",  station:"Hatcher",          lineColor:"#00A84F", lineName:"Green",  type:"Graffiti recurrence",      horizon:"2h 45m",  confidence:73, category:"security",    impact:"medium"   },
  { id:"p10", station:"West End",         lineColor:"#00A84F", lineName:"Green",  type:"Trash overflow",           horizon:"1h 05m",  confidence:91, category:"cleaning",    impact:"high"     },
];

interface AnomalyAlert {
  id: string; station: string; lineColor: string;
  type: string; severity: "critical" | "high" | "medium";
  confidence: number; detectedAt: string; description: string;
}
const ANOMALIES: AnomalyAlert[] = [
  { id:"a1", station:"LBJ/Central",      lineColor:"#DA291C", type:"Sensor dropout cluster",      severity:"critical", confidence:98, detectedAt:"2 min ago",  description:"3 cameras + elevator sensor offline simultaneously — possible power fault" },
  { id:"a2", station:"Cityplace/Uptown", lineColor:"#DA291C", type:"Inspection delay anomaly",    severity:"critical", confidence:95, detectedAt:"8 min ago",  description:"Station uninspected 31 min — 72% above network average of 18 min" },
  { id:"a3", station:"Las Colinas",      lineColor:"#F77F00", type:"Repeat incident pattern",     severity:"high",     confidence:88, detectedAt:"14 min ago", description:"2nd restroom closure this week — cleaning rotation frequency insufficient" },
  { id:"a4", station:"SW Medical",       lineColor:"#00A84F", type:"Asset failure cascade",       severity:"high",     confidence:83, detectedAt:"21 min ago", description:"Elevator + 2 cameras offline — correlated degradation signature detected" },
  { id:"a5", station:"Walnut Hill",      lineColor:"#00A84F", type:"Lighting fault trend",        severity:"high",     confidence:79, detectedAt:"33 min ago", description:"Lighting faults up 48% over baseline — aging infrastructure pattern" },
  { id:"a6", station:"Kiest",            lineColor:"#0076CE", type:"Ridership-cleaning mismatch", severity:"medium",   confidence:74, detectedAt:"41 min ago", description:"Cleaning frequency below predicted demand for current ridership volume" },
];

interface AIDecision {
  id: string; station: string; lineColor: string;
  action: string; assignedTo: string; role: string;
  priority: "critical" | "high" | "standard";
  status: "auto-dispatched" | "pending" | "acknowledged";
  generatedAt: string; reason: string;
}
const AI_DECISIONS: AIDecision[] = [
  { id:"d1", station:"Cityplace/Uptown", lineColor:"#DA291C", action:"Deploy field tech — restroom saturation predicted",         assignedTo:"Priya K.",   role:"Field Tech",  priority:"critical", status:"auto-dispatched", generatedAt:"4 min ago",  reason:"97% confidence · OOS risk in 22 min" },
  { id:"d2", station:"LBJ/Central",      lineColor:"#DA291C", action:"Dispatch maintenance — elevator failure sequence detected",  assignedTo:"Marcus T.",  role:"Supervisor",  priority:"critical", status:"auto-dispatched", generatedAt:"6 min ago",  reason:"Sensor dropout cluster · power fault signature" },
  { id:"d3", station:"SW Medical",       lineColor:"#00A84F", action:"Accelerate cleaning cycle — platform surge in 35 min",      assignedTo:"Carlos M.",  role:"Field Tech",  priority:"high",     status:"acknowledged",    generatedAt:"11 min ago", reason:"92% confidence · event discharge pattern" },
  { id:"d4", station:"Las Colinas",      lineColor:"#F77F00", action:"Increase security coverage — camera blind spot identified",  assignedTo:"Unassigned", role:"—",           priority:"high",     status:"pending",         generatedAt:"15 min ago", reason:"Historical incident correlation · 84% confidence" },
  { id:"d5", station:"West End",         lineColor:"#00A84F", action:"Deploy sanitation — trash overflow predicted in 65 min",    assignedTo:"Tina L.",    role:"Maintenance", priority:"high",     status:"pending",         generatedAt:"22 min ago", reason:"91% confidence · fill-rate model v2.1" },
  { id:"d6", station:"Walnut Hill",      lineColor:"#00A84F", action:"Schedule elevator inspection — degradation pattern rising",  assignedTo:"Tina L.",    role:"Maintenance", priority:"high",     status:"acknowledged",    generatedAt:"28 min ago", reason:"Lighting + elevator correlation · 79% confidence" },
  { id:"d7", station:"Kiest",            lineColor:"#0076CE", action:"Add cleaning pass — ridership-demand mismatch flagged",     assignedTo:"Unassigned", role:"—",           priority:"standard", status:"pending",         generatedAt:"35 min ago", reason:"Demand model override · surge threshold crossed" },
];

/* ─── Helpers ────────────────────────────────────── */
const scoreColor = (n: number) => n >= 85 ? "#2E7D32" : n >= 70 ? "#F57C00" : "#D32F2F";
const scoreFill  = (n: number) => n >= 85 ? "#4CAF50" : n >= 70 ? "#FFA726" : "#EF5350";

const statusStyle = (st: Status) => ({
  critical:  { bg:"#FFEBEE", text:"#C62828", border:"#EF9A9A", label:"CRITICAL"    },
  warning:   { bg:"#FFF3E0", text:"#E65100", border:"#FFCC80", label:"ATTENTION"   },
  deploying: { bg:"#E3F2FD", text:"#1565C0", border:"#90CAF9", label:"DEPLOYED"    },
  good:      { bg:"#E8F5E9", text:"#2E7D32", border:"#A5D6A7", label:"OPERATIONAL" },
  closed:    { bg:"#F5F5F5", text:"#616161", border:"#BDBDBD", label:"CLOSED"      },
}[st]);

function getLineAssets(line: Line) {
  const keys = ["elevators","cameras","stairwells","trash_cans","bus_covers"] as const;
  let total = 0, ok = 0;
  line.stations.forEach(s => {
    const a = ASSETS[s.id]; if (!a) return;
    keys.forEach(k => { total += a[k]; ok += a[`${k}_ok` as keyof AssetEntry] as number; });
  });
  return { total, ok, uptime: total ? Math.round((ok / total) * 100) : 100 };
}

/* ─── Inspection data ───────────────────────────── */
const INSP_SECTIONS: InspSection[] = [
  {
    id:"elevators", title:"Elevators",
    items:[
      { id:"elev-1", name:"Elevator operational", desc:"Doors open/close, car moves between floors", priority:"critical" },
      { id:"elev-2", name:"Interior lighting functional", desc:"All interior lights working properly", priority:"high" },
      { id:"elev-3", name:"Emergency phone/intercom working", desc:"Emergency call button connects to dispatch", priority:"critical" },
      { id:"elev-4", name:"Certificate posted & current", desc:"Inspection certificate visible and not expired", priority:"high" },
      { id:"elev-5", name:"Interior cleanliness", desc:"No debris, graffiti, or biohazard material present", priority:"standard" },
      { id:"elev-6", name:"Floor indicators working", desc:"Digital/mechanical floor display functioning", priority:"standard" },
      { id:"elev-7", name:"Door sensors functional", desc:"Safety sensors prevent door close on obstruction", priority:"critical" },
    ],
  },
  {
    id:"cameras", title:"Security Cameras",
    items:[
      { id:"cam-1", name:"All cameras online", desc:"No offline or degraded feeds in station area", priority:"critical" },
      { id:"cam-2", name:"Camera lenses clean", desc:"No obstructions, fog, or graffiti on lens", priority:"high" },
      { id:"cam-3", name:"Platform coverage complete", desc:"Full platform visible, no blind spots", priority:"critical" },
      { id:"cam-4", name:"Stairwell cameras operational", desc:"Stairwell entry/exit points covered", priority:"high" },
      { id:"cam-5", name:"Entrance/exit cameras working", desc:"All entry points monitored", priority:"critical" },
      { id:"cam-6", name:"Mounting hardware secure", desc:"No loose, tilted, or misaligned camera mounts", priority:"standard" },
      { id:"cam-7", name:"Recording indicator active", desc:"Camera status LEDs or feed timestamps current", priority:"high" },
    ],
  },
  {
    id:"stairwells", title:"Stairwells",
    items:[
      { id:"stair-1", name:"Handrails secure", desc:"Both rails firmly mounted, no wobble", priority:"critical" },
      { id:"stair-2", name:"Lighting adequate", desc:"All stairwell lights functional, no dark areas", priority:"high" },
      { id:"stair-3", name:"Steps free of debris", desc:"No litter, standing water, or slip hazards on steps", priority:"high" },
      { id:"stair-4", name:"Graffiti absent", desc:"No graffiti or vandalism on walls or handrails", priority:"standard" },
      { id:"stair-5", name:"Non-slip surfaces intact", desc:"Anti-slip tape or treads intact and not peeling", priority:"high" },
      { id:"stair-6", name:"Emergency lighting functional", desc:"Backup lighting activates on power loss", priority:"critical" },
      { id:"stair-7", name:"Drainage clear", desc:"Floor drains not clogged; no pooling water", priority:"standard" },
    ],
  },
  {
    id:"trash_cans", title:"Trash Cans & Waste Stations",
    items:[
      { id:"trash-1", name:"All receptacles in place", desc:"No missing or overturned waste bins", priority:"standard" },
      { id:"trash-2", name:"Receptacles not overflowing", desc:"Less than 75% full; no overflow onto platform", priority:"high" },
      { id:"trash-3", name:"Recycling bins labeled", desc:"Recycling bins clearly labeled and separate from trash", priority:"standard" },
      { id:"trash-4", name:"No biohazard material", desc:"No syringes, blood, or medical waste present", priority:"critical" },
      { id:"trash-5", name:"Lids/covers intact", desc:"Bin lids functional and properly covering contents", priority:"standard" },
      { id:"trash-6", name:"Surrounding area clean", desc:"No loose debris around or under waste bins", priority:"standard" },
    ],
  },
  {
    id:"bus_covers", title:"Bus Covers & Shelters",
    items:[
      { id:"bus-1", name:"Roof/canopy structurally sound", desc:"No sagging, cracks, or loose panels", priority:"critical" },
      { id:"bus-2", name:"Seating clean and intact", desc:"No broken, vandalized, or missing bench sections", priority:"standard" },
      { id:"bus-3", name:"Lighting operational", desc:"All shelter lights working", priority:"high" },
      { id:"bus-4", name:"Schedule/route info posted", desc:"Current schedule and route maps displayed", priority:"standard" },
      { id:"bus-5", name:"No graffiti or vandalism", desc:"Panels, glass, and seating free of graffiti", priority:"standard" },
      { id:"bus-6", name:"Drainage functional", desc:"No water pooling under or around shelter", priority:"standard" },
      { id:"bus-7", name:"Glass panels intact", desc:"No cracked, broken, or missing glass panels", priority:"high" },
      { id:"bus-8", name:"ADA accessibility clear", desc:"Curb cut and ramp to shelter unobstructed", priority:"critical" },
    ],
  },
  {
    id:"general", title:"General Station Condition",
    items:[
      { id:"gen-1",  name:"Platform clear of obstructions", desc:"Full-length platform accessible, no blocked sections", priority:"critical" },
      { id:"gen-2",  name:"Signage visible and current", desc:"All directional and safety signs legible and current", priority:"high" },
      { id:"gen-3",  name:"PA system functional", desc:"Announcements audible across platform length", priority:"high" },
      { id:"gen-4",  name:"Ticket machines operational", desc:"All vending/validator machines online and accepting payment", priority:"high" },
      { id:"gen-5",  name:"Restrooms clean and stocked", desc:"Soap, paper, flushing all functional; no biohazard", priority:"high" },
      { id:"gen-6",  name:"No water intrusion", desc:"No leaks, water stains on ceiling or walls", priority:"high" },
      { id:"gen-7",  name:"Platform edge markings visible", desc:"Yellow tactile strip and edge line clear and unpeeled", priority:"critical" },
      { id:"gen-8",  name:"Emergency exits unlocked", desc:"All emergency exit doors operable and unobstructed", priority:"critical" },
      { id:"gen-9",  name:"Fire extinguishers present", desc:"Extinguishers in place, pressure in green zone, tagged current", priority:"critical" },
      { id:"gen-10", name:"Overall cleanliness acceptable", desc:"Platform, walls, and ceilings meet cleanliness standard", priority:"standard" },
    ],
  },
];

/* ─── Spark chart ────────────────────────────────── */
function SparkLine({ stations, color }: { stations: Station[]; color: string }) {
  const W=340, H=44, P=6;
  const scores = stations.map(s => s.score);
  const min = Math.min(...scores), max = Math.max(...scores), rng = max - min || 1;
  const pts = stations.map((s, i) => ({
    x: P + (i / Math.max(stations.length - 1, 1)) * (W - P * 2),
    y: H - P - ((s.score - min) / rng) * (H - P * 2),
    score: s.score,
  }));
  const linePath = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const areaPath = linePath + ` L${pts[pts.length-1].x.toFixed(1)},${H} L${pts[0].x.toFixed(1)},${H} Z`;
  const gid = `sgw${color.replace(/[^a-z0-9]/gi, "")}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width:"100%", height:44 }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.18}/>
          <stop offset="100%" stopColor={color} stopOpacity={0.02}/>
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gid})`}/>
      <path d={linePath} fill="none" stroke={color} strokeWidth={1.5} strokeLinejoin="round" strokeLinecap="round"/>
      {pts.map((p, i) => (
        <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={2.8}
          fill={scoreFill(p.score)} stroke="#FFFFFF" strokeWidth={1.2}/>
      ))}
    </svg>
  );
}

/* ─── Command Center ─────────────────────────────── */
function CommandCenter({ onDrill }: { onDrill: (id: string) => void }) {
  let crit = 0, warn = 0;
  ALL_STATIONS.forEach(s => { if (s.status === "critical") crit++; else if (s.status === "warning") warn++; });
  const avg = Math.round(ALL_STATIONS.reduce((a, s) => a + s.score, 0) / ALL_STATIONS.length);
  let nt = 0, no = 0;
  ALL_STATIONS.forEach(s => {
    const a = ASSETS[s.id]; if (!a) return;
    (["elevators","cameras","stairwells","trash_cans","bus_covers"] as const).forEach(k => {
      nt += a[k]; no += a[`${k}_ok` as keyof AssetEntry] as number;
    });
  });
  const uptime = nt ? Math.round((no / nt) * 100) : 100;
  const worst = [...ALL_STATIONS].sort((a, b) => a.score - b.score).slice(0, 10);

  return (
    <div style={{ padding:"24px 28px", overflowY:"auto", flex:1, background:T.bg }}>

      {/* Page header */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginBottom:3 }}>
          KAI Facilities Management · DART Rail Network
        </div>
        <div style={{ fontFamily:"'Share Tech Mono'", fontSize:22, color:T.text, lineHeight:1.15 }}>
          Station Readiness Command Center
        </div>
      </div>

      {/* KPI row */}
      <div className="kd-grid-5col" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:24 }}>
        {[
          { label:"Critical Stations", val:crit,       sub:"Require immediate action", color:"#D32F2F" },
          { label:"Needs Attention",   val:warn,        sub:"Scheduled service needed", color:"#F57C00" },
          { label:"Avg Readiness",     val:avg,         sub:"Network average / 100",    color:scoreColor(avg) },
          { label:"Asset Uptime",      val:`${uptime}%`,sub:`${no} of ${nt} assets`,   color:scoreColor(uptime) },
          { label:"AI Accuracy",       val:"94.2%",     sub:"Model v2.1 · Live",        color:T.gold },
        ].map(k => (
          <div key={k.label} className="dash-cell" style={{ background:T.panel, padding:"14px 18px", cursor:"default" }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:T.textMuted, marginBottom:5 }}>{k.label}</div>
            <div className="dash-cell-value summary-num" style={{ fontFamily:"'Share Tech Mono'", fontSize:28, color:k.color, lineHeight:1 }}>{k.val}</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:4, letterSpacing:"0.04em" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Line cards */}
      <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>
        LINES — READINESS OVERVIEW · Click to drill down
      </div>
      <div className="kd-grid-lines" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:24 }}>
        {Object.entries(LINES).map(([lid, line]) => {
          const scores = line.stations.map(s => s.score);
          const lavg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
          const { total, ok, uptime:lu } = getLineAssets(line);
          let lc = 0, lw = 0;
          line.stations.forEach(s => { if (s.status === "critical") lc++; else if (s.status === "warning") lw++; });
          const issueCounts: Record<string, number> = {};
          line.stations.forEach(s => s.issues.forEach(i => { issueCounts[i] = (issueCounts[i] || 0) + 1; }));
          const topIssues = Object.entries(issueCounts).sort((a, b) => b[1] - a[1]).slice(0, 3);
          return (
            <div key={lid} onClick={() => onDrill(lid)}
                 style={{ background:T.panel, padding:"18px 20px", cursor:"pointer", borderLeft:`3px solid ${line.color}`, transition:"background 0.15s", boxShadow:T.shadow }}
                 onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                 onMouseLeave={e => (e.currentTarget.style.background = T.panel)}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed'", fontSize:15, fontWeight:700, letterSpacing:"0.05em", color:line.color }}>{line.name}</div>
                  <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, letterSpacing:"0.06em", marginTop:1 }}>{line.sub}</div>
                </div>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontFamily:"'Share Tech Mono'", fontSize:22, color:scoreColor(lavg), lineHeight:1 }}>{lavg}</div>
                  <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.12em", marginTop:2 }}>AVG SCORE</div>
                </div>
              </div>
              <SparkLine stations={line.stations} color={line.color}/>
              <div style={{ display:"flex", gap:14, marginTop:8 }}>
                {[
                  { v:`${lu}%`,      l:"UPTIME", c:scoreColor(lu)  },
                  { v:`${ok}/${total}`,l:"ASSETS",c:T.textSub      },
                  { v:`${Math.min(...scores)}–${Math.max(...scores)}`,l:"RANGE",c:T.textSub },
                ].map(d => (
                  <div key={d.l}>
                    <div style={{ fontFamily:"'Share Tech Mono'", fontSize:12, color:d.c }}>{d.v}</div>
                    <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginTop:1 }}>{d.l}</div>
                  </div>
                ))}
              </div>
              <div style={{ display:"flex", gap:4, marginTop:8, flexWrap:"wrap" }}>
                {lc > 0 && <span style={{ fontFamily:"'Share Tech Mono'", fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:2, background:"#FFEBEE", color:"#C62828" }}>{lc} CRITICAL</span>}
                {lw > 0 && <span style={{ fontFamily:"'Share Tech Mono'", fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:2, background:"#FFF3E0", color:"#E65100" }}>{lw} ATTENTION</span>}
                {lc === 0 && lw === 0 && <span style={{ fontFamily:"'Share Tech Mono'", fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:2, background:"#E8F5E9", color:"#2E7D32" }}>ALL CLEAR</span>}
              </div>
              {topIssues.length > 0 && (
                <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap" }}>
                  {topIssues.map(([key, count]) => {
                    const issue = ISSUES[key];
                    return issue ? (
                      <span key={key} style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.08em", padding:"2px 7px", borderRadius:2, background:T.bg, color:T.textMuted, border:`1px solid ${T.border}` }}>
                        {issue.label} · {count}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 10 worst */}
      <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>
        10 LOWEST READINESS — NETWORK-WIDE
      </div>
      <div className="kd-table-wrap"><table className="tufte-table" style={{ width:"100%", borderCollapse:"collapse", background:T.panel, border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
        <thead>
          <tr style={{ background:"#F9FAFB" }}>
            {["Station","Line","Score","Readiness","Issues","Status"].map((h, i) => (
              <th key={h} style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:T.textMuted, padding:"8px 14px", textAlign: i >= 2 && i <= 3 ? "right" : "left", borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {worst.map(st => {
            const style = statusStyle(st.status);
            return (
              <tr key={st.id} style={{ borderBottom:`1px solid #F4F5F7`, cursor:"default", transition:"background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding:"9px 14px", fontFamily:"'Barlow Condensed'", fontSize:13, fontWeight:600, letterSpacing:"0.02em", color:T.text }}>{st.name}</td>
                <td style={{ padding:"9px 14px" }}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background:st.lineColor, display:"inline-block" }}/>
                    <span style={{ fontFamily:"'Barlow Condensed'", fontSize:11, color:T.textMuted, letterSpacing:"0.04em" }}>{st.lineName}</span>
                  </span>
                </td>
                <td style={{ padding:"9px 14px", textAlign:"right", fontFamily:"'Share Tech Mono'", fontSize:12, fontWeight:700, color:scoreColor(st.score) }}>{st.score}</td>
                <td style={{ padding:"9px 14px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                    <div style={{ flex:1, height:4, background:T.border, borderRadius:1 }}>
                      <div className={`score-fill${st.score < 70 ? " critical-fill" : ""}`} style={{ height:4, width:`${st.score}%`, background:scoreFill(st.score), borderRadius:1 }}/>
                    </div>
                    <span style={{ fontFamily:"'Share Tech Mono'", fontSize:10, color:scoreColor(st.score), width:26, textAlign:"right" }}>{st.score}</span>
                  </div>
                </td>
                <td style={{ padding:"9px 14px", fontFamily:"'Barlow Condensed'", fontSize:11, color:T.textMuted, letterSpacing:"0.03em" }}>
                  {st.issues.length > 0 ? st.issues.map(k => ISSUES[k]?.label ?? k).join(" · ") : "—"}
                </td>
                <td style={{ padding:"9px 14px", textAlign:"right" }}>
                  <span style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.1em", padding:"2px 8px", borderRadius:2, background:style.bg, color:style.text, border:`1px solid ${style.border}` }}>
                    {style.label}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table></div>
    </div>
  );
}

/* ─── Station map (Mapbox GL interactive) ───────── */
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";

function StationMap({ station, lineColor }: { station: Station; lineColor: string }) {
  const coords = COORDS[station.id];
  if (!coords || !MAPBOX_TOKEN) return null;
  const [lng, lat] = coords;
  return (
    <div className="fade-in" style={{ padding:"14px 22px", borderBottom:`1px solid ${T.border}` }}>
      <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.25em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>Location</div>
      <div style={{ borderRadius:4, overflow:"hidden", border:`1px solid ${T.border}` }}>
        <StationMapGL
          lat={lat} lng={lng}
          stationName={station.name}
          lineColor={lineColor}
          token={MAPBOX_TOKEN}
        />
      </div>
      <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, color:T.textMuted, marginTop:6, letterSpacing:"0.05em" }}>
        {lat.toFixed(4)}° N · {Math.abs(lng).toFixed(4)}° W
      </div>
    </div>
  );
}

/* ─── Station view ───────────────────────────────── */
function StationView({ lineId, selectedId, onSelect, onReport }: { lineId:string; selectedId:string|null; onSelect:(id:string)=>void; onReport:(name:string)=>void; }) {
  const line = LINES[lineId];
  const selected = line.stations.find(s => s.id === selectedId) ?? line.stations[0];
  const style = statusStyle(selected.status);
  const a = ASSETS[selected.id];
  const [deployState, setDeployState] = useState<Record<string,"idle"|"deploying"|"deployed">>({});
  const [deployHovered, setDeployHovered] = useState(false);
  const ds = deployState[selected.id] ?? "idle";
  const handleDeploy = () => {
    if (ds !== "idle") return;
    setDeployState(prev => ({ ...prev, [selected.id]: "deploying" }));
    setTimeout(() => setDeployState(prev => ({ ...prev, [selected.id]: "deployed" })), 1600);
  };

  return (
    <div className="kd-station-layout" style={{ display:"flex", flex:1, overflow:"hidden" }}>

      {/* Station list */}
      <div className="kd-station-list" style={{ width:280, borderRight:`1px solid ${T.border}`, overflowY:"auto", flexShrink:0, background:T.panel }}>
        <div style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:"#F9FAFB", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:9, height:9, borderRadius:"50%", background:line.color }}/>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:15, fontWeight:700, letterSpacing:"0.05em", color:line.color }}>{line.name}</div>
          </div>
          <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, color:T.textMuted }}>{line.stations.length} STA</div>
        </div>
        {line.stations.map((st, i) => (
          <div key={st.id} onClick={() => onSelect(st.id)}
               className={`station-row line-btn${selectedId === st.id ? " selected active" : ""}`}
               style={{ display:"flex", alignItems:"center", cursor:"pointer", background:selectedId === st.id ? "#F9FAFB" : "transparent", borderLeft:`3px solid ${selectedId === st.id ? line.color : "transparent"}`, "--active-line-color": line.color } as React.CSSProperties}
               onMouseEnter={e => { if (selectedId !== st.id) e.currentTarget.style.background = "#FAFAFA"; }}
               onMouseLeave={e => { if (selectedId !== st.id) e.currentTarget.style.background = "transparent"; }}>
            {/* Connector */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:36, flexShrink:0 }}>
              <div style={{ width:2, height:18, background:i === 0 ? "transparent" : line.color }}/>
              <div className={`station-node${st.status === "critical" ? " critical" : ""}`} style={{ width:12, height:12, borderRadius:"50%", border:`2.5px solid ${st.status === "critical" ? "#D32F2F" : st.status === "warning" ? "#F57C00" : st.status === "closed" ? "#BDBDBD" : "#2E7D32"}`, background: st.status === "critical" ? "#FFEBEE" : st.status === "warning" ? "#FFF8E1" : st.status === "closed" ? "#F5F5F5" : "#E8F5E9", zIndex:1 }}/>
              <div style={{ width:2, height:18, background:i === line.stations.length - 1 ? "transparent" : line.color }}/>
            </div>
            {/* Card info */}
            <div className="station-card" style={{ flex:1, padding:"5px 10px 5px 4px", borderBottom:`1px solid #F4F5F7` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:13, fontWeight:600, letterSpacing:"0.02em", color:T.text }}>{st.name}</div>
                <div style={{ fontFamily:"'Share Tech Mono'", fontSize:11, color:st.status === "closed" ? "#BDBDBD" : scoreColor(st.score) }}>{st.status === "closed" ? "—" : `${st.score}%`}</div>
              </div>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:1 }}>
                {st.issues.length > 0 ? `${st.issues.length} issue${st.issues.length > 1 ? "s" : ""}` : "Clear"} · {st.lastInspected}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail panel */}
      <div style={{ flex:1, overflowY:"auto", background:T.panel }}>
        {selected.status === "closed" ? (
          /* ── Closed station view ── */
          <div className="fade-in">
            {/* Closure banner */}
            <div style={{ margin:"18px 22px 0", padding:"10px 14px", background:"#FFF8E1", border:"1px solid #FFB300", borderRadius:4 }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:"#E65100", marginBottom:3 }}>Station Closed</div>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:12, color:"#4E342E", lineHeight:1.5 }}>{selected.closure || "This station is currently closed."}</div>
            </div>

            {/* Header */}
            <div style={{ padding:"14px 22px", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:22, fontWeight:900, letterSpacing:"0.04em", color:"#9E9E9E", textDecoration:"line-through", lineHeight:1.1 }}>{selected.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:line.color }}/>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, letterSpacing:"0.1em" }}>
                  {selected.city} · {line.name} · Station {line.stations.indexOf(selected) + 1} of {line.stations.length}
                </div>
              </div>
            </div>

            {/* Alternative stations */}
            <div style={{ padding:"12px 22px", borderBottom:`1px solid ${T.border}`, background:"#F9FAFB" }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.15em", textTransform:"uppercase", color:"#9E9E9E", marginBottom:6 }}>Alternative Stations</div>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:13, color:"#424242", letterSpacing:"0.04em" }}>EBJ Union Station &nbsp;·&nbsp; Akard Station</div>
            </div>

            {/* Closure dates */}
            <div style={{ padding:"12px 22px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:24, flexWrap:"wrap" }}>
              <div>
                <div style={{ fontFamily:"'Share Tech Mono'", fontSize:11, color:"#9E9E9E" }}>Closed</div>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", marginTop:2 }}>Jan 5, 2026</div>
              </div>
              <div>
                <div style={{ fontFamily:"'Share Tech Mono'", fontSize:11, color:"#9E9E9E" }}>~2029</div>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", marginTop:2 }}>Est. Reopening</div>
              </div>
              <div>
                <div style={{ fontFamily:"'Share Tech Mono'", fontSize:11, color:"#9E9E9E" }}>~3 Years</div>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, letterSpacing:"0.1em", textTransform:"uppercase", marginTop:2 }}>Duration</div>
              </div>
              <span style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.15em", padding:"3px 9px", borderRadius:2, background:"#F5F5F5", color:"#616161", border:"1px solid #BDBDBD" }}>CLOSED</span>
            </div>

            {/* Assets at closure */}
            {a && (
              <div style={{ padding:"14px 22px", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.25em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>Station Assets (At Closure)</div>
                {(["elevators","cameras","stairwells","trash_cans","bus_covers"] as const).map(k => {
                  const total = a[k], ok = a[`${k}_ok` as keyof AssetEntry] as number;
                  if (!total) return null;
                  return (
                    <div key={k} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:`1px solid #F4F5F7` }}>
                      <div style={{ fontFamily:"'Barlow Condensed'", fontSize:11, fontWeight:600, color:"#9E9E9E", letterSpacing:"0.03em", width:96, flexShrink:0, textTransform:"capitalize" }}>{k.replace(/_/g," ")}</div>
                      <div style={{ display:"flex", gap:2, flex:1, flexWrap:"wrap" }}>
                        {Array.from({length:total},(_,j) => (
                          <span key={j} style={{ display:"inline-block", width:8, height:8, borderRadius:2, background:j < ok ? "#9E9E9E" : "#E0E0E0" }}/>
                        ))}
                      </div>
                      <div style={{ fontFamily:"'Share Tech Mono'", fontSize:10, color:"#9E9E9E", marginRight:6 }}>{ok}/{total}</div>
                      <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, background:"#F5F5F5", color:"#9E9E9E", padding:"1px 6px", borderRadius:3, fontWeight:700, letterSpacing:"0.05em", flexShrink:0 }}>INACTIVE</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer */}
            <div style={{ padding:"14px 22px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, letterSpacing:"0.08em" }}>KAI Facilities Management</div>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:700, letterSpacing:"0.15em", color:"#F9A825" }}>STATION CLOSED</div>
            </div>
          </div>
        ) : (
          /* ── Normal station view ── */
          <>
            {/* Header */}
            <div style={{ padding:"18px 22px", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:22, fontWeight:900, letterSpacing:"0.04em", color:T.text, lineHeight:1.1 }}>{selected.name}</div>
              <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:line.color }}/>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, letterSpacing:"0.1em" }}>
                  {selected.city} · {line.name} · Station {line.stations.indexOf(selected) + 1} of {line.stations.length}
                </div>
              </div>
              <div style={{ display:"flex", alignItems:"flex-end", gap:6, marginTop:12 }}>
                <div className="score-big-num" style={{ fontFamily:"'Share Tech Mono'", fontSize:38, lineHeight:1, color:scoreColor(selected.score) }}>{selected.score}</div>
                <div style={{ fontFamily:"'Barlow Condensed'", color:T.textMuted, paddingBottom:5, lineHeight:1.3 }}>
                  <div style={{ fontSize:13, letterSpacing:"0.05em" }}>/ 100</div>
                  <div style={{ fontSize:9, letterSpacing:"0.15em", textTransform:"uppercase" }}>Readiness Score</div>
                </div>
              </div>
              <div style={{ height:5, background:T.border, borderRadius:2, marginTop:8, overflow:"hidden" }}>
                <div className={`score-fill${selected.score < 70 ? " critical-fill" : ""}`} style={{ height:5, width:`${selected.score}%`, background:scoreFill(selected.score), borderRadius:2 }}/>
              </div>
              <div style={{ marginTop:8 }}>
                <span className="status-chip" style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.15em", padding:"3px 9px", borderRadius:2, background:style.bg, color:style.text, border:`1px solid ${style.border}` }}>
                  {style.label}
                </span>
              </div>
              <div style={{ marginTop:12 }}>
                <a
                  href={["mockingbird","downtown-plano","addison"].includes(selected.id) ? `/dart/station/${selected.id}` : "/dart"}
                  style={{
                    display:"inline-flex", alignItems:"center", gap:6,
                    fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase",
                    padding:"5px 12px", borderRadius:2, cursor:"pointer",
                    background:"#2C3E50", color:"#FFFFFF", textDecoration:"none",
                    border:"none",
                  }}>
                  <span style={{ width:5, height:5, borderRadius:"50%", background:"#27AE60", flexShrink:0 }}/>
                  Station Intelligence
                </a>
              </div>
            </div>

            {/* Issues */}
            <div className="fade-in" style={{ padding:"14px 22px", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.25em", textTransform:"uppercase", color:T.textMuted }}>Open Issues</div>
                <button
                  onClick={() => onReport(selected.name)}
                  style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase", padding:"5px 10px", borderRadius:2, border:"none", cursor:"pointer", background:"#111827", color:"#FFFFFF", minWidth:148, textAlign:"center" }}>
                  REPORT ISSUE
                </button>
              </div>
              {selected.issues.length === 0
                ? <div style={{ fontFamily:"'Barlow Condensed'", fontSize:12, color:"#2E7D32", letterSpacing:"0.05em" }}>✓ All clear</div>
                : selected.issues.map((key, i) => {
                    const issue = ISSUES[key];
                    const pc = issue?.priority === "critical" ? "#D32F2F" : issue?.priority === "high" ? "#F57C00" : "#2E7D32";
                    return (
                      <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid #F4F5F7` }}>
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <div style={{ width:32, height:26, borderRadius:4, background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Share Tech Mono'", fontSize:9, fontWeight:700, letterSpacing:"0.04em", color:T.textMuted, flexShrink:0 }}>{issue?.icon ?? "!!"}</div>
                          <div>
                            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:13, fontWeight:600, color:T.text }}>{issue?.label ?? key}</div>
                            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:1 }}>{selected.lastInspected}</div>
                          </div>
                        </div>
                        <span style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:2, background:`${pc}18`, color:pc, textTransform:"uppercase", letterSpacing:"0.05em" }}>{issue?.priority ?? "high"}</span>
                      </div>
                    );
                  })
              }
            </div>

            {/* Staff */}
            <div className="fade-in" style={{ padding:"14px 22px", borderBottom:`1px solid ${T.border}` }}>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.25em", textTransform:"uppercase", color:T.textMuted }}>Deployed Staff</div>
                <button
                  onClick={handleDeploy}
                  onMouseEnter={() => ds === "idle" && setDeployHovered(true)}
                  onMouseLeave={() => setDeployHovered(false)}
                  className={ds === "deployed" ? "deploy-btn-deployed" : ds === "deploying" ? "deploy-btn-dispatching" : ""}
                  style={{
                    fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.15em", textTransform:"uppercase",
                    padding:"5px 10px", borderRadius:2, border:"none", minWidth:148, textAlign:"center",
                    cursor: ds === "idle" ? "pointer" : "default",
                    background: ds === "deployed" ? "#14532D" : ds === "deploying" ? "#374151" : deployHovered ? "#C9A84C" : "#111827",
                    color: ds === "deployed" ? "#86EFAC" : ds === "deploying" ? "#D1D5DB" : deployHovered ? "#111827" : "#FFFFFF",
                    transform: ds === "idle" && deployHovered ? "translateY(-1px)" : "none",
                    boxShadow: ds === "idle" && deployHovered ? "0 4px 14px rgba(201,168,76,0.4)" : "none",
                    transition:"background 0.18s, color 0.18s, transform 0.18s, box-shadow 0.18s",
                  }}>
                  {ds === "deployed" ? "✓ CREW DISPATCHED" : ds === "deploying" ? "DISPATCHING..." : "DEPLOY STATION CREW"}
                </button>
              </div>
              {selected.staff.length === 0
                ? <div style={{ fontFamily:"'Barlow Condensed'", fontSize:12, color:T.textMuted }}>No staff currently assigned</div>
                : selected.staff.map((m, i) => {
                    const b = { "On Task":{ bg:"#E8F5E9", color:"#2E7D32" }, "En Route":{ bg:"#E3F2FD", color:"#1565C0" }, "Available":{ bg:"#F3F4F6", color:"#6B7280" } }[m.status];
                    return (
                      <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 0", borderBottom:`1px solid #F4F5F7` }}>
                        <div>
                          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:13, fontWeight:700, color:T.text }}>{m.name}</div>
                          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted }}>{m.role}{m.detail ? ` · ${m.detail}` : ""}</div>
                        </div>
                        <span style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", padding:"3px 9px", borderRadius:2, background:b.bg, color:b.color }}>{m.status}</span>
                      </div>
                    );
                  })
              }
            </div>

            {/* Assets */}
            {a && (
              <div className="fade-in" style={{ padding:"14px 22px", borderBottom:`1px solid ${T.border}` }}>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.25em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>Station Assets</div>
                {(["elevators","cameras","stairwells","trash_cans","bus_covers"] as const).map(k => {
                  const total = a[k], ok = a[`${k}_ok` as keyof AssetEntry] as number;
                  const pct = total ? Math.round((ok / total) * 100) : 100;
                  return (
                    <div key={k} className="asset-row" style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:`1px solid #F4F5F7` }}>
                      <div style={{ fontFamily:"'Barlow Condensed'", fontSize:11, fontWeight:600, color:T.textSub, letterSpacing:"0.03em", width:96, flexShrink:0, textTransform:"capitalize" }}>{k.replace(/_/g," ")}</div>
                      <div style={{ flex:1, height:3, background:T.border, borderRadius:1 }}>
                        <div className={`score-fill${pct < 70 ? " critical-fill" : ""}`} style={{ height:3, width:`${pct}%`, background:scoreFill(pct), borderRadius:1 }}/>
                      </div>
                      <div style={{ fontFamily:"'Share Tech Mono'", fontSize:10, color:scoreColor(pct), width:32, textAlign:"right" }}>{ok}/{total}</div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Station map */}
            <StationMap station={selected} lineColor={line.color} />

            {/* FIFA callout */}
            <div style={{ margin:"14px 22px", padding:"12px 14px", background:"#111827", borderRadius:4 }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.gold, marginBottom:4 }}>FIFA World Cup 2026</div>
              <div style={{ fontFamily:"'Share Tech Mono'", fontSize:20, color:"#FFFFFF", lineHeight:1 }}>+286%</div>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:"rgba(255,255,255,0.5)", marginTop:4 }}>Expected surge · 9 match days · AT&T Stadium</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── Photo upload cell ──────────────────────────── */
function InspPhotoCell({ itemId }: { itemId: string }) {
  const [thumbs, setThumbs] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const onFiles = (files: FileList | null) => {
    if (!files) return;
    const urls: string[] = [];
    Array.from(files).slice(0, 3 - thumbs.length).forEach(f => {
      if (f.type.startsWith("image/")) urls.push(URL.createObjectURL(f));
    });
    setThumbs(prev => [...prev, ...urls].slice(0, 3));
  };

  return (
    <div style={{ display:"flex", alignItems:"center", gap:4 }}>
      {thumbs.map((url, i) => (
        <img key={i} src={url} alt="" className="insp-thumb-wrap" style={{ width:28, height:28, objectFit:"cover", borderRadius:3, border:`1px solid ${T.border}`, cursor:"pointer" }} onClick={() => window.open(url, "_blank")}/>
      ))}
      {thumbs.length < 3 && (
        <>
          <button onClick={() => inputRef.current?.click()}
            className="insp-upload-zone"
            style={{ width:28, height:28, border:`1px dashed ${T.borderHard}`, borderRadius:3, background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:T.textMuted, flexShrink:0 }}
            title="Attach photo">
            +
          </button>
          <input ref={inputRef} type="file" accept="image/*" multiple style={{ display:"none" }} id={`photo-${itemId}`}
            onChange={e => onFiles(e.target.files)}/>
        </>
      )}
    </div>
  );
}

/* ─── Inspection view ────────────────────────────── */
function InspectionView() {
  const [inspState, setInspState]   = useState<Record<string, InspVal>>({});
  const [inspNotes, setInspNotes]   = useState<Record<string, string>>({});
  const [station,   setStation]     = useState("");
  const [inspector, setInspector]   = useState("");
  const [crewId,    setCrewId]      = useState("");
  const [stationOpen, setStationOpen] = useState(false);
  const stationMatches = ALL_STATIONS.filter(s =>
    !station.trim() || s.name.toLowerCase().includes(station.toLowerCase())
  );
  const [submitted, setSubmitted]   = useState(false);
  const [flashRows, setFlashRows]   = useState<Record<string, "pass"|"fail">>({});
  const [flashSecs, setFlashSecs]   = useState<Set<string>>(new Set());
  const [openNotes, setOpenNotes]   = useState<Set<string>>(new Set());
  const [savedNotes, setSavedNotes] = useState<Set<string>>(new Set());
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(INSP_SECTIONS.map(s => s.id)));
  const toggleSection = (id: string) => setOpenSections(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const toggle = (id: string, val: InspVal) => {
    const next = inspState[id] === val ? null : val;
    setInspState(prev => ({ ...prev, [id]: next }));
    if (next === "pass" || next === "fail") {
      setFlashRows(prev => ({ ...prev, [id]: next }));
      setTimeout(() => setFlashRows(prev => { const n = { ...prev }; delete n[id]; return n; }), 500);
      // find section and flash it
      const sec = INSP_SECTIONS.find(s => s.items.some(it => it.id === id));
      if (sec) {
        setFlashSecs(prev => new Set(prev).add(sec.id));
        setTimeout(() => setFlashSecs(prev => { const n = new Set(prev); n.delete(sec.id); return n; }), 600);
      }
    }
  };

  const toggleNote = (id: string) => setOpenNotes(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const saveNote = (id: string) => {
    setOpenNotes(prev => { const n = new Set(prev); n.delete(id); return n; });
    if (inspNotes[id]?.trim()) {
      setSavedNotes(prev => new Set(prev).add(id));
    } else {
      setSavedNotes(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  const secScore = (sec: InspSection) => {
    const vals = sec.items.map(it => inspState[it.id]);
    const answered = vals.filter(v => v === "pass" || v === "fail");
    if (answered.length === 0) return null;
    const passes = vals.filter(v => v === "pass").length;
    return Math.round((passes / answered.length) * 100);
  };

  const totalItems = INSP_SECTIONS.flatMap(s => s.items);
  const answeredCount = totalItems.filter(it => inspState[it.id] !== undefined && inspState[it.id] !== null).length;
  const passCount     = totalItems.filter(it => inspState[it.id] === "pass").length;
  const failCount     = totalItems.filter(it => inspState[it.id] === "fail").length;
  const naCount       = totalItems.filter(it => inspState[it.id] === "na").length;
  const overallScore  = answeredCount > 0
    ? Math.round((passCount / (passCount + failCount || 1)) * 100)
    : null;

  const canSubmit = station.trim() !== "" && inspector.trim() !== "" && answeredCount >= Math.ceil(totalItems.length * 0.8);

  if (submitted) {
    return (
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", background:T.bg, padding:40 }}>
        <div style={{ textAlign:"center", maxWidth:420 }}>
          <div style={{ fontSize:48, marginBottom:16 }}>✓</div>
          <div style={{ fontFamily:"'Share Tech Mono'", fontSize:22, color:"#2E7D32", marginBottom:8 }}>Inspection Submitted</div>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:13, color:T.textMuted, marginBottom:24, letterSpacing:"0.04em" }}>
            {station} · Inspector {inspector} · {passCount} pass / {failCount} fail / {naCount} N/A{savedNotes.size > 0 ? ` · ${savedNotes.size} note${savedNotes.size > 1 ? "s" : ""}` : ""}
          </div>
          {overallScore !== null && (
            <div style={{ fontFamily:"'Share Tech Mono'", fontSize:44, color:scoreColor(overallScore), marginBottom:4, lineHeight:1 }}>{overallScore}%</div>
          )}
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, letterSpacing:"0.2em", marginBottom:28 }}>OVERALL SCORE</div>
          <button onClick={() => { setSubmitted(false); setInspState({}); setInspNotes({}); setStation(""); setInspector(""); setCrewId(""); setOpenNotes(new Set()); setSavedNotes(new Set()); }}
            style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", padding:"10px 24px", background:T.gold, color:"#FFFFFF", border:"none", borderRadius:3, cursor:"pointer" }}>
            New Inspection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kd-insp-layout" style={{ display:"flex", flex:1, overflow:"hidden" }}>

      {/* Left sidebar — form header + section nav */}
      <div className="kd-insp-sidebar" style={{ width:260, borderRight:`1px solid ${T.border}`, background:T.panel, display:"flex", flexDirection:"column", flexShrink:0 }}>
        {/* Metadata form */}
        <div style={{ padding:"16px 16px 12px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted, marginBottom:12 }}>
            Inspection Details
          </div>
          {/* Station autocomplete */}
          <div style={{ marginBottom:8, position:"relative" }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.14em", color:T.textMuted, marginBottom:3, textTransform:"uppercase" }}>Station</div>
            <input value={station} onChange={e => { setStation(e.target.value); setStationOpen(true); }}
              placeholder="Select station…" autoComplete="off"
              style={{ width:"100%", fontFamily:"'Barlow Condensed'", fontSize:12, padding:"5px 8px", border:`1px solid ${T.border}`, borderRadius:3, background:T.bg, color:T.text, outline:"none", boxSizing:"border-box" as const }}
              onFocus={e => { e.currentTarget.style.borderColor = T.gold; setStationOpen(true); }}
              onBlur={e => { e.currentTarget.style.borderColor = T.border; setTimeout(() => setStationOpen(false), 150); }}
            />
            {stationOpen && stationMatches.length > 0 && (
              <div style={{ position:"absolute", top:"100%", left:0, right:0, background:T.panel, border:`1px solid ${T.borderHard}`, borderRadius:3, boxShadow:T.shadowMd, zIndex:200, maxHeight:180, overflowY:"auto" }}>
                {stationMatches.map(s => (
                  <div key={`${s.id}-${s.lineId}`}
                    onMouseDown={() => { setStation(s.name); setStationOpen(false); }}
                    style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 8px", fontFamily:"'Barlow Condensed'", fontSize:12, color:T.text, cursor:"pointer", borderBottom:`1px solid ${T.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bg)}
                    onMouseLeave={e => (e.currentTarget.style.background = T.panel)}
                  >
                    <span>{s.name}</span>
                    <span style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.06em" }}>{s.lineName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Other fields */}
          {[
            { label:"Inspector", val:inspector, set:setInspector, ph:"Full name" },
            { label:"Crew / Badge ID", val:crewId, set:setCrewId, ph:"Optional" },
          ].map(f => (
            <div key={f.label} style={{ marginBottom:8 }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.14em", color:T.textMuted, marginBottom:3, textTransform:"uppercase" }}>{f.label}</div>
              <input value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph}
                style={{ width:"100%", fontFamily:"'Barlow Condensed'", fontSize:12, padding:"5px 8px", border:`1px solid ${T.border}`, borderRadius:3, background:T.bg, color:T.text, outline:"none", boxSizing:"border-box" }}
                onFocus={e => (e.currentTarget.style.borderColor = T.gold)}
                onBlur={e => (e.currentTarget.style.borderColor = T.border)}
              />
            </div>
          ))}
        </div>

        {/* Section list */}
        <div style={{ overflowY:"auto", flex:1 }}>
          <div style={{ padding:"10px 16px 6px", fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted }}>
            Sections
          </div>
          {INSP_SECTIONS.map(sec => {
            const sc = secScore(sec);
            const answered = sec.items.filter(it => inspState[it.id] !== null && inspState[it.id] !== undefined).length;
            const isFlashing = flashSecs.has(sec.id);
            return (
              <a key={sec.id} href={`#insp-sec-${sec.id}`}
                style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"7px 16px", textDecoration:"none", transition:"background 0.12s", background: isFlashing ? "#FFFDE7" : "transparent", borderLeft:`3px solid ${sc !== null ? scoreFill(sc) : "transparent"}` }}
                onMouseEnter={e => { e.currentTarget.style.background = "#F9FAFB"; }}
                onMouseLeave={e => { e.currentTarget.style.background = isFlashing ? "#FFFDE7" : "transparent"; }}>
                <div>
                  <div style={{ fontFamily:"'Barlow Condensed'", fontSize:12, fontWeight:600, color:T.text, letterSpacing:"0.02em" }}>{sec.title}</div>
                  <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.06em" }}>{answered}/{sec.items.length} answered</div>
                </div>
                {sc !== null && (
                  <div style={{ fontFamily:"'Share Tech Mono'", fontSize:12, color:scoreColor(sc), fontWeight:700 }}>{sc}%</div>
                )}
              </a>
            );
          })}
        </div>

        {/* Progress + submit */}
        <div style={{ padding:"12px 16px", borderTop:`1px solid ${T.border}` }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.1em" }}>{answeredCount} / {totalItems.length} ITEMS</div>
            {overallScore !== null && (
              <div style={{ fontFamily:"'Share Tech Mono'", fontSize:11, color:scoreColor(overallScore), fontWeight:700 }}>{overallScore}%</div>
            )}
          </div>
          <div style={{ height:3, background:T.border, borderRadius:2, overflow:"hidden", marginBottom:10 }}>
            <div className="insp-progress-fill" style={{ height:3, width:`${(answeredCount / totalItems.length) * 100}%`, background:T.gold, borderRadius:2 }}/>
          </div>
          <div style={{ display:"flex", gap:6, marginBottom:10, fontFamily:"'Share Tech Mono'", fontSize:9 }}>
            <span style={{ color:"#2E7D32" }}>{passCount}P</span>
            <span style={{ color:"#D32F2F" }}>{failCount}F</span>
            <span style={{ color:T.textMuted }}>{naCount}N/A</span>
          </div>
          <button onClick={() => canSubmit && setSubmitted(true)} disabled={!canSubmit}
            className="insp-submit-btn"
            style={{ width:"100%", fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", padding:"9px", borderRadius:3, border:"none", cursor: canSubmit ? "pointer" : "not-allowed", background: canSubmit ? T.gold : T.border, color: canSubmit ? "#FFFFFF" : T.textMuted }}>
            {canSubmit ? "Submit Inspection" : `${Math.ceil(totalItems.length * 0.8) - answeredCount} more to enable`}
          </button>
          {!station.trim() && <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:"#D32F2F", marginTop:5, letterSpacing:"0.06em" }}>Station name required</div>}
        </div>
      </div>

      {/* Main checklist */}
      <div className="kd-scroll" style={{ flex:1, overflowY:"auto", background:T.bg, padding:"20px 28px" }}>

        {/* Page header */}
        <div style={{ marginBottom:20 }}>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginBottom:3 }}>
            KAI Facilities Management · DART Rail Network
          </div>
          <div style={{ fontFamily:"'Share Tech Mono'", fontSize:22, color:T.text, lineHeight:1.15 }}>
            Station Inspection Checklist
          </div>
        </div>

        {/* Score banner */}
        {overallScore !== null && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:20 }}>
            {[
              { label:"Overall Score",  val:`${overallScore}%`, color:scoreColor(overallScore) },
              { label:"Pass",           val:passCount,           color:"#2E7D32"               },
              { label:"Fail",           val:failCount,           color:"#D32F2F"               },
              { label:"N/A",            val:naCount,             color:T.textMuted             },
            ].map(k => (
              <div key={k.label} style={{ background:T.panel, padding:"12px 16px" }}>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:T.textMuted, marginBottom:4 }}>{k.label}</div>
                <div style={{ fontFamily:"'Share Tech Mono'", fontSize:24, color:k.color, lineHeight:1 }}>{k.val}</div>
              </div>
            ))}
          </div>
        )}

        {/* Sections */}
        {INSP_SECTIONS.map(sec => (
          <div key={sec.id} id={`insp-sec-${sec.id}`} style={{ marginBottom:20, background:T.panel, border:`1px solid ${T.border}`, borderRadius:4, overflow:"hidden", boxShadow:T.shadow }}>
            {/* Section header — accordion toggle */}
            <button
              onClick={() => toggleSection(sec.id)}
              style={{ width:"100%", padding:"10px 16px", background:"#F9FAFB", border:"none", borderBottom: openSections.has(sec.id) ? `1px solid ${T.border}` : "none", display:"flex", alignItems:"center", justifyContent:"space-between", cursor:"pointer" }}>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <svg width="12" height="12" viewBox="0 0 12 12" style={{ flexShrink:0, transition:"transform 0.2s", transform: openSections.has(sec.id) ? "rotate(90deg)" : "rotate(0deg)" }} fill="none" stroke={T.textMuted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4,2 8,6 4,10"/>
                </svg>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:14, fontWeight:700, letterSpacing:"0.08em", color:T.text }}>{sec.title}</div>
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.1em" }}>
                  {sec.items.filter(it => inspState[it.id] !== null && inspState[it.id] !== undefined).length}/{sec.items.length}
                </div>
                {secScore(sec) !== null && (
                  <div className={`insp-section-score${flashSecs.has(sec.id) ? " updated" : ""}`} style={{ fontFamily:"'Share Tech Mono'", fontSize:14, color:scoreColor(secScore(sec)!), fontWeight:700 }}>{secScore(sec)}%</div>
                )}
              </div>
            </button>

            {/* Items — collapsed when section is closed */}
            {openSections.has(sec.id) && <table className="insp-table" style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead>
                <tr style={{ background:"#FAFAFA" }}>
                  {["Item","Priority","Pass","Fail","N/A","Photo","Notes"].map((h, i) => (
                    <th key={h} style={{ fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", color:T.textMuted, padding:"6px 12px", textAlign: i >= 2 && i <= 4 ? "center" : "left", borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sec.items.map(it => {
                  const val   = inspState[it.id] ?? null;
                  const flash = flashRows[it.id];
                  const priBg = it.priority === "critical" ? "#FFEBEE" : it.priority === "high" ? "#FFF3E0" : "#F3F4F6";
                  const priTx = it.priority === "critical" ? "#C62828" : it.priority === "high" ? "#E65100" : "#6B7280";
                  const rowBg = flash === "pass" ? "#E8F5E9" : flash === "fail" ? "#FFEBEE" : "transparent";
                  return (
                    <>
                      <tr key={it.id} className={flash === "pass" ? "just-passed" : flash === "fail" ? "just-failed" : ""} style={{ borderBottom:`1px solid #F4F5F7` }}>
                        <td style={{ padding:"9px 12px", maxWidth:240 }}>
                          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:13, fontWeight:600, color:T.text }}>{it.name}</div>
                          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:1 }}>{it.desc}</div>
                        </td>
                        <td style={{ padding:"9px 12px", whiteSpace:"nowrap" }}>
                          <span style={{ fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.12em", padding:"2px 6px", borderRadius:2, background:priBg, color:priTx, textTransform:"uppercase" }}>{it.priority}</span>
                        </td>
                        {(["pass","fail","na"] as const).map(v => (
                          <td key={v} style={{ padding:"9px 8px", textAlign:"center" }}>
                            <button onClick={() => toggle(it.id, v)}
                              className={`insp-radio-btn${val === v ? ` ${v}` : ""}`}
                              style={{ width:26, height:26, borderRadius:3, border:`1.5px solid ${val === v ? (v === "pass" ? "#4CAF50" : v === "fail" ? "#EF5350" : "#9E9E9E") : T.border}`, background: val === v ? (v === "pass" ? "#E8F5E9" : v === "fail" ? "#FFEBEE" : "#F3F4F6") : "transparent", cursor:"pointer", fontFamily:"'Share Tech Mono'", fontSize:9, fontWeight:700, color: val === v ? (v === "pass" ? "#2E7D32" : v === "fail" ? "#C62828" : "#6B7280") : T.textMuted }}>
                              {v === "pass" ? "✓" : v === "fail" ? "✗" : "–"}
                            </button>
                          </td>
                        ))}
                        <td style={{ padding:"9px 8px" }}>
                          <InspPhotoCell itemId={it.id}/>
                        </td>
                        <td style={{ padding:"9px 8px" }}>
                          <button onClick={() => toggleNote(it.id)}
                            className="btn-sm"
                            style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.08em", padding:"3px 8px", borderRadius:2, border:`1px solid ${openNotes.has(it.id) ? T.gold : savedNotes.has(it.id) ? "#A5D6A7" : T.border}`, background: openNotes.has(it.id) ? "#FFFDE7" : savedNotes.has(it.id) ? "#E8F5E9" : "transparent", color: openNotes.has(it.id) ? "#8B6914" : savedNotes.has(it.id) ? "#2E7D32" : T.textMuted, cursor:"pointer", whiteSpace:"nowrap", display:"flex", alignItems:"center", gap:4 }}>
                            {savedNotes.has(it.id) && <span style={{ width:5, height:5, borderRadius:"50%", background:"#4CAF50", display:"inline-block", flexShrink:0 }}/>}
                            {inspNotes[it.id] ? "Note ✓" : "Add note"}
                          </button>
                        </td>
                      </tr>
                      {openNotes.has(it.id) && (
                        <tr key={`${it.id}-note`} style={{ background:"#FFFDE7" }}>
                          <td colSpan={7} style={{ padding:"6px 12px 10px 28px" }}>
                            <textarea value={inspNotes[it.id] ?? ""} onChange={e => setInspNotes(prev => ({ ...prev, [it.id]: e.target.value }))}
                              placeholder="Add note or corrective action…" rows={2}
                              style={{ width:"100%", fontFamily:"'Barlow Condensed'", fontSize:12, padding:"6px 8px", border:`1px solid ${T.border}`, borderRadius:3, background:T.panel, color:T.text, resize:"vertical", outline:"none", boxSizing:"border-box" }}
                              onFocus={e => (e.currentTarget.style.borderColor = T.gold)}
                              onBlur={e => (e.currentTarget.style.borderColor = T.border)}
                            />
                            <div style={{ display:"flex", gap:6, marginTop:5 }}>
                              <button onClick={() => saveNote(it.id)} className="btn-sm"
                                style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.12em", padding:"4px 12px", borderRadius:2, border:"none", background: inspNotes[it.id]?.trim() ? "#2E7D32" : T.border, color: inspNotes[it.id]?.trim() ? "#FFFFFF" : T.textMuted, cursor: inspNotes[it.id]?.trim() ? "pointer" : "default", textTransform:"uppercase" }}>
                                Save Note
                              </button>
                              <button onClick={() => { setOpenNotes(prev => { const n = new Set(prev); n.delete(it.id); return n; }); }} className="btn-sm"
                                style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.08em", padding:"4px 10px", borderRadius:2, border:`1px solid ${T.border}`, background:"transparent", color:T.textMuted, cursor:"pointer" }}>
                                Cancel
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>}
          </div>
        ))}

        {/* Signature block */}
        <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:4, padding:"16px 20px", marginBottom:20, boxShadow:T.shadow }}>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted, marginBottom:12 }}>
            Inspector Attestation
          </div>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:12, color:T.textSub, lineHeight:1.6, marginBottom:12 }}>
            I certify that I personally conducted this inspection and that all entries accurately reflect the conditions observed at the time of inspection.
          </div>
          <div style={{ display:"flex", gap:16 }}>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:3, textTransform:"uppercase" }}>Inspector</div>
              <div style={{ fontFamily:"'Share Tech Mono'", fontSize:14, color:T.text, padding:"6px 0", borderBottom:`1px solid ${T.borderHard}` }}>{inspector || "—"}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:3, textTransform:"uppercase" }}>Station</div>
              <div style={{ fontFamily:"'Share Tech Mono'", fontSize:14, color:T.text, padding:"6px 0", borderBottom:`1px solid ${T.borderHard}` }}>{station || "—"}</div>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.1em", marginBottom:3, textTransform:"uppercase" }}>Date / Time</div>
              <div style={{ fontFamily:"'Share Tech Mono'", fontSize:14, color:T.text, padding:"6px 0", borderBottom:`1px solid ${T.borderHard}` }}>{new Date().toLocaleDateString("en-US", { month:"short", day:"numeric", year:"numeric" })}</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

/* ─── Asset dashboard view ───────────────────────── */
function AssetDashboardView({ assetKey }: { assetKey: AssetKey }) {
  const meta = ASSET_META[assetKey];
  const okKey = `${assetKey}_ok` as keyof AssetEntry;

  let totalNet = 0, okNet = 0;
  const stationRows: { station: Station; total: number; ok: number; down: number }[] = [];
  ALL_STATIONS.forEach(s => {
    const a = ASSETS[s.id]; if (!a) return;
    const t = a[assetKey], o = a[okKey] as number;
    totalNet += t; okNet += o;
    stationRows.push({ station: s, total: t, ok: o, down: t - o });
  });
  const downNet = totalNet - okNet;
  const uptimePct = totalNet ? Math.round((okNet / totalNet) * 100) : 100;
  const sorted = [...stationRows].sort((a, b) => b.down - a.down);

  const lineBreakdown = Object.entries(LINES).map(([lid, line]) => {
    let lt = 0, lo = 0;
    line.stations.forEach(s => { const a = ASSETS[s.id]; if (!a) return; lt += a[assetKey]; lo += a[okKey] as number; });
    return { lid, line, total: lt, ok: lo, down: lt - lo, pct: lt ? Math.round((lo/lt)*100) : 100 };
  });

  return (
    <div className="asset-dashboard" style={{ padding:"24px 28px", overflowY:"auto", flex:1, background:T.bg }}>
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginBottom:3 }}>
          KAI Asset Dashboard · DART Rail Network
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <span style={{ fontFamily:"'Share Tech Mono'", fontSize:11, fontWeight:700, color:T.textMuted, background:T.bg, border:`1px solid ${T.border}`, padding:"4px 7px", borderRadius:3, letterSpacing:"0.08em" }}>{meta.icon}</span>
          <div style={{ fontFamily:"'Share Tech Mono'", fontSize:22, color:T.text }}>{meta.label} Dashboard</div>
        </div>
      </div>

      {/* KPIs */}
      <div className="kd-grid-4col" style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:24 }}>
        {[
          { label:"Total Network",  val:totalNet,        sub:"Units across all stations",    color:T.text                                        },
          { label:"Operational",    val:okNet,           sub:"Currently online",             color:"#2E7D32"                                     },
          { label:"Down",           val:downNet,         sub:"Requiring attention",          color: downNet > 0 ? "#D32F2F" : "#2E7D32"          },
          { label:"Network Uptime", val:`${uptimePct}%`, sub:"Overall availability",         color:scoreColor(uptimePct)                         },
        ].map(k => (
          <div key={k.label} className="dash-cell" style={{ background:T.panel, padding:"14px 18px" }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:T.textMuted, marginBottom:5 }}>{k.label}</div>
            <div className="dash-cell-value" style={{ fontFamily:"'Share Tech Mono'", fontSize:28, color:k.color, lineHeight:1 }}>{k.val}</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Per-line */}
      <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>BY LINE</div>
      <div className="kd-asset-grid-5 kd-grid-5col" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:24 }}>
        {lineBreakdown.map(({ lid, line, total, ok, down, pct }) => (
          <div key={lid} style={{ background:T.panel, padding:"14px 18px", borderLeft:`3px solid ${line.color}` }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:13, fontWeight:700, color:line.color, marginBottom:6 }}>{line.name}</div>
            <div style={{ fontFamily:"'Share Tech Mono'", fontSize:20, color:scoreColor(pct), lineHeight:1 }}>{pct}%</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, marginTop:3 }}>{ok}/{total} · {down > 0 ? `${down} DOWN` : "All OK"}</div>
            <div style={{ height:3, background:T.border, borderRadius:1, marginTop:8, overflow:"hidden" }}>
              <div style={{ height:3, width:`${pct}%`, background:scoreFill(pct), borderRadius:1 }}/>
            </div>
          </div>
        ))}
      </div>

      {/* Station table */}
      <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>STATIONS — SORTED BY UNITS DOWN</div>
      <div className="kd-table-wrap"><table className="tufte-table" style={{ width:"100%", borderCollapse:"collapse", background:T.panel, border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
        <thead>
          <tr style={{ background:"#F9FAFB" }}>
            {["Station","Line","Units","Down","Uptime","Status"].map((h, i) => (
              <th key={h} style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.2em", textTransform:"uppercase", color:T.textMuted, padding:"8px 14px", textAlign: i >= 2 ? "right" : "left", borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ station:st, total, ok, down }) => {
            const pct = total ? Math.round((ok / total) * 100) : 100;
            return (
              <tr key={st.id} style={{ borderBottom:`1px solid #F4F5F7`, transition:"background 0.1s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <td style={{ padding:"8px 14px", fontFamily:"'Barlow Condensed'", fontSize:13, fontWeight:600, color:T.text }}>{st.name}</td>
                <td style={{ padding:"8px 14px" }}>
                  <span style={{ display:"inline-flex", alignItems:"center", gap:5 }}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background:st.lineColor, display:"inline-block" }}/>
                    <span style={{ fontFamily:"'Barlow Condensed'", fontSize:11, color:T.textMuted }}>{st.lineName}</span>
                  </span>
                </td>
                <td style={{ padding:"8px 14px", textAlign:"right", fontFamily:"'Share Tech Mono'", fontSize:11, color:T.textSub }}>{total}</td>
                <td style={{ padding:"8px 14px", textAlign:"right", fontFamily:"'Share Tech Mono'", fontSize:11, fontWeight:700, color: down > 0 ? "#D32F2F" : "#2E7D32" }}>{down > 0 ? down : "—"}</td>
                <td style={{ padding:"8px 14px", textAlign:"right" }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:6 }}>
                    <div style={{ width:60, height:3, background:T.border, borderRadius:1 }}>
                      <div style={{ height:3, width:`${pct}%`, background:scoreFill(pct), borderRadius:1 }}/>
                    </div>
                    <span style={{ fontFamily:"'Share Tech Mono'", fontSize:10, color:scoreColor(pct), width:28, textAlign:"right" }}>{pct}%</span>
                  </div>
                </td>
                <td style={{ padding:"8px 14px", textAlign:"right" }}>
                  <span style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, padding:"2px 7px", borderRadius:2,
                    background: down === 0 ? "#E8F5E9" : down === 1 ? "#FFF3E0" : "#FFEBEE",
                    color:       down === 0 ? "#2E7D32" : down === 1 ? "#E65100" : "#C62828",
                    border:     `1px solid ${down === 0 ? "#A5D6A7" : down === 1 ? "#FFCC80" : "#EF9A9A"}` }}>
                    {down === 0 ? "ALL OK" : down === 1 ? "ATTENTION" : "CRITICAL"}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table></div>
    </div>
  );
}

/* ─── Report Issue view ──────────────────────────── */
const REPORT_TYPES: { key: string; label: string; code: string; priority: "critical"|"high"|"standard" }[] = [
  { key:"safety",    label:"Safety",    code:"SFY", priority:"critical" },
  { key:"security",  label:"Security",  code:"SEC", priority:"critical" },
  { key:"vandalism", label:"Vandalism", code:"VND", priority:"high"     },
  { key:"cleaning",  label:"Cleaning",  code:"CLN", priority:"high"     },
  { key:"equipment", label:"Equipment", code:"EQP", priority:"high"     },
  { key:"trash_can", label:"Trash Can", code:"TRS", priority:"standard" },
  { key:"bench",     label:"Bench",     code:"BCH", priority:"standard" },
];

function ReportIssueView({ initialStation = "" }: { initialStation?: string }) {
  const [station,    setStation]    = useState(initialStation);
  const [stationOpen,setStationOpen]= useState(false);
  const stationMatches = ALL_STATIONS.filter(s =>
    !station.trim() || s.name.toLowerCase().includes(station.toLowerCase())
  );
  const [issueType,  setIssueType]  = useState<string|null>(null);
  const [priority,   setPriority]   = useState<"critical"|"high"|"standard"|null>(null);
  const [notes,      setNotes]      = useState("");
  const [photo,      setPhoto]      = useState<File|null>(null);
  const [photoUrl,   setPhotoUrl]   = useState<string|null>(null);
  const [reporter,   setReporter]   = useState("");
  const [badge,      setBadge]      = useState("");
  const [hoveredType, setHoveredType] = useState<string|null>(null);
  const [submitted,  setSubmitted]  = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleType = (key: string) => {
    const t = REPORT_TYPES.find(r => r.key === key)!;
    setIssueType(key);
    setPriority(t.priority);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setPhoto(f);
    if (f) setPhotoUrl(URL.createObjectURL(f));
    else setPhotoUrl(null);
  };

  const canSubmit = station.trim() !== "" && issueType !== null;

  const reset = () => {
    setStation(""); setIssueType(null); setPriority(null);
    setNotes(""); setPhoto(null); setPhotoUrl(null);
    setReporter(""); setBadge(""); setSubmitted(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const priorityColor = (p: "critical"|"high"|"standard") =>
    p === "critical" ? "#C62828" : p === "high" ? "#E65100" : T.textMuted;
  const priorityBg    = (p: "critical"|"high"|"standard") =>
    p === "critical" ? "#FFEBEE" : p === "high" ? "#FFF3E0" : T.bg;

  /* ── Label helper ── */
  const Label = ({ children }: { children: React.ReactNode }) => (
    <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:T.textMuted, marginBottom:5 }}>
      {children}
    </div>
  );

  /* ── Field wrapper ── */
  const Field = ({ children, mb=14 }: { children: React.ReactNode; mb?: number }) => (
    <div style={{ marginBottom:mb }}>{children}</div>
  );

  /* ── Text input ── */
  const Input = ({ value, onChange, placeholder, disabled=false }: { value:string; onChange:(v:string)=>void; placeholder:string; disabled?:boolean }) => (
    <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
      style={{ width:"100%", fontFamily:"'Barlow Condensed'", fontSize:12, padding:"6px 10px", border:`1px solid ${T.border}`, borderRadius:3, background: disabled ? T.bg : T.panel, color:T.text, outline:"none", boxSizing:"border-box" as const, opacity: disabled ? 0.6 : 1 }}
      onFocus={e => { if (!disabled) e.currentTarget.style.borderColor = T.gold; }}
      onBlur={e => { e.currentTarget.style.borderColor = T.border; }}
    />
  );

  if (submitted) {
    const t = REPORT_TYPES.find(r => r.key === issueType)!;
    return (
      <div className="kd-scroll" style={{ flex:1, overflowY:"auto", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:32 }}>
        <div style={{ background:T.panel, border:`1px solid ${T.border}`, borderRadius:4, padding:"40px 48px", maxWidth:480, width:"100%", textAlign:"center", boxShadow:T.shadowMd }}>
          <div style={{ fontFamily:"'Share Tech Mono'", fontSize:11, letterSpacing:"0.3em", color:T.gold, marginBottom:10 }}>REPORT SUBMITTED</div>
          <div style={{ fontFamily:"'Share Tech Mono'", fontSize:28, color:T.text, marginBottom:6 }}>#{Math.floor(Math.random()*9000+1000)}</div>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:13, color:T.textSub, marginBottom:4 }}>{station} · {t.label}</div>
          {priority && (
            <div style={{ display:"inline-block", fontFamily:"'Share Tech Mono'", fontSize:9, letterSpacing:"0.14em", padding:"3px 10px", borderRadius:2, background:priorityBg(priority), color:priorityColor(priority), marginBottom:20 }}>
              {priority.toUpperCase()}
            </div>
          )}
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:11, color:T.textMuted, marginBottom:28 }}>
            Report logged and routed to the operations queue.
          </div>
          <button onClick={reset}
            style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", padding:"9px 28px", background:T.gold, color:"#fff", border:"none", borderRadius:3, cursor:"pointer" }}>
            New Report
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="kd-scroll" style={{ flex:1, overflowY:"auto", background:T.bg, padding:"24px 28px" }}>

      {/* Page header */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginBottom:3 }}>
          KAI Facilities Management · DART Rail Network
        </div>
        <div style={{ fontFamily:"'Share Tech Mono'", fontSize:22, color:T.text, lineHeight:1.15 }}>
          Report an Issue
        </div>
      </div>

      {/* Form card */}
      <div style={{ maxWidth:640, background:T.panel, border:`1px solid ${T.border}`, borderRadius:4, boxShadow:T.shadow }}>

        {/* Station */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}` }}>
          <Label>Station <span style={{ color:"#D32F2F" }}>*</span></Label>
          <div style={{ position:"relative" }}>
            <input value={station} onChange={e => { setStation(e.target.value); setStationOpen(true); }}
              placeholder="Select station…" autoComplete="off"
              style={{ width:"100%", fontFamily:"'Barlow Condensed'", fontSize:12, padding:"6px 10px", border:`1px solid ${T.border}`, borderRadius:3, background:T.panel, color:T.text, outline:"none", boxSizing:"border-box" as const }}
              onFocus={e => { e.currentTarget.style.borderColor = T.gold; setStationOpen(true); }}
              onBlur={e => { e.currentTarget.style.borderColor = T.border; setTimeout(() => setStationOpen(false), 150); }}
            />
            {stationOpen && stationMatches.length > 0 && (
              <div style={{ position:"absolute", top:"100%", left:0, right:0, background:T.panel, border:`1px solid ${T.borderHard}`, borderRadius:3, boxShadow:T.shadowMd, zIndex:200, maxHeight:180, overflowY:"auto" }}>
                {stationMatches.map(s => (
                  <div key={`${s.id}-${s.lineId}`}
                    onMouseDown={() => { setStation(s.name); setStationOpen(false); }}
                    style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"6px 10px", fontFamily:"'Barlow Condensed'", fontSize:12, color:T.text, cursor:"pointer", borderBottom:`1px solid ${T.border}` }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bg)}
                    onMouseLeave={e => (e.currentTarget.style.background = T.panel)}
                  >
                    <span>{s.name}</span>
                    <span style={{ fontSize:9, color:T.textMuted, letterSpacing:"0.06em" }}>{s.lineName}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Issue Type */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}` }}>
          <Label>Issue Type <span style={{ color:"#D32F2F" }}>*</span></Label>
          <div style={{ display:"flex", flexWrap:"wrap" as const, gap:6 }}>
            {REPORT_TYPES.map(t => {
              const active = issueType === t.key;
              return (
                <button key={t.key} onClick={() => handleType(t.key)}
                  onMouseEnter={() => setHoveredType(t.key)}
                  onMouseLeave={() => setHoveredType(null)}
                  className={active ? "report-type-btn-active" : ""}
                  style={{
                    fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const,
                    padding:"6px 16px", borderRadius:3, cursor:"pointer",
                    border:`1px solid ${active ? "#166534" : hoveredType === t.key ? "#16A34A" : T.border}`,
                    background: active ? "#166534" : hoveredType === t.key ? "#F0FDF4" : T.panel,
                    color: active ? "#FFFFFF" : hoveredType === t.key ? "#166534" : T.textSub,
                    transform: !active && hoveredType === t.key ? "translateY(-1px)" : "none",
                    boxShadow: !active && hoveredType === t.key ? "0 3px 10px rgba(22,163,74,0.2)" : "none",
                    transition:"background 0.15s, color 0.15s, border-color 0.15s, transform 0.15s, box-shadow 0.15s",
                  }}>
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Priority */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}` }}>
          <Label>Priority</Label>
          <div style={{ display:"flex", gap:6 }}>
            {(["critical","high","standard"] as const).map(p => {
              const active = priority === p;
              return (
                <button key={p} onClick={() => setPriority(p)}
                  style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, padding:"5px 14px", border:`1px solid ${active ? priorityColor(p) : T.border}`, borderRadius:3, background: active ? priorityBg(p) : T.panel, color: active ? priorityColor(p) : T.textMuted, cursor:"pointer", transition:"all 0.12s" }}>
                  {p}
                </button>
              );
            })}
          </div>
          {!priority && (
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, marginTop:6, letterSpacing:"0.06em" }}>
              Auto-set when issue type is selected. Override if needed.
            </div>
          )}
        </div>

        {/* Notes */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}` }}>
          <Label>Location / Notes</Label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)}
            placeholder="Describe the issue and its exact location…"
            rows={4}
            style={{ width:"100%", fontFamily:"'Barlow Condensed'", fontSize:12, padding:"6px 10px", border:`1px solid ${T.border}`, borderRadius:3, background:T.panel, color:T.text, outline:"none", resize:"vertical" as const, boxSizing:"border-box" as const, lineHeight:1.5 }}
            onFocus={e => (e.currentTarget.style.borderColor = T.gold)}
            onBlur={e => (e.currentTarget.style.borderColor = T.border)}
          />
        </div>

        {/* Photo */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}` }}>
          <Label>Photo</Label>
          <div style={{ display:"flex", alignItems:"center", gap:12, flexWrap:"wrap" as const }}>
            <button onClick={() => fileRef.current?.click()}
              style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" as const, padding:"6px 16px", border:`1px solid ${T.borderHard}`, borderRadius:3, background:T.panel, color:T.textSub, cursor:"pointer" }}>
              + Add Photo
            </button>
            <span style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted }}>
              {photo ? photo.name : "No file selected"}
            </span>
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} style={{ display:"none" }}/>
          </div>
          {photoUrl && (
            <div style={{ marginTop:12, position:"relative", display:"inline-block" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoUrl} alt="Issue photo" style={{ maxWidth:220, maxHeight:140, borderRadius:3, border:`1px solid ${T.border}`, display:"block" }}/>
              <button onClick={() => { setPhoto(null); setPhotoUrl(null); if (fileRef.current) fileRef.current.value = ""; }}
                style={{ position:"absolute", top:4, right:4, width:20, height:20, borderRadius:"50%", background:"rgba(0,0,0,0.55)", border:"none", color:"#fff", cursor:"pointer", fontFamily:"'Share Tech Mono'", fontSize:11, display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 }}>
                ×
              </button>
            </div>
          )}
        </div>

        {/* Reported By */}
        <div style={{ padding:"20px 24px", borderBottom:`1px solid ${T.border}` }}>
          <Label>Reported By <span style={{ fontWeight:400, fontSize:8, letterSpacing:"0.1em" }}>(Optional)</span></Label>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10 }}>
            <Field mb={0}>
              <Input value={reporter} onChange={setReporter} placeholder="Full name"/>
            </Field>
            <Field mb={0}>
              <Input value={badge} onChange={setBadge} placeholder="Badge / Crew ID"/>
            </Field>
          </div>
        </div>

        {/* Submit */}
        <div style={{ padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12 }}>
          {!canSubmit && (
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.06em", flex:1 }}>
              {!station.trim() ? "Station required" : "Issue type required"}
            </div>
          )}
          {canSubmit && <div style={{ flex:1 }}/>}
          <button onClick={() => canSubmit && setSubmitted(true)} disabled={!canSubmit}
            style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase" as const, padding:"9px 28px", background: canSubmit ? T.gold : T.border, color: canSubmit ? "#fff" : T.textMuted, border:"none", borderRadius:3, cursor: canSubmit ? "pointer" : "not-allowed", whiteSpace:"nowrap" as const }}>
            Submit Report
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Intelligence view ─────────────────────────── */
function IntelligenceView() {
  const autoDisp = AI_DECISIONS.filter(d => d.status === "auto-dispatched").length;
  const pending  = AI_DECISIONS.filter(d => d.status === "pending").length;

  const catIcon = (c: AIPrediction["category"]) =>
    ({ cleaning:"CLN", maintenance:"MNT", staffing:"STF", security:"CAM" }[c]);

  const impactColor = (imp: AIPrediction["impact"]) =>
    ({ critical:"#D32F2F", high:"#F57C00", medium:"#1565C0" }[imp]);

  const sevColor = (s: AnomalyAlert["severity"]) =>
    ({ critical:"#D32F2F", high:"#E65100", medium:"#1565C0" }[s]);

  const statusStyles: Record<AIDecision["status"], { bg: string; color: string }> = {
    "auto-dispatched": { bg:"#E8F5E9", color:"#2E7D32" },
    "pending":          { bg:"#FFF3E0", color:"#E65100" },
    "acknowledged":     { bg:"#E3F2FD", color:"#1565C0" },
  };

  return (
    <div style={{ padding:"24px 28px", overflowY:"auto", flex:1, background:T.bg }}>

      {/* Page header */}
      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginBottom:3 }}>
          KAI Intelligence Engine · DART Rail Network
        </div>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ fontFamily:"'Share Tech Mono'", fontSize:22, color:T.text, lineHeight:1.15 }}>
            AI Prediction &amp; Decision Engine
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:5, fontFamily:"'Share Tech Mono'", fontSize:9, color:"#2E7D32", background:"#E8F5E9", padding:"3px 10px", borderRadius:2, letterSpacing:"0.06em" }}>
            <div className="live-dot" style={{ width:6, height:6, borderRadius:"50%", flexShrink:0 }}/>
            MODEL ACTIVE
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div className="kd-grid-5col" style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:24 }}>
        {[
          { label:"Model Accuracy",     val:"94.2%",               sub:"v2.1 · Trained on 18mo data",   color:T.gold    },
          { label:"Active Predictions", val:AI_PREDICTIONS.length, sub:"Next 4h · across all stations", color:"#1565C0" },
          { label:"Anomalies Detected", val:ANOMALIES.length,      sub:"In the last 60 minutes",        color:"#E65100" },
          { label:"Auto-Dispatched",    val:autoDisp,              sub:"Actions sent · 0 overrides",    color:"#2E7D32" },
          { label:"Pending Approval",   val:pending,               sub:"Awaiting supervisor review",    color:"#F57C00" },
        ].map(k => (
          <div key={k.label} className="dash-cell" style={{ background:T.panel, padding:"14px 18px", cursor:"default" }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:T.textMuted, marginBottom:5 }}>{k.label}</div>
            <div className="dash-cell-value" style={{ fontFamily:"'Share Tech Mono'", fontSize:28, color:k.color, lineHeight:1 }}>{String(k.val)}</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:4, letterSpacing:"0.04em" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Three-column main */}
      <div className="kd-grid-3col" style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:24, alignItems:"start" }}>

        {/* Column 1: Predictive Demand */}
        <div style={{ background:T.panel }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, background:"#F9FAFB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted }}>Predictive Demand · Next 4h</div>
            <div style={{ fontFamily:"'Share Tech Mono'", fontSize:8, color:T.gold }}>{AI_PREDICTIONS.length} ACTIVE</div>
          </div>
          {AI_PREDICTIONS.map(p => (
            <div key={p.id} style={{ padding:"10px 14px", borderBottom:`1px solid #F4F5F7`, transition:"background 0.12s", cursor:"default" }}
                 onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                 onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:6 }}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5, marginBottom:3 }}>
                    <span style={{ fontFamily:"'Share Tech Mono'", fontSize:8, fontWeight:700, color:T.textMuted, background:T.bg, border:`1px solid ${T.border}`, padding:"1px 4px", borderRadius:2, letterSpacing:"0.06em", flexShrink:0 }}>{catIcon(p.category)}</span>
                    <span style={{ fontFamily:"'Barlow Condensed'", fontSize:12, fontWeight:700, color:T.text }}>{p.station}</span>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:p.lineColor, flexShrink:0, display:"inline-block" }}/>
                  </div>
                  <div style={{ fontFamily:"'Barlow Condensed'", fontSize:11, color:T.textSub, letterSpacing:"0.02em" }}>{p.type}</div>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <div style={{ fontFamily:"'Share Tech Mono'", fontSize:11, color:impactColor(p.impact), fontWeight:700 }}>{p.horizon}</div>
                  <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, color:T.textMuted, marginTop:2 }}>{p.confidence}%</div>
                </div>
              </div>
              <div style={{ marginTop:5, height:2, background:T.border, borderRadius:1, overflow:"hidden" }}>
                <div style={{ height:2, width:`${p.confidence}%`, background:impactColor(p.impact), borderRadius:1 }}/>
              </div>
            </div>
          ))}
        </div>

        {/* Column 2: Anomaly Detection */}
        <div style={{ background:T.panel, borderLeft:`1px solid ${T.border}` }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, background:"#F9FAFB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted }}>Anomaly Detection · Live Feed</div>
            <div style={{ fontFamily:"'Share Tech Mono'", fontSize:8, color:"#E65100" }}>{ANOMALIES.length} FLAGGED</div>
          </div>
          {ANOMALIES.map(a => {
            const sc = sevColor(a.severity);
            return (
              <div key={a.id} style={{ padding:"12px 14px", borderBottom:`1px solid #F4F5F7`, transition:"background 0.12s", cursor:"default" }}
                   onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                   onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:5 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:a.lineColor, flexShrink:0, display:"inline-block" }}/>
                    <span style={{ fontFamily:"'Barlow Condensed'", fontSize:12, fontWeight:700, color:T.text }}>{a.station}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:6, flexShrink:0 }}>
                    <span style={{ fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.1em", padding:"2px 6px", borderRadius:2, background:`${sc}18`, color:sc, textTransform:"uppercase" }}>{a.severity}</span>
                    <span style={{ fontFamily:"'Share Tech Mono'", fontSize:9, color:T.textMuted }}>{a.confidence}%</span>
                  </div>
                </div>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:12, fontWeight:600, color:T.textSub, letterSpacing:"0.02em", marginBottom:4 }}>{a.type}</div>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, lineHeight:1.5 }}>{a.description}</div>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.08em", marginTop:5, textTransform:"uppercase" }}>Detected {a.detectedAt}</div>
              </div>
            );
          })}
          {/* Precision callout */}
          <div style={{ padding:"12px 14px", background:"#F9FAFB", borderTop:`1px solid ${T.border}` }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6 }}>Anomaly Detection Precision</div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ flex:1, height:3, background:T.border, borderRadius:1, overflow:"hidden" }}>
                <div style={{ height:3, width:"94.4%", background:T.gold, borderRadius:1 }}/>
              </div>
              <span style={{ fontFamily:"'Share Tech Mono'", fontSize:11, color:T.gold, fontWeight:700 }}>94.4%</span>
            </div>
          </div>
        </div>

        {/* Column 3: Decision Queue */}
        <div style={{ background:T.panel, borderLeft:`1px solid ${T.border}` }}>
          <div style={{ padding:"12px 16px", borderBottom:`1px solid ${T.border}`, background:"#F9FAFB", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted }}>Decision Queue</div>
            <div style={{ fontFamily:"'Share Tech Mono'", fontSize:8, color:"#2E7D32" }}>{autoDisp} AUTO-SENT</div>
          </div>
          {AI_DECISIONS.map(d => {
            const st = statusStyles[d.status];
            const pc = d.priority === "critical" ? "#D32F2F" : d.priority === "high" ? "#E65100" : "#2E7D32";
            return (
              <div key={d.id} style={{ padding:"10px 14px", borderBottom:`1px solid #F4F5F7`, borderLeft:`3px solid ${pc}`, transition:"background 0.12s", cursor:"default" }}
                   onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
                   onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", gap:4, marginBottom:4 }}>
                  <div style={{ display:"flex", alignItems:"center", gap:5 }}>
                    <span style={{ width:6, height:6, borderRadius:"50%", background:d.lineColor, flexShrink:0, display:"inline-block" }}/>
                    <span style={{ fontFamily:"'Barlow Condensed'", fontSize:12, fontWeight:700, color:T.text }}>{d.station}</span>
                  </div>
                  <span style={{ fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, padding:"2px 6px", borderRadius:2, background:st.bg, color:st.color, whiteSpace:"nowrap", letterSpacing:"0.06em", flexShrink:0 }}>{d.status}</span>
                </div>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:11, color:T.textSub, lineHeight:1.4, marginBottom:5 }}>{d.action}</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted }}>
                    {d.assignedTo !== "Unassigned" ? `→ ${d.assignedTo} · ${d.role}` : "Awaiting assignment"}
                  </div>
                  <span style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted }}>{d.generatedAt}</span>
                </div>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, marginTop:3, letterSpacing:"0.02em" }}>{d.reason}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Model Performance */}
      <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>
        MODEL PERFORMANCE · v2.1
      </div>
      <div className="kd-grid-6col" style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}` }}>
        {[
          { label:"Overall Accuracy",     val:"94.2%", sub:"All prediction types",  color:T.gold    },
          { label:"Cleaning Demand",       val:"96.1%", sub:"Precision / recall",    color:"#2E7D32" },
          { label:"Maintenance Failure",   val:"91.8%", sub:"72h forecast window",   color:"#2E7D32" },
          { label:"Staffing Optimization", val:"93.7%", sub:"Demand-based routing",  color:"#2E7D32" },
          { label:"False Positive Rate",   val:"4.2%",  sub:"Below 5% target",       color:"#1565C0" },
          { label:"Alert-to-Action",       val:"<30s",  sub:"Avg dispatch latency",  color:T.gold    },
        ].map(k => (
          <div key={k.label} style={{ background:T.panel, padding:"12px 16px" }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", color:T.textMuted, marginBottom:4 }}>{k.label}</div>
            <div style={{ fontFamily:"'Share Tech Mono'", fontSize:22, color:k.color, lineHeight:1 }}>{k.val}</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, marginTop:3 }}>{k.sub}</div>
          </div>
        ))}
      </div>

    </div>
  );
}

/* ─── Nav drawer ─────────────────────────────────── */
function NavDrawer({ open, onClose, view, setView }: {
  open: boolean; onClose: () => void; view: View; setView: (v: View) => void;
}) {
  const assetKeys: AssetKey[] = ["elevators","cameras","stairwells","trash_cans","bus_covers"];

  const downCounts = assetKeys.reduce((acc, key) => {
    const okKey = `${key}_ok` as keyof AssetEntry;
    let down = 0;
    ALL_STATIONS.forEach(s => { const a = ASSETS[s.id]; if (!a) return; down += (a[key] - (a[okKey] as number)); });
    acc[key] = down; return acc;
  }, {} as Record<AssetKey, number>);

  const ASSET_ICONS: Record<AssetKey, React.ReactNode> = {
    elevators:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="1.5" width="10" height="11" rx="1"/><line x1="7" y1="1.5" x2="7" y2="12.5"/><polyline points="4.5,5 7,2.5 9.5,5"/><polyline points="4.5,9 7,11.5 9.5,9"/></svg>,
    cameras:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="9" height="6" rx="1"/><polyline points="10,6.5 13,5 13,9 10,7.5"/></svg>,
    stairwells: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1.5,12.5 1.5,9.5 4.5,9.5 4.5,6.5 7.5,6.5 7.5,3.5 10.5,3.5 10.5,1.5 12.5,1.5"/><line x1="1.5" y1="12.5" x2="12.5" y2="12.5"/></svg>,
    trash_cans: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,4 12,4"/><path d="M4.5 4V2.5h5V4"/><path d="M3 4l.8 8.5h6.4L11 4"/><line x1="5.5" y1="6.5" x2="5.5" y2="10.5"/><line x1="8.5" y1="6.5" x2="8.5" y2="10.5"/></svg>,
    bus_covers: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="3.5" x2="13" y2="3.5"/><rect x="3" y="3.5" width="8" height="6" rx="0.75"/><line x1="4.5" y1="9.5" x2="4.5" y2="12"/><line x1="9.5" y1="9.5" x2="9.5" y2="12"/></svg>,
  };

  const navRow = (label: string, desc: string, v: View, icon: React.ReactNode) => {
    const active = view === v;
    return (
      <div key={label} onClick={() => { setView(v); onClose(); }}
           style={{ padding:"9px 14px", margin:"2px 8px", cursor:"pointer",
             border:`1px solid ${active ? T.gold : "transparent"}`,
             borderRadius:3,
             background: active ? "#FFFDE7" : "transparent",
             display:"flex", alignItems:"center", gap:10, transition:"background 0.12s" }}
           onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F9FAFB"; }}
           onMouseLeave={e => { e.currentTarget.style.background = active ? "#FFFDE7" : "transparent"; }}>
        <span style={{ width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", background: active ? "rgba(201,168,76,0.15)" : "#EDEEF0", borderRadius:4, flexShrink:0, color: active ? T.gold : T.textMuted }}>
          {icon}
        </span>
        <div>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:14, fontWeight:700, letterSpacing:"0.04em", color:T.text }}>{label}</div>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:1 }}>{desc}</div>
        </div>
      </div>
    );
  };

  return (
    <>
      {open && <div onClick={onClose} style={{ position:"absolute", inset:0, background:"rgba(0,0,0,0.15)", zIndex:100 }}/>}
      <div style={{
        position:"absolute", top:0, left:0, bottom:0, width:280, zIndex:101,
        background:T.panel, borderRight:`1px solid ${T.border}`,
        boxShadow:"4px 0 24px rgba(0,0,0,0.12)", display:"flex", flexDirection:"column",
        transform: open ? "translateX(0)" : "translateX(-110%)",
        transition:"transform 0.22s cubic-bezier(0.4,0,0.2,1)",
      }}>

        {/* Drawer header */}
        <div style={{ padding:"14px 18px", borderBottom:`2px solid ${T.gold}`, display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontWeight:900, fontSize:20, letterSpacing:"0.15em", color:T.text }}>KAI</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:8, letterSpacing:"0.3em", color:T.gold, textTransform:"uppercase", marginTop:1 }}>DART STATION READINESS</div>
          </div>
          <button onClick={onClose} style={{ width:26, height:26, border:`1px solid ${T.border}`, borderRadius:4, background:"transparent", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontSize:13, color:T.textMuted }}>✕</button>
        </div>

        {/* Nav items */}
        <div className="kd-scroll" style={{ flex:1, overflowY:"auto" }}>
          <div style={{ padding:"10px 18px 4px", fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted }}>Command</div>
          {navRow("Command Center","Network overview & spark charts","command",<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="1" width="5" height="5" rx="0.75"/><rect x="8" y="1" width="5" height="5" rx="0.75"/><rect x="1" y="8" width="5" height="5" rx="0.75"/><rect x="8" y="8" width="5" height="5" rx="0.75"/></svg>)}

          <div style={{ padding:"10px 18px 4px", fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginTop:4 }}>Station Operations</div>
          {navRow("Stations","All lines · select to inspect","stations",<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 1.5C5.07 1.5 3.5 3.07 3.5 5c0 2.8 3.5 7 3.5 7s3.5-4.2 3.5-7c0-1.93-1.57-3.5-3.5-3.5z"/><circle cx="7" cy="5" r="1.25"/></svg>)}

          <div style={{ padding:"10px 18px 4px", fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginTop:4 }}>Asset Dashboards</div>
          {assetKeys.map(key => {
            const assetView = `asset_${key}` as View;
            const active = view === assetView;
            const down = downCounts[key];
            return (
              <div key={key} onClick={() => { setView(assetView); onClose(); }}
                   style={{ padding:"9px 14px", margin:"2px 8px", cursor:"pointer",
                     border:`1px solid ${active ? T.gold : "transparent"}`,
                     borderRadius:3,
                     background: active ? "#FFFDE7" : "transparent",
                     display:"flex", alignItems:"center", justifyContent:"space-between", transition:"background 0.12s" }}
                   onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F9FAFB"; }}
                   onMouseLeave={e => { e.currentTarget.style.background = active ? "#FFFDE7" : "transparent"; }}>
                <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                  <span style={{ width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", background: active ? "rgba(201,168,76,0.15)" : "#EDEEF0", borderRadius:4, flexShrink:0, color: active ? T.gold : T.textMuted }}>
                    {ASSET_ICONS[key]}
                  </span>
                  <div>
                    <div style={{ fontFamily:"'Barlow Condensed'", fontSize:14, fontWeight:700, color:T.text }}>{ASSET_META[key].label}</div>
                    <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:1 }}>{ASSET_META[key].desc}</div>
                  </div>
                </div>
                {down > 0 && (
                  <span style={{ fontFamily:"'Share Tech Mono'", fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:2, background:"#DC2626", color:"#FFFFFF", whiteSpace:"nowrap", flexShrink:0 }}>{down} DOWN</span>
                )}
              </div>
            );
          })}

          <div style={{ padding:"10px 18px 4px", fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginTop:4 }}>Field Operations</div>
          {navRow("Inspection","48-item crew checklist · photo upload","inspect",<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="1.5" width="10" height="11" rx="1"/><line x1="5" y1="5.5" x2="9" y2="5.5"/><line x1="5" y1="8" x2="9" y2="8"/><line x1="5" y1="10.5" x2="7" y2="10.5"/></svg>)}
          {navRow("Report Issue","Safety · vandalism · equipment · cleaning","report",<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 1.5L1 12.5h12L7 1.5z"/><line x1="7" y1="6" x2="7" y2="9"/><circle cx="7" cy="11" r="0.6" fill="currentColor" stroke="none"/></svg>)}

          <div style={{ padding:"10px 18px 4px", fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginTop:4 }}>AI Intelligence</div>
          {navRow("Intelligence Engine","Predictions · anomalies · decisions","intelligence",<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2L8.5 5 12 5.5 9.5 8 10 11.5 7 10 4 11.5 4.5 8 2 5.5 5.5 5z"/></svg>)}
        </div>

        {/* Drawer footer */}
        <div style={{ padding:"10px 16px", borderTop:`1px solid ${T.border}`, flexShrink:0 }}>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:8, letterSpacing:"0.15em", color:T.textMuted, textTransform:"uppercase" }}>KAI Facilities Management · DART Network</div>
          <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, color:T.textMuted, marginTop:2 }}>{new Date().toLocaleTimeString()}</div>
        </div>
      </div>
    </>
  );
}

/* ─── Permanent sidebar ──────────────────────────── */
function PermanentSidebar({ view, setView, collapsed, onToggle }: { view: View; setView: (v: View) => void; collapsed: boolean; onToggle: () => void }) {
  const assetKeys: AssetKey[] = ["elevators","cameras","stairwells","trash_cans","bus_covers"];

  const downCounts = assetKeys.reduce((acc, key) => {
    const okKey = `${key}_ok` as keyof AssetEntry;
    let down = 0;
    ALL_STATIONS.forEach(s => { const a = ASSETS[s.id]; if (!a) return; down += (a[key] - (a[okKey] as number)); });
    acc[key] = down; return acc;
  }, {} as Record<AssetKey, number>);

  const ASSET_ICONS: Record<AssetKey, React.ReactNode> = {
    elevators:  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="1.5" width="10" height="11" rx="1"/><line x1="7" y1="1.5" x2="7" y2="12.5"/><polyline points="4.5,5 7,2.5 9.5,5"/><polyline points="4.5,9 7,11.5 9.5,9"/></svg>,
    cameras:    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="4" width="9" height="6" rx="1"/><polyline points="10,6.5 13,5 13,9 10,7.5"/></svg>,
    stairwells: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="1.5,12.5 1.5,9.5 4.5,9.5 4.5,6.5 7.5,6.5 7.5,3.5 10.5,3.5 10.5,1.5 12.5,1.5"/><line x1="1.5" y1="12.5" x2="12.5" y2="12.5"/></svg>,
    trash_cans: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="2,4 12,4"/><path d="M4.5 4V2.5h5V4"/><path d="M3 4l.8 8.5h6.4L11 4"/><line x1="5.5" y1="6.5" x2="5.5" y2="10.5"/><line x1="8.5" y1="6.5" x2="8.5" y2="10.5"/></svg>,
    bus_covers: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="1" y1="3.5" x2="13" y2="3.5"/><rect x="3" y="3.5" width="8" height="6" rx="0.75"/><line x1="4.5" y1="9.5" x2="4.5" y2="12"/><line x1="9.5" y1="9.5" x2="9.5" y2="12"/></svg>,
  };

  const navRow = (label: string, desc: string, v: View, icon: React.ReactNode) => {
    const active = view === v;
    return (
      <div key={label} onClick={() => setView(v)} title={collapsed ? label : undefined}
           style={{ padding: collapsed ? "9px 0" : "9px 14px", margin:"2px 8px", cursor:"pointer",
             border:`1px solid ${active ? T.gold : "transparent"}`,
             borderRadius:3,
             background: active ? "#FFFDE7" : "transparent",
             display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "flex-start", gap:10, transition:"background 0.12s" }}
           onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F9FAFB"; }}
           onMouseLeave={e => { e.currentTarget.style.background = active ? "#FFFDE7" : "transparent"; }}>
        <span style={{ width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", background: active ? "rgba(201,168,76,0.15)" : "#EDEEF0", borderRadius:4, flexShrink:0, color: active ? T.gold : T.textMuted }}>
          {icon}
        </span>
        {!collapsed && (
          <div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:14, fontWeight:700, letterSpacing:"0.04em", color:T.text }}>{label}</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:1 }}>{desc}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="kd-permanent-sidebar" style={{ width: collapsed ? 52 : 260, flexShrink:0, background:T.panel, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", boxShadow:"1px 0 4px rgba(0,0,0,0.04)", transition:"width 0.25s cubic-bezier(0.4,0,0.2,1)", overflow:"hidden" }}>
      {/* Sidebar header */}
      <div style={{ padding: collapsed ? "14px 8px" : "14px 18px", borderBottom:`2px solid ${T.gold}`, flexShrink:0, display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "flex-start" }}>
        {collapsed
          ? <svg width="22" height="22" viewBox="0 0 100 100" fill="none" style={{ opacity:.85 }}><ellipse cx="50" cy="62" rx="22" ry="14" fill={T.gold}/><circle cx="50" cy="38" r="14" fill={T.gold}/></svg>
          : <div>
              <div style={{ fontFamily:"'Barlow Condensed'", fontWeight:900, fontSize:20, letterSpacing:"0.15em", color:T.text }}>KAI</div>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:8, letterSpacing:"0.3em", color:T.gold, textTransform:"uppercase", marginTop:1 }}>DART STATION READINESS</div>
            </div>
        }
      </div>

      {/* Nav items */}
      <div className="kd-scroll" style={{ flex:1, overflowY:"auto" }}>
        {!collapsed && <div style={{ padding:"10px 18px 4px", fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted }}>Command</div>}
        {navRow("Command Center","Network overview & spark charts","command",<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="1" width="5" height="5" rx="0.75"/><rect x="8" y="1" width="5" height="5" rx="0.75"/><rect x="1" y="8" width="5" height="5" rx="0.75"/><rect x="8" y="8" width="5" height="5" rx="0.75"/></svg>)}

        {!collapsed && <div style={{ padding:"10px 18px 4px", fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginTop:4 }}>Station Operations</div>}
        {navRow("Stations","All lines · select to inspect","stations",<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 1.5C5.07 1.5 3.5 3.07 3.5 5c0 2.8 3.5 7 3.5 7s3.5-4.2 3.5-7c0-1.93-1.57-3.5-3.5-3.5z"/><circle cx="7" cy="5" r="1.25"/></svg>)}

        {!collapsed && <div style={{ padding:"10px 18px 4px", fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginTop:4 }}>Asset Dashboards</div>}
        {assetKeys.map(key => {
          const assetView = `asset_${key}` as View;
          const active = view === assetView;
          const down = downCounts[key];
          return (
            <div key={key} onClick={() => setView(assetView)} title={collapsed ? ASSET_META[key].label : undefined}
                 style={{ padding: collapsed ? "9px 0" : "9px 14px", margin:"2px 8px", cursor:"pointer",
                   border:`1px solid ${active ? T.gold : "transparent"}`,
                   borderRadius:3,
                   background: active ? "#FFFDE7" : "transparent",
                   display:"flex", alignItems:"center", justifyContent: collapsed ? "center" : "space-between", transition:"background 0.12s", position:"relative" }}
                 onMouseEnter={e => { if (!active) e.currentTarget.style.background = "#F9FAFB"; }}
                 onMouseLeave={e => { e.currentTarget.style.background = active ? "#FFFDE7" : "transparent"; }}>
              <div style={{ display:"flex", gap:10, alignItems:"center" }}>
                <span style={{ width:26, height:26, display:"flex", alignItems:"center", justifyContent:"center", background: active ? "rgba(201,168,76,0.15)" : "#EDEEF0", borderRadius:4, flexShrink:0, color: active ? T.gold : T.textMuted, position:"relative" }}>
                  {ASSET_ICONS[key]}
                  {collapsed && down > 0 && <span style={{ position:"absolute", top:-3, right:-3, width:7, height:7, borderRadius:"50%", background:"#DC2626", border:"1px solid white" }}/>}
                </span>
                {!collapsed && (
                  <div>
                    <div style={{ fontFamily:"'Barlow Condensed'", fontSize:14, fontWeight:700, color:T.text }}>{ASSET_META[key].label}</div>
                    <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:1 }}>{ASSET_META[key].desc}</div>
                  </div>
                )}
              </div>
              {!collapsed && down > 0 && (
                <span style={{ fontFamily:"'Share Tech Mono'", fontSize:9, fontWeight:700, padding:"2px 6px", borderRadius:2, background:"#DC2626", color:"#FFFFFF", whiteSpace:"nowrap", flexShrink:0 }}>{down} DOWN</span>
              )}
            </div>
          );
        })}

        {!collapsed && <div style={{ padding:"10px 18px 4px", fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginTop:4 }}>Field Operations</div>}
        {navRow("Inspection","48-item crew checklist · photo upload","inspect",<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="1.5" width="10" height="11" rx="1"/><line x1="5" y1="5.5" x2="9" y2="5.5"/><line x1="5" y1="8" x2="9" y2="8"/><line x1="5" y1="10.5" x2="7" y2="10.5"/></svg>)}
        {navRow("Report Issue","Safety · vandalism · equipment · cleaning","report",<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 1.5L1 12.5h12L7 1.5z"/><line x1="7" y1="6" x2="7" y2="9"/><circle cx="7" cy="11" r="0.6" fill="currentColor" stroke="none"/></svg>)}

        {!collapsed && <div style={{ padding:"10px 18px 4px", fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginTop:4 }}>AI Intelligence</div>}
        {navRow("Intelligence Engine","Predictions · anomalies · decisions","intelligence",<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2L8.5 5 12 5.5 9.5 8 10 11.5 7 10 4 11.5 4.5 8 2 5.5 5.5 5z"/></svg>)}
      </div>

      {/* Sidebar footer */}
      {!collapsed && (
        <div style={{ padding:"10px 16px", borderTop:`1px solid ${T.border}`, flexShrink:0 }}>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:8, letterSpacing:"0.15em", color:T.textMuted, textTransform:"uppercase" }}>KAI Facilities Management · DART Network</div>
          <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, color:T.textMuted, marginTop:2 }}>{new Date().toLocaleTimeString()}</div>
        </div>
      )}
    </div>
  );
}

/* ─── Root ───────────────────────────────────────── */
export default function DashboardDemo({ initialView }: { initialView?: string } = {}) {
  const [view,        setView]      = useState<View>((initialView as View) ?? "command");

  useEffect(() => {
    if (initialView) setView(initialView as View);
  }, [initialView]);
  const [lineId,      setLineId]    = useState("red");
  const [stationId,   setStationId] = useState<string>("cityplace-up");
  const [preReportStation, setPreReportStation] = useState("");
  const [time,        setTime]      = useState("");
  const [drawerOpen,       setDrawerOpen]      = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12:false, hour:"2-digit", minute:"2-digit", second:"2-digit" }));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const check = () => { if (window.innerWidth < 960) setSidebarCollapsed(true); };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const drill = useCallback((id: string) => {
    setLineId(id);
    const list = LINES[id].stations;
    setStationId((list.find(s => s.status === "critical") ?? list[0]).id);
    setView("stations");
  }, []);

  let crit = 0, warn = 0;
  ALL_STATIONS.forEach(s => { if (s.status === "critical") crit++; else if (s.status === "warning") warn++; });

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow+Condensed:wght@300;400;600;700;900&family=Barlow:wght@300;400;500&display=swap');
        :root { --kai-gold: #C9A84C; --kai-gold-light: #F0D98A; }
        .kd-scroll::-webkit-scrollbar { width: 3px; }
        .kd-scroll::-webkit-scrollbar-track { background: transparent; }
        .kd-scroll::-webkit-scrollbar-thumb { background: #C4C8CF; border-radius: 2px; }
        @keyframes kdlive { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:0.4;transform:scale(0.7);} }

        /* NAV DRAWER BUTTON */
        .nav-hamburger {
          display: flex; flex-direction: column; justify-content: center; gap: 5px;
          width: 36px; height: 36px; padding: 6px;
          background: none; border: none; cursor: pointer; border-radius: 4px;
          transition: background 0.15s; flex-shrink: 0;
        }
        .nav-hamburger:hover { background: rgba(0,0,0,0.05); }
        .nav-hamburger span { display:block; height:2px; background:#374151; border-radius:1px; transition:transform 0.25s ease, opacity 0.2s ease, width 0.2s ease; transform-origin:left center; width:100%; }
        .nav-hamburger span:nth-child(2) { width: 70%; }
        .nav-hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(1px,-1px); }
        .nav-hamburger.open span:nth-child(2) { opacity:0; transform:scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(1px,1px); }

        /* OVERLAY */
        .nav-overlay { position:fixed; inset:0; background:rgba(0,0,0,0.25); z-index:200; opacity:0; pointer-events:none; transition:opacity 0.3s ease; backdrop-filter:blur(1px); }
        .nav-overlay.open { opacity:1; pointer-events:all; }

        /* DRAWER */
        .nav-drawer {
          position: fixed; top:0; left:0; width:280px; height:100vh;
          background: #FFFFFF; z-index:300;
          transform: translateX(-100%);
          transition: transform 0.32s cubic-bezier(0.4,0,0.2,1);
          display: flex; flex-direction:column;
          border-right: 1px solid #E8EAED;
          overflow: hidden;
          box-shadow: none;
        }
        .nav-drawer.open { transform:translateX(0); box-shadow:6px 0 40px rgba(0,0,0,0.55); }
        .nav-drawer::before {
          content:''; position:absolute; inset:0; pointer-events:none;
          background: none; opacity: 0.8;
        }

        .drawer-header {
          padding: 18px 20px 14px;
          border-bottom: 1px solid #E8EAED;
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0; position: relative; z-index:1;
        }
        .drawer-brand-name { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:20px; letter-spacing:0.15em; color:#111827; line-height:1; }
        .drawer-brand-sub  { font-family:'Barlow Condensed',sans-serif; font-weight:600; font-size:9px; letter-spacing:0.28em; color:var(--kai-gold); text-transform:uppercase; margin-top:3px; }
        .drawer-close {
          width:28px; height:28px; background:#F4F5F7; border:1px solid #E8EAED;
          border-radius:4px; display:flex; align-items:center; justify-content:center; cursor:pointer;
          transition:background 0.15s; color:#6B7280; font-family:'Share Tech Mono',monospace; font-size:13px; font-weight:400;
        }
        .drawer-close:hover { background:#E8EAED; color:#111827; }

        .drawer-section-label {
          font-family:'Barlow Condensed',sans-serif; font-size:9px; font-weight:600;
          letter-spacing:0.3em; text-transform:uppercase; color:#9CA3AF;
          padding: 14px 20px 5px; position:relative; z-index:1;
        }

        .drawer-nav { flex:1; overflow-y:auto; padding:4px 0 16px; position:relative; z-index:1; }
        .drawer-nav::-webkit-scrollbar { width:3px; }
        .drawer-nav::-webkit-scrollbar-thumb { background:#D1D5DB; border-radius:2px; }

        .drawer-item {
          display:flex; align-items:center; gap:14px;
          padding:10px 20px; cursor:pointer; background:none; border:none; width:100%;
          text-align:left; position:relative; transition:background 0.15s ease;
          border-left:2px solid transparent;
        }
        .drawer-item:hover { background:#F4F5F7; }
        .drawer-item.active { background:#FFF8E8; border-left-color:var(--kai-gold); }
        .drawer-item.active .drawer-item-label { color:#111827; font-weight:700; }
        .drawer-item.active .drawer-item-icon { opacity:1; filter:none; }
        .drawer-item.active .drawer-active-bar { opacity:1; }

        .drawer-active-bar {
          position:absolute; left:0; top:0; bottom:0; width:2px;
          background: linear-gradient(to bottom, var(--kai-gold-light), var(--kai-gold));
          opacity:0; transition:opacity 0.15s;
        }

        .drawer-item-icon { width:18px; height:18px; flex-shrink:0; opacity:0.45; transition:opacity 0.15s; filter:invert(1) brightness(0); }
        .drawer-item:hover .drawer-item-icon { opacity:0.8; filter:invert(1) brightness(0); }

        .drawer-item-text { flex:1; }
        .drawer-item-label {
          font-family:'Barlow Condensed',sans-serif; font-size:13px; font-weight:600;
          letter-spacing:0.08em; color:#111827; display:block; line-height:1.2;
          transition:color 0.15s;
        }
        .drawer-item:hover .drawer-item-label { color:#111827; }
        .drawer-item-desc { font-family:'Barlow',sans-serif; font-size:10px; color:#9CA3AF; display:block; margin-top:1px; }

        .drawer-item-badge {
          font-family:'Share Tech Mono',monospace; font-size:9px; font-weight:700;
          padding:2px 6px; border-radius:2px; letter-spacing:0.05em; flex-shrink:0;
        }

        .drawer-divider { height:1px; background:#F3F4F6; margin:6px 20px; }

        .drawer-footer {
          padding:12px 20px; border-top:1px solid rgba(201,168,76,0.12);
          flex-shrink:0; position:relative; z-index:1;
        }
        .drawer-footer-text { font-family:'Share Tech Mono',monospace; font-size:9px; color:#9CA3AF; letter-spacing:0.1em; }
        .drawer-footer-gold { color:var(--kai-gold); }

        /* Staggered entrance */
        .nav-drawer.open .drawer-item { animation:drawerItemIn 0.28s cubic-bezier(0.4,0,0.2,1) both; }
        .nav-drawer.open .drawer-item:nth-child(1)  { animation-delay:0.04s; }
        .nav-drawer.open .drawer-item:nth-child(2)  { animation-delay:0.07s; }
        .nav-drawer.open .drawer-item:nth-child(3)  { animation-delay:0.10s; }
        .nav-drawer.open .drawer-item:nth-child(4)  { animation-delay:0.13s; }
        .nav-drawer.open .drawer-item:nth-child(5)  { animation-delay:0.16s; }
        .nav-drawer.open .drawer-item:nth-child(6)  { animation-delay:0.19s; }
        .nav-drawer.open .drawer-item:nth-child(7)  { animation-delay:0.22s; }
        .nav-drawer.open .drawer-item:nth-child(8)  { animation-delay:0.25s; }
        .nav-drawer.open .drawer-item:nth-child(9)  { animation-delay:0.28s; }
        @keyframes drawerItemIn { from{opacity:0;transform:translateX(-12px)} to{opacity:1;transform:translateX(0)} }

        /* ── MICRO-INTERACTIONS ─────────────────────────────────────────────────── */

        /* Nav tab underline slide */
        .nav-tab { position:relative; overflow:hidden; }
        .nav-tab::after { content:''; position:absolute; bottom:0; left:50%; right:50%; height:2px; background:var(--kai-gold); transition:left 0.25s cubic-bezier(0.4,0,0.2,1), right 0.25s cubic-bezier(0.4,0,0.2,1); }
        .nav-tab.active::after { left:0; right:0; }
        .nav-tab::before { content:''; position:absolute; inset:0; background:rgba(201,168,76,0.07); transform:scaleX(0); transform-origin:center; transition:transform 0.2s ease; }
        .nav-tab:hover::before { transform:scaleX(1); }

        /* Line button active slide */
        .line-btn { transition:background 0.18s ease, border-left-color 0.2s ease, padding-left 0.18s ease; }
        .line-btn:hover { padding-left:23px !important; }
        .line-btn.active { padding-left:23px !important; border-left-color:var(--active-line-color, var(--kai-gold)) !important; }

        /* Station card translate */
        .station-card { transition:box-shadow 0.18s ease, border-color 0.18s ease, transform 0.15s ease; }
        .station-row:hover .station-card { transform:translateX(2px); }
        .station-row.selected .station-card { transform:translateX(3px); }

        /* Station node: critical pulse ring */
        .station-node.critical { animation:nodePulse 2s ease-in-out infinite; }
        @keyframes nodePulse { 0%,100% { box-shadow:0 0 0 0 rgba(211,47,47,0.45); } 60% { box-shadow:0 0 0 6px rgba(211,47,47,0); } }
        .station-node { transition:transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease; }
        .station-row.selected .station-node { box-shadow:0 0 0 3px rgba(201,168,76,0.35); }

        /* Score bar entrance */
        .score-fill { animation:scoreReveal 0.55s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes scoreReveal { from { width:0 !important; } }
        .score-fill.critical-fill { background:linear-gradient(90deg,#D32F2F 0%,#EF5350 50%,#D32F2F 100%) !important; background-size:200% 100% !important; animation:scoreReveal 0.55s cubic-bezier(0.4,0,0.2,1) both, shimmer 2.5s linear 0.6s infinite; }
        @keyframes shimmer { from { background-position:200% 0; } to { background-position:-200% 0; } }

        /* Summary stat hover lift */
        .summary-stat { border-radius:4px; padding:4px 8px; margin:-4px -8px; transition:background 0.15s ease, transform 0.15s ease; cursor:pointer; }
        .summary-stat:hover { background:rgba(0,0,0,0.04); transform:translateY(-1px); }
        .summary-stat:active { transform:translateY(0); }
        .summary-num { transition:color 0.3s ease; }
        .summary-num.flash { animation:numFlash 0.35s ease; }
        @keyframes numFlash { 0% { opacity:1; transform:scale(1); } 40% { opacity:0.3; transform:scale(0.82); } 100% { opacity:1; transform:scale(1); } }

        /* Deploy button ripple */
        .deploy-btn { position:relative; overflow:hidden; }
        .deploy-btn::after { content:''; position:absolute; top:50%; left:50%; width:0; height:0; background:rgba(255,255,255,0.22); border-radius:50%; transform:translate(-50%,-50%); opacity:0; }
        .deploy-btn.ripple::after { width:320px; height:320px; opacity:0; transition:width 0.5s ease, height 0.5s ease, opacity 0.5s ease; }
        .deploy-btn.deployed { animation:deployPulse 0.4s ease, deployGlow 1.2s ease 0.4s forwards; }
        @keyframes deployGlow { from { box-shadow:0 0 0 0 rgba(21,101,192,0.5); } to { box-shadow:0 0 0 8px rgba(21,101,192,0); } }

        /* Detail panel staggered slide-in */
        .fade-in { animation:panelSlideIn 0.28s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes panelSlideIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        .fade-in:nth-child(2) { animation-delay:0.05s; }
        .fade-in:nth-child(3) { animation-delay:0.10s; }
        .fade-in:nth-child(4) { animation-delay:0.15s; }
        .fade-in:nth-child(5) { animation-delay:0.20s; }

        /* Asset row stagger slide */
        .asset-row { transition:background 0.12s ease; animation:assetRowIn 0.25s ease both; }
        @keyframes assetRowIn { from { opacity:0; transform:translateX(-6px); } to { opacity:1; transform:translateX(0); } }
        .asset-row:nth-child(1) { animation-delay:0.04s; }
        .asset-row:nth-child(2) { animation-delay:0.08s; }
        .asset-row:nth-child(3) { animation-delay:0.12s; }
        .asset-row:nth-child(4) { animation-delay:0.16s; }
        .asset-row:nth-child(5) { animation-delay:0.20s; }
        .asset-row:hover { background:#F9FAFB; }

        /* Score big number pop */
        .score-big-num { animation:scoreNumIn 0.4s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes scoreNumIn { from { transform:scale(0.6); opacity:0; } to { transform:scale(1); opacity:1; } }

        /* Status chip bounce in */
        .status-chip { animation:chipIn 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes chipIn { from { transform:scale(0.7); opacity:0; } to { transform:scale(1); opacity:1; } }

        /* Dashboard KPI entrance */
        .dash-cell-value { animation:kpiIn 0.4s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes kpiIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

        /* Dash cell hover */
        .dash-cell { transition:background 0.15s ease, box-shadow 0.15s ease; }
        .dash-cell:hover { background:#F9FAFB; box-shadow:inset 0 0 0 1px #C4C8CF; }

        /* Tufte table row hover */
        .tufte-table tbody tr { transition:background 0.12s ease; }
        .tufte-table tbody tr:hover td { background:#F2EFE9; }

        /* Inspection table row hover + flash */
        .insp-table tbody tr { transition:background 0.12s ease; }
        .insp-table tbody tr:hover td { background:#F9FAFB; }
        .insp-table tbody tr.just-passed { animation:rowPass 0.55s ease; }
        @keyframes rowPass { 0% { background:transparent; } 35% { background:rgba(46,125,50,0.09); } 100% { background:transparent; } }
        .insp-table tbody tr.just-failed { animation:rowFail 0.55s ease; }
        @keyframes rowFail { 0% { background:transparent; } 35% { background:rgba(211,47,47,0.09); } 100% { background:transparent; } }

        /* Inspection radio button micro-bounce */
        .insp-radio-btn { transition:background 0.12s ease, color 0.12s ease, border-color 0.12s ease, transform 0.12s ease; }
        .insp-radio-btn:hover { transform:translateY(-1px); }
        .insp-radio-btn:active { transform:scale(0.93); }
        .insp-radio-btn.pass,.insp-radio-btn.fail,.insp-radio-btn.na { animation:btnSelect 0.22s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes btnSelect { from { transform:scale(0.85); } to { transform:scale(1); } }

        /* Section score tick */
        .insp-section-score.updated { animation:sectionTick 0.35s cubic-bezier(0.34,1.56,0.64,1); }
        @keyframes sectionTick { from { transform:scale(0.75); opacity:0.3; } to { transform:scale(1); opacity:1; } }

        /* Thumb pop */
        .insp-thumb-wrap { animation:thumbPop 0.25s cubic-bezier(0.34,1.56,0.64,1) both; }
        @keyframes thumbPop { from { transform:scale(0); opacity:0; } to { transform:scale(1); opacity:1; } }

        /* Upload zone */
        .insp-upload-zone { transition:border-color 0.15s ease, background 0.15s ease, transform 0.12s ease; }
        .insp-upload-zone:hover { transform:scale(1.015); }
        .insp-upload-zone:active { transform:scale(0.98); }

        /* Buttons lift */
        .btn-sm { transition:background 0.15s ease, border-color 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease; }
        .btn-sm:hover { transform:translateY(-1px); box-shadow:0 2px 6px rgba(0,0,0,0.12); }
        .btn-sm:active { transform:translateY(0); box-shadow:none; }

        /* Submit button lift */
        .insp-submit-btn { transition:background 0.2s ease, color 0.2s ease, transform 0.12s ease, box-shadow 0.2s ease; }
        .insp-submit-btn:not(:disabled):hover { transform:translateY(-2px); box-shadow:0 4px 16px rgba(0,0,0,0.2); }
        .insp-submit-btn:not(:disabled):active { transform:translateY(0); box-shadow:none; }

        /* Deploy all flash */
        .btn-deploy.deploying-all { animation:deployAllFlash 0.4s ease 3; }
        @keyframes deployAllFlash { 0%,100% { background:#1C1A16; } 50% { background:#1565C0; } }

        /* Enhanced live dot */
        .live-dot { animation:livePulse 2s ease-in-out infinite; background:#22C55E !important; }
        @keyframes livePulse { 0%,100% { transform:scale(1); box-shadow:0 0 0 0 rgba(76,175,80,0.6); } 60% { transform:scale(0.85); box-shadow:0 0 0 5px rgba(76,175,80,0); } }

        /* Asset dashboard scan-line entrance */
        .asset-dashboard { animation:dashEnter 0.3s cubic-bezier(0.4,0,0.2,1) both; }
        @keyframes dashEnter { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

        /* Inspection progress bar smooth */
        .insp-progress-fill { transition:width 0.5s cubic-bezier(0.4,0,0.2,1), background 0.4s ease; }

        /* ── END MICRO-INTERACTIONS ──────────────────────────────────────────────── */

        /* ── RESPONSIVE / MOBILE ────────────────────────────────────────────────── */

        /* Desktop: hide hamburger, show sidebar toggle */
        .kd-hamburger { display:none; }
        .kd-sidebar-toggle { display:flex; }

        /* Mobile: show hamburger, hide sidebar toggle */
        @media (max-width: 768px) {
          .kd-hamburger { display:flex !important; }
          .kd-sidebar-toggle { display:none !important; }
        }

        /* Hide permanent sidebar on mobile — use drawer instead */
        @media (max-width: 768px) {
          .kd-permanent-sidebar { display:none !important; }
          .kd-nav-tabs { overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
          .kd-nav-tabs::-webkit-scrollbar { display:none; }
          .kd-main-header { padding: 0 10px 0 6px !important; }
          .kd-content-area { padding: 14px 12px !important; }
          .kd-grid-5col { grid-template-columns: repeat(2,1fr) !important; }
          .kd-grid-4col { grid-template-columns: repeat(2,1fr) !important; }
          .kd-grid-3col { grid-template-columns: 1fr !important; }
          .kd-grid-6col { grid-template-columns: repeat(2,1fr) !important; }
          .kd-grid-lines { grid-template-columns: repeat(2,1fr) !important; }
          .kd-table-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; }
          .kd-table-wrap table { min-width:540px; }
          .kd-station-list { width:100% !important; border-right:none !important; max-height:280px; }
          .kd-station-detail { min-width:0; }
          .kd-station-layout { flex-direction:column !important; }
          .kd-insp-layout { flex-direction:column !important; }
          .kd-insp-sidebar { width:100% !important; border-right:none !important; border-bottom:1px solid #E8EAED; max-height:200px; }
          .kd-asset-grid-5 { grid-template-columns: repeat(2,1fr) !important; }
          .kd-score-big { font-size:28px !important; }
        }

        @media (max-width: 480px) {
          .kd-grid-5col, .kd-grid-4col, .kd-grid-6col { grid-template-columns: 1fr 1fr !important; }
          .kd-grid-lines { grid-template-columns: 1fr !important; }
          .kd-header-chips { display:none !important; }
          .kd-insp-sidebar { max-height:160px; }
        }

        /* ── END RESPONSIVE ─────────────────────────────────────────────────────── */
      `}</style>

      <div style={{ background:T.bg, borderRadius:8, overflow:"hidden", border:`1px solid ${T.border}`, display:"flex", flexDirection:"row", minHeight:700, fontFamily:"'Barlow',sans-serif", boxShadow:T.shadowMd, position:"relative" }}>

        {/* Permanent sidebar — always visible */}
        <PermanentSidebar view={view} setView={setView} collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(c => !c)} />

        {/* Sidebar pull-tab — gold handle on sidebar edge, desktop only */}
        <div className="kd-sidebar-toggle" style={{ position:"relative", width:0, flexShrink:0, zIndex:30 }}>
          <button
            onClick={() => setSidebarCollapsed(c => !c)}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            style={{ position:"absolute", top:"50%", left:0, transform:"translateY(-50%)", width:16, height:48, background:T.gold, border:"none", borderRadius:"0 6px 6px 0", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#FFFFFF", zIndex:30, transition:"width 0.15s ease", boxShadow:"3px 0 8px rgba(0,0,0,0.18)", padding:0 }}
            onMouseEnter={e => { e.currentTarget.style.width = "22px"; }}
            onMouseLeave={e => { e.currentTarget.style.width = "16px"; }}>
            <svg width="8" height="12" viewBox="0 0 8 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {sidebarCollapsed ? <polyline points="2,1 6,6 2,11"/> : <polyline points="6,1 2,6 6,11"/>}
            </svg>
          </button>
        </div>

        {/* Mobile slide-out drawer overlay */}
        <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} view={view} setView={setView}/>

        {/* Main panel */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

          {/* Header */}
          <div style={{ background:T.panel, borderBottom:`2px solid ${T.gold}`, padding:"0 20px 0 10px", height:60, display:"flex", alignItems:"center", gap:12, flexShrink:0, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
            {/* Hamburger — mobile only */}
            <button onClick={() => setDrawerOpen(o => !o)} title="Open navigation"
                    className="kd-hamburger"
                    style={{ width:32, height:32, border:`1px solid ${T.border}`, borderRadius:4, background:"transparent", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, flexShrink:0, transition:"background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ width:13, height:1.5, background:T.text, borderRadius:1 }}/>
              <div style={{ width:13, height:1.5, background:T.text, borderRadius:1 }}/>
              <div style={{ width:13, height:1.5, background:T.text, borderRadius:1 }}/>
            </button>
            {/* Sidebar toggle — desktop only */}
            <button onClick={() => setSidebarCollapsed(c => !c)} title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                    className="kd-sidebar-toggle"
                    style={{ width:36, height:36, border:`2px solid ${T.gold}`, borderRadius:5, background:"rgba(201,168,76,0.10)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background 0.15s, border-color 0.15s", color:T.gold }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,168,76,0.22)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,168,76,0.10)"; }}>
              <svg width="16" height="16" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {sidebarCollapsed
                  ? <><rect x="1" y="1" width="4" height="13" rx="1"/><line x1="8" y1="4.5" x2="14" y2="4.5"/><line x1="8" y1="7.5" x2="14" y2="7.5"/><line x1="8" y1="10.5" x2="14" y2="10.5"/></>
                  : <><rect x="1" y="1" width="4" height="13" rx="1"/><polyline points="9,5 11,7.5 9,10"/></>
                }
              </svg>
            </button>
            <div style={{ flex:1 }}/>
            <div className="kd-header-chips" style={{ display:"flex", alignItems:"center", gap:10 }}>
              {crit > 0 && <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, letterSpacing:"0.06em", color:"#C62828", background:"#FFEBEE", padding:"3px 10px", borderRadius:2, fontWeight:700 }}>{crit} CRITICAL</div>}
              {warn > 0 && <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, letterSpacing:"0.06em", color:"#E65100", background:"#FFF3E0", padding:"3px 10px", borderRadius:2 }}>{warn} ATTENTION</div>}
              <div style={{ display:"flex", alignItems:"center", gap:5, fontFamily:"'Share Tech Mono'", fontSize:9, color:T.textMuted, letterSpacing:"0.08em", background:T.bg, padding:"3px 8px", borderRadius:2 }}>
                <div className="live-dot" style={{ width:6, height:6, borderRadius:"50%", flexShrink:0 }}/>
                LIVE
              </div>
              <div style={{ fontFamily:"'Share Tech Mono'", fontSize:13, color:T.text, fontWeight:600 }}>{time}</div>
            </div>
          </div>

          {/* Nav tabs */}
          <div className="kd-nav-tabs" style={{ background:T.panel, borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", flexShrink:0 }}>
            <div style={{ display:"flex", alignItems:"stretch" }}>
              {/* Command Center tab */}
              <button onClick={() => setView("command")}
                      className={`nav-tab${view === "command" ? " active" : ""}`}
                      style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", padding:"11px 16px", background:"none", border:"none", cursor:"pointer", color: view === "command" ? T.text : T.textMuted, transition:"color 0.15s", whiteSpace:"nowrap" }}>
                Command Center
              </button>

              {/* Thin separator */}
              <div style={{ width:1, background:T.border, margin:"8px 4px", flexShrink:0 }}/>

              {/* Line tabs — each with a persistent color-coded dot */}
              {Object.entries(LINES).map(([id, l]) => {
                const isActive = view === "stations" && lineId === id;
                return (
                  <button key={id} onClick={() => drill(id)}
                          className={`nav-tab${isActive ? " active" : ""}`}
                          style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:600, letterSpacing:"0.16em", textTransform:"uppercase", padding:"11px 12px", background:"none", border:"none", cursor:"pointer", color: isActive ? l.color : T.textMuted, transition:"color 0.15s", "--kai-gold": l.color, display:"inline-flex", alignItems:"center", gap:5 } as React.CSSProperties}>
                    <span style={{ width:7, height:7, borderRadius:"50%", background:l.color, flexShrink:0, opacity: isActive ? 1 : 0.45, transition:"opacity 0.15s, transform 0.15s", transform: isActive ? "scale(1.2)" : "scale(1)" }}/>
                    {l.name.replace(" Line", "")}
                  </button>
                );
              })}

              {/* Thin separator */}
              <div style={{ width:1, background:T.border, margin:"8px 4px", flexShrink:0 }}/>

              <button onClick={() => setView("inspect")}
                      className={`nav-tab${view === "inspect" ? " active" : ""}`}
                      style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", padding:"11px 14px", background:"none", border:"none", cursor:"pointer", color: view === "inspect" ? T.text : T.textMuted, transition:"color 0.15s" }}>
                Inspect
              </button>
              <button onClick={() => { setPreReportStation(""); setView("report"); }}
                      className={`nav-tab${view === "report" ? " active" : ""}`}
                      style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", padding:"11px 14px", background:"none", border:"none", cursor:"pointer", color: view === "report" ? T.text : T.textMuted, transition:"color 0.15s" }}>
                Report
              </button>
              <button onClick={() => setView("intelligence")}
                      className={`nav-tab${view === "intelligence" ? " active" : ""}`}
                      style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", padding:"11px 14px", background:"none", border:"none", cursor:"pointer", color: view === "intelligence" ? T.text : T.textMuted, transition:"color 0.15s", display:"inline-flex", alignItems:"center", gap:5 }}>
                <span style={{ width:6, height:6, borderRadius:"50%", background: view === "intelligence" ? "#4CAF50" : T.textMuted, opacity: view === "intelligence" ? 1 : 0.5, transition:"background 0.15s, opacity 0.15s" }}/>
                Intelligence
              </button>
            </div>
            <div style={{ display:"flex", alignItems:"center", padding:"0 16px", borderLeft:`1px solid ${T.border}`, gap:6 }}>
              <span style={{ width:6, height:6, borderRadius:"50%", background:T.gold, opacity:0.7 }}/>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:T.gold }}>FIFA 2026 · 9 MATCH DAYS</div>
            </div>
          </div>

          {/* Content */}
          <div className="kd-scroll" style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            {view === "command"           && <CommandCenter onDrill={drill}/>}
            {view === "stations"          && <StationView lineId={lineId} selectedId={stationId} onSelect={setStationId} onReport={(name) => { setPreReportStation(name); setView("report"); }}/>}
            {view === "inspect"           && <InspectionView/>}
            {view === "report"            && <ReportIssueView initialStation={preReportStation}/>}
            {view === "intelligence"      && <IntelligenceView/>}
            {view === "asset_elevators"   && <AssetDashboardView assetKey="elevators"/>}
            {view === "asset_cameras"     && <AssetDashboardView assetKey="cameras"/>}
            {view === "asset_stairwells"  && <AssetDashboardView assetKey="stairwells"/>}
            {view === "asset_trash_cans"  && <AssetDashboardView assetKey="trash_cans"/>}
            {view === "asset_bus_covers"  && <AssetDashboardView assetKey="bus_covers"/>}
          </div>

          {/* Footer */}
          <div style={{ background:T.panel, borderTop:`1px solid ${T.border}`, padding:"6px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:8, letterSpacing:"0.2em", color:T.textMuted, textTransform:"uppercase" }}>
              KAI · AI-Powered Facility Intelligence · Dallas Area Rapid Transit
            </div>
            <div style={{ fontFamily:"'Share Tech Mono'", fontSize:8, color:T.textMuted }}>
              94.2% AI ACCURACY · &lt;30s ALERT-TO-ACTION
            </div>
          </div>

        </div>{/* end main panel */}

      </div>
    </>
  );
}
