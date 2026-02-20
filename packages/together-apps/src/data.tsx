// app/data/apps.tsx
import React from "react";
import {
  GlobalOutlined,
  ReadOutlined,
  RocketOutlined,
  HeartOutlined,
  CodeOutlined,
  CompassOutlined,
  CoffeeOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  BulbOutlined,
} from "@ant-design/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

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

  // Content sections
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

// ─── Data ─────────────────────────────────────────────────────────────────────

export const appsData: AppData[] = [
  // ── PRESERVE (Launched — full showcase) ────────────────────────────────────
  {
    key: "preserve",
    slug: "preserve",
    label: "Together We Preserve",
    tagline: "Environmental Data & Conservation",
    description:
      "Map environmental data and track conservation efforts globally.",
    longDescription:
      "Together Preserve is a decentralized, community-powered database for environmental metrics. Activists, scientists, and citizens contribute to a living map of our planet's health — tracking deforestation rates, water quality, air pollution, and biodiversity in real-time. Every data point is verified by the community and permanently stored on an immutable ledger, creating the most trustworthy environmental record on the planet.",
    color: "#52c41a",
    icon: <GlobalOutlined />,
    status: "launched",
    heroConfig: { x: 0, y: -160, delay: 0 },
    communityCount: "84,200+",

    stats: [
      { value: "84,200+", label: "Active Contributors" },
      { value: "2.1M", label: "Data Points Logged" },
      { value: "190+", label: "Countries Covered" },
      { value: "98%", label: "Data Verification Rate" },
    ],

    features: [
      {
        title: "Real-time Global Map",
        desc: "Explore a live 3D globe showing environmental data contributed by people worldwide. Filter by category, date range, or severity.",
      },
      {
        title: "Blockchain Verification",
        desc: "Every data point is backed by community consensus and cryptographic proof, ensuring integrity you can actually trust.",
      },
      {
        title: "Open Data API",
        desc: "Researchers, NGOs, and journalists access the full raw dataset for free via our RESTful API — no rate limits, ever.",
      },
      {
        title: "Alert System",
        desc: "Subscribe to geofenced alerts for your region. Be the first to know when air quality drops or deforestation is detected.",
      },
      {
        title: "Carbon Calculator",
        desc: "Measure and offset your personal carbon footprint directly within the app, connected to real reforestation projects.",
      },
      {
        title: "Species Tracker",
        desc: "Log wildlife sightings and contribute to the most comprehensive community-sourced biodiversity database ever built.",
      },
    ],

    howItWorks: [
      {
        step: 1,
        title: "Observe & Capture",
        desc: "Use your phone to photograph, measure, or record any environmental metric — from a dying river to a thriving coral reef.",
      },
      {
        step: 2,
        title: "Submit & Describe",
        desc: "Tag your location, add context, and submit. Our AI pre-validates the data before it goes to community review.",
      },
      {
        step: 3,
        title: "Community Verifies",
        desc: "Nearby contributors and domain experts review and confirm your submission through our proof-of-stake consensus.",
      },
      {
        step: 4,
        title: "Data Goes Live",
        desc: "Verified data appears instantly on the global map, in the open API, and in government and NGO dashboards worldwide.",
      },
    ],

    mockups: [
      {
        title: "Global Map View",
        description:
          "Interactive 3D globe with layered data filters — air, water, land, and biodiversity.",
      },
      {
        title: "Data Submission",
        description:
          "Clean, guided form for submitting environmental observations from anywhere in the world.",
      },
      {
        title: "Verification Feed",
        description:
          "Community review queue where experts confirm and contextualize incoming data points.",
      },
      {
        title: "Personal Dashboard",
        description:
          "Your contribution history, earned badges, and the measurable impact of your data.",
      },
    ],

    testimonials: [
      {
        name: "Dr. Amara Osei",
        role: "Environmental Scientist",
        location: "Accra, Ghana",
        quote:
          "Preserve gave our research team access to ground-truth data from rural communities that satellite imagery simply cannot capture. It's become indispensable.",
        initials: "AO",
        avatarColor: "#52c41a",
      },
      {
        name: "Luisa Fernández",
        role: "Climate Activist",
        location: "Bogotá, Colombia",
        quote:
          "I've been logging deforestation near my village for two years. Last month, that data was cited in a congressional hearing. This platform gives citizens a real voice.",
        initials: "LF",
        avatarColor: "#237804",
      },
      {
        name: "Kenji Watanabe",
        role: "Marine Biologist",
        location: "Okinawa, Japan",
        quote:
          "The coral reef bleaching data on Preserve is more granular and up-to-date than anything our institution could produce alone. The community is extraordinary.",
        initials: "KW",
        avatarColor: "#52c41a",
      },
    ],

    roadmap: [
      {
        quarter: "Q1 2024",
        title: "Global Launch",
        desc: "Public launch with map, submission, and verification system.",
        status: "done",
      },
      {
        quarter: "Q2 2024",
        title: "Open API v1",
        desc: "Released free public API with full dataset access.",
        status: "done",
      },
      {
        quarter: "Q3 2024",
        title: "Mobile Apps",
        desc: "Native iOS and Android apps with offline data capture.",
        status: "done",
      },
      {
        quarter: "Q4 2024",
        title: "AI Anomaly Detection",
        desc: "Machine learning layer that flags unusual environmental changes automatically.",
        status: "in-progress",
      },
      {
        quarter: "Q1 2025",
        title: "Government Integrations",
        desc: "Direct data pipeline integrations with 12 national environmental agencies.",
        status: "planned",
      },
      {
        quarter: "Q2 2025",
        title: "Predictive Modeling",
        desc: "Community-trained models predicting deforestation and pollution events before they happen.",
        status: "planned",
      },
    ],

    team: [
      { name: "Sofia Reyes", role: "Product Lead", initials: "SR" },
      { name: "James Okafor", role: "Lead Engineer", initials: "JO" },
      { name: "Priya Nair", role: "Data Science", initials: "PN" },
      { name: "Tom Eriksson", role: "Community", initials: "TE" },
      { name: "Mia Chen", role: "Design", initials: "MC" },
    ],

    faqs: [
      {
        question: "Is all the data publicly available?",
        answer:
          "Yes. Every verified data point on Preserve is open source and accessible via our free API, CSV export, or the map interface.",
      },
      {
        question: "How do you prevent bad data?",
        answer:
          "We use a two-layer system: an AI pre-filter that catches obvious errors, then a community consensus mechanism where trusted contributors verify submissions before they go live.",
      },
      {
        question: "Can I use Preserve data in academic research?",
        answer:
          "Absolutely. We provide a citeable DOI for the full dataset and have a dedicated research portal with export tools tailored for academic use.",
      },
      {
        question: "Is the mobile app free?",
        answer:
          "Yes, the app is completely free on iOS and Android with no ads and no premium tier. We are funded by grants and institutional partnerships.",
      },
    ],

    platforms: { web: true, ios: true, android: true, urls: {web: "http://localhost:3002"} },
  },

  // ── LEARN (Planning) ────────────────────────────────────────────────────────
  {
    key: "learn",
    slug: "learn",
    label: "Together We Learn",
    tagline: "Collaborative Knowledge for Everyone",
    description:
      "Collaborative courses and wikis for community knowledge sharing.",
    longDescription:
      "Together Learn is a next-generation Learning Management System built for real communities — not corporations. Create courses, host living wikis, and earn certifications recognized across the entire Together ecosystem. Designed specifically for adults with limited time, including those returning to education and communities with low connectivity.",
    color: "#fa8c16",
    icon: <ReadOutlined />,
    status: "planning",
    isNew: true,
    heroConfig: { x: 180, y: -60, delay: 1 },
    communityCount: "12,400 on waitlist",

    stats: [
      { value: "12,400+", label: "Waitlist Members" },
      { value: "340+", label: "Courses Planned" },
      { value: "60+", label: "Community Educators" },
      { value: "28", label: "Languages Targeted" },
    ],

    features: [
      {
        title: "Peer-Reviewed Assignments",
        desc: "Work is evaluated by fellow community members, not just AI — building real human connections around learning.",
      },
      {
        title: "Offline-First Design",
        desc: "Download entire courses for use in areas with limited or no internet access. Sync when connected.",
      },
      {
        title: "Skill Graph",
        desc: "Visualize your learning path, see what skills unlock others, and connect with mentors who've walked the same road.",
      },
      {
        title: "Adaptive Learning",
        desc: "AI-powered modules that adapt to your pace and schedule — a full lesson in 10 minutes or an hour, your choice.",
      },
      {
        title: "Community Certifications",
        desc: "Earn credentials verified and recognized across the Together ecosystem and its partner organizations worldwide.",
      },
      {
        title: "Live Study Groups",
        desc: "Join real-time or async study groups with learners worldwide who are working through the same material.",
      },
    ],

    howItWorks: [
      {
        step: 1,
        title: "Choose Your Path",
        desc: "Browse community-created courses or let the skill graph recommend what to learn next based on your goals.",
      },
      {
        step: 2,
        title: "Learn at Your Pace",
        desc: "Consume content in micro-sessions or deep dives — the app saves your exact position and adapts to your schedule.",
      },
      {
        step: 3,
        title: "Practice & Be Reviewed",
        desc: "Complete assignments and receive thoughtful feedback from peer reviewers in your learning community.",
      },
      {
        step: 4,
        title: "Earn & Share",
        desc: "Receive verified certifications, add them to your Together profile, and help teach others what you've learned.",
      },
    ],

    mockups: [
      {
        title: "Course Discovery",
        description:
          "Browse courses by skill, language, time commitment, or community rating.",
      },
      {
        title: "Lesson Player",
        description:
          "Distraction-free reading and video interface with note-taking built in.",
      },
      {
        title: "Skill Graph",
        description:
          "Visual map of your skills, progress, and the paths that lie ahead.",
      },
      {
        title: "Community Feed",
        description:
          "See what peers are learning, ask questions, and celebrate milestones together.",
      },
    ],

    testimonials: [
      {
        name: "Maria da Silva",
        role: "Adult Learner",
        location: "São Paulo, Brazil",
        quote:
          "I'm 42 and never finished school. Knowing this platform was built for people like me — not students — makes all the difference. I can't wait.",
        initials: "MS",
        avatarColor: "#fa8c16",
      },
      {
        name: "Ethan Okonkwo",
        role: "Community Educator",
        location: "Lagos, Nigeria",
        quote:
          "I've been teaching informally for years. Having a real platform to host my courses and issue certificates will change what I can offer my community.",
        initials: "EO",
        avatarColor: "#d46b08",
      },
    ],

    roadmap: [
      {
        quarter: "Q2 2025",
        title: "Creator Beta",
        desc: "First cohort of educators build and test course creation tools.",
        status: "planned",
      },
      {
        quarter: "Q3 2025",
        title: "Learner Waitlist Access",
        desc: "Waitlist members get early access to the first 50 courses.",
        status: "planned",
      },
      {
        quarter: "Q4 2025",
        title: "Public Launch",
        desc: "Full public launch with certification system and skill graph.",
        status: "planned",
      },
      {
        quarter: "Q1 2026",
        title: "Offline Mode & Mobile",
        desc: "Native apps with full offline course downloads.",
        status: "planned",
      },
    ],

    team: [
      { name: "Ana Luiza Costa", role: "Product Lead", initials: "AL" },
      { name: "Samuel Adeyemi", role: "Curriculum Design", initials: "SA" },
      { name: "Nina Petrov", role: "Engineering", initials: "NP" },
    ],

    faqs: [
      {
        question: "When will Together Learn launch?",
        answer:
          "We're targeting a creator beta in Q2 2025, with public access opening in Q4 2025. Join the waitlist to get notified first.",
      },
      {
        question: "Will courses be free?",
        answer:
          "Most community-created courses will be free. Creators can optionally set a price, which goes directly to them — Together takes no cut.",
      },
      {
        question: "How will it work for people with low connectivity?",
        answer:
          "We're designing offline-first from day one. You'll be able to download an entire course over Wi-Fi and complete it anywhere.",
      },
    ],

    platforms: { web: true, ios: true, android: true },
    waitlistUrl: "#waitlist",
  },

  // ── WORK (Planning) ─────────────────────────────────────────────────────────
  {
    key: "work",
    slug: "work",
    label: "Together We Work",
    tagline: "Async Collaboration for Distributed Teams",
    description: "Async tools for distributed teams to build faster.",
    longDescription:
      "The traditional office is obsolete. Together Work provides a complete suite of asynchronous collaboration tools — kanban boards, shared whiteboards, decision logs, and governance voting — designed from the ground up for decentralized teams, DAOs, and remote-first organizations that span continents and time zones.",
    color: "#0050B3",
    icon: <RocketOutlined />,
    status: "planning",
    heroConfig: { x: -180, y: -40, delay: 2 },
    communityCount: "8,100 on waitlist",

    stats: [
      { value: "8,100+", label: "Teams on Waitlist" },
      { value: "120+", label: "DAOs Interested" },
      { value: "45", label: "Countries Represented" },
      { value: "Async", label: "First Principle" },
    ],

    features: [
      {
        title: "Governance & Voting",
        desc: "Integrated polling, token-weighted voting, and consensus tools for teams making decisions without meetings.",
      },
      {
        title: "Crypto Payroll",
        desc: "Automate recurring payroll and one-off bounties in stablecoins — across borders, without banks.",
      },
      {
        title: "Timezone Intelligence",
        desc: "Smart scheduler that maps your team's working hours and finds genuine overlap without making anyone sacrifice sleep.",
      },
      {
        title: "Decision Logs",
        desc: "Every team decision is documented, searchable, and traceable — so new members can understand the why, not just the what.",
      },
      {
        title: "Kanban & Sprints",
        desc: "Flexible project boards that work for both structured sprints and open-ended async workflows.",
      },
      {
        title: "Video Memos",
        desc: "Record short async video updates instead of scheduling meetings — your team watches when it works for them.",
      },
    ],

    howItWorks: [
      {
        step: 1,
        title: "Set Up Your Workspace",
        desc: "Create your organization, invite team members, and configure your governance and payment preferences.",
      },
      {
        step: 2,
        title: "Define Work Structures",
        desc: "Build kanban boards, set recurring cycles, and create a decision log template that matches how your team thinks.",
      },
      {
        step: 3,
        title: "Work Across Time Zones",
        desc: "Post updates, make proposals, and move work forward asynchronously — no one needs to be online at the same time.",
      },
      {
        step: 4,
        title: "Reward & Compensate",
        desc: "Trigger payroll, distribute bounties, and recognize contributions — all automated within the platform.",
      },
    ],

    mockups: [
      {
        title: "Team Dashboard",
        description:
          "At-a-glance view of all active projects, pending decisions, and upcoming async deadlines.",
      },
      {
        title: "Voting Interface",
        description:
          "Clean proposal and voting UI — see who's voted, the current result, and the full discussion thread.",
      },
      {
        title: "Timezone Map",
        description:
          "Visual map of your team's working hours across the globe, with optimal meeting windows highlighted.",
      },
      {
        title: "Payroll Settings",
        description:
          "Configure stablecoin payroll schedules and one-click bounty distribution.",
      },
    ],

    testimonials: [
      {
        name: "Yuki Tanaka",
        role: "DAO Core Contributor",
        location: "Tokyo, Japan",
        quote:
          "We've tried every async tool out there. None of them understand DAOs. Together Work actually gets how decentralized organizations make decisions.",
        initials: "YT",
        avatarColor: "#0050B3",
      },
      {
        name: "Rafael Morales",
        role: "Remote Team Lead",
        location: "Buenos Aires, Argentina",
        quote:
          "The timezone intelligence feature alone would save us two hours a week of scheduling back-and-forth. And the crypto payroll is a game-changer for our international team.",
        initials: "RM",
        avatarColor: "#003a8c",
      },
    ],

    roadmap: [
      {
        quarter: "Q3 2025",
        title: "Alpha — Kanban & Decisions",
        desc: "Core async project management and decision log for early access teams.",
        status: "planned",
      },
      {
        quarter: "Q4 2025",
        title: "Governance & Voting",
        desc: "Full voting and proposal system for DAO and team governance.",
        status: "planned",
      },
      {
        quarter: "Q1 2026",
        title: "Crypto Payroll Beta",
        desc: "Automated stablecoin payroll and bounty distribution.",
        status: "planned",
      },
      {
        quarter: "Q2 2026",
        title: "Public Launch",
        desc: "Full public release with all features and native mobile apps.",
        status: "planned",
      },
    ],

    team: [
      { name: "Carlos Vega", role: "Product Lead", initials: "CV" },
      { name: "Aiko Suzuki", role: "Engineering", initials: "AS" },
      { name: "Lena Braun", role: "Design", initials: "LB" },
    ],

    faqs: [
      {
        question: "Does this work for regular companies, not just DAOs?",
        answer:
          "Absolutely. The governance tools are optional — you can use Together Work as a straightforward async collaboration suite without any crypto or voting features.",
      },
      {
        question: "Which stablecoins will payroll support?",
        answer:
          "We're targeting USDC and DAI at launch, with plans to support additional tokens based on community demand.",
      },
    ],

    platforms: { web: true, ios: true, android: true },
    waitlistUrl: "#waitlist",
  },

  // ── HELP (Planning) ─────────────────────────────────────────────────────────
  {
    key: "help",
    slug: "help",
    label: "Together We Help",
    tagline: "A Mesh Network for Human Kindness",
    description: "Community aid, crisis response, and mutual support.",
    longDescription:
      "A mesh network for human kindness. Together Help connects you with the people around you — to offer help, ask for it, or coordinate responses to local crises. Whether it's a neighbor who needs a ride to a hospital or a community recovering from a flood, Help makes mutual aid as easy as sending a message.",
    color: "#eb2f96",
    icon: <HeartOutlined />,
    status: "planning",
    heroConfig: { x: 140, y: 100, delay: 3 },
    communityCount: "19,500 on waitlist",

    stats: [
      { value: "19,500+", label: "People on Waitlist" },
      { value: "850+", label: "Communities Mapped" },
      { value: "72hrs", label: "Avg Crisis Response Target" },
      { value: "Privacy", label: "Core Principle" },
    ],

    features: [
      {
        title: "Geofenced Alerts",
        desc: "When urgent help is needed, nearby community members get notified automatically — no shouting into the void.",
      },
      {
        title: "Resource Pooling",
        desc: "Manage shared community inventories — tools, food, medicine, vehicles — and see who has what in real-time.",
      },
      {
        title: "Privacy by Design",
        desc: "Precise locations are never stored or shared. All location data is obfuscated to protect vulnerable users.",
      },
      {
        title: "Crisis Coordination",
        desc: "Purpose-built tools for coordinating community response during floods, fires, power outages, and other emergencies.",
      },
      {
        title: "Skills Matching",
        desc: "Match people with the right skills — nursing, carpentry, translation — to the neighbors who need them most.",
      },
      {
        title: "Long-term Projects",
        desc: "Organize ongoing mutual aid initiatives — community gardens, elder care networks, neighborhood watch programs.",
      },
    ],

    howItWorks: [
      {
        step: 1,
        title: "Join Your Community",
        desc: "Set your neighborhood radius. Your identity stays private — you're just a helpful neighbor in your zone.",
      },
      {
        step: 2,
        title: "Offer or Request",
        desc: "Post what you can offer (skills, resources, time) or what you need. The platform matches you with people nearby.",
      },
      {
        step: 3,
        title: "Connect Safely",
        desc: "Communicate through the platform without sharing personal contact details until you're ready.",
      },
      {
        step: 4,
        title: "Help Happens",
        desc: "Log the interaction, build community trust scores, and watch your neighborhood grow stronger over time.",
      },
    ],

    mockups: [
      {
        title: "Neighborhood Map",
        description:
          "Anonymous map showing active requests and offers in your local area.",
      },
      {
        title: "Crisis Board",
        description:
          "Centralized coordination view for community emergencies — tasks, resources, and who's helping.",
      },
      {
        title: "Request Form",
        description:
          "Simple, guided form to post a help request with optional urgency level and skill requirements.",
      },
      {
        title: "Resource Inventory",
        description:
          "Community-managed inventory of shared tools, food stores, and emergency supplies.",
      },
    ],

    testimonials: [
      {
        name: "Ngozi Adebayo",
        role: "Community Organizer",
        location: "Nairobi, Kenya",
        quote:
          "We've been running mutual aid networks on WhatsApp for years. Something purpose-built for this, with privacy protection, would transform what we can do.",
        initials: "NA",
        avatarColor: "#eb2f96",
      },
      {
        name: "Dimitri Papadopoulos",
        role: "Volunteer Coordinator",
        location: "Athens, Greece",
        quote:
          "During the 2023 wildfires, coordination was chaos. A tool designed for exactly this kind of crisis response would have saved lives.",
        initials: "DP",
        avatarColor: "#9e1068",
      },
    ],

    roadmap: [
      {
        quarter: "Q2 2025",
        title: "Pilot Communities",
        desc: "Launch in 5 partner communities across 4 continents to test core help/offer matching.",
        status: "planned",
      },
      {
        quarter: "Q3 2025",
        title: "Crisis Mode",
        desc: "Dedicated emergency coordination features tested with disaster response organizations.",
        status: "planned",
      },
      {
        quarter: "Q4 2025",
        title: "Resource Pooling",
        desc: "Community inventory management for shared physical resources.",
        status: "planned",
      },
      {
        quarter: "Q1 2026",
        title: "Public Launch",
        desc: "Open to all communities worldwide with full privacy and safety features.",
        status: "planned",
      },
    ],

    team: [
      { name: "Amina Diallo", role: "Community Lead", initials: "AD" },
      { name: "Pedro Alves", role: "Engineering", initials: "PA" },
      { name: "Sara Kim", role: "Safety & Privacy", initials: "SK" },
    ],

    faqs: [
      {
        question: "How do you protect vulnerable users?",
        answer:
          "We never store precise GPS coordinates. Location is obfuscated to a neighborhood radius, and all communication happens through the platform until both parties choose to share direct contact.",
      },
      {
        question: "Can Together Help be used for disaster response?",
        answer:
          "Yes — Crisis Mode is a core feature. We're designing it in partnership with disaster relief organizations to ensure it meets real-world emergency requirements.",
      },
    ],

    platforms: { web: true, ios: true, android: true },
    waitlistUrl: "#waitlist",
  },

  // ── CODE (Planning) ─────────────────────────────────────────────────────────
  {
    key: "code",
    slug: "code",
    label: "Together We Code",
    tagline: "Open Source Foundry",
    description: "Open-source contribution platform and bounty network.",
    longDescription:
      "The engine room of the Together ecosystem. Together Code helps developers discover meaningful open-source issues, fund critical dependencies, and collaborate on the infrastructure that powers everything Together builds. It's the platform for people who want their code to matter beyond a corporate sprint.",
    color: "#13c2c2",
    icon: <CodeOutlined />,
    status: "planning",
    heroConfig: { x: -120, y: 140, delay: 4 },
    communityCount: "6,800 on waitlist",

    stats: [
      { value: "6,800+", label: "Developers on Waitlist" },
      { value: "$240K", label: "Bounties Planned" },
      { value: "Open", label: "Source First" },
      { value: "∞", label: "Issues to Fix" },
    ],

    features: [
      {
        title: "Bounty Network",
        desc: "Get paid in crypto to fix critical bugs and implement features in open-source projects that matter.",
      },
      {
        title: "One-Click Dev Environments",
        desc: "Spin up a fully configured cloud development environment for any repository in under 60 seconds.",
      },
      {
        title: "Good First Issue Matching",
        desc: "AI that matches developers to issues based on their skill level, language preference, and the time they have available.",
      },
      {
        title: "Dependency Funding",
        desc: "Discover and fund the unmaintained open-source libraries your favorite apps depend on.",
      },
      {
        title: "Hackathon Hub",
        desc: "Join virtual hackathons organized around Together platform features, with real bounties and community recognition.",
      },
      {
        title: "Contributor Profiles",
        desc: "Build a verifiable public record of your open-source contributions — portable across platforms.",
      },
    ],

    howItWorks: [
      {
        step: 1,
        title: "Set Your Stack",
        desc: "Tell us your languages, frameworks, and the time you have. We match you to relevant issues instantly.",
      },
      {
        step: 2,
        title: "Pick an Issue",
        desc: "Browse curated issues with bounties attached — from first-timer bugs to complex architectural challenges.",
      },
      {
        step: 3,
        title: "Code in the Cloud",
        desc: "Launch a pre-configured dev environment and start working. No local setup, no dependency hell.",
      },
      {
        step: 4,
        title: "Submit & Earn",
        desc: "Open a PR, get reviewed by maintainers, and receive your bounty automatically on merge.",
      },
    ],

    mockups: [
      {
        title: "Issue Discovery",
        description:
          "Personalized feed of open-source issues matched to your skills and availability.",
      },
      {
        title: "Bounty Board",
        description:
          "Real-time board of funded issues sorted by reward, difficulty, and time to close.",
      },
      {
        title: "Cloud IDE",
        description:
          "Browser-based VS Code-compatible environment with repo already cloned and configured.",
      },
      {
        title: "Contributor Profile",
        description:
          "Public portfolio of verified open-source contributions with impact metrics.",
      },
    ],

    testimonials: [
      {
        name: "Ava Williams",
        role: "Open Source Maintainer",
        location: "Austin, USA",
        quote:
          "Maintaining an open source project with 200k users and zero funding is exhausting. A bounty network like this could finally make the math work for contributors.",
        initials: "AW",
        avatarColor: "#13c2c2",
      },
      {
        name: "Hiroshi Kimura",
        role: "Self-Taught Developer",
        location: "Osaka, Japan",
        quote:
          "I learned to code on YouTube and never had a traditional path into the industry. A platform that pays for real open source work could be my break.",
        initials: "HK",
        avatarColor: "#006d75",
      },
    ],

    roadmap: [
      {
        quarter: "Q3 2025",
        title: "Developer Preview",
        desc: "Invite-only access for early contributors and open-source maintainers.",
        status: "planned",
      },
      {
        quarter: "Q4 2025",
        title: "Bounty Network Launch",
        desc: "First $100K in bounties distributed across Together platform issues.",
        status: "planned",
      },
      {
        quarter: "Q1 2026",
        title: "Cloud Environments",
        desc: "One-click dev environment launch for any public GitHub/GitLab repository.",
        status: "planned",
      },
    ],

    team: [
      { name: "Leo Park", role: "Lead Engineer", initials: "LP" },
      { name: "Fatima Zahra", role: "Developer Relations", initials: "FZ" },
    ],

    faqs: [
      {
        question: "What currencies are bounties paid in?",
        answer:
          "At launch, bounties will be paid in USDC. We'll add more options based on community preference.",
      },
      {
        question: "Can I contribute to non-Together projects?",
        answer:
          "Yes. While Together Code prioritizes the ecosystem's own open-source projects, the bounty network will include high-impact external OSS projects too.",
      },
    ],

    platforms: { web: true, ios: false, android: false },
    waitlistUrl: "#waitlist",
  },

  // ── EAT (Planning) ──────────────────────────────────────────────────────────
  {
    key: "eat",
    slug: "eat",
    label: "Together We Eat",
    tagline: "End Food Waste. Fight Hunger.",
    description:
      "Connect food donors with nonprofits to fight waste and hunger.",
    longDescription:
      "Every year, one-third of all food produced globally is wasted — while 800 million people go hungry. Together Eat is a real-time logistics platform connecting restaurants, supermarkets, and households who have surplus food with the nonprofits and community kitchens who need it. Zero waste. Zero hunger. Together.",
    color: "#d4380d",
    icon: <CoffeeOutlined />,
    status: "planning",
    heroConfig: { x: 160, y: -100, delay: 5 },
    communityCount: "22,000 on waitlist",

    stats: [
      { value: "22,000+", label: "People on Waitlist" },
      { value: "1/3", label: "of All Food Is Wasted" },
      { value: "800M", label: "People Face Hunger" },
      { value: "0", label: "Our Target for Both" },
    ],

    features: [
      {
        title: "Surplus Matching",
        desc: "Restaurants and supermarkets post surplus food in real-time. Nearby nonprofits and kitchens claim it instantly.",
      },
      {
        title: "Pickup Logistics",
        desc: "Volunteer pickup coordination built in — no nonprofit needs their own logistics team to receive donations.",
      },
      {
        title: "Nutrition Tracker",
        desc: "Track the nutritional content of food distributed to ensure communities receive balanced, healthy donations.",
      },
      {
        title: "Impact Dashboard",
        desc: "Donors see exactly how much food they've saved, how many meals they've provided, and the CO₂ they've offset.",
      },
      {
        title: "Healthy Recipes",
        desc: "Community-contributed recipes built around commonly donated ingredients — making surplus food delicious.",
      },
      {
        title: "Corporate Programs",
        desc: "Tools for restaurants and grocery chains to build structured, reportable food donation programs with zero extra work.",
      },
    ],

    howItWorks: [
      {
        step: 1,
        title: "Post Surplus",
        desc: "A restaurant, store, or household lists available food — item, quantity, pickup window, and location.",
      },
      {
        step: 2,
        title: "Organizations Claim",
        desc: "Verified local nonprofits and community kitchens receive an alert and claim what they can use.",
      },
      {
        step: 3,
        title: "Volunteer Pickup",
        desc: "Nearby volunteers are matched for pickup and delivery if the organization needs transport support.",
      },
      {
        step: 4,
        title: "Impact Is Measured",
        desc: "Every transaction is logged — meals served, food saved, emissions avoided — and shared with all participants.",
      },
    ],

    mockups: [
      {
        title: "Donation Feed",
        description:
          "Real-time map and list of available food donations in your area, updated minute-by-minute.",
      },
      {
        title: "Post Surplus",
        description:
          "Quick, photo-first form for businesses to list surplus food in under 60 seconds.",
      },
      {
        title: "Impact Report",
        description:
          "Beautiful, shareable impact dashboards for donors — perfect for social media and CSR reporting.",
      },
      {
        title: "Recipe Library",
        description:
          "Community recipes centered around commonly donated foods like bread, produce, and prepared meals.",
      },
    ],

    testimonials: [
      {
        name: "Chioma Obi",
        role: "Food Bank Director",
        location: "Abuja, Nigeria",
        quote:
          "Our biggest challenge isn't the need — it's the logistics. A real-time matching platform would let us feed three times as many people with the same team.",
        initials: "CO",
        avatarColor: "#d4380d",
      },
      {
        name: "Paolo Ricci",
        role: "Restaurant Owner",
        location: "Milan, Italy",
        quote:
          "We throw away 15kg of food every service. I've been trying to find an easy way to donate it for years. This is exactly what the industry needs.",
        initials: "PR",
        avatarColor: "#ad2102",
      },
    ],

    roadmap: [
      {
        quarter: "Q2 2025",
        title: "City Pilots",
        desc: "Launch in 3 cities with partner restaurants, supermarkets, and food banks.",
        status: "planned",
      },
      {
        quarter: "Q3 2025",
        title: "Volunteer Network",
        desc: "Integrated volunteer pickup and delivery coordination.",
        status: "planned",
      },
      {
        quarter: "Q1 2026",
        title: "Corporate Partnerships",
        desc: "Structured donation programs for national restaurant and grocery chains.",
        status: "planned",
      },
      {
        quarter: "Q2 2026",
        title: "Global Launch",
        desc: "Open platform to all cities worldwide with full localization.",
        status: "planned",
      },
    ],

    team: [
      { name: "Isabela Cunha", role: "Product Lead", initials: "IC" },
      { name: "Marcus Webb", role: "Logistics Engineer", initials: "MW" },
      { name: "Yara Hassan", role: "Nonprofit Relations", initials: "YH" },
    ],

    faqs: [
      {
        question: "Who can post food donations?",
        answer:
          "Anyone — restaurants, supermarkets, caterers, bakeries, households, and farms. We verify business donors to ensure food safety standards are met.",
      },
      {
        question: "How do you ensure food safety?",
        answer:
          "All food donors complete a food safety checklist before posting. Nonprofits flag any issues, which affects the donor's trust score.",
      },
    ],

    platforms: { web: true, ios: true, android: true },
    waitlistUrl: "#waitlist",
  },

  // ── SUPPORT (Planning) ──────────────────────────────────────────────────────
  {
    key: "support",
    slug: "support",
    label: "Together We Support",
    tagline: "Mental Health Without Stigma",
    description:
      "Comprehensive mental health and addiction support for everyone.",
    longDescription:
      "Mental health care shouldn't be a privilege. Together Support is a safe, stigma-free platform providing access to virtual therapy, peer support groups, guided mental health tools, and addiction recovery resources — for everyone, regardless of income or insurance. We're not replacing therapists; we're making sure no one ever waits alone.",
    color: "#722ed1",
    icon: <SafetyOutlined />,
    status: "planning",
    heroConfig: { x: -160, y: 80, delay: 6 },
    communityCount: "31,000 on waitlist",

    stats: [
      { value: "31,000+", label: "People on Waitlist" },
      { value: "1 in 4", label: "People Face Mental Health Issues" },
      { value: "75%", label: "Never Receive Treatment" },
      { value: "Safe", label: "Space for All" },
    ],

    features: [
      {
        title: "Virtual Therapy Access",
        desc: "Connect with licensed therapists via text, audio, or video — with sliding scale pricing based on what you can afford.",
      },
      {
        title: "Peer Support Circles",
        desc: "Moderated group sessions run by trained peer supporters — people with lived experience of the same challenges.",
      },
      {
        title: "Daily Mental Health Tools",
        desc: "Guided breathing, CBT exercises, mood journals, and grounding techniques available 24/7, no appointment needed.",
      },
      {
        title: "Addiction Recovery Paths",
        desc: "Structured recovery programs for substance use and behavioral addictions, supported by community sponsors.",
      },
      {
        title: "Crisis Line Integration",
        desc: "One-tap access to verified crisis support lines and emergency services, localized to your country.",
      },
      {
        title: "Anonymous Mode",
        desc: "Participate in communities and access all tools with zero identifying information required — safety first.",
      },
    ],

    howItWorks: [
      {
        step: 1,
        title: "Start Anonymously",
        desc: "No name, no email required to begin. Access self-guided tools and community spaces immediately.",
      },
      {
        step: 2,
        title: "Find Your Support",
        desc: "Choose from self-guided tools, peer support groups, or connection with a licensed therapist at your pace.",
      },
      {
        step: 3,
        title: "Build Your Practice",
        desc: "Track your mood, complete daily exercises, and build the mental health habits that work for you.",
      },
      {
        step: 4,
        title: "Grow With Community",
        desc: "When you're ready, contribute to peer support spaces — your experience could be someone else's lifeline.",
      },
    ],

    mockups: [
      {
        title: "Daily Check-In",
        description:
          "Warm, non-clinical mood and wellbeing tracking with guided reflection prompts.",
      },
      {
        title: "Support Circles",
        description:
          "Intimate group spaces with topic-specific communities and trained peer moderators.",
      },
      {
        title: "Therapy Matching",
        description:
          "Therapist profiles, specializations, availability, and pricing — matched to your needs.",
      },
      {
        title: "Recovery Path",
        description:
          "Structured, milestone-based recovery programs with community accountability partners.",
      },
    ],

    testimonials: [
      {
        name: "Anonymous",
        role: "Waitlist Member",
        location: "United States",
        quote:
          "I make too much for assistance and too little for a therapist. I've been on a waiting list for 8 months. I need this platform to exist.",
        initials: "A",
        avatarColor: "#722ed1",
      },
      {
        name: "Dr. Fatou Diallo",
        role: "Psychiatrist",
        location: "Dakar, Senegal",
        quote:
          "In Senegal, the ratio of psychiatrists to population is 1 per 800,000 people. A platform that scales peer support intelligently could save lives at a national level.",
        initials: "FD",
        avatarColor: "#531dab",
      },
    ],

    roadmap: [
      {
        quarter: "Q3 2025",
        title: "Self-Guided Tools Beta",
        desc: "CBT exercises, mood tracking, and breathing tools — no account required.",
        status: "planned",
      },
      {
        quarter: "Q4 2025",
        title: "Peer Support Circles",
        desc: "Launch moderated group spaces with trained peer support leaders.",
        status: "planned",
      },
      {
        quarter: "Q1 2026",
        title: "Therapy Marketplace",
        desc: "Connect with licensed therapists at sliding-scale pricing.",
        status: "planned",
      },
      {
        quarter: "Q2 2026",
        title: "Recovery Programs",
        desc: "Structured, community-supported addiction and behavioral recovery paths.",
        status: "planned",
      },
    ],

    team: [
      { name: "Dr. Leila Hosseini", role: "Clinical Lead", initials: "LH" },
      { name: "Omar Shaikh", role: "Product", initials: "OS" },
      { name: "Grace Lee", role: "Safety & Moderation", initials: "GL" },
    ],

    faqs: [
      {
        question: "Is this a replacement for professional therapy?",
        answer:
          "No — Together Support complements professional care. It provides tools and community for the 75% of people with mental health needs who currently receive no care at all.",
      },
      {
        question: "How do you ensure safety in peer support spaces?",
        answer:
          "All peer support circles are moderated by trained facilitators. We have strict community guidelines, anonymous reporting, and 24/7 safety team coverage.",
      },
    ],

    platforms: { web: true, ios: true, android: true },
    waitlistUrl: "#waitlist",
  },

  // ── TRANSFORM (Planning) ────────────────────────────────────────────────────
  {
    key: "transform",
    slug: "transform",
    label: "Together We Transform",
    tagline: "Habits That Actually Stick",
    description:
      "Personal transformation through community-driven fitness and habits.",
    longDescription:
      "Most fitness apps are built for people who are already fit. Together Transform is different — it's a holistic personal transformation platform that combines adaptive workout plans, habit building, nutrition guidance, and real community accountability. Built for real people, real starting points, real lives.",
    color: "#fa541c",
    icon: <ThunderboltOutlined />,
    status: "planning",
    heroConfig: { x: 100, y: -80, delay: 7 },
    communityCount: "27,500 on waitlist",

    stats: [
      { value: "27,500+", label: "People on Waitlist" },
      { value: "80%", label: "of New Year Resolutions Fail by Feb" },
      { value: "Community", label: "Changes Everything" },
      { value: "Holistic", label: "Mind + Body + Habits" },
    ],

    features: [
      {
        title: "Adaptive Workout Plans",
        desc: "Plans that start where you are — not where a fitness model is. Adjusts automatically based on your feedback and progress.",
      },
      {
        title: "Habit Stack Builder",
        desc: "Build new habits by anchoring them to existing routines. Science-backed, community-tested approach.",
      },
      {
        title: "Accountability Circles",
        desc: "Small groups of 5-8 people working toward similar goals — daily check-ins, celebrations, and honest support.",
      },
      {
        title: "Nutrition Without Obsession",
        desc: "Practical, flexible nutrition guidance focused on sustainable change — not calorie counting or restriction.",
      },
      {
        title: "Mental & Physical Together",
        desc: "Integrates with Together Support for a truly holistic approach to transformation that includes mental wellbeing.",
      },
      {
        title: "Progress, Not Perfection",
        desc: "Milestone celebrations, streak protection, and a community culture that values consistency over intensity.",
      },
    ],

    howItWorks: [
      {
        step: 1,
        title: "Start Where You Are",
        desc: "Answer a few questions about your life, goals, and current habits. No judgment, no baseline fitness test.",
      },
      {
        step: 2,
        title: "Get Your Plan",
        desc: "Receive a personalized workout, habit, and nutrition plan that fits your actual schedule and preferences.",
      },
      {
        step: 3,
        title: "Join Your Circle",
        desc: "Match with a small accountability group of people with similar goals and timezone — check in daily.",
      },
      {
        step: 4,
        title: "Transform Together",
        desc: "Track progress, celebrate milestones with your circle, and adjust your plan as your life evolves.",
      },
    ],

    mockups: [
      {
        title: "Daily Dashboard",
        description:
          "Your workout, habit checklist, and circle activity — everything for today in one clean view.",
      },
      {
        title: "Workout Player",
        description:
          "Guided workout experience with video, timer, and adaptive difficulty based on your feedback.",
      },
      {
        title: "Habit Tracker",
        description:
          "Visual habit chains, streaks, and the science behind each habit in your stack.",
      },
      {
        title: "Accountability Circle",
        description:
          "Your small group's daily check-ins, wins, and encouragement — intimate and real.",
      },
    ],

    testimonials: [
      {
        name: "Blessing Okonkwo",
        role: "Working Parent",
        location: "Port Harcourt, Nigeria",
        quote:
          "I've failed at 'fitness apps' a dozen times. But I've never had a community holding me accountable before. That's what makes this different.",
        initials: "BO",
        avatarColor: "#fa541c",
      },
      {
        name: "Clara Santos",
        role: "Recovering from Injury",
        location: "Lisbon, Portugal",
        quote:
          "An app that starts from where I actually am — not an idealized version — feels revolutionary. Can't wait.",
        initials: "CS",
        avatarColor: "#ad2102",
      },
    ],

    roadmap: [
      {
        quarter: "Q4 2025",
        title: "Habit & Workout Beta",
        desc: "Core adaptive workout and habit-building tools with small group testing.",
        status: "planned",
      },
      {
        quarter: "Q1 2026",
        title: "Accountability Circles",
        desc: "Matched small groups with daily check-in system.",
        status: "planned",
      },
      {
        quarter: "Q2 2026",
        title: "Nutrition Tools",
        desc: "Flexible, non-restrictive nutrition guidance and meal planning.",
        status: "planned",
      },
      {
        quarter: "Q3 2026",
        title: "Support Integration",
        desc: "Deep integration with Together Support for holistic mental + physical wellbeing.",
        status: "planned",
      },
    ],

    team: [
      { name: "Jordan Myers", role: "Product Lead", initials: "JM" },
      { name: "Ines Ferreira", role: "Wellness Science", initials: "IF" },
      { name: "David Kim", role: "Engineering", initials: "DK" },
    ],

    faqs: [
      {
        question: "Is this only for fitness beginners?",
        answer:
          "Not at all — Together Transform adapts to any level. Whether you're starting from zero or training for a marathon, the platform meets you where you are.",
      },
      {
        question: "How are accountability circles formed?",
        answer:
          "We match circles based on timezone, goals, and schedule compatibility. Groups are kept small (5-8 people) intentionally, so everyone feels seen.",
      },
    ],

    platforms: { web: true, ios: true, android: true },
    waitlistUrl: "#waitlist",
  },

  // ── EXPLORE (Planning) ──────────────────────────────────────────────────────
  {
    key: "explore",
    slug: "explore",
    label: "Together We Explore",
    tagline: "Travel the World, Together",
    description:
      "Connect travel enthusiasts for shared adventures and authentic experiences.",
    longDescription:
      "Together Explore is where curious travelers find each other. Share local tips, co-plan itineraries, join group adventures, and experience places the way only a local friend can show you. Not a booking platform — a community for people who travel to connect, not just consume.",
    color: "#1d39c4",
    icon: <CompassOutlined />,
    status: "planning",
    heroConfig: { x: -100, y: -120, delay: 8 },
    communityCount: "14,800 on waitlist",

    stats: [
      { value: "14,800+", label: "Explorers on Waitlist" },
      { value: "195", label: "Countries to Cover" },
      { value: "Local", label: "Knowledge First" },
      { value: "Community", label: "Not Commerce" },
    ],

    features: [
      {
        title: "Local Tips Network",
        desc: "Hyper-local recommendations from people who actually live there — not SEO-optimized listicles.",
      },
      {
        title: "Shared Itineraries",
        desc: "Co-create and share detailed travel itineraries with the community. Collaborate on planning in real-time.",
      },
      {
        title: "Group Trip Organizer",
        desc: "Tools for organizing group travel — from expense splitting to voting on destinations and activities.",
      },
      {
        title: "Travel Buddy Matching",
        desc: "Find compatible travel companions for solo adventurers who want company for part or all of a trip.",
      },
      {
        title: "Hidden Gem Database",
        desc: "Community-documented places that don't appear in guidebooks — protected from over-tourism by careful curation.",
      },
      {
        title: "Offline Maps & Notes",
        desc: "Download your full itinerary, local tips, and maps for complete offline access — for when you really get off the grid.",
      },
    ],

    howItWorks: [
      {
        step: 1,
        title: "Share Where You Know",
        desc: "Contribute local knowledge about your hometown, favorite destinations, or anywhere you've lived.",
      },
      {
        step: 2,
        title: "Discover Your Next Trip",
        desc: "Browse community itineraries, local tips, and hidden gems filtered by travel style and budget.",
      },
      {
        step: 3,
        title: "Plan Together",
        desc: "Co-create your itinerary with friends or find travel companions through the buddy matching system.",
      },
      {
        step: 4,
        title: "Explore & Share Back",
        desc: "Document your journey, add new discoveries to the community database, and inspire the next explorer.",
      },
    ],

    mockups: [
      {
        title: "Destination Map",
        description:
          "Interactive map of community-contributed tips and hidden gems for any city or region.",
      },
      {
        title: "Itinerary Builder",
        description:
          "Day-by-day trip planner with map view, cost estimates, and real-time collaboration.",
      },
      {
        title: "Travel Buddy Profiles",
        description:
          "Match with compatible travel companions based on style, pace, and upcoming destinations.",
      },
      {
        title: "Local Tips Feed",
        description:
          "Hyperlocal recommendations from residents — neighborhoods, restaurants, transport, timing.",
      },
    ],

    testimonials: [
      {
        name: "Amelia Thompson",
        role: "Solo Traveler",
        location: "Melbourne, Australia",
        quote:
          "The best travel experiences I've had came from tips given by locals I met. A platform that systematizes that is something I would use every single trip.",
        initials: "AT",
        avatarColor: "#1d39c4",
      },
      {
        name: "Kwame Asante",
        role: "Travel Blogger",
        location: "Kumasi, Ghana",
        quote:
          "Ghana has incredible places that no guidebook covers. I've been documenting them for years with nowhere to put them. Together Explore is that home.",
        initials: "KA",
        avatarColor: "#10239e",
      },
    ],

    roadmap: [
      {
        quarter: "Q1 2026",
        title: "Tips & Itineraries Beta",
        desc: "Community tips database and shared itinerary builder with early explorer community.",
        status: "planned",
      },
      {
        quarter: "Q2 2026",
        title: "Travel Buddy Matching",
        desc: "Compatible traveler matching based on style, budget, and upcoming trips.",
        status: "planned",
      },
      {
        quarter: "Q3 2026",
        title: "Group Trip Tools",
        desc: "Full group travel planning with expense splitting and collaborative decision making.",
        status: "planned",
      },
      {
        quarter: "Q4 2026",
        title: "Offline Mobile",
        desc: "Full offline access to itineraries, maps, and tips on native iOS and Android.",
        status: "planned",
      },
    ],

    team: [
      { name: "Isabel Moreau", role: "Product Lead", initials: "IM" },
      { name: "Raj Patel", role: "Community", initials: "RP" },
      { name: "Sun Li", role: "Engineering", initials: "SL" },
    ],

    faqs: [
      {
        question: "Is this competing with TripAdvisor or Google Maps?",
        answer:
          "No. Together Explore is fundamentally about community and connection — not reviews or booking. It's the difference between asking a friend and reading a review.",
      },
      {
        question: "How do you protect hidden gems from over-tourism?",
        answer:
          "Sensitive locations are shared only within trusted community circles, not indexed publicly. We believe in responsible travel by design.",
      },
    ],

    platforms: { web: true, ios: true, android: true },
    waitlistUrl: "#waitlist",
  },

  // ── INNOVATE (Planning) ─────────────────────────────────────────────────────
  {
    key: "innovate",
    slug: "innovate",
    label: "Together We Innovate",
    tagline: "Where Ideas Become Reality",
    description:
      "Entrepreneurship, innovation, and startup collaboration platform.",
    longDescription:
      "Together Innovate is a collaborative space for entrepreneurs, innovators, and creative minds who are building the future. Find co-founders, validate ideas with real users, access mentors, and connect with impact-driven investors — in a community that values building things that matter over building things that merely scale.",
    color: "#faad14",
    icon: <BulbOutlined />,
    status: "planning",
    heroConfig: { x: 200, y: 60, delay: 9 },
    communityCount: "9,300 on waitlist",

    stats: [
      { value: "9,300+", label: "Innovators on Waitlist" },
      { value: "500+", label: "Ideas Submitted" },
      { value: "120+", label: "Mentors Committed" },
      { value: "Impact", label: "Over Growth" },
    ],

    features: [
      {
        title: "Co-Founder Matching",
        desc: "Find your missing piece — technical, business, design, or domain expertise — matched by skills, values, and vision.",
      },
      {
        title: "Idea Validation Lab",
        desc: "Post your idea and get structured feedback from community members in your target market — before you build a thing.",
      },
      {
        title: "Mentor Network",
        desc: "Access seasoned entrepreneurs and domain experts for 1:1 mentorship sessions, matched to your startup stage and sector.",
      },
      {
        title: "Brainstorm Rooms",
        desc: "Live collaborative sessions for problem-solving, ideation, and design sprints with fellow innovators.",
      },
      {
        title: "Impact Investors Hub",
        desc: "Connect with investors who prioritize social and environmental impact alongside financial returns.",
      },
      {
        title: "Startup Resources",
        desc: "Legal templates, financial models, pitch decks, and technical infrastructure — a full startup toolkit for builders.",
      },
    ],

    howItWorks: [
      {
        step: 1,
        title: "Share Your Vision",
        desc: "Post your idea or the problem you're trying to solve. The community helps you pressure-test it from day one.",
      },
      {
        step: 2,
        title: "Build Your Team",
        desc: "Get matched with co-founders and collaborators whose skills complement yours and whose values align.",
      },
      {
        step: 3,
        title: "Validate & Iterate",
        desc: "Use the community as your first user research panel — get honest feedback before writing a single line of code.",
      },
      {
        step: 4,
        title: "Launch & Grow",
        desc: "Access mentors, investors, and resources to take your validated idea from prototype to product.",
      },
    ],

    mockups: [
      {
        title: "Idea Board",
        description:
          "Community feed of ideas in development — vote, comment, and offer to join the team.",
      },
      {
        title: "Co-Founder Matching",
        description:
          "Detailed profiles with skills, experience, values, and what people are looking for in a partner.",
      },
      {
        title: "Mentor Sessions",
        description:
          "Booking interface for 1:1 mentorship with verified entrepreneurs and domain experts.",
      },
      {
        title: "Startup Dashboard",
        description:
          "Track your idea's progress, team, funding status, and community feedback in one place.",
      },
    ],

    testimonials: [
      {
        name: "Taiwo Adeyemi",
        role: "First-Time Founder",
        location: "Lagos, Nigeria",
        quote:
          "I have the idea and the domain expertise but no technical co-founder. Having a platform designed to find that person — especially in emerging markets — is huge.",
        initials: "TA",
        avatarColor: "#faad14",
      },
      {
        name: "Sofia Lindqvist",
        role: "Impact Investor",
        location: "Stockholm, Sweden",
        quote:
          "The deal flow for impact startups from the Global South is almost nonexistent in traditional VC networks. A platform built around this community would change that.",
        initials: "SL",
        avatarColor: "#d48806",
      },
    ],

    roadmap: [
      {
        quarter: "Q2 2026",
        title: "Idea Validation Beta",
        desc: "Idea posting and structured community feedback system.",
        status: "planned",
      },
      {
        quarter: "Q3 2026",
        title: "Co-Founder Matching",
        desc: "Skill and values-based matching for startup co-founders.",
        status: "planned",
      },
      {
        quarter: "Q4 2026",
        title: "Mentor & Investor Network",
        desc: "Curated network of mentors and impact investors with booking and connection tools.",
        status: "planned",
      },
    ],

    team: [
      { name: "Victor Osei", role: "Product Lead", initials: "VO" },
      { name: "Catalina Torres", role: "Community", initials: "CT" },
    ],

    faqs: [
      {
        question: "Is this only for tech startups?",
        answer:
          "Not at all. Together Innovate is for any kind of innovation — social enterprises, creative businesses, community projects, and yes, tech startups too.",
      },
      {
        question: "How do you curate the mentor network?",
        answer:
          "Mentors are verified through a combination of professional background review and community vouching. We prioritize practitioners over advisors — people who've actually built things.",
      },
    ],

    platforms: { web: true, ios: false, android: false },
    waitlistUrl: "#waitlist",
  },
];

export type AppKey = (typeof appsData)[number]["key"];