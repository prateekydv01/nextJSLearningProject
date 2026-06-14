'use client'

import React, { useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from 'zod'
import {useDebounceValue} from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signInSchema } from '@/schemas/signInSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Loader2 } from 'lucide-react';
import { signIn } from 'next-auth/react'
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'



function page() {
 
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
      resolver:zodResolver(signInSchema),
      defaultValues:{
          identifier:'',
          password:''
      }
  })
  
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    const res = await signIn('credentials', {
      redirect:false,
      identifier: data.identifier,
      password:data.password
    })  

    console.log(res);
    if (res?.error) {
      toast(res.error)
    } else {
      toast("Login Successfull")
    }

    if (res?.url) {
      router.replace('/dashboard')
    }
  }
return (
  <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />

    {/* Blur Effects */}
    <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
    <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

    <div className="relative z-10 w-full max-w-md">
      <div className="rounded-2xl border bg-background/70 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Welcome
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              {" "}
              Back
            </span>
          </h1>

          <p className="mt-3 text-muted-foreground">
            Sign in to continue your anonymous conversations
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              name="identifier"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    Email or Username
                  </FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      placeholder="Enter your email or username"
                      className="h-11 bg-background/60 backdrop-blur"
                    />

                    <FieldError>
                      {fieldState.error?.message}
                    </FieldError>
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    Password
                  </FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className="h-11 bg-background/60 backdrop-blur"
                    />

                    <FieldError>
                      {fieldState.error?.message}
                    </FieldError>
                  </FieldContent>
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            className="w-full h-11 text-base"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <a
            href="/sign-up"
            className="font-semibold text-primary hover:underline"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  </div>
);
}

export default page