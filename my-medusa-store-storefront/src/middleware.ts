import { NextRequest, NextResponse } from "next/server"

const DEFAULT_COUNTRY = "pl"

/**
 * Simplified middleware — redirects to /pl/ prefix for country routing.
 * When MedusaJS backend is running, replace this with the original middleware
 * that fetches regions dynamically.
 */
export async function middleware(request: NextRequest) {
  // Check if the url is a static asset
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

  // If already has country code prefix, proceed
  if (urlCountryCode === DEFAULT_COUNTRY) {
    return NextResponse.next()
  }

  // Redirect to default country
  const redirectPath =
    request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
  const queryString = request.nextUrl.search ? request.nextUrl.search : ""
  const redirectUrl = `${request.nextUrl.origin}/${DEFAULT_COUNTRY}${redirectPath}${queryString}`

  return NextResponse.redirect(redirectUrl, 307)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
