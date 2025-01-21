"use client";

import { signIn, getSession } from "next-auth/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignIn() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleCredentialsSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const email = (e.target as HTMLFormElement).email.value;
    const password = (e.target as HTMLFormElement).password.value;


    console.log("email : ",email);
    console.log("password : ",password);
    try {
      const res = await signIn("credentials", {
        identifier: email,
        password,
        redirect: false,
      });

      console.log("Sign-in response:", res);

      if (res?.ok) {
        console.log("Sign-in successful. Fetching session...");
        const session = await getSession();
        console.log("Session after login:", session);

        if (session?.user?.id) {
          console.log("Session found. Redirecting to dashboard...");
          console.log("Cookies:", document.cookie);
          window.location.href = "/dashboard";
        } else {
          console.error("Session not found. Debugging cookies and tokens...");
          console.log("Cookies:", document.cookie);
          setError("Session not found. Please try again.");
        }
      } else {
        console.error("Sign-in failed. Response:", res);
        setError("Invalid email or password.");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center p-4">
      {/* Logo and Heading */}
      <div className="flex items-center justify-center mb-8">
        <img
          src="/images/side_logo.png"
          alt="NoteGenie Logo"
          className="h-16 w-16"
        />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent ml-4">
          NOTEGENIE
        </h1>
      </div>

      {/* Sign-In Section */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-semibold text-center text-gray-200 mb-6">
          Sign In
        </h2>
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}

        {/* Credentials Sign-In Form */}
        <form onSubmit={handleCredentialsSignIn} className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-gray-300">
              Email
            </Label>
            <Input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Enter your email"
              className="bg-gray-700 text-gray-200 border-gray-600"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Enter your password"
              className="bg-gray-700 text-gray-200 border-gray-600"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Signing In...
              </div>
            ) : (
              "Sign in with Credentials"
            )}
          </Button>
        </form>

        {/* Sign-Up Link */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-300">
            Don't have an account?{" "}
            <Link
              href="/sign-up"
              className="text-blue-500 hover:text-blue-400"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}