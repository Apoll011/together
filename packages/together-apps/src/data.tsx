// app/data/apps.tsx
import React from "react";
import {
  GlobalOutlined,
  ReadOutlined,
  RocketOutlined,
  HeartOutlined,
  CodeOutlined,
  CompassOutlined,
} from "@ant-design/icons";

export interface AppData {
  key: string;
  slug: string;
  label: string;
  tagline: string;
  description: string;
  longDescription: string;
  color: string;
  icon: React.ReactNode;
  isNew?: boolean;
  heroConfig: { x: number; y: number; delay: number };
  features: { title: string; desc: string }[];
  faqs: { question: string; answer: string }[];
}

export const appsData: AppData[] = [
  {
    key: "preserve",
    slug: "preserve",
    label: "Preserve",
    tagline: "Environmental Data & Conservation",
    description: "Map environmental data and track conservation efforts globally.",
    longDescription: "Together Preserve is a decentralized database for environmental metrics. Activists, scientists, and citizens contribute to a living map of our planet's health, tracking everything from deforestation rates to water quality in real-time.",
    color: "#52c41a",
    icon: <GlobalOutlined />,
    heroConfig: { x: 0, y: -160, delay: 0 },
    features: [
      { title: "Real-time Mapping", desc: "Visualize data points on a global 3D globe interactively." },
      { title: "Verified Sources", desc: "Blockchain-backed verification ensures data integrity." },
      { title: "Export API", desc: "Researchers can access raw datasets for free via our open API." },
    ],
    faqs: [
      { question: "Is the data public?", answer: "Yes, all data contributed to Preserve is Open Source." },
      { question: "How do I verify data?", answer: "We use a community consensus mechanism similar to Proof of Stake." },
    ]
  },
  {
    key: "learn",
    slug: "learn",
    label: "Learn",
    tagline: "Collaborative Knowledge",
    description: "Collaborative courses and wikis for community knowledge sharing.",
    longDescription: "A next-generation Learning Management System (LMS) built for communities. Create courses, host wikis, and issue certifications that are recognized across the entire Together ecosystem.",
    color: "#fa8c16",
    icon: <ReadOutlined />,
    isNew: true,
    heroConfig: { x: 180, y: -60, delay: 1 },
    features: [
      { title: "Peer Review", desc: "Assignments are reviewed by the community, fostering connection." },
      { title: "Offline Mode", desc: "Download entire courses for areas with low connectivity." },
      { title: "Skill Graph", desc: "Visualize your learning path and connect with mentors." },
    ],
    faqs: [
      { question: "Are courses free?", answer: "Most community courses are free. Premium courses support creators directly." },
    ]
  },
  {
    key: "work",
    slug: "work",
    label: "Work",
    tagline: "Async Collaboration",
    description: "Async tools for distributed teams to build faster.",
    longDescription: "The office is obsolete. Together Work provides a suite of asynchronous tools—kanban boards, whiteboards, and decision logs—designed specifically for decentralized autonomous organizations (DAOs) and remote teams.",
    color: "#0050B3",
    icon: <RocketOutlined />,
    heroConfig: { x: -180, y: -40, delay: 2 },
    features: [
      { title: "Voting Mechanisms", desc: "Integrated polling and governance tools for teams." },
      { title: "Crypto Payments", desc: "Automate payroll and bounties in stablecoins." },
      { title: "Timezone Smart", desc: "Scheduler automatically finds overlaps in team availability." },
    ],
    faqs: [
      { question: "Can I use this for a traditional company?", answer: "Absolutely. It works great for any remote team." },
    ]
  },
  {
    key: "help",
    slug: "help",
    label: "Help",
    tagline: "Mutual Aid Network",
    description: "Community aid, crisis response, and mutual support.",
    longDescription: "A mesh network for human kindness. Connect with locals to offer or request help during crises, or organize long-term mutual aid projects in your neighborhood.",
    color: "#eb2f96",
    icon: <HeartOutlined />,
    heroConfig: { x: 140, y: 100, delay: 3 },
    features: [
      { title: "Geofenced Alerts", desc: "Notify nearby users when urgent help is needed." },
      { title: "Resource Pooling", desc: "Manage shared community inventories like tools or food." },
      { title: "Privacy First", desc: "Locations are obfuscated to protect vulnerable users." },
    ],
    faqs: []
  },
  {
    key: "code",
    slug: "code",
    label: "Code",
    tagline: "Open Source Foundry",
    description: "Open-source contribution platform and bounty network.",
    longDescription: "The engine room of the ecosystem. Together Code helps developers find meaningful open-source issues, fund dependencies, and collaborate on the software that powers the Together platform.",
    color: "#13c2c2",
    icon: <CodeOutlined />,
    heroConfig: { x: -120, y: 140, delay: 4 },
    features: [
      { title: "Bounty Network", desc: "Get paid to fix critical bugs in open source projects." },
      { title: "One-Click Dev Env", desc: "Spin up cloud development environments instantly." },
    ],
    faqs: []
  },
];

export type AppKey = (typeof appsData)[number]["key"];