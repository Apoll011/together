export type AppStatus = "launched" | "beta" | "planning";

export interface AppStat {
  value: string;
  label: string;
}

export interface HowItWorksStep {
  step: number;
  title: string;
  desc: string;
}

export interface Testimonial {
  name: string;
  role: string;
  location: string;
  quote: string;
  initials: string;
  avatarColor: string;
}

export interface RoadmapItem {
  quarter: string;
  title: string;
  desc: string;
  status: "done" | "in-progress" | "planned";
}

export interface TeamMember {
  name: string;
  role: string;
  initials: string;
}

export interface AppPlatformsUrls {
  web?: string,
  ios?: string,
  android?: string
}

export interface AppPlatforms {
  web: boolean;
  ios: boolean;
  android: boolean;
  urls?: AppPlatformsUrls
}

export interface MockupSlide {
  title: string;
  description: string;
}

export interface AppData {
  key: string;
  slug: string;
  label: string;
  tagline: string;
  description: string;
  longDescription: string;
  color: string;
  icon: React.ReactNode;
  status: AppStatus;
  isNew?: boolean;
  heroConfig: { x: number; y: number; delay: number };

  stats: AppStat[];
  features: { title: string; desc: string }[];
  howItWorks: HowItWorksStep[];
  mockups: MockupSlide[];
  testimonials: Testimonial[];
  roadmap: RoadmapItem[];
  team: TeamMember[];
  faqs: { question: string; answer: string }[];
  platforms: AppPlatforms;
  waitlistUrl?: string;
  communityCount?: string;
}

export type AppKey = AppData["key"];