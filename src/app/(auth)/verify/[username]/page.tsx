'use client'

import { Button } from '@/components/ui/button'
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/ApiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios,{AxiosError} from 'axios'
import { useParams, useRouter } from 'next/navigation'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'

function VerifyAccount() {
    const router = useRouter()
    const param = useParams<{ username: string }>()
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema)
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const res = await axios.post(`/api/verify-code`, {
                username: param.username,
                code:data.code
            })

            toast(res.data.message)
            
            router.replace(`/sign-in`)
        } catch (error) {
            console.log("error while verifying code", error)
            const axiosError = error as AxiosError<ApiResponse>
            toast(axiosError?.response?.data.message)
        }
    }
  return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
              <div className="text-center">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                    Verify Your Account
                </h1>
                <p className="mb-4">Enter the verification code sent to your email</p>
                </div>
          

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Controller
              name="code"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Verification Code</FieldLabel>

                  <FieldContent>
                    <Input
                    {...field} 
                    />

                      <FieldError>
                        {fieldState.error?.message}
                      </FieldError>
                    
                  </FieldContent>
                  
                </Field>

                
              )}
            />
            
                  <Button type="submit">Verify</Button>
              
              </form>
            </div>
    </div>
  )
}

export default VerifyAccount