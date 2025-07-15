'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authClient } from '@/lib/auth-client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, LogInIcon, OctagonAlertIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { FcGoogle } from 'react-icons/fc';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import LogoGreen from '../../../public/logo-green.webp';
import LogoOrange from '../../../public/logo-orange.webp';
import { useTheme } from 'next-themes';

const formSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);
  const { theme } = useTheme();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    setPending(true);
    setError(null);

    authClient.signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: '/',
      },
      {
        onSuccess: () => {
          setPending(false);
          toast.success('Signed in successfully');
          router.push('/');
        },
        onError: ({ error }) => {
          setPending(false);
          setError(error.message);
          toast.error(error.message);
        },
      }
    );
  };

  const onSocialSubmit = () => {
    setGooglePending(true);
    setError(null);

    authClient.signIn.social(
      {
        provider: 'google',
        callbackURL: '/',
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
      }
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
                  <h1 className="text-2xl font-bold">Welcome Back 👋</h1>
                  <p className="text-muted-foreground text-balance">
                    Sign In to your account
                  </p>
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
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
                        <FormLabel>Password</FormLabel>
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
                  className="w-full flex items-center"
                  disabled={googlePending || pending}
                >
                  {pending ? (
                    <>
                      Signing in...
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Sign In
                      <LogInIcon />
                    </>
                  )}
                </Button>
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or Continue With
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
                  Don&apos;t have an account?{' '}
                  <Link
                    href="/sign-up"
                    className="underline underline-offset-4"
                  >
                    Create one
                  </Link>
                </div>
              </div>
            </form>
          </Form>
          <div className="from-primary/10 to-primary/40 relative hidden flex-col items-center justify-center gap-y-4 bg-radial md:flex">
            <Image
              src={theme === 'light' ? LogoGreen : LogoOrange}
              alt="Image "
              className="object-cover pointer-events-none"
              width={148}
              height={148}
            />
          </div>
        </CardContent>
      </Card>

      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our <a href="#">Terms Of Service</a>{' '}
        and <a href="#">Privacy Policy</a>
      </div>
    </div>
  );
};
