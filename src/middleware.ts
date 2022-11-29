import { NextFetchEvent, NextRequest, NextResponse, URLPattern } from 'next/server'
import { fetchValidGuild } from './utils/api';

const validateMiddlewareCookie = (req: NextRequest) => {
    const sessionId = req.cookies.get('connect.sid')
    return sessionId ? {
        Cookie: `connect.sid=${sessionId.value}`
    } : false;
}

export async function middleware(req: NextRequest, e: NextFetchEvent) {

    if(req.nextUrl.pathname.startsWith("/dashboard")){
        const headers = validateMiddlewareCookie(req)

        if (!headers) return NextResponse.redirect("http://localhost:3001/");

        if (!req.nextUrl.pathname.split("/")[2]) return NextResponse.redirect('http://localhost:3001/menu');
        const id = req.nextUrl.pathname.split("/")[2]

        const response = await fetchValidGuild(headers, id);
        return response.status === 200 ? NextResponse.next() : NextResponse.redirect('http://localhost:3001/menu')
    }

}