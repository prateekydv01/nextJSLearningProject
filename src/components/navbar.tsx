'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'

function Navbar() {
  const { data: session } = useSession()
  const user: User = session?.user as User

  return (
    <div className="border-b bg-background shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-6">
        
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight"
        >
          Mystery Message
        </Link>

        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="hidden text-sm font-medium text-muted-foreground sm:block">
                Welcome, {user?.username || user?.email}
              </span>

              <Button
                variant="destructive"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            </>
          ) : (
              <>
            <Link href="/sign-in">
              <Button>Login</Button>
                </Link>
            <Link href="/sign-up">
              <Button>SignUp</Button>
                </Link>
                
                </>
              
              
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar