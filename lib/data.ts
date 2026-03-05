/* ------------------------------------------------------------------ */
/*  Brand Colors                                                       */
/* ------------------------------------------------------------------ */

export interface BrandColors {
  name: string;
  primary: string;
  secondary: string;
  background: string;
  text: string;
  accent: string;
}

export const BRAND_PRESETS: Record<string, BrandColors> = {
  schoolregistry: {
    name: "SchoolRegistry",
    primary: "#059669",
    secondary: "#34D399",
    background: "#0F172A",
    text: "#F8FAFC",
    accent: "#F59E0B",
  },
  cdlschools: {
    name: "CDL Schools",
    primary: "#1E40AF",
    secondary: "#3B82F6",
    background: "#0F172A",
    text: "#F8FAFC",
    accent: "#F97316",
  },
  chatautomate: {
    name: "ChatAutomate",
    primary: "#7C3AED",
    secondary: "#8B5CF6",
    background: "#0F172A",
    text: "#F8FAFC",
    accent: "#F59E0B",
  },
  guardiancryo: {
    name: "GuardianCryo",
    primary: "#0D9488",
    secondary: "#14B8A6",
    background: "#0F172A",
    text: "#F8FAFC",
    accent: "#F59E0B",
  },
  custom: {
    name: "Custom",
    primary: "#3B82F6",
    secondary: "#60A5FA",
    background: "#0F172A",
    text: "#F8FAFC",
    accent: "#F59E0B",
  },
};

/* ------------------------------------------------------------------ */
/*  Projects                                                            */
/* ------------------------------------------------------------------ */

export interface ProjectColor {
  primary: string;
  secondary: string;
  light: string;
  dark: string;
}

export interface Project {
  id: number;
  slug: string;
  name: string;
  description: string;
  status: string;
  progress: number;
  team: number;
  dueDate: string;
  tasks: number;
  completed: number;
  features: string[];
  color: ProjectColor;
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "guardiancryo",
    name: "GuardianCryo",
    description: "Cryogenic shipping and storage solutions for fertility clinics",
    status: "active",
    progress: 0,
    team: 0,
    dueDate: "No deadline set",
    tasks: 0,
    completed: 0,
    features: ["Kanban Board", "Notes", "Parking Lot", "Shipping Requests"],
    color: { primary: "#0D9488", secondary: "#14B8A6", light: "#F0FDFA", dark: "#0F766E" },
  },
  {
    id: 2,
    slug: "cdl-schools",
    name: "CDL Schools",
    description: "Commercial Driver's License training and certification platform",
    status: "active",
    progress: 0,
    team: 0,
    dueDate: "No deadline set",
    tasks: 0,
    completed: 0,
    features: ["Kanban Board", "Notes", "Parking Lot", "Partner Management"],
    color: { primary: "#1E40AF", secondary: "#3B82F6", light: "#EFF6FF", dark: "#1E3A8A" },
  },
  {
    id: 3,
    slug: "chatautomate",
    name: "ChatAutomate",
    description: "chatautomate.ng - AI-powered chat automation platform",
    status: "active",
    progress: 0,
    team: 0,
    dueDate: "No deadline set",
    tasks: 0,
    completed: 0,
    features: ["Kanban Board", "Notes", "Parking Lot", "AI Analytics"],
    color: { primary: "#7C3AED", secondary: "#8B5CF6", light: "#F5F3FF", dark: "#6D28D9" },
  },
  {
    id: 4,
    slug: "schoolregistry",
    name: "SchoolRegistry",
    description: "Nigerian school registry and accreditation platform - schoolregistry.ng",
    status: "active",
    progress: 0,
    team: 0,
    dueDate: "No deadline set",
    tasks: 0,
    completed: 0,
    features: ["Kanban Board", "Notes", "Parking Lot", "School Management"],
    color: { primary: "#059669", secondary: "#10B981", light: "#ECFDF5", dark: "#047857" },
  },
  {
    id: 5,
    slug: "marks-team",
    name: "Mark's Team",
    description: "World-class project team with 5-layer structure: Ideation, Development, Marketing, Sales, Creative",
    status: "active",
    progress: 25,
    team: 8,
    dueDate: "Ongoing",
    tasks: 42,
    completed: 12,
    features: ["Enhanced Kanban", "Team Profiles", "Real-time Chat", "Task Assignment", "Performance Metrics", "Documentation Hub"],
    color: { primary: "#DC2626", secondary: "#EF4444", light: "#FEF2F2", dark: "#B91C1C" },
  },
];

/* ------------------------------------------------------------------ */
/*  Sidebar Navigation                                                 */
/* ------------------------------------------------------------------ */

export const PROJECT_NAV_ITEMS = [
  { href: "/projects/guardiancryo", iconKey: "package", label: "GuardianCryo" },
  { href: "/projects/cdl-schools", iconKey: "graduation-cap", label: "CDL Schools" },
  { href: "/projects/chatautomate", iconKey: "brain", label: "ChatAutomate" },
  { href: "/projects/schoolregistry", iconKey: "school", label: "SchoolRegistry" },
];

/* ------------------------------------------------------------------ */
/*  Data Studio Templates                                              */
/* ------------------------------------------------------------------ */

export type TemplateType = "line_race" | "bar_race" | "comparison_duel" | "stat_counter" | "stacked_area";

export interface TemplateInfo {
  id: TemplateType;
  name: string;
  description: string;
  example: string;
}

export const TEMPLATES: TemplateInfo[] = [
  { id: "line_race", name: "Line Race", description: "Animated line chart showing trends over time", example: "WAEC Performance Lagos 2016-2025" },
  { id: "bar_race", name: "Bar Race", description: "Horizontal bars reordering dynamically over time", example: "Top 10 States by WAEC Score" },
  { id: "comparison_duel", name: "Comparison Duel", description: "Head-to-head split screen comparison", example: "Lagos vs Abuja: WAEC Head-to-Head" },
  { id: "stat_counter", name: "Stat Counter", description: "Large animated number with context", example: "13,360+ Schools Verified" },
  { id: "stacked_area", name: "Stacked Area", description: "Composition changes over time", example: "Public vs Private School Growth" },
];

export const SAMPLE_DATA: Record<TemplateType, string> = {
  line_race: JSON.stringify({ title: "WAEC Performance Trend", subtitle: "National average pass rate", endNote: "72% (2025)", sourceLabel: "SchoolRegistry.ng", data: [{ year: 2016, value: 48 }, { year: 2017, value: 51 }, { year: 2018, value: 55 }, { year: 2019, value: 63 }, { year: 2020, value: 58 }, { year: 2021, value: 60 }, { year: 2022, value: 65 }, { year: 2023, value: 68 }, { year: 2024, value: 71 }, { year: 2025, value: 72 }] }, null, 2),
  bar_race: JSON.stringify({ title: "Top Schools by Enrollment", subtitle: "Verified school enrollment figures", sourceLabel: "SchoolRegistry.ng", valueSuffix: " students", maxBars: 6, data: [{ label: "Lagos Model School", values: [{ year: 2020, value: 1200 }, { year: 2023, value: 1800 }] }, { label: "Abuja International", values: [{ year: 2020, value: 900 }, { year: 2023, value: 1500 }] }, { label: "Rivers Academy", values: [{ year: 2020, value: 700 }, { year: 2023, value: 1100 }] }] }, null, 2),
  comparison_duel: JSON.stringify({ title: "Public vs Private Schools", subtitle: "Performance metrics comparison", sourceLabel: "SchoolRegistry.ng", categories: ["Pass Rate", "Enrollment", "Teacher Ratio"], left: { label: "Public Schools", values: [52, 1200, 45], color: "#059669" }, right: { label: "Private Schools", values: [78, 800, 25], color: "#3B82F6" } }, null, 2),
  stat_counter: JSON.stringify({ title: "Schools Verified", subtitle: "Across all 36 states", value: 13360, prefix: "", suffix: "+", contextLine: "And growing every day", sourceLabel: "SchoolRegistry.ng", miniChartData: [2000, 4500, 6000, 7800, 9200, 10500, 11800, 12500, 13000, 13360] }, null, 2),
  stacked_area: JSON.stringify({ title: "School Type Distribution", subtitle: "Public vs Private school growth", sourceLabel: "SchoolRegistry.ng", years: [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025], series: [{ label: "Public", values: [5000, 5200, 5100, 5400, 5700, 6000, 6200, 6500], color: "#059669" }, { label: "Private", values: [3000, 3400, 3200, 3600, 4000, 4500, 5000, 5500], color: "#3B82F6" }] }, null, 2),
};

/* ------------------------------------------------------------------ */
/*  Team Members (Mark's Team)                                         */
/* ------------------------------------------------------------------ */

export interface TeamMember {
  name: string;
  role: string;
  avatar: string;
  status: "online" | "offline" | "busy";
}

export const TEAM_MEMBERS: TeamMember[] = [
  { name: "Mark (Director)", role: "Project Director & PMO", avatar: "M", status: "online" },
  { name: "Growth Bot", role: "Growth & Revenue", avatar: "G", status: "online" },
  { name: "Ops Bot", role: "Operations & Success", avatar: "O", status: "online" },
  { name: "Engineering Bot", role: "Engineering Lead", avatar: "E", status: "online" },
  { name: "Product Bot", role: "Product Lead", avatar: "P", status: "online" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

export function getProjectBySlug(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}

export function getBrandColors(key: string): BrandColors {
  return BRAND_PRESETS[key] || BRAND_PRESETS.custom;
}
