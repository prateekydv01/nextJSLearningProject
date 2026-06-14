'use client'

import React,{useEffect, useState} from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from 'zod'
import {useDebounceValue} from "usehooks-ts"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { signUpSchema } from '@/schemas/signUpSchema'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Loader2 } from 'lucide-react';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const [username,setUsername] = useState('')
  const [usernameMessage,setUsernameMessage] = useState('')
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const[isSubmitting,setIsSubmitting]=useState(false)
  const [debouncedUsername] = useDebounceValue(username,300)
  const router =useRouter()

  //zod implementation

  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver:zodResolver(signUpSchema),
    defaultValues:{
        username:'',
        email:'',
        password:''
    }
  })

  useEffect(()=>{
    const checkUsernameUnique  = async () =>{
        if(debouncedUsername){
            setIsCheckingUsername(true)
            setUsernameMessage('')

            try {
                const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)

                setUsernameMessage(response?.data?.message)
            } catch (error) {
                const axiosError = error as AxiosError<{message:any}>

                setUsernameMessage(axiosError.response?.data?.message )
            }finally{
                setIsCheckingUsername(false)
            }
        }
    }
    checkUsernameUnique()
  },
  [debouncedUsername])

  const onSubmit = async (data : z.infer<typeof signUpSchema>) => {
    setIsSubmitting(true)
    try {
      const response = await axios.post<ApiResponse>('/api/sign-up', data)
      toast(response.data.message)
      router.replace(`/verify/${data.username}`)
    } catch (error) {
      console.log("Error in signup of user", error);
      const axiosError = error as AxiosError<{message:any}>
      let errorMessage = axiosError.response?.data?.message
      toast(errorMessage)

    }
    finally {
      setIsSubmitting(false)
    }
  }
  

 return (
  <div className="relative min-h-screen overflow-hidden flex items-center justify-center px-4 py-10">
    {/* Background */}
    <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />

    {/* Blur Effects */}
    <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
    <div className="absolute bottom-20 right-10 h-72 w-72 rounded-full bg-purple-500/20 blur-3xl" />

    <div className="relative z-10 w-full max-w-md">
      <div className="rounded-2xl border bg-background/70 p-8 shadow-2xl backdrop-blur-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Join
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              {" "}
              True Feedback
            </span>
          </h1>

          <p className="mt-3 text-muted-foreground">
            Sign up to start receiving anonymous messages
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <FieldGroup>
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    Username
                  </FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      placeholder="Choose a username"
                      className="h-11 bg-background/60 backdrop-blur"
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />

                    <div className="mt-2 flex items-center">
                      {isCheckingUsername ? (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Checking username...
                        </div>
                      ) : (
                        usernameMessage && (
                          <FieldDescription
                            className={
                              usernameMessage ===
                              'username available'
                                ? 'text-green-500'
                                : 'text-red-500'
                            }
                          >
                            {usernameMessage}
                          </FieldDescription>
                        )
                      )}
                    </div>

                    <FieldError>
                      {fieldState.error?.message}
                    </FieldError>
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>
                    Email
                  </FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="h-11 bg-background/60 backdrop-blur"
                    />

                    <FieldDescription>
                      We'll send a verification code to this email.
                    </FieldDescription>

                    <FieldError>
                      {fieldState.error?.message}
                    </FieldError>
                  </FieldContent>
                </Field>
              )}
            />

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
                      placeholder="Create a strong password"
                      className="h-11 bg-background/60 backdrop-blur"
                    />

                    <FieldError>
                      {fieldState.error?.message}
                    </FieldError>
                  </FieldContent>
                </Field>
              )}
            />

            <Button
              type="submit"
              className="h-11 w-full text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <a
            href="/sign-in"
            className="font-semibold text-primary hover:underline"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  </div>
);
}

