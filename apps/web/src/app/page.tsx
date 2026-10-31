"use client";

import { ArrowRight, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";

import { Dither } from "@/components/ui/beams";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <main className="flex flex-1 items-center justify-center">
      <Dither color="#9fb4ff" scale={3} speed={1} interactive={false} pixelSize={3} className="-z-10 opacity-10" />
      <div className="flex max-w-xl flex-col items-center gap-6 px-6 text-center z-10">
        <div className="flex items-center justify-center">
          <img
            data-no-hover
            data-no-focus-ring
            src="/assets/logo_black.png"
            alt="Zlo logo"
            className="size-20 sm:size-24 dark:hidden"
          />
          <img
            data-no-hover
            data-no-focus-ring
            src="/assets/logo_white.png"
            alt="Zlo logo"
            className="size-20 sm:size-24 hidden dark:block"
          />
        </div>

        <h1 className="text-4xl font-semibold tracking-tight text-balance text-foreground sm:text-5xl">
          Know what your subscriptions really cost
        </h1>

        <p className="max-w-md text-balance text-muted-foreground">
          Zlo tracks every recurring charge, normalises weekly, monthly and yearly billing into one
          monthly cost, and warns you before the next renewal hits.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" nativeButton={false} render={<Link href="/login" />}>
            Get started
            <ArrowRight aria-hidden data-icon="inline-end" />
          </Button>
          <Button
            size="lg"
            variant="ghost"
            nativeButton={false}
            render={<Link href="/home" />}
          >
            <LayoutDashboardIcon aria-hidden data-icon="inline-start" />
            Open home
          </Button>
        </div>
      </div>
    </main>
  );
}

