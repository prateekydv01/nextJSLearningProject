'use client'

import React from 'react'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { User } from 'next-auth'
import { Button } from './ui/button'
import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

function Navbar() {
  const { data: session } = useSession()
  const user: User = session?.user as User

  const { setTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-2xl">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          <Link
            href="/"
            className="text-2xl md:text-3xl font-extrabold tracking-tight"
          >
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              Mystery
            </span>{' '}
            Message
          </Link>

          <div className="flex items-center gap-2 md:gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="relative"
                >
                  <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />

                  <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />

                  <span className="sr-only">
                    Toggle theme
                  </span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() =>
                    setTheme('light')
                  }
                >
                  Light
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    setTheme('dark')
                  }
                >
                  Dark
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    setTheme('system')
                  }
                >
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {session ? (
              <>
                <div className="hidden md:flex items-center gap-3 rounded-full border bg-background/50 px-4 py-2 backdrop-blur-md">
                  {/* <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-purple-500 text-sm font-semibold text-white">
                    {(user?.username ||
                      user?.email ||
                      'U')
                      .charAt(0)
                      .toUpperCase()}
                  </div> */}

                  <span className="text-sm font-medium">
                    @{user?.username}
                  </span>
                </div>

                <Button
                  variant="destructive"
                  onClick={() =>
                    signOut()
                  }
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="hidden sm:flex"
                  >
                    Sign In
                  </Button>
                </Link>

                <Link href="/sign-up">
                  <Button>
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar