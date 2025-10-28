import Link from "next/link";
import { ShimmerButton } from "@/src/components/magicui/shimmer-button";

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
            <div className="text-center">
                <h1 className="mb-4 text-6xl font-bold text-white">404</h1>
                <h2 className="mb-2 text-2xl font-semibold text-gray-200">Question Not Found</h2>
                <p className="mb-8 text-gray-400">
                    The question you're looking for doesn't exist or has been removed.
                </p>
                <Link href="/questions">
                    <ShimmerButton className="shadow-2xl">
                        <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                            Browse Questions
                        </span>
                    </ShimmerButton>
                </Link>
            </div>
        </div>
    );
}

