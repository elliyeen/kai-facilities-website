"use client";

import { useState, useEffect, useCallback, useRef } from "react";

/* ─── Types ──────────────────────────────────────── */
type Status  = "good" | "warning" | "critical" | "deploying" | "closed";
type View    = "command" | "stations" | "inspect" | "asset_elevators" | "asset_cameras" | "asset_stairwells" | "asset_trash_cans" | "asset_bus_covers" | "intelligence";
type AssetKey = "elevators" | "cameras" | "stairwells" | "trash_cans" | "bus_covers";
type InspVal = "pass" | "fail" | "na" | null;

interface Issue { key: string; label: string; icon: string; priority: "critical"|"high"|"standard"; }
interface StaffMember { name: string; role: string; status: "On Task"|"En Route"|"Available"; detail: string; }
interface AssetEntry { elevators: number; elevators_ok: number; cameras: number; cameras_ok: number; stairwells: number; stairwells_ok: number; trash_cans: number; trash_cans_ok: number; bus_covers: number; bus_covers_ok: number; }
interface Station {
  id: string; name: string; score: number; status: Status;
  issues: string[]; lastInspected: string; staff: StaffMember[];
  lineId: string; lineColor: string; lineName: string;
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
  "8th-corinth":           { elevators:2,elevators_ok:2, cameras:7,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:8,   bus_covers:1,bus_covers_ok:1 },
  "convention-b":          { elevators:4,elevators_ok:4, cameras:14,cameras_ok:14, stairwells:6,stairwells_ok:6, trash_cans:18,trash_cans_ok:18, bus_covers:4,bus_covers_ok:4 },
  "union-b":               { elevators:4,elevators_ok:4, cameras:12,cameras_ok:12, stairwells:6,stairwells_ok:6, trash_cans:16,trash_cans_ok:15, bus_covers:3,bus_covers_ok:3 },
  "west-end-b":            { elevators:2,elevators_ok:2, cameras:8,cameras_ok:8,   stairwells:3,stairwells_ok:3, trash_cans:10,trash_cans_ok:10, bus_covers:2,bus_covers_ok:2 },
  "akard-b":               { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:1,bus_covers_ok:1 },
  "st-paul-b":             { elevators:2,elevators_ok:2, cameras:6,cameras_ok:6,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:1,bus_covers_ok:1 },
  "cityplace-b":           { elevators:2,elevators_ok:1, cameras:8,cameras_ok:6,   stairwells:4,stairwells_ok:4, trash_cans:10,trash_cans_ok:8,  bus_covers:2,bus_covers_ok:2 },
  "smu-b":                 { elevators:2,elevators_ok:2, cameras:7,cameras_ok:7,   stairwells:3,stairwells_ok:3, trash_cans:9,trash_cans_ok:9,   bus_covers:2,bus_covers_ok:2 },
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

/* ─── Station builder ───────────────────────────── */
const mk = (id:string,name:string,score:number,status:Status,issues:string[],last:string,staff:StaffMember[],lid:string,lc:string,ln:string):Station =>
  ({id,name,score,status,issues,lastInspected:last,staff,lineId:lid,lineColor:lc,lineName:ln});

const RED: Station[] = [
  mk("westmoreland",     "Westmoreland",         92,"good",    [],                                         "5 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("hampton",          "Hampton",              90,"good",    [],                                         "8 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("tyler-vernon",     "Tyler/Vernon",         91,"good",    [],                                         "7 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("zoo",              "Zoo",                  88,"warning", ["debris"],                                 "16 min ago", [],                                                                                     "red","#DA291C","Red Line"),
  mk("8th-corinth-r",    "8th & Corinth",        86,"warning", ["debris"],                                 "14 min ago", [],                                                                                     "red","#DA291C","Red Line"),
  mk("cedars-r",         "Cedars",               90,"good",    [],                                         "7 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("convention-r",     "Convention Center",    97,"good",    [],                                         "2 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("union-r",          "EBJ Union Station",    95,"good",    [],                                         "3 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("west-end-r",       "West End",             93,"good",    [],                                         "6 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("akard",            "Akard",                96,"good",    [],                                         "7 min ago",  [{name:"Rosa M.",  role:"Inspector",  status:"Available",detail:""}],                  "red","#DA291C","Red Line"),
  mk("st-paul",          "St. Paul",             87,"warning", ["cleaning_overdue"],                       "12 min ago", [{name:"James W.",role:"Maintenance",status:"On Task",  detail:"Restroom check"}],    "red","#DA291C","Red Line"),
  mk("pearl",            "Pearl/Arts District",  98,"good",    [],                                         "1 min ago",  [{name:"David R.", role:"Cleaner",    status:"On Task",  detail:"Platform sweep"}],   "red","#DA291C","Red Line"),
  mk("cityplace-up",     "Cityplace/Uptown",     71,"critical",["restroom_closed","crew_delayed"],          "31 min ago", [{name:"Priya K.",role:"Field Tech", status:"En Route", detail:"ETA 2 min"}],         "red","#DA291C","Red Line"),
  mk("smu",              "SMU/Mockingbird",      93,"good",    [],                                         "9 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("lovers-lane",      "Lovers Lane",          94,"good",    [],                                         "5 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("park-lane",        "Park Lane",            91,"good",    [],                                         "14 min ago", [],                                                                                     "red","#DA291C","Red Line"),
  mk("walnut-hill-r",    "Walnut Hill",          89,"warning", ["lighting_fault"],                         "17 min ago", [],                                                                                     "red","#DA291C","Red Line"),
  mk("forest-lane",      "Forest Lane",          94,"good",    [],                                         "6 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("lbj-central",      "LBJ/Central",          73,"critical",["elevator_down","lighting_fault","camera_offline"],"22 min ago",[{name:"Aisha B.",role:"Field Tech",status:"En Route",detail:"ETA 4 min"}],    "red","#DA291C","Red Line"),
  mk("spring-valley",    "Spring Valley",        95,"good",    [],                                         "4 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("arapaho-center",   "Arapaho Center",       92,"good",    [],                                         "8 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("galatyn-park",     "Galatyn Park",         96,"good",    [],                                         "3 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("cityline-bush",    "CityLine/Bush",        97,"good",    [],                                         "2 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("12th-street",      "12th Street",          90,"good",    [],                                         "9 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("downtown-plano",   "Downtown Plano",       93,"good",    [],                                         "6 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
  mk("parker-road",      "Parker Road",          99,"good",    [],                                         "1 min ago",  [],                                                                                     "red","#DA291C","Red Line"),
];
const GREEN: Station[] = [
  mk("buckner",                "Buckner",                          93,"good",     [],                                        "8 min ago",  [],"green","#00A84F","Green Line"),
  mk("lake-june",              "Lake June",                        91,"good",     [],                                        "6 min ago",  [],"green","#00A84F","Green Line"),
  mk("lawnview",               "Lawnview",                         94,"good",     [],                                        "4 min ago",  [],"green","#00A84F","Green Line"),
  mk("hatcher",                "Hatcher",                          88,"warning",  ["graffiti"],                              "15 min ago", [],"green","#00A84F","Green Line"),
  mk("mlk",                    "MLK Jr.",                          92,"good",     [],                                        "7 min ago",  [],"green","#00A84F","Green Line"),
  mk("fair-park",              "Fair Park",                        96,"good",     [],                                        "3 min ago",  [],"green","#00A84F","Green Line"),
  mk("baylor",                 "Baylor University Med Ctr",        94,"good",     [],                                        "5 min ago",  [],"green","#00A84F","Green Line"),
  mk("deep-ellum",             "Deep Ellum",                       90,"good",     [],                                        "11 min ago", [],"green","#00A84F","Green Line"),
  mk("pearl-g",                "Pearl/Arts District",              97,"good",     [],                                        "2 min ago",  [],"green","#00A84F","Green Line"),
  mk("st-paul-g",              "St. Paul",                         87,"warning",  ["cleaning_overdue"],                      "13 min ago", [],"green","#00A84F","Green Line"),
  mk("akard-g",                "Akard",                            95,"good",     [],                                        "4 min ago",  [],"green","#00A84F","Green Line"),
  mk("west-end-g",             "West End",                         89,"warning",  ["debris"],                                "10 min ago", [],"green","#00A84F","Green Line"),
  mk("victory-g",              "Victory",                          96,"good",     [],                                        "3 min ago",  [],"green","#00A84F","Green Line"),
  mk("market-center-g",        "Market Center",                    93,"good",     [],                                        "6 min ago",  [],"green","#00A84F","Green Line"),
  mk("sw-medical",             "SW Medical District/Parkland",     72,"critical", ["elevator_down","camera_offline"],         "27 min ago", [{name:"Carlos M.",role:"Field Tech",status:"En Route",detail:"ETA 3 min"}],"green","#00A84F","Green Line"),
  mk("inwood-g",               "Inwood/Love Field",                98,"good",     [],                                        "1 min ago",  [],"green","#00A84F","Green Line"),
  mk("burbank",                "Burbank",                          91,"good",     [],                                        "8 min ago",  [],"green","#00A84F","Green Line"),
  mk("bachman-g",              "Bachman",                          94,"good",     [],                                        "5 min ago",  [],"green","#00A84F","Green Line"),
  mk("walnut-hill",            "Walnut Hill/Denton",               78,"warning",  ["elevator_down","lighting_fault"],         "19 min ago", [{name:"Tina L.",role:"Maintenance",status:"On Task",detail:"Elevator inspection"}],"green","#00A84F","Green Line"),
  mk("royal-lane",             "Royal Lane",                       93,"good",     [],                                        "6 min ago",  [],"green","#00A84F","Green Line"),
  mk("farmers-branch",         "Farmers Branch",                   95,"good",     [],                                        "4 min ago",  [],"green","#00A84F","Green Line"),
  mk("downtown-carrollton",    "Downtown Carrollton",              97,"good",     [],                                        "2 min ago",  [],"green","#00A84F","Green Line"),
  mk("trinity-mills",          "Trinity Mills",                    92,"good",     [],                                        "7 min ago",  [],"green","#00A84F","Green Line"),
  mk("north-carrollton-frank", "N. Carrollton/Frankford",          99,"good",     [],                                        "1 min ago",  [],"green","#00A84F","Green Line"),
];
const BLUE: Station[] = [
  mk("unt-dallas",       "UNT Dallas",                    96,"good",     [],                                 "4 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("camp-wisdom",      "Camp Wisdom",                   92,"good",     [],                                 "7 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("ledbetter",        "Ledbetter",                     91,"good",     [],                                 "8 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("va-medical",       "VA Medical Center",             97,"good",     [],                                 "2 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("kiest",            "Kiest",                         88,"warning",  ["escalator_maint"],                "20 min ago", [],"blue","#0076CE","Blue Line"),
  mk("illinois",         "Illinois",                      94,"good",     [],                                 "5 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("morrell",          "Morrell",                       91,"good",     [],                                 "9 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("8th-corinth",      "8th & Corinth",                 86,"warning",  ["debris"],                         "14 min ago", [],"blue","#0076CE","Blue Line"),
  mk("cedars",           "Cedars",                        90,"good",     [],                                 "7 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("convention-b",     "Convention Center",             97,"good",     [],                                 "2 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("union-b",          "EBJ Union Station",             95,"good",     [],                                 "3 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("west-end-b",       "West End",                      93,"good",     [],                                 "6 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("akard-b",          "Akard",                         96,"good",     [],                                 "4 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("st-paul-b",        "St. Paul",                      94,"good",     [],                                 "5 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("pearl-b",          "Pearl/Arts District",           98,"good",     [],                                 "1 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("cityplace-b",      "Cityplace/Uptown",              74,"critical", ["restroom_closed","crew_delayed"],  "26 min ago", [{name:"Priya K.",role:"Field Tech",status:"En Route",detail:"ETA 2 min"}],"blue","#0076CE","Blue Line"),
  mk("smu-b",            "SMU/Mockingbird",               95,"good",     [],                                 "4 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("white-rock",       "White Rock",                    93,"good",     [],                                 "6 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("lake-highlands",   "Lake Highlands",                87,"warning",  ["lighting_fault"],                 "17 min ago", [],"blue","#0076CE","Blue Line"),
  mk("lbj-skillman",     "LBJ/Skillman",                  92,"good",     [],                                 "8 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("forest-jupiter",   "Forest/Jupiter",                90,"good",     [],                                 "10 min ago", [],"blue","#0076CE","Blue Line"),
  mk("downtown-garland", "Downtown Garland",              94,"good",     [],                                 "5 min ago",  [],"blue","#0076CE","Blue Line"),
  mk("downtown-rowlett", "Downtown Rowlett",              97,"good",     [],                                 "3 min ago",  [],"blue","#0076CE","Blue Line"),
];
const ORANGE: Station[] = [
  mk("parker-road-o",    "Parker Road",                      99,"good",    [],                             "1 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("downtown-plano-o", "Downtown Plano",                   93,"good",    [],                             "6 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("12th-street-o",    "12th Street",                      90,"good",    [],                             "9 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("cityline-bush-o",  "Cityline/Bush",                    97,"good",    [],                             "2 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("galatyn-park-o",   "Galatyn Park",                     96,"good",    [],                             "3 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("arapaho-center-o", "Arapaho Center",                   92,"good",    [],                             "8 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("spring-valley-o",  "Spring Valley",                    95,"good",    [],                             "4 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("lbj-central-o",    "LBJ/Central",                      73,"critical",["elevator_down","lighting_fault","camera_offline"],"22 min ago",[{name:"Aisha B.",role:"Field Tech",status:"En Route",detail:"ETA 4 min"}],"orange","#F77F00","Orange Line"),
  mk("forest-ln-o",      "Forest Lane",                      94,"good",    [],                             "6 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("walnut-hill-o",    "Walnut Hill",                      89,"warning", ["lighting_fault"],             "17 min ago", [],"orange","#F77F00","Orange Line"),
  mk("park-lane-o",      "Park Lane",                        91,"good",    [],                             "14 min ago", [],"orange","#F77F00","Orange Line"),
  mk("lovers-lane-o",    "Lovers Lane",                      94,"good",    [],                             "5 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("smu-o",            "SMU/Mockingbird",                  93,"good",    [],                             "9 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("cityplace-o",      "Cityplace/Uptown",                 71,"critical",["restroom_closed","crew_delayed"],"31 min ago",[{name:"Priya K.",role:"Field Tech",status:"En Route",detail:"ETA 2 min"}],"orange","#F77F00","Orange Line"),
  mk("pearl-o",          "Pearl/Arts District",              98,"good",    [],                             "1 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("st-paul-o",        "St. Paul",                         87,"warning", ["cleaning_overdue"],           "12 min ago", [],"orange","#F77F00","Orange Line"),
  mk("akard-o",          "Akard",                            96,"good",    [],                             "7 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("west-end-o",       "West End",                         93,"good",    [],                             "6 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("victory-o",        "Victory",                          96,"good",    [],                             "3 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("market-center-o",  "Market Center",                    93,"good",    [],                             "6 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("sw-medical-o",     "SW Medical District/Parkland",     72,"critical",["elevator_down","camera_offline"],"27 min ago",[{name:"Carlos M.",role:"Field Tech",status:"En Route",detail:"ETA 3 min"}],"orange","#F77F00","Orange Line"),
  mk("love-o",           "Inwood/Love Field",                98,"good",    [],                             "1 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("burbank-o",        "Burbank",                          91,"good",    [],                             "8 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("bachman",          "Bachman",                          94,"good",    [],                             "4 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("univ-dallas",      "University of Dallas",             90,"good",    [],                             "10 min ago", [],"orange","#F77F00","Orange Line"),
  mk("las-colinas",      "Las Colinas Urban Ctr",            72,"critical",["restroom_closed","graffiti"], "28 min ago", [],"orange","#F77F00","Orange Line"),
  mk("irving",           "Irving Convention Ctr",            91,"good",    [],                             "7 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("hidden-ridge",     "Hidden Ridge",                     95,"good",    [],                             "5 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("north-lake",       "Dallas College Northlake Campus",  88,"good",    [],                             "11 min ago", [],"orange","#F77F00","Orange Line"),
  mk("belt-line",        "Belt Line",                        95,"good",    [],                             "6 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("dfw-a",            "DFW Airport T-A",                  97,"good",    [],                             "3 min ago",  [],"orange","#F77F00","Orange Line"),
  mk("dfw-b",            "DFW Airport T-B",                  96,"good",    [],                             "5 min ago",  [],"orange","#F77F00","Orange Line"),
];
const SILVER: Station[] = [
  mk("shiloh-sl",              "Shiloh Rd",                96,"good",[],"4 min ago", [],"silver","#8C9BAB","Silver Line"),
  mk("12th-street-sl",         "12th Street",              93,"good",[],"8 min ago", [],"silver","#8C9BAB","Silver Line"),
  mk("cityline-bush-sl",       "Cityline/Bush",            97,"good",[],"2 min ago", [],"silver","#8C9BAB","Silver Line"),
  mk("ut-dallas-sl",           "UT Dallas",                91,"good",[],"12 min ago",[],"silver","#8C9BAB","Silver Line"),
  mk("knoll-trail",            "Knoll Trail",              95,"good",[],"6 min ago", [],"silver","#8C9BAB","Silver Line"),
  mk("addison-sl",             "Addison",                  94,"good",[],"5 min ago", [],"silver","#8C9BAB","Silver Line"),
  mk("downtown-carrollton-sl", "Downtown Carrollton",      92,"good",[],"9 min ago", [],"silver","#8C9BAB","Silver Line"),
  mk("cypress-waters",         "Cypress Waters",           98,"good",[],"1 min ago", [],"silver","#8C9BAB","Silver Line"),
  mk("dfw-north-sl",           "DFW North",                96,"good",[],"3 min ago", [],"silver","#8C9BAB","Silver Line"),
  mk("dfw-terminal-b-sl",      "DFW Terminal B",           99,"good",[],"1 min ago", [],"silver","#8C9BAB","Silver Line"),
];

const LINES: Record<string, Line> = {
  red:    { name:"Red Line",    sub:"Westmoreland — Parker Rd", color:"#DA291C", stations:RED    },
  green:  { name:"Green Line",  sub:"Buckner — N. Carrollton/Frankford", color:"#00A84F", stations:GREEN  },
  blue:   { name:"Blue Line",   sub:"UNT Dallas — Downtown Rowlett", color:"#0076CE", stations:BLUE   },
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
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:24 }}>
        {[
          { label:"Critical Stations", val:crit,       sub:"Require immediate action", color:"#D32F2F" },
          { label:"Needs Attention",   val:warn,        sub:"Scheduled service needed", color:"#F57C00" },
          { label:"Avg Readiness",     val:avg,         sub:"Network average / 100",    color:scoreColor(avg) },
          { label:"Asset Uptime",      val:`${uptime}%`,sub:`${no} of ${nt} assets`,   color:scoreColor(uptime) },
          { label:"AI Accuracy",       val:"94.2%",     sub:"Model v2.1 · Live",        color:T.gold },
        ].map(k => (
          <div key={k.label} style={{ background:T.panel, padding:"14px 18px", cursor:"default", transition:"background 0.15s" }}
               onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
               onMouseLeave={e => (e.currentTarget.style.background = T.panel)}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:T.textMuted, marginBottom:5 }}>{k.label}</div>
            <div style={{ fontFamily:"'Share Tech Mono'", fontSize:28, color:k.color, lineHeight:1 }}>{k.val}</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:4, letterSpacing:"0.04em" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Line cards */}
      <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>
        LINES — READINESS OVERVIEW · Click to drill down
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:24 }}>
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
      <table style={{ width:"100%", borderCollapse:"collapse", background:T.panel, border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
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
                      <div style={{ height:4, width:`${st.score}%`, background:scoreFill(st.score), borderRadius:1 }}/>
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
      </table>
    </div>
  );
}

/* ─── Station view ───────────────────────────────── */
function StationView({ lineId, selectedId, onSelect }: { lineId:string; selectedId:string|null; onSelect:(id:string)=>void; }) {
  const line = LINES[lineId];
  const selected = line.stations.find(s => s.id === selectedId) ?? line.stations[0];
  const style = statusStyle(selected.status);
  const a = ASSETS[selected.id];

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

      {/* Station list */}
      <div style={{ width:280, borderRight:`1px solid ${T.border}`, overflowY:"auto", flexShrink:0, background:T.panel }}>
        <div style={{ padding:"10px 14px", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between", background:"#F9FAFB", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:9, height:9, borderRadius:"50%", background:line.color }}/>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:15, fontWeight:700, letterSpacing:"0.05em", color:line.color }}>{line.name}</div>
          </div>
          <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, color:T.textMuted }}>{line.stations.length} STA</div>
        </div>
        {line.stations.map((st, i) => (
          <div key={st.id} onClick={() => onSelect(st.id)}
               style={{ display:"flex", alignItems:"center", cursor:"pointer", background:selectedId === st.id ? "#F9FAFB" : "transparent", borderLeft:`3px solid ${selectedId === st.id ? line.color : "transparent"}`, transition:"background 0.12s" }}
               onMouseEnter={e => { if (selectedId !== st.id) e.currentTarget.style.background = "#FAFAFA"; }}
               onMouseLeave={e => { if (selectedId !== st.id) e.currentTarget.style.background = "transparent"; }}>
            {/* Connector */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", width:36, flexShrink:0 }}>
              <div style={{ width:2, height:18, background:i === 0 ? "transparent" : line.color }}/>
              <div style={{ width:12, height:12, borderRadius:"50%", border:`2.5px solid ${st.status === "critical" ? "#D32F2F" : st.status === "warning" ? "#F57C00" : "#2E7D32"}`, background: st.status === "critical" ? "#FFEBEE" : st.status === "warning" ? "#FFF8E1" : "#E8F5E9", zIndex:1 }}/>
              <div style={{ width:2, height:18, background:i === line.stations.length - 1 ? "transparent" : line.color }}/>
            </div>
            {/* Card info */}
            <div style={{ flex:1, padding:"5px 10px 5px 4px", borderBottom:`1px solid #F4F5F7` }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:13, fontWeight:600, letterSpacing:"0.02em", color:T.text }}>{st.name}</div>
                <div style={{ fontFamily:"'Share Tech Mono'", fontSize:11, color:scoreColor(st.score) }}>{st.score}%</div>
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
        {/* Header */}
        <div style={{ padding:"18px 22px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:22, fontWeight:900, letterSpacing:"0.04em", color:T.text, lineHeight:1.1 }}>{selected.name}</div>
          <div style={{ display:"flex", alignItems:"center", gap:5, marginTop:4 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:line.color }}/>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, letterSpacing:"0.1em" }}>{line.name}</div>
          </div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:6, marginTop:12 }}>
            <div style={{ fontFamily:"'Share Tech Mono'", fontSize:38, lineHeight:1, color:scoreColor(selected.score) }}>{selected.score}%</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.15em", paddingBottom:6 }}>READINESS</div>
          </div>
          <div style={{ height:5, background:T.border, borderRadius:2, marginTop:8, overflow:"hidden" }}>
            <div style={{ height:5, width:`${selected.score}%`, background:scoreFill(selected.score), borderRadius:2 }}/>
          </div>
          <div style={{ marginTop:8 }}>
            <span style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.15em", padding:"3px 9px", borderRadius:2, background:style.bg, color:style.text, border:`1px solid ${style.border}` }}>
              {style.label}
            </span>
          </div>
        </div>

        {/* Issues */}
        <div style={{ padding:"14px 22px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.25em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>Open Issues</div>
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
        <div style={{ padding:"14px 22px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.25em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>Deployed Staff</div>
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
          <div style={{ padding:"14px 22px", borderBottom:`1px solid ${T.border}` }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.25em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>Station Assets</div>
            {(["elevators","cameras","stairwells","trash_cans","bus_covers"] as const).map(k => {
              const total = a[k], ok = a[`${k}_ok` as keyof AssetEntry] as number;
              const pct = total ? Math.round((ok / total) * 100) : 100;
              return (
                <div key={k} style={{ display:"flex", alignItems:"center", gap:8, padding:"5px 0", borderBottom:`1px solid #F4F5F7` }}>
                  <div style={{ fontFamily:"'Barlow Condensed'", fontSize:11, fontWeight:600, color:T.textSub, letterSpacing:"0.03em", width:96, flexShrink:0, textTransform:"capitalize" }}>{k.replace(/_/g," ")}</div>
                  <div style={{ flex:1, height:3, background:T.border, borderRadius:1 }}>
                    <div style={{ height:3, width:`${pct}%`, background:scoreFill(pct), borderRadius:1 }}/>
                  </div>
                  <div style={{ fontFamily:"'Share Tech Mono'", fontSize:10, color:scoreColor(pct), width:32, textAlign:"right" }}>{ok}/{total}</div>
                </div>
              );
            })}
          </div>
        )}

        {/* FIFA callout */}
        <div style={{ margin:"14px 22px", padding:"12px 14px", background:"#111827", borderRadius:4 }}>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.gold, marginBottom:4 }}>FIFA World Cup 2026</div>
          <div style={{ fontFamily:"'Share Tech Mono'", fontSize:20, color:"#FFFFFF", lineHeight:1 }}>+286%</div>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:"rgba(255,255,255,0.5)", marginTop:4 }}>Expected surge · 9 match days · AT&T Stadium</div>
        </div>
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
        <img key={i} src={url} alt="" style={{ width:28, height:28, objectFit:"cover", borderRadius:3, border:`1px solid ${T.border}`, cursor:"pointer" }} onClick={() => window.open(url, "_blank")}/>
      ))}
      {thumbs.length < 3 && (
        <>
          <button onClick={() => inputRef.current?.click()}
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
  const [submitted, setSubmitted]   = useState(false);
  const [flashRows, setFlashRows]   = useState<Record<string, "pass"|"fail">>({});
  const [flashSecs, setFlashSecs]   = useState<Set<string>>(new Set());
  const [openNotes, setOpenNotes]   = useState<Set<string>>(new Set());

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
            {station} · Inspector {inspector} · {passCount} pass / {failCount} fail / {naCount} N/A
          </div>
          {overallScore !== null && (
            <div style={{ fontFamily:"'Share Tech Mono'", fontSize:44, color:scoreColor(overallScore), marginBottom:4, lineHeight:1 }}>{overallScore}%</div>
          )}
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, letterSpacing:"0.2em", marginBottom:28 }}>OVERALL SCORE</div>
          <button onClick={() => { setSubmitted(false); setInspState({}); setInspNotes({}); setStation(""); setInspector(""); setCrewId(""); setOpenNotes(new Set()); }}
            style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", padding:"10px 24px", background:T.gold, color:"#FFFFFF", border:"none", borderRadius:3, cursor:"pointer" }}>
            New Inspection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display:"flex", flex:1, overflow:"hidden" }}>

      {/* Left sidebar — form header + section nav */}
      <div style={{ width:260, borderRight:`1px solid ${T.border}`, background:T.panel, display:"flex", flexDirection:"column", flexShrink:0 }}>
        {/* Metadata form */}
        <div style={{ padding:"16px 16px 12px", borderBottom:`1px solid ${T.border}` }}>
          <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted, marginBottom:12 }}>
            Inspection Details
          </div>
          {[
            { label:"Station", val:station, set:setStation, ph:"Select station…" },
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
            <div style={{ height:3, width:`${(answeredCount / totalItems.length) * 100}%`, background:T.gold, borderRadius:2, transition:"width 0.3s" }}/>
          </div>
          <div style={{ display:"flex", gap:6, marginBottom:10, fontFamily:"'Share Tech Mono'", fontSize:9 }}>
            <span style={{ color:"#2E7D32" }}>{passCount}P</span>
            <span style={{ color:"#D32F2F" }}>{failCount}F</span>
            <span style={{ color:T.textMuted }}>{naCount}N/A</span>
          </div>
          <button onClick={() => canSubmit && setSubmitted(true)} disabled={!canSubmit}
            style={{ width:"100%", fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:700, letterSpacing:"0.2em", textTransform:"uppercase", padding:"9px", borderRadius:3, border:"none", cursor: canSubmit ? "pointer" : "not-allowed", background: canSubmit ? T.gold : T.border, color: canSubmit ? "#FFFFFF" : T.textMuted, transition:"background 0.2s" }}>
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
            {/* Section header */}
            <div style={{ padding:"10px 16px", background:"#F9FAFB", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:14, fontWeight:700, letterSpacing:"0.08em", color:T.text }}>{sec.title}</div>
              <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, color:T.textMuted, letterSpacing:"0.1em" }}>
                  {sec.items.filter(it => inspState[it.id] !== null && inspState[it.id] !== undefined).length}/{sec.items.length}
                </div>
                {secScore(sec) !== null && (
                  <div style={{ fontFamily:"'Share Tech Mono'", fontSize:14, color:scoreColor(secScore(sec)!), fontWeight:700, transition:"color 0.3s" }}>{secScore(sec)}%</div>
                )}
              </div>
            </div>

            {/* Items */}
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
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
                      <tr key={it.id} style={{ borderBottom:`1px solid #F4F5F7`, transition:"background 0.15s", background:rowBg }}>
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
                              style={{ width:26, height:26, borderRadius:3, border:`1.5px solid ${val === v ? (v === "pass" ? "#4CAF50" : v === "fail" ? "#EF5350" : "#9E9E9E") : T.border}`, background: val === v ? (v === "pass" ? "#E8F5E9" : v === "fail" ? "#FFEBEE" : "#F3F4F6") : "transparent", cursor:"pointer", fontFamily:"'Share Tech Mono'", fontSize:9, fontWeight:700, color: val === v ? (v === "pass" ? "#2E7D32" : v === "fail" ? "#C62828" : "#6B7280") : T.textMuted, transition:"all 0.15s" }}>
                              {v === "pass" ? "✓" : v === "fail" ? "✗" : "–"}
                            </button>
                          </td>
                        ))}
                        <td style={{ padding:"9px 8px" }}>
                          <InspPhotoCell itemId={it.id}/>
                        </td>
                        <td style={{ padding:"9px 8px" }}>
                          <button onClick={() => toggleNote(it.id)}
                            style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.08em", padding:"3px 8px", borderRadius:2, border:`1px solid ${openNotes.has(it.id) ? T.gold : T.border}`, background: openNotes.has(it.id) ? "#FFFDE7" : "transparent", color: openNotes.has(it.id) ? "#8B6914" : T.textMuted, cursor:"pointer", whiteSpace:"nowrap" }}>
                            {inspNotes[it.id] ? "Edit" : "Add"}
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
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
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
    <div style={{ padding:"24px 28px", overflowY:"auto", flex:1, background:T.bg }}>
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
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:24 }}>
        {[
          { label:"Total Network",  val:totalNet,        sub:"Units across all stations",    color:T.text                                        },
          { label:"Operational",    val:okNet,           sub:"Currently online",             color:"#2E7D32"                                     },
          { label:"Down",           val:downNet,         sub:"Requiring attention",          color: downNet > 0 ? "#D32F2F" : "#2E7D32"          },
          { label:"Network Uptime", val:`${uptimePct}%`, sub:"Overall availability",         color:scoreColor(uptimePct)                         },
        ].map(k => (
          <div key={k.label} style={{ background:T.panel, padding:"14px 18px" }}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:T.textMuted, marginBottom:5 }}>{k.label}</div>
            <div style={{ fontFamily:"'Share Tech Mono'", fontSize:28, color:k.color, lineHeight:1 }}>{k.val}</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:4 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Per-line */}
      <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.28em", textTransform:"uppercase", color:T.textMuted, marginBottom:10 }}>BY LINE</div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:24 }}>
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
      <table style={{ width:"100%", borderCollapse:"collapse", background:T.panel, border:`1px solid ${T.border}`, boxShadow:T.shadow }}>
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
      </table>
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
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#4CAF50", animation:"kdlive 1.5s infinite" }}/>
            MODEL ACTIVE
          </div>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:24 }}>
        {[
          { label:"Model Accuracy",     val:"94.2%",               sub:"v2.1 · Trained on 18mo data",   color:T.gold    },
          { label:"Active Predictions", val:AI_PREDICTIONS.length, sub:"Next 4h · across all stations", color:"#1565C0" },
          { label:"Anomalies Detected", val:ANOMALIES.length,      sub:"In the last 60 minutes",        color:"#E65100" },
          { label:"Auto-Dispatched",    val:autoDisp,              sub:"Actions sent · 0 overrides",    color:"#2E7D32" },
          { label:"Pending Approval",   val:pending,               sub:"Awaiting supervisor review",    color:"#F57C00" },
        ].map(k => (
          <div key={k.label} style={{ background:T.panel, padding:"14px 18px", cursor:"default", transition:"background 0.15s" }}
               onMouseEnter={e => (e.currentTarget.style.background = "#F9FAFB")}
               onMouseLeave={e => (e.currentTarget.style.background = T.panel)}>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", color:T.textMuted, marginBottom:5 }}>{k.label}</div>
            <div style={{ fontFamily:"'Share Tech Mono'", fontSize:28, color:k.color, lineHeight:1 }}>{String(k.val)}</div>
            <div style={{ fontFamily:"'Barlow Condensed'", fontSize:10, color:T.textMuted, marginTop:4, letterSpacing:"0.04em" }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Three-column main */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:1, background:T.border, border:`1px solid ${T.border}`, marginBottom:24, alignItems:"start" }}>

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
      <div style={{ display:"grid", gridTemplateColumns:"repeat(6,1fr)", gap:1, background:T.border, border:`1px solid ${T.border}` }}>
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
function PermanentSidebar({ view, setView }: { view: View; setView: (v: View) => void }) {
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
      <div key={label} onClick={() => setView(v)}
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
    <div style={{ width:260, flexShrink:0, background:T.panel, borderRight:`1px solid ${T.border}`, display:"flex", flexDirection:"column", boxShadow:"1px 0 4px rgba(0,0,0,0.04)" }}>
      {/* Sidebar header */}
      <div style={{ padding:"14px 18px", borderBottom:`2px solid ${T.gold}`, flexShrink:0 }}>
        <div style={{ fontFamily:"'Barlow Condensed'", fontWeight:900, fontSize:20, letterSpacing:"0.15em", color:T.text }}>KAI</div>
        <div style={{ fontFamily:"'Barlow Condensed'", fontSize:8, letterSpacing:"0.3em", color:T.gold, textTransform:"uppercase", marginTop:1 }}>DART STATION READINESS</div>
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
            <div key={key} onClick={() => setView(assetView)}
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

        <div style={{ padding:"10px 18px 4px", fontFamily:"'Barlow Condensed'", fontSize:8, fontWeight:700, letterSpacing:"0.3em", textTransform:"uppercase", color:T.textMuted, marginTop:4 }}>AI Intelligence</div>
        {navRow("Intelligence Engine","Predictions · anomalies · decisions","intelligence",<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 2L8.5 5 12 5.5 9.5 8 10 11.5 7 10 4 11.5 4.5 8 2 5.5 5.5 5z"/></svg>)}
      </div>

      {/* Sidebar footer */}
      <div style={{ padding:"10px 16px", borderTop:`1px solid ${T.border}`, flexShrink:0 }}>
        <div style={{ fontFamily:"'Barlow Condensed'", fontSize:8, letterSpacing:"0.15em", color:T.textMuted, textTransform:"uppercase" }}>KAI Facilities Management · DART Network</div>
        <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, color:T.textMuted, marginTop:2 }}>{new Date().toLocaleTimeString()}</div>
      </div>
    </div>
  );
}

/* ─── Root ───────────────────────────────────────── */
export default function DashboardDemo() {
  const [view,        setView]      = useState<View>("command");
  const [lineId,      setLineId]    = useState("red");
  const [stationId,   setStationId] = useState<string>("cityplace-up");
  const [time,        setTime]      = useState("");
  const [drawerOpen,  setDrawerOpen]= useState(false);

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("en-US", { hour12:false, hour:"2-digit", minute:"2-digit", second:"2-digit" }));
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
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
      `}</style>

      <div style={{ background:T.bg, borderRadius:8, overflow:"hidden", border:`1px solid ${T.border}`, display:"flex", flexDirection:"row", minHeight:700, fontFamily:"'Barlow',sans-serif", boxShadow:T.shadowMd, position:"relative" }}>

        {/* Permanent sidebar — always visible */}
        <PermanentSidebar view={view} setView={setView} />

        {/* Mobile slide-out drawer overlay */}
        <NavDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} view={view} setView={setView}/>

        {/* Main panel */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>

          {/* Header */}
          <div style={{ background:T.panel, borderBottom:`2px solid ${T.gold}`, padding:"0 20px 0 10px", height:52, display:"flex", alignItems:"center", gap:10, flexShrink:0, boxShadow:"0 1px 4px rgba(0,0,0,0.06)" }}>
            {/* Hamburger — only for mobile / extra-small viewports */}
            <button onClick={() => setDrawerOpen(o => !o)} title="Open navigation"
                    style={{ width:32, height:32, border:`1px solid ${T.border}`, borderRadius:4, background:"transparent", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4, flexShrink:0, transition:"background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = T.bg)}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
              <div style={{ width:13, height:1.5, background:T.text, borderRadius:1 }}/>
              <div style={{ width:13, height:1.5, background:T.text, borderRadius:1 }}/>
              <div style={{ width:13, height:1.5, background:T.text, borderRadius:1 }}/>
            </button>
            <svg width="24" height="24" viewBox="0 0 100 100" fill="none" style={{ opacity:.92, flexShrink:0 }}>
              <ellipse cx="50" cy="62" rx="22" ry="14" fill={T.gold}/>
              <circle cx="50" cy="38" r="14" fill={T.gold}/>
              <path d="M35 55 Q20 68 18 80 Q30 72 45 68" fill="#8B6914"/>
              <path d="M42 30 L44 12 M46 29 L50 10 M54 30 L56 12" stroke="#8B6914" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="56" cy="34" r="2.5" fill="#1a1a1a"/>
            </svg>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontWeight:700, fontSize:17, letterSpacing:"0.12em", color:T.text }}>KAI</div>
              <div style={{ fontFamily:"'Barlow Condensed'", fontWeight:600, fontSize:9, letterSpacing:"0.22em", color:T.gold, textTransform:"uppercase" }}>DART Station Readiness Command</div>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              {crit > 0 && <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, letterSpacing:"0.06em", color:"#C62828", background:"#FFEBEE", padding:"3px 10px", borderRadius:2 }}>{crit} CRITICAL</div>}
              {warn > 0 && <div style={{ fontFamily:"'Share Tech Mono'", fontSize:9, letterSpacing:"0.06em", color:"#E65100", background:"#FFF3E0", padding:"3px 10px", borderRadius:2 }}>{warn} ATTENTION</div>}
              <div style={{ display:"flex", alignItems:"center", gap:5, fontFamily:"'Share Tech Mono'", fontSize:9, color:T.textMuted, letterSpacing:"0.08em" }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:"#4CAF50", animation:"kdlive 1.5s infinite" }}/>
                LIVE · 65 STA
              </div>
              <div style={{ fontFamily:"'Share Tech Mono'", fontSize:12, color:T.text }}>{time}</div>
            </div>
          </div>

          {/* Nav tabs */}
          <div style={{ background:T.panel, borderBottom:`1px solid ${T.border}`, display:"flex", justifyContent:"space-between", flexShrink:0 }}>
            <div style={{ display:"flex" }}>
              <button onClick={() => setView("command")}
                      style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", padding:"10px 18px", background:"none", border:"none", cursor:"pointer", color: view === "command" ? T.text : T.textMuted, borderBottom: view === "command" ? `2px solid ${T.gold}` : "2px solid transparent", transition:"all 0.15s" }}>
                Command Center
              </button>
              {Object.entries(LINES).map(([id, l]) => (
                <button key={id} onClick={() => drill(id)}
                        style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:600, letterSpacing:"0.18em", textTransform:"uppercase", padding:"10px 14px", background:"none", border:"none", cursor:"pointer", color: view === "stations" && lineId === id ? l.color : T.textMuted, borderBottom: view === "stations" && lineId === id ? `2px solid ${l.color}` : "2px solid transparent", transition:"all 0.15s" }}>
                  {l.name.replace(" Line", "")}
                </button>
              ))}
              <button onClick={() => setView("inspect")}
                      style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", padding:"10px 18px", background:"none", border:"none", cursor:"pointer", color: view === "inspect" ? T.text : T.textMuted, borderBottom: view === "inspect" ? `2px solid ${T.gold}` : "2px solid transparent", transition:"all 0.15s" }}>
                Inspect
              </button>
              <button onClick={() => setView("intelligence")}
                      style={{ fontFamily:"'Barlow Condensed'", fontSize:10, fontWeight:600, letterSpacing:"0.22em", textTransform:"uppercase", padding:"10px 18px", background:"none", border:"none", cursor:"pointer", color: view === "intelligence" ? T.text : T.textMuted, borderBottom: view === "intelligence" ? `2px solid ${T.gold}` : "2px solid transparent", transition:"all 0.15s", display:"flex", alignItems:"center", gap:5 }}>
                <span style={{ display:"inline-block", width:5, height:5, borderRadius:"50%", background: view === "intelligence" ? "#4CAF50" : T.textMuted }}/>
                Intelligence
              </button>
            </div>
            <div style={{ display:"flex", alignItems:"center", padding:"0 18px", borderLeft:`1px solid ${T.border}` }}>
              <div style={{ fontFamily:"'Barlow Condensed'", fontSize:9, fontWeight:700, letterSpacing:"0.18em", color:T.gold }}>FIFA 2026 · 9 MATCH DAYS</div>
            </div>
          </div>

          {/* Content */}
          <div className="kd-scroll" style={{ flex:1, overflow:"hidden", display:"flex", flexDirection:"column" }}>
            {view === "command"           && <CommandCenter onDrill={drill}/>}
            {view === "stations"          && <StationView lineId={lineId} selectedId={stationId} onSelect={setStationId}/>}
            {view === "inspect"           && <InspectionView/>}
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
