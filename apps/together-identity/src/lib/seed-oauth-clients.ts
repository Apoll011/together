// lib/seed-oauth-clients.ts

import { auth } from "./auth";

const FIRST_PARTY_CLIENTS = [
  {
    key: "TOGETHER_WEB_CLIENT_ID",
    id: 'ovqEMuOsRjPKrHxLsYXSTcnFwKgqdiaA',
    body: {
      client_name: "Together Web",
      logo_uri: "http://localhost:3000/favicon.ico",
      client_uri: "http://localhost:3000",
      redirect_uris: ["http://localhost:3000/auth/callback"],
      tos_uri: "",
      policy_uri: "",
      skip_consent: false,
      enable_end_session: true,
    },
  }
];

export async function seedOAuthClients() {
  for (const { key, id, body } of FIRST_PARTY_CLIENTS) {
    if (id) {
      const { data } = await auth.api.getOAuthClientPublic({
        query: { client_id: id },
        headers: new Headers(),
      });
      if (data) continue;
    }

    const client = await auth.api.adminCreateOAuthClient({
      headers: new Headers(),
      body,
    });

    console.warn(`⚠️  New OAuth client created for ${key}: ${client.clientId}`);
    console.warn(`   Add to your .env: ${key}=${client.clientId}`);
  }
}