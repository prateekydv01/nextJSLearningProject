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
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Join True Feedback
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'> 
          <FieldGroup>

            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Username</FieldLabel>

                  <FieldContent>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />

                    {isCheckingUsername && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}

                    {!isCheckingUsername && usernameMessage && (
                      <FieldDescription
                        className={
                          usernameMessage === "username available"
                            ? "text-green-500"
                            : "text-red-500"
                        }
                      >
                        {usernameMessage}
                      </FieldDescription>
                    )} 

                    
                  </FieldContent>
                </Field>
              )}
            />

            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>

                  <FieldContent>
                    <Input
                    {...field} type='email'
                    />

                    <FieldDescription>
                      We will send you a verification code.
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
                  <FieldLabel>Password</FieldLabel>

                  <FieldContent>
                    <Input
                    {...field} type='password'
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
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                "Sign Up"
              )}
            </Button>

          </FieldGroup>

        </form>
      </div>
    </div>
  )
}

