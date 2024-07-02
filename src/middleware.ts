import { getToken } from 'next-auth/jwt'
import { NextRequest, NextResponse } from 'next/server'
export { default } from "next-auth/middleware"


// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {

    const token = await getToken({ req: request })
    //current url
    const url = request.nextUrl;
    // Check if the user is authenticated
    const isAuthenticated = !!token

    // If the user is authenticated and tries to access pages like 'sign-in', 'sign-up', 'verify', or '/', redirect them to 'dashboard'
    if (isAuthenticated && (
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/verify') ||
        url.pathname === '/'
    )) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // If the user is not authenticated and tries to access 'dashboard', redirect them to 'sign-in'
    if (!isAuthenticated && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }

    // Allow the request to proceed normally if no redirection is needed
    return NextResponse.next()
}

// Matching paths
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/',
        '/dashboard/:path*',
        '/verify/:path*',
    ],
}