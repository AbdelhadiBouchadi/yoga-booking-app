"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  ArrowRight,
  Check,
  Flower2,
  Heart,
  Leaf,
  Infinity,
} from "lucide-react";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useTranslations } from "next-intl";
import Link from "next/link";

const planIcons = {
  trial: Flower2,
  pack5: Heart,
  pack10: Leaf,
  unlimited: Infinity,
};

export default function PricingSection() {
  const t = useTranslations("pricing");
  const [frequency, setFrequency] = useState<string>("perSession");
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const plans = [
    {
      id: "trial",
      icon: planIcons.trial,
      popular: false,
    },
    {
      id: "pack5",
      icon: planIcons.pack5,
      popular: false,
    },
    {
      id: "pack10",
      icon: planIcons.pack10,
      popular: true,
    },
    {
      id: "unlimited",
      icon: planIcons.unlimited,
      popular: false,
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="from-background via-primary/5 to-background relative w-full overflow-hidden bg-gradient-to-br px-4 py-24 sm:px-8"
    >
      {/* Blurry Background Dots */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
        className="bg-primary/20 dark:bg-primary/10 absolute -top-[10%] right-[10%] -z-10 h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem]"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={
          isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
        }
        transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
        className="bg-secondary/20 dark:bg-secondary/10 absolute -bottom-[10%] left-[10%] -z-10 h-[31.25rem] w-[31.25rem] rounded-full blur-[10rem]"
      />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-center gap-8">
          {/* Header */}
          <div className="flex flex-col items-center space-y-2 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Badge
                variant="outline"
                className="border-primary/20 bg-primary/5 mb-4 rounded-full px-4 py-1 text-sm font-medium"
              >
                <Sparkles className="text-primary mr-1 h-3.5 w-3.5 animate-pulse" />
                {t("badge")}
              </Badge>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="from-foreground via-foreground/90 to-foreground/80 mb-6 bg-gradient-to-r bg-clip-text py-2 font-mono text-4xl font-bold tracking-tight text-transparent sm:text-5xl md:text-6xl"
            >
              {t("title")}{" "}
              <span className="from-primary to-primary/70 block bg-gradient-to-r bg-clip-text text-transparent">
                {t("titleHighlight")}
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-muted-foreground mx-auto max-w-2xl font-serif text-xl md:text-2xl"
            >
              {t("description")}
            </motion.p>
          </div>

          {/* Tabs for viewing options */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={
              isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }
            }
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            <Tabs
              defaultValue={frequency}
              onValueChange={setFrequency}
              className="bg-muted/30 inline-block rounded-full p-1 shadow-sm"
            >
              <TabsList className="bg-transparent">
                <TabsTrigger
                  value="perSession"
                  className="data-[state=active]:bg-background rounded-full transition-all duration-300 data-[state=active]:shadow-sm"
                >
                  {t("tabs.perSession")}
                </TabsTrigger>
                <TabsTrigger
                  value="total"
                  className="data-[state=active]:bg-background rounded-full transition-all duration-300 data-[state=active]:shadow-sm"
                >
                  {t("tabs.total")}
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          {/* Pricing Cards */}
          <div className="mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, index) => {
              const Icon = plan.icon;
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
                  }
                  //   transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="flex"
                >
                  <Card
                    className={cn(
                      "relative h-full w-full text-left transition-all duration-300 hover:shadow-lg",
                      plan.popular
                        ? "border-primary/50 from-primary/[0.03] ring-primary/50 dark:shadow-primary/10 bg-gradient-to-b to-transparent shadow-md ring-2"
                        : "bg-card/50 hover:border-primary/30 backdrop-blur-sm",
                    )}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 right-0 left-0 mx-auto w-fit">
                        <Badge className="bg-primary text-primary-foreground rounded-full px-4 py-1 shadow-sm">
                          <Sparkles className="mr-1 h-3.5 w-3.5" />
                          {t("popularBadge")}
                        </Badge>
                      </div>
                    )}

                    <CardHeader className={cn("pb-4", plan.popular && "pt-8")}>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "flex h-10 w-10 items-center justify-center rounded-full",
                            plan.popular
                              ? "bg-primary/10 text-primary"
                              : "bg-secondary/20 text-foreground",
                          )}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <CardTitle
                          className={cn(
                            "font-mono text-xl font-bold",
                            plan.popular && "text-primary",
                          )}
                        >
                          {t(`plans.${plan.id}.name`)}
                        </CardTitle>
                      </div>

                      <CardDescription className="mt-3 space-y-2">
                        <p className="font-serif text-sm">
                          {t(`plans.${plan.id}.description`)}
                        </p>
                        <div className="pt-2">
                          {frequency === "perSession" &&
                          t(`plans.${plan.id}.pricePerSession`) !== "N/A" ? (
                            <div className="flex items-baseline">
                              <span
                                className={cn(
                                  "font-mono text-3xl font-bold",
                                  plan.popular
                                    ? "text-primary"
                                    : "text-foreground",
                                )}
                              >
                                {t(`plans.${plan.id}.pricePerSession`)}
                              </span>
                              <span className="text-muted-foreground ml-1 font-serif text-sm">
                                {t("currency")}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-baseline">
                              <span
                                className={cn(
                                  "font-mono text-3xl font-bold",
                                  plan.popular
                                    ? "text-primary"
                                    : "text-foreground",
                                )}
                              >
                                {t(`plans.${plan.id}.price`)}
                              </span>
                              <span className="text-muted-foreground ml-1 font-serif text-sm">
                                {t("currency")}
                              </span>
                            </div>
                          )}
                        </div>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="grid gap-3 pb-6">
                      {t
                        .raw(`plans.${plan.id}.features`)
                        .map((feature: string, featureIndex: number) => (
                          <motion.div
                            key={featureIndex}
                            initial={{ opacity: 0, x: -5 }}
                            animate={
                              isInView
                                ? { opacity: 1, x: 0 }
                                : { opacity: 0, x: -5 }
                            }
                            // transition={{
                            //   duration: 0.3,
                            //   delay: 0.6 + index * 0.1 + featureIndex * 0.05,
                            // }}
                            className="flex items-center gap-2 text-sm"
                          >
                            <div
                              className={cn(
                                "flex h-5 w-5 items-center justify-center rounded-full",
                                plan.popular
                                  ? "bg-primary/10 text-primary"
                                  : "bg-secondary/20 text-secondary-foreground",
                              )}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </div>
                            <span
                              className={cn(
                                "font-serif",
                                plan.popular
                                  ? "text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              {feature}
                            </span>
                          </motion.div>
                        ))}
                    </CardContent>

                    <CardFooter>
                      {plan.id === "trial" ? (
                        <Button
                          variant={plan.popular ? "default" : "outline"}
                          className={cn(
                            "group w-full font-medium transition-all duration-300",
                            plan.popular
                              ? "bg-primary hover:bg-primary/90 hover:shadow-primary/20 hover:shadow-md"
                              : "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                          )}
                          asChild
                        >
                          <Link href={`/sessions`}>
                            {t(`plans.${plan.id}.cta`)}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          variant={plan.popular ? "default" : "outline"}
                          className={cn(
                            "group w-full font-medium transition-all duration-300",
                            plan.popular
                              ? "bg-primary hover:bg-primary/90 hover:shadow-primary/20 hover:shadow-md"
                              : "hover:border-primary/30 hover:bg-primary/5 hover:text-primary",
                          )}
                          asChild
                        >
                          <a href="mailto:contact@lafabriquedubonheur.co">
                            {t(`plans.${plan.id}.cta`)}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                          </a>
                        </Button>
                      )}
                    </CardFooter>

                    {/* Subtle gradient effects */}
                    {plan.popular ? (
                      <>
                        <div className="from-primary/[0.05] pointer-events-none absolute right-0 bottom-0 left-0 h-1/2 rounded-b-lg bg-gradient-to-t to-transparent" />
                        <div className="border-primary/20 pointer-events-none absolute inset-0 rounded-lg border" />
                      </>
                    ) : (
                      <div className="hover:border-primary/10 pointer-events-none absolute inset-0 rounded-lg border border-transparent opacity-0 transition-opacity duration-300 hover:opacity-100" />
                    )}
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
