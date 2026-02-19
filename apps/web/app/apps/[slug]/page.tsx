// app/apps/[slug]/page.tsx
import React from "react";
import { notFound } from "next/navigation"; // To handle 404s
import { appsData } from "@repo/together-apps/data";
import AppPageClient from "./client";

export default async function AppPage({ params }: {   params: Promise<{ slug: string }>; }) {
    const { slug } = await params;

  const app = appsData.find((a) => a.slug === slug);

  if (!app) {
    notFound();
  }

  return (<AppPageClient app={app}></AppPageClient>);

}