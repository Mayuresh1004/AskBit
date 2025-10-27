import { NextResponse, NextRequest } from 'next/server'
import getOrCreateDB from './src/models/server/dbSetup'
import getOrCreateStorage from './src/models/server/storageSetup'


 
// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
    await Promise.all([
        getOrCreateDB(),
        getOrCreateStorage()
    ])
  return NextResponse.next()
}
 
export const config = {
    /*match all request paths except for the below one
        api
        _next/static
        _next/image
        favicon.com
    */
  matcher: [
     "/((?!api|_next/static|_next/image|favicon.ico).*)"
  ],
}