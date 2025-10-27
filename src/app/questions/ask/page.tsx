"use client";

import { useAuthStore } from "@/store/Auth";
import QuestionForm from "@/components/QuestionForm";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AskQuestionPage() {
    const { user, hydrated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (hydrated && !user) {
            router.push("/login");
        }
    }, [hydrated, user, router]);

    if (!hydrated) {
        return (
            <div className="container mx-auto px-4 pb-20 pt-36">
                <div className="flex items-center justify-center">
                    <div className="text-lg">Loading...</div>
                </div>
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect to login
    }

    return (
        <div className="container mx-auto px-4 pb-20 pt-36">
            <div className="mb-10">
                <h1 className="text-3xl font-bold">Ask a Question</h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Share your knowledge and get help from the community
                </p>
            </div>
            <div className="max-w-3xl">
                <QuestionForm />
            </div>
        </div>
    );
}
