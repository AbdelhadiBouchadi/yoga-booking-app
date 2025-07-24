"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, OctagonAlertIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import LogoGreen from "../../../public/logo-green.webp";
import LogoOrange from "../../../public/logo-orange.webp";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";

const formSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

export const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const { theme } = useTheme();
  const t = useTranslations("auth.signUp");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setPending(true);
    setError(null);

    try {
      // First, create the account
      await authClient.signUp.email(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: async () => {
            // After successful signup, send OTP for verification
            await authClient.emailOtp.sendVerificationOtp(
              {
                email: data.email,
                type: "email-verification",
              },
              {
                onSuccess: () => {
                  setPending(false);
                  toast.success(
                    "Account created! Please check your email for verification code.",
                  );
                  // Redirect to OTP verification page with email
                  router.push(`/verify-email?email=${data.email}`);
                },
                onError: ({ error }) => {
                  setPending(false);
                  setError(
                    "Account created but failed to send verification email. Please try signing in.",
                  );
                  toast.error("Failed to send verification email");
                },
              },
            );
          },
          onError: ({ error }) => {
            setPending(false);
            setError(error.message);
            toast.error(error.message);
          },
        },
      );
    } catch (err) {
      setPending(false);
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    }
  };

  const onSocialSubmit = () => {
    setGooglePending(true);
    setError(null);

    authClient.signIn.social(
      {
        provider: "google",
        callbackURL: "/",
      },
      {
        onSuccess: () => {
          setGooglePending(false);
          toast.success(`Signed in with google successfully`);
        },
        onError: ({ error }) => {
          setGooglePending(false);
          setError(error.message);
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">{t("title")}</h1>
                  <p className="text-muted-foreground text-balance">
                    {t("description")}
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("name.label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder={t("name.placeholder")}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email")}</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="email@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("password.label")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="*********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("password.confirmPassword")}</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="*********"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {!!error && (
                  <Alert className="bg-destructive/10 border-none">
                    <OctagonAlertIcon className="!text-destructive size-4" />
                    <AlertTitle className="font-semibold">{error}</AlertTitle>
                  </Alert>
                )}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={googlePending || pending}
                >
                  {pending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("pending")}
                    </>
                  ) : (
                    <>{t("signUpBtn")}</>
                  )}
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    {t("continueWith")}
                  </span>
                </div>
                <div className="grid grid-cols-1">
                  <Button
                    variant="outline"
                    type="button"
                    className="w-full"
                    disabled={googlePending || pending}
                    onClick={() => {
                      onSocialSubmit();
                    }}
                  >
                    {googlePending ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <FcGoogle className="mr-2 size-6" />
                    )}
                    Google
                  </Button>
                </div>
                <div className="text-center text-sm">
                  {t("dontHaveAccount")}{" "}
                  <Link
                    href="/sign-in"
                    className="hover:text-muted-foreground underline underline-offset-4 transition-colors duration-100"
                  >
                    {t("createAccount")}
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="from-primary/10 to-primary/40 relative hidden flex-col items-center justify-center gap-y-4 bg-radial md:flex">
            <Image
              src={theme === "light" ? LogoGreen : LogoOrange}
              alt="Image "
              className="pointer-events-none object-cover"
              width={148}
              height={148}
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        {t("privacyPolicy.description")}{" "}
        <a href="#">{t("privacyPolicy.tos")} </a> {t("privacyPolicy.and")}{" "}
        <a href="#">{t("privacyPolicy.pp")} </a>
      </div>
    </div>
  );
};
