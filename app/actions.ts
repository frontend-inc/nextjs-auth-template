"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  if (!email || !password) {
    return {
      error: true,
      message: "Email and password are required",
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        email_confirmed: false
      }
    },
  });

  if (error) {
    console.error(error.code + " " + error.message);
    return {
      error: true,
      message: error.message
    };
  } else {
    // Send OTP code for verification
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
      }
    });

    if (otpError) {
      console.error(otpError);
    }

    return {
      success: true,
      message: "Please check your email for a verification code.",
    };
  }
};

export const verifyOtpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const token = formData.get("token")?.toString();
  const type = formData.get("type")?.toString() as "email" | "recovery" || "email";
  const supabase = await createClient();
  const isClient = formData.get("_client") === "true";

  if (!email || !token) {
    return {
      error: true,
      message: "Email and verification code are required",
    };
  }

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type,
  });

  if (error) {
    return {
      error: true,
      message: error.message
    };
  }

  // If this is for email verification for a new user, update the user's metadata
  if (type === "email") {
    // Get the user to update their metadata
    const { data: userData } = await supabase.auth.getUser();
    
    if (userData?.user) {
      // Update the user's metadata to mark their email as confirmed
      await supabase.auth.updateUser({
        data: { email_confirmed: true }
      });
    }
  }

  // When called from client component, we return success
  if (isClient) {
    return {
      success: true,
      session: data.session
    };
  }

  // When called from server, we redirect
  return redirect("/protected");
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  if (!email || !password) {
    return {
      error: true,
      message: "Email and password are required"
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return {
      error: true,
      message: error.message
    };
  }

  // When called from client component, we return success
  if (formData.get("_client") === "true") {
    return {
      success: true,
      session: data.session
    };
  }

  // When called from server, we redirect
  return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const callbackUrl = formData.get("callbackUrl")?.toString();
  const isClient = formData.get("_client") === "true";

  if (!email) {
    return isClient 
      ? { error: true, message: "Email is required" }
      : encodedRedirect("error", "/forgot-password", "Email is required");
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  });

  if (error) {
    console.error(error.message);
    return isClient
      ? { error: true, message: "Could not send recovery code" }
      : encodedRedirect("error", "/forgot-password", "Could not send recovery code");
  }

  if (callbackUrl && !isClient) {
    return redirect(callbackUrl);
  }
  
  const successMessage = "Check your email for a recovery code.";
  
  return isClient
    ? { success: true, message: successMessage }
    : encodedRedirect("success", "/forgot-password", successMessage);
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password and confirm password are required",
    );
  }

  if (password !== confirmPassword) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Passwords do not match",
    );
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    encodedRedirect(
      "error",
      "/protected/reset-password",
      "Password update failed",
    );
  }

  encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return redirect("/sign-in");
};
