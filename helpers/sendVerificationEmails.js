import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";

export async function sendVerificationEmail(email, username, verifyCode) {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      //to: email,
      to: 'gtanishq62@gmail.com',
      subject: 'Mystery message verification code.',
      react: VerificationEmail({ username, otp: verifyCode }),
    });

    return {
      success: true,
      message: 'Verification email sent successfully.',
    };
  } catch (err) {
    console.error("Error sending verification email:", err);

    return {
      success: false,
      message: 'Failed to send verification email.',
    };
  }
}
