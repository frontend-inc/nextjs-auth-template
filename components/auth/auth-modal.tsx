"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "./login-form"
import SignupForm from "./signup-form"
import ForgotPasswordForm from "./forgot-password-form"
import { ThemeSwitcher } from "@/components/theme-switcher"

type AuthModalProps = {
  defaultTab?: "login" | "signup" | "forgot-password"
  triggerElement?: React.ReactNode
}

export default function AuthModal({ defaultTab = "login", triggerElement }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab)
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {triggerElement ? (
        <DialogTrigger asChild>
          {triggerElement}
        </DialogTrigger>
      ) : (
        <div className="flex gap-2 items-center">
          <ThemeSwitcher />
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" onClick={() => setActiveTab("login")}>
              Sign in
            </Button>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Button size="sm" onClick={() => setActiveTab("signup")}>
              Sign up
            </Button>
          </DialogTrigger>
        </div>
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {activeTab === "login" && "Sign in"}
            {activeTab === "signup" && "Sign up"}
            {activeTab === "forgot-password" && "Reset password"}
          </DialogTitle>
          <DialogDescription>
            {activeTab === "login" && "Enter your credentials to sign in to your account."}
            {activeTab === "signup" && "Create a new account to get started."}
            {activeTab === "forgot-password" && "Enter your email to receive a password reset link."}
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="mt-4">
            <LoginForm 
              onForgotPassword={() => setActiveTab("forgot-password")}
              onSuccess={() => setOpen(false)}
            />
          </TabsContent>
          <TabsContent value="signup" className="mt-4">
            <SignupForm onSuccess={() => setOpen(false)} />
          </TabsContent>
          <TabsContent value="forgot-password" className="mt-4">
            <ForgotPasswordForm 
              onBackToLogin={() => setActiveTab("login")}
              onSuccess={() => setOpen(false)}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}