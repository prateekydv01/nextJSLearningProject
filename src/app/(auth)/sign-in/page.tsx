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
  <div className="light min-h-screen flex items-center justify-center bg-slate-100 px-4">
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Welcome Back
          </h1>

          <p className="mt-3 text-slate-600">
            Sign in to continue your secret conversations
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
                  <FieldLabel className="text-slate-700">
                    Email or Username
                  </FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      placeholder="Enter your email or username"
                      className="h-11 bg-white border-slate-300 text-slate-900"
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
                  <FieldLabel className="text-slate-700">
                    Password
                  </FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className="h-11 bg-white border-slate-300 text-slate-900"
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
              "Sign In"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <a
            href="/sign-up"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign Up
          </a>
        </div>
      </div>
    </div>
  </div>
)
}

export default page