"use client"

import { signUpAction } from "@/app/actions"
import { SubmitButton } from "@/components/submit-button"
import { FormMessage } from "@/components/form-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import OtpVerificationForm from "./otp-verification-form"

type SignupFormProps = {
  onSuccess?: () => void
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [step, setStep] = useState<"form" | "otp">("form")

  const handleSubmit = async (formData: FormData) => {
    try {
      setError(null)
      const emailValue = formData.get("email") as string
      setEmail(emailValue)
      
      // Add a flag to indicate this is a client-side request
      formData.append("_client", "true")
      
      const result = await signUpAction(formData)
      
      if (result && 'error' in result) {
        setError(result.message || 'Sign up failed')
        setSuccess(null)
        return
      }
      
      if (result && 'success' in result) {
        setSuccess(result.message || 'Check your email for a verification code')
        setError(null)
        setStep("otp")
      }
    } catch (e) {
      setError('An unexpected error occurred')
      setSuccess(null)
      console.error(e)
    }
  }

  if (step === "otp") {
    return (
      <OtpVerificationForm 
        email={email} 
        type="email" 
        onBack={() => setStep("form")}
        onSuccess={onSuccess}
      />
    )
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          name="email" 
          id="email" 
          type="email"
          placeholder="you@example.com" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          name="password" 
          id="password" 
          type="password"
          placeholder="••••••••" 
          required 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <FormMessage variant="error">{error}</FormMessage>}
      {success && <FormMessage variant="success">{success}</FormMessage>}

      <SubmitButton pendingText="Creating account..." className="w-full">
        Create account
      </SubmitButton>
    </form>
  )
}