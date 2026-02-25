import type { Metadata } from "next";
import { App, Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import "antd/dist/reset.css";
import "./globals.css";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { ThemeProvider } from "@repo/ui/ThemeContext";
import { TogetherAuthProvider } from "@together/auth-sdk/react/context/TogetherAuthProvider";
import { getServerSession } from "@together/auth-sdk/server";

export const metadata: Metadata = {
  title: "Together",
  description:
    "A modular ecosystem designed to foster community, preservation, and learning.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialSession = await getServerSession({identityBaseUrl: process.env.IDENTITY_URL!});

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <TogetherAuthProvider
          config={{
            clientId: process.env.TOGETHER_CLIENT_ID!,
            identityBaseUrl: process.env.IDENTITY_URL!,
            autoRedirect: true,
            appName: "main",
            redirectUri: process.env.TOGETHER_REDIRECT_URI!
          }}
          initialSession={initialSession}
        >
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
        </TogetherAuthProvider>
      </body>
    </html>
  );
}
