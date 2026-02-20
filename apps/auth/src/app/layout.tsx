import type { Metadata } from "next";
import { App, Layout } from "antd";
import { Content } from "antd/lib/layout/layout";
import "antd/dist/reset.css";
import { ThemeProvider } from "@repo/ui/ThemeContext";

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
        <ThemeProvider>
          <App>
            <Layout
              style={{
                minHeight: "100vh",
              }}
            >
              <Content>
                {children}
              </Content>
            </Layout>
          </App>
        </ThemeProvider>
      </body>
    </html>
  );
}
