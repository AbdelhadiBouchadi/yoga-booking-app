import { Resend } from "resend";
import { env } from "./env";
import { EmailTemplate } from "@/components/email/EmailTemplate";
import { BookingConfirmationTemplate } from "@/components/email/BookingConfirmationTemplate";
import { WaitlistNotificationTemplate } from "@/components/email/WaitlistNotificationTemplate";
import { formatDateForEmail, formatTimeForEmail } from "./email-utils";

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
  lessonTitle: string,
  lessonStartTime: Date, // Accept Date object instead of formatted strings
  location: string,
  instructorName?: string,
) {
  try {
    const lessonDate = formatDateForEmail(lessonStartTime);
    const lessonTime = formatTimeForEmail(lessonStartTime);

    const { data, error } = await resend.emails.send({
      from: "contact@lafabriquedubonheur.co",
      to: [email],
      subject: "Your Booking has been confirmed - La Fabrique Du Bonheur",
      react: BookingConfirmationTemplate({
        firstName,
        lessonTitle,
        lessonDate,
        lessonTime,
        location,
        instructorName,
      }) as React.ReactNode,
    });

    if (error) {
      console.error("Error sending booking confirmation email:", error);
      throw new Error("Failed to send booking confirmation email");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    throw error;
  }
}

export async function sendWaitlistNotificationEmail(
  email: string,
  firstName: string,
  lessonTitle: string,
  lessonStartTime: Date, // Accept Date object instead of formatted strings
  location: string,
  position: number,
  instructorName?: string,
) {
  try {
    const lessonDate = formatDateForEmail(lessonStartTime);
    const lessonTime = formatTimeForEmail(lessonStartTime);

    const { data, error } = await resend.emails.send({
      from: "contact@lafabriquedubonheur.co",
      to: [email],
      subject: "🙏 You're on the Waitlist - La Fabrique Du Bonheur",
      react: WaitlistNotificationTemplate({
        firstName,
        lessonTitle,
        lessonDate,
        lessonTime,
        location,
        position,
        instructorName,
      }) as React.ReactNode,
    });

    if (error) {
      console.error("Error sending waitlist notification email:", error);
      throw new Error("Failed to send waitlist notification email");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending waitlist notification email:", error);
    throw error;
  }
}

export async function sendWaitlistPromotionEmail(
  email: string,
  firstName: string,
  lessonTitle: string,
  lessonStartTime: Date, // Accept Date object instead of formatted strings
  location: string,
  instructorName?: string,
) {
  try {
    const lessonDate = formatDateForEmail(lessonStartTime);
    const lessonTime = formatTimeForEmail(lessonStartTime);

    const { data, error } = await resend.emails.send({
      from: "contact@lafabriquedubonheur.co",
      to: [email],
      subject: "✨ Great News! A Spot Opened Up - La Fabrique Du Bonheur",
      react: BookingConfirmationTemplate({
        firstName,
        lessonTitle,
        lessonDate,
        lessonTime,
        location,
        instructorName,
      }) as React.ReactNode,
    });

    if (error) {
      console.error("Error sending waitlist promotion email:", error);
      throw new Error("Failed to send waitlist promotion email");
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error sending waitlist promotion email:", error);
    throw error;
  }
}
