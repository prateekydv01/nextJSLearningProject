'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Autoplay from 'embla-carousel-autoplay';
import messages from '@/message.json';
import { useSession } from 'next-auth/react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

export default function Home() {
  const { data: session } = useSession();
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Hero Section */}
      <main className="relative flex-1 flex flex-col items-center justify-center overflow-hidden px-4 md:px-24 py-16">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />

        {/* Decorative Blur Effects */}
        <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
          {/* Heading */}
          <section className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Dive into the World of
              <span className="block mt-2 bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                Anonymous Feedback
              </span>
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              True Feedback helps you receive honest, anonymous messages
              from friends, colleagues, and your audience without revealing
              their identity.
            </p>

           <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            {session ? (
              <Link href="/dashboard">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
    <>
      <Link href="/sign-up">
        <Button size="lg" className="w-full sm:w-auto">
          Get Started
        </Button>
      </Link>

      <Link href="/sign-in">
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto"
        >
          Sign In
        </Button>
      </Link>
    </>
  )}
</div>
          </section>

          {/* Carousel */}
          <section className="w-full max-w-3xl">
            <Carousel
              plugins={[
                Autoplay({
                  delay: 2500,
                }),
              ]}
              className="w-full"
            >
              <CarouselContent>
                {messages.map((message, index) => (
                  <CarouselItem key={index}>
                    <div className="p-2">
                      <Card className="backdrop-blur-md bg-background/70 border-border shadow-xl">
                        <CardHeader>
                          <CardTitle className="text-lg">
                            {message.title}
                          </CardTitle>
                        </CardHeader>

                        <CardContent className="flex gap-4">
                          <Mail className="h-5 w-5 text-primary mt-1 flex-shrink-0" />

                          <div>
                            <p className="text-sm md:text-base">
                              {message.content}
                            </p>

                            <p className="mt-3 text-xs text-muted-foreground">
                              {message.received}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>

              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GhostTalk. All rights reserved.
        </div>
      </footer>
    </div>
  );
}