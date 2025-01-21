import NextAuth from "next-auth";
import { authOptions } from "./option";

const handler = NextAuth(authOptions); // This handler will handle both GET and POST requests

export { handler as GET, handler as POST };