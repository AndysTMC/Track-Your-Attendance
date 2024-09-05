
import axios from 'axios';
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function middleware(request: NextRequest) {
  const providedAdminKey = request.cookies.get("adminKey")?.value;
  try {
  const response = await axios.post(new URL('/api/admin/key-verify', request.url).toString(), { adminKey: providedAdminKey },
    {
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
    return NextResponse.next();
  } catch (error: any) {
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: '/admin/',
};