import { Resend } from "resend";
import { env } from "./env";
import { EmailTemplate } from "@/components/email/EmailTemplate";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  firstName: string,
  otp: string,
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "contact@lafabriquedubonheur.co",
      to: [email],
      subject: "La Fabrique Du Bonheur - Verify Your Email Address",
      react: EmailTemplate({ firstName, otp }) as React.ReactNode,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send verification email");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending verification email:", error);
    throw error;
  }
}

export async function sendBookingConfirmationEmail(
  email: string,
  firstName: string,
) {
  try {
    const { data, error } = await resend.emails.send({
      from: "contact@lafabriquedubonheur.co",
      to: [email],
      subject: "La Fabrique Du Bonheur - Booking Confirmation",
      react: EmailTemplate({ firstName, otp: email }) as React.ReactNode,
    });
  } catch (error) {}
}
