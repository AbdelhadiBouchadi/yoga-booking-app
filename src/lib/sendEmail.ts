"use server";

import React from "react";
import { Resend } from "resend";
import { getErrorMessage, validateString } from "./utils";
import ContactFormEmail from "@/components/email/ContactFormEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async (formData: FormData) => {
  const senderEmail = formData.get("email");
  const message = formData.get("message");
  const senderName = formData.get("name");

  // simple server-side validation
  if (!validateString(senderEmail, 500)) {
    return {
      error: "Invalid sender email",
    };
  }
  if (!validateString(senderName, 500)) {
    return {
      error: "Invalid sender name",
    };
  }
  if (!validateString(message, 5000)) {
    return {
      error: "Invalid message",
    };
  }

  let data;
  try {
    data = await resend.emails.send({
      from: "La Fabrique Du Bonheur Contact <contact@lafabriquedubonheur.co>",
      to: "contact@lafabriquedubonheur.co",
      subject: "New Contact Form Message - La Fabrique Du Bonheur",
      replyTo: senderEmail as string,
      react: React.createElement(ContactFormEmail, {
        message: message as string,
        senderEmail: senderEmail as string,
        senderName: senderName as string,
      }),
    });

    console.log(data);
  } catch (error: unknown) {
    return {
      error: getErrorMessage(error),
    };
  }

  return {
    data,
  };
};
