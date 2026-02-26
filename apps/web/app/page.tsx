/*"use client";

import { Hero } from "./components/Hero";
import { Features } from "./components/Features";
import { Stats } from "./components/Stats";
import { CTA } from "./components/CTA";

export default function Home() {
  return (
    <div>
		  <Hero/>
      <Features/>
      <Stats/>
      <CTA/>
    </div>
  );
}
*/
import { getLogtoContext, signIn, signOut } from '@logto/next/server-actions';
import SignIn from './components/Sign-in';
import SignOut from './components/sign-out';
import { logtoConfig } from './logto';

export default async function Home() {
    const { isAuthenticated, claims } = await getLogtoContext(logtoConfig);

  return (
    <nav>
      {isAuthenticated ? (
        <p>
          Hello, {claims?.sub},
          <SignOut
            onSignOut={async () => {
              'use server';

              await signOut(logtoConfig);
            }}
          />
        </p>
      ) : (
        <p>
          <SignIn
            onSignIn={async () => {
              'use server';

              await signIn(logtoConfig);
            }}
          />
        </p>
      )}
    </nav>
  );
};