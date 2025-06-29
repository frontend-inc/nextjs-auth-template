"use client"

import { signInAction } from "@/app/actions"
import { SubmitButton } from "@/components/submit-button"
import { FormMessage } from "@/components/form-message"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import OtpVerificationForm from "./otp-verification-form"

type LoginFormProps = {
  onForgotPassword: () => void
  onSuccess?: () => void
}

export default function LoginForm({ onForgotPassword, onSuccess }: LoginFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")

  const handleSubmit = async (formData: FormData) => {
    try {
      setError(null)
      setSuccess(null)
      
      // Add a flag to indicate this is a client-side request
      formData.append("_client", "true")
      
      const result = await signInAction(formData)
      
      if (result && 'error' in result) {
        setError(result.message || 'Sign in failed')
        return
      }
      
      if (result && 'success' in result) {
        if (onSuccess) {
          onSuccess()
        } else {
          window.location.href = "/protected"
        }
      }
    } catch (e) {
      setError('An unexpected error occurred')
      console.error(e)
    }
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

      <div className="flex flex-col gap-2">
        <SubmitButton pendingText="Signing in..." className="w-full">
          Sign In
        </SubmitButton>
        
        <button 
          type="button"
          onClick={onForgotPassword} 
          className="text-xs text-foreground hover:text-muted-foreground underline mt-2 self-end"
        >
          Forgot Password?
        </button>
      </div>
    </form>
  )
}