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
            Verify
            <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
              {' '}
              Account
            </span>
          </h1>

          <p className="mt-3 text-muted-foreground">
            Enter the verification code sent to your email
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <Controller
            name="code"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>
                  Verification Code
                </FieldLabel>

                <FieldContent>
                  <Input
                    {...field}
                    placeholder="Enter verification code"
                    className="h-11 bg-background/60 backdrop-blur"
                  />

                  <FieldDescription>
                    Check your inbox for the code.
                  </FieldDescription>

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
          >
            Verify Account
          </Button>
        </form>
      </div>
    </div>
  </div>
);
}

export default VerifyAccount