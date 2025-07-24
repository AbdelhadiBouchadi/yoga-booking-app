import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import React from "react";

const AuthLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) => {
  const messages = await getMessages();
  const { locale } = await params;

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div className="bg-background/40 flex min-h-svh flex-col items-center justify-center p-6 font-sans md:p-10">
        <div className="w-full max-w-sm md:max-w-5xl">{children}</div>
      </div>
    </NextIntlClientProvider>
  );
};

export default AuthLayout;
