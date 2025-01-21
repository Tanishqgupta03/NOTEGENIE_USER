import { Resend } from 'resend';

// Log the Resend API key for debugging
console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);

// Initialize the Resend client
export const resend = new Resend(process.env.RESEND_API_KEY);