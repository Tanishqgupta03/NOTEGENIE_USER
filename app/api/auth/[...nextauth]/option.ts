import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";
import UserModel from "@/model/User";

// Define a type for the user model to ensure proper type checking
interface User {
  _id: string;
  email: string;
  username: string;
  password: string;
  isVerified: boolean;
  tier: string; // Added tier field
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {

        console.log("credentails : ",credentials)
        if (!credentials?.identifier || !credentials?.password) {
          console.log("Missing credentials");
          throw new Error("Email and password are required.");
        }
      
        await dbConnect();
        console.log(`Trying to authenticate: ${credentials.identifier}`);
      
        const user = await UserModel.findOne({
          $or: [{ email: credentials.identifier }, { username: credentials.identifier }],
        });
      
        if (!user) {
          console.log("User not found in database");
          throw new Error("No account found with the provided email or username.");
        }
      
        if (!user.isVerified) {
          console.log("Account not verified");
          throw new Error("Your account is not verified. Please verify it first.");
        }
      
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordCorrect) {
          console.log("Invalid password");
          throw new Error("Incorrect password. Please try again.");
        }
      
        console.log("User authenticated:", user.email);
        return user;
      }
      
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        username: token.username as string,
        tier: token.tier as string
      };
      console.log("Final session:", session);
      return session;
    },
    async jwt({ token, user }) {
      console.log("JWT callback - Token before update:", token);
      console.log("JWT callback - User:", user);

      if (user) {
        token.id = user._id.toString();
        token.username = user.username;
        token.tier = user.tier; // Added tier to JWT
      }

      console.log("JWT callback - Token after update:", token);
      return token;
    },
  },
  cookies: {
    sessionToken: {
      name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
        // Remove the domain setting entirely
      },
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
};

export default NextAuth(authOptions);
