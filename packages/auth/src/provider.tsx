"use client";

import { LogtoProvider, type LogtoConfig } from "@logto/next/client";
import type { ReactNode } from "react";

export interface AuthProviderProps {
  /** Pass the same config object used in createAuthClient() */
  config: LogtoConfig;
  children: ReactNode;
}

/**
 * Wrap your root layout with this provider.
 *
 * @example
 * // app/layout.tsx
 * import { AuthProvider } from "@repo/auth/provider";
 * import { authConfig } from "@/lib/auth";
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <AuthProvider config={authConfig}>
 *           {children}
 *         </AuthProvider>
 *       </body>
 *     </html>
 *   );
 * }
 */
export function AuthProvider({ config, children }: AuthProviderProps) {
  return <LogtoProvider config={config}>{children}</LogtoProvider>;
}