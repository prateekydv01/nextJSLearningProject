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
  <div className="light min-h-screen flex items-center justify-center bg-slate-100 px-4 py-10">
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-xl border border-slate-200">
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">
            Join True Feedback
          </h1>

          <p className="mt-3 text-slate-600">
            Sign up to start your anonymous adventure
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
                  <FieldLabel className="text-slate-700">
                    Username
                  </FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      className="h-11 bg-white border-slate-300"
                      placeholder="Choose a username"
                      onChange={(e) => {
                        field.onChange(e)
                        setUsername(e.target.value)
                      }}
                    />

                    <div className=" flex items-center">
                      {isCheckingUsername ? (
                        <div className="flex items-center gap-2 text-slate-500 text-sm">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Checking username...
                        </div>
                      ) : (
                        usernameMessage && (
                          <FieldDescription
                            className={
                              usernameMessage === "username available"
                                ? "text-green-600"
                                : "text-red-600"
                            }
                          >
                            {usernameMessage}
                          </FieldDescription>
                        )
                      )}
                    </div>

                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel className="text-slate-700">
                    Email
                  </FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      type="email"
                      placeholder="Enter your email"
                      className="h-11 bg-white border-slate-300"
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
                  <FieldLabel className="text-slate-700">
                    Password
                  </FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Create a strong password"
                      className="h-11 bg-white border-slate-300"
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
              className="w-full h-11 text-base"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </FieldGroup>
        </form>

        <div className="mt-6 text-center text-sm text-slate-600">
          Already have an account?{" "}
          <a
            href="/sign-in"
            className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Sign In
          </a>
        </div>
      </div>
    </div>
  </div>
)
}

