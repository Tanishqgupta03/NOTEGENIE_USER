"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import Image from 'next/image';

const Verify = () => {
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    // Get the username from the URL query parameters
    const queryParams = new URLSearchParams(window.location.search);
    const usernameFromQuery = queryParams.get("username");
    if (usernameFromQuery) {
      setUsername(decodeURIComponent(usernameFromQuery));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, verifyCode }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          router.push("/sign-in");
        }, 2000);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 flex flex-col items-center justify-center p-4">
      {/* Logo and Heading */}
      <div className="flex items-center justify-center mb-8">
      <Image 
        src="/images/side_logo.png" 
        alt="NoteGenie Logo" 
        width={56}  // Adjust width as needed
        height={56} // Adjust height as needed
        className="h-14 w-auto"
      />
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent ml-4">
          NOTEGENIE
        </h1>
      </div>

      {/* Verification Section */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-semibold text-center text-gray-200 mb-6">
          Verify Your Account
        </h2>
        {error && (
          <Alert variant="destructive" className="mb-4">
            {error}
          </Alert>
        )}
        {success && (
          <Alert variant="default" className="bg-green-900 text-green-200 mb-4">
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="verifyCode" className="text-gray-300">
              Verification Code
            </Label>
            <Input
              type="text"
              name="verifyCode"
              id="verifyCode"
              value={verifyCode}
              onChange={(e) => setVerifyCode(e.target.value)}
              placeholder="Enter your code"
              className="bg-gray-700 text-gray-200 border-gray-600"
              required
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
                Verifying...
              </div>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
        <div className="text-center mt-6">
          <p className="text-sm text-gray-300">
            Didn&apos;t receive a code?{" "}
            <button
              className="text-blue-500 hover:text-blue-400"
              onClick={() => setError("Resend functionality not implemented yet.")}
            >
              Resend Code
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Verify;