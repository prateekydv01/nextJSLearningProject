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
      // router.replace('/dashboard')
    }
  }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Welcome Back to True Feedback
          </h1>
          <p className="mb-4">Sign in to continue your secret conversations</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FieldGroup>
            
            <Controller
              name="identifier"
              control={form.control}
              render={({ field , fieldState}) => (
                <Field>
                  <FieldLabel>Email/Username</FieldLabel>

                  <FieldContent>
                    <Input
                    {...field} placeholder='Enter Email or Username'
                    />


                      <FieldError>
                        {fieldState.error?.message}
                      </FieldError>
                    
                  </FieldContent>
                  
                </Field>
  )}
            >

            </Controller>

            <Controller
              name="password"
              control={form.control}
              render={({ field , fieldState}) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>

                  <FieldContent>
                    <Input
                    {...field} placeholder='Enter Password' type='password'
                    />


                      <FieldError>
                        {fieldState.error?.message}
                      </FieldError>
                    
                  </FieldContent>
                  
                </Field>
  )}
            >

            </Controller>
          </FieldGroup>

          <Button
            type="submit"
            className="w-full"
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
      </div>
    </div>

  )
}

export default page