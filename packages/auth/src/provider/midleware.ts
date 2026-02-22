import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

const isOnboardingRoute = createRouteMatcher(['/sign-up'])
const isProtectedRoute = createRouteMatcher([])
const isUnAuthenticated = createRouteMatcher(['/sign-in'])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { isAuthenticated, sessionClaims, redirectToSignIn } = await auth()

  if (isAuthenticated && isUnAuthenticated(req)) {
    const home = new URL('/', req.url)
    return NextResponse.redirect(home)
  }

  if (isAuthenticated && isOnboardingRoute(req)) {
    return NextResponse.next()
  }

  if (!isAuthenticated && isProtectedRoute(req)) return redirectToSignIn({ returnBackUrl: req.url })

  if (isAuthenticated && !sessionClaims?.metadata?.onboardingComplete) {
    const onboardingUrl = new URL('/join', req.url)
    return NextResponse.redirect(onboardingUrl)
  }

  if (isAuthenticated && isProtectedRoute(req)) return NextResponse.next()

  if (!isProtectedRoute(req)) return NextResponse.next()

})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}