import Link from "next/link";
import { ShimmerButton } from "@/src/components/magicui/shimmer-button";
import { Particles } from "@/src/components/magicui/particles";

export default function Home() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Particles
                className="absolute inset-0"
                quantity={100}
                ease={80}
                color="#ffffff"
                refresh
            />
            <main className="relative z-10 flex min-h-screen w-full max-w-3xl flex-col items-center justify-center gap-8 px-8 py-32 text-center">
                <h1 className="text-6xl font-bold text-white">
                    Welcome to <span className="text-orange-500">AskBit</span>
                </h1>
                <p className="max-w-2xl text-xl leading-8 text-gray-300">
                    Ask questions, get answers. The community-driven platform for knowledge sharing.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row">
                    <Link href="/questions">
                        <ShimmerButton className="shadow-2xl">
                            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                Browse Questions
                            </span>
                        </ShimmerButton>
                    </Link>
                    <Link href="/questions/ask">
                        <ShimmerButton className="shadow-2xl">
                            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                Ask a Question
                            </span>
                        </ShimmerButton>
                    </Link>
                </div>
                <div className="mt-8 flex gap-4">
                    <Link
                        href="/login"
                        className="rounded-lg bg-white/10 px-6 py-3 font-medium text-white transition-colors hover:bg-white/20"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="rounded-lg bg-orange-500 px-6 py-3 font-medium text-white transition-colors hover:bg-orange-600"
                    >
                        Sign Up
                    </Link>
                </div>
            </main>
        </div>
    );
}
