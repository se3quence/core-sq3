import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher([
  '/',
  '/auth(.*)',
  '/portal(.*)',
  '/images(.*)',
  '/chatbot',
])

const middleware = clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    auth.protect()
  }
})

export default middleware

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
}
