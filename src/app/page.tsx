"use client";

import { HeroParallax } from "@/components/ui/hero-parallax";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Particles } from "@/components/magicui/particles";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { MagicCard, MagicContainer } from "@/components/magicui/magic-card";
import { NumberTicker } from "@/components/magicui/number-ticker";
import { AnimatedGridPattern } from "@/components/magicui/animated-grid-pattern";
import { BorderBeam } from "@/components/magicui/border-beam";
import { WobbleCard } from "@/components/ui/wobble-card";
import { IconQuestionMark, IconUsers, IconTrophy, IconRocket, IconHeart, IconStar } from "@tabler/icons-react";
import Link from "next/link";
import { useAuthStore } from "@/store/Auth";
import { useEffect, useState } from "react";

const products = [
  {
    title: "Ask Questions",
    link: "/questions/ask",
    thumbnail: "/api/placeholder/600/400",
  },
  {
    title: "Browse Questions",
    link: "/questions",
    thumbnail: "/api/placeholder/600/400",
  },
  {
    title: "Get Answers",
    link: "/questions",
    thumbnail: "/api/placeholder/600/400",
  },
  {
    title: "Vote & Rate",
    link: "/questions",
    thumbnail: "/api/placeholder/600/400",
  },
  {
    title: "Build Reputation",
    link: "/questions",
    thumbnail: "/api/placeholder/600/400",
  },
  {
    title: "Join Community",
    link: "/register",
    thumbnail: "/api/placeholder/600/400",
  },
];

const features = [
  {
    title: "Ask Questions",
    description: "Get answers from a community of experts and enthusiasts",
    icon: <IconQuestionMark className="h-8 w-8" />,
  },
  {
    title: "Vote & Rate",
    description: "Help the community by voting on the best answers",
    icon: <IconHeart className="h-8 w-8" />,
  },
  {
    title: "Build Reputation",
    description: "Earn points and build your reputation through quality contributions",
    icon: <IconTrophy className="h-8 w-8" />,
  },
  {
    title: "Join Community",
    description: "Connect with like-minded individuals and share knowledge",
    icon: <IconUsers className="h-8 w-8" />,
  },
];

const stats = [
  { label: "Questions Asked", value: 1250 },
  { label: "Answers Given", value: 3200 },
  { label: "Active Users", value: 850 },
  { label: "Success Rate", value: 95 },
];

export default function Home() {
  const { user, hydrated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Effects */}
      <Particles
        className="absolute inset-0"
        quantity={100}
        ease={80}
        color="#ffffff"
        size={0.5}
      />
      <BackgroundBeams />
      
      {/* Hero Section */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        <div className="mx-auto max-w-4xl">
          <h1 className="mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-6xl font-bold text-transparent sm:text-7xl">
            AskBit
          </h1>
          <p className="mb-8 text-xl text-gray-300 sm:text-2xl">
            The ultimate platform for asking questions and getting expert answers
          </p>
          
          <div className="mb-12 flex flex-col gap-4 sm:flex-row sm:justify-center">
            {user ? (
              <Link href="/questions/ask">
                <ShimmerButton className="shadow-2xl">
                  <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                    Ask a Question
                  </span>
                </ShimmerButton>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <ShimmerButton className="shadow-2xl">
                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                      Get Started
                    </span>
                  </ShimmerButton>
                </Link>
                <Link href="/login">
                  <ShimmerButton className="shadow-2xl">
                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                      Sign In
                    </span>
                  </ShimmerButton>
                </Link>
              </>
            )}
            <Link href="/questions">
              <ShimmerButton className="shadow-2xl">
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  Browse Questions
                </span>
              </ShimmerButton>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-white sm:text-4xl">
                  <NumberTicker value={stat.value} />
                  {index === 3 && "%"}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative z-10 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-16 text-center text-4xl font-bold text-white">
            Why Choose AskBit?
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <WobbleCard key={index} className="group">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 text-blue-500 group-hover:text-blue-400">
                    {feature.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </WobbleCard>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Parallax Section */}
      <div className="relative z-10 py-20">
        <HeroParallax products={products} />
      </div>

      {/* CTA Section */}
      <div className="relative z-10 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <div className="relative mx-auto max-w-2xl">
            <BorderBeam className="absolute inset-0" />
            <div className="rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-8 backdrop-blur-sm">
              <h2 className="mb-4 text-3xl font-bold text-white">
                Ready to Get Started?
              </h2>
              <p className="mb-8 text-lg text-gray-300">
                Join thousands of users who are already asking questions and sharing knowledge
              </p>
              <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                {!user ? (
                  <>
                    <Link href="/register">
                      <ShimmerButton className="shadow-2xl">
                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                          Create Account
                        </span>
                      </ShimmerButton>
                    </Link>
                    <Link href="/login">
                      <ShimmerButton className="shadow-2xl">
                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                          Sign In
                        </span>
                      </ShimmerButton>
                    </Link>
                  </>
                ) : (
                  <Link href="/questions/ask">
                    <ShimmerButton className="shadow-2xl">
                      <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                        Ask Your First Question
                      </span>
                    </ShimmerButton>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 -z-10">
        <AnimatedGridPattern
          numSquares={30}
          maxOpacity={0.1}
          duration={3000}
          className="[mask-image:radial-gradient(300px_circle_at_center,white,transparent)]"
        />
      </div>
    </div>
  );
}
