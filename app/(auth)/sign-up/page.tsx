"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import Image from 'next/image';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    userType: "personal", // Default to "personal"
    role: "user", // Default to "user"
  });
  const [error, setError] = useState<string | null>(null); // Fix: Allow string or null
  const [success, setSuccess] = useState<string | null>(null); // Fix: Allow string or null
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setTimeout(() => {
          if (router) {
            router.push(`/verify?username=${encodeURIComponent(formData.username)}`);
          }
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
      {/* Logo and Heading in One Line */}
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

      {/* Sign-Up Section */}
      <div className="bg-gray-800 shadow-lg rounded-lg p-6 w-full max-w-xl border border-gray-700">
        <h2 className="text-2xl font-semibold text-center text-gray-200 mb-6">
          Create Your Account
        </h2>
        {error && <Alert variant="destructive">{error}</Alert>}
        {success && (
          <Alert variant="default" className="bg-green-900 text-green-200">
            {success}
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name and Username Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">
                Name
              </Label>
              <Input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className="bg-gray-700 text-gray-200 border-gray-600"
                required
              />
            </div>
            <div>
              <Label htmlFor="username" className="text-gray-300">
                Username
              </Label>
              <Input
                type="text"
                name="username"
                id="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                className="bg-gray-700 text-gray-200 border-gray-600"
                required
              />
            </div>
          </div>

          {/* Email and Password Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email" className="text-gray-300">
                Email
              </Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="bg-gray-700 text-gray-200 border-gray-600"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <Input
                type="password"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="bg-gray-700 text-gray-200 border-gray-600"
                required
              />
            </div>
          </div>

          {/* User Type Field */}
          <div>
            <Label htmlFor="userType" className="text-gray-300">
              Account Type
            </Label>
            <select
              name="userType"
              id="userType"
              value={formData.userType}
              onChange={handleChange}
              className="w-full p-2 bg-gray-700 text-gray-200 border border-gray-600 rounded-md"
              required
            >
              <option value="personal">Personal</option>
              <option value="professional">Professional</option>
            </select>
          </div>

          {/* Role Field (Hidden, default to "user") */}
          <input type="hidden" name="role" value="user" />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 shadow-sm mt-4"
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
                Signing Up...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        {/* Sign-In Link */}
        <div className="text-center mt-6">
          <p className="text-gray-300">
            Already have an account?{" "}
            <Link
              href="/sign-in"
              className="text-blue-500 hover:text-blue-400"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;