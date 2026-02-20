import type { Metadata } from "next";
import { App, Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import "antd/dist/reset.css";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "@repo/ui/ThemeContext";
import {
  ClerkProvider
} from '@clerk/nextjs'

export const metadata: Metadata = {
  title: "Together",
  description:
    "A modular ecosystem designed to foster community, preservation, and learning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
      <ClerkProvider>
        <ThemeProvider>
          <App>
            <Layout
              style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Navbar />

              <Content
                style={{
                  flex: 1,
                  paddingTop: 64,
                }}
              >
                {children}
              </Content>

              <Footer />
            </Layout>
          </App>
        </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
