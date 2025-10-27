"use client";

import QuestionForm from "@/src/components/QuestionForm";
import { Particles } from "@/src/components/magicui/particles";
import { TracingBeam } from "@/src/components/ui/tracing-beam";
import { IconInfoCircle, IconBulb } from "@tabler/icons-react";
import Link from "next/link";

const AskQuestionPage = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Particles
                className="absolute inset-0"
                quantity={100}
                ease={80}
                color="#ffffff"
                refresh
            />
            
            <div className="relative mx-auto max-w-5xl px-4 pb-20 pt-6">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="mb-2 text-4xl font-bold text-white">
                        Ask a Question
                    </h1>
                    <p className="text-gray-300">
                        Share your knowledge or get help from the community
                    </p>
                </div>

                {/* Tips Section */}
                <div className="mb-8 rounded-2xl border border-blue-500/20 bg-blue-500/5 p-6 backdrop-blur-sm">
                    <div className="mb-4 flex items-center gap-2">
                        <IconBulb className="h-5 w-5 text-blue-400" />
                        <h3 className="font-semibold text-blue-400">Tips for asking a great question</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"></span>
                            <span>Be specific and detailed about what you&apos;re trying to solve</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"></span>
                            <span>Include relevant code, error messages, or context</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"></span>
                            <span>Use clear tags to help others find and answer your question</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400"></span>
                            <span>Add images or attachments if they help explain your problem</span>
                        </li>
                    </ul>
                </div>

                {/* Info Box */}
                <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <div className="flex items-start gap-3">
                        <IconInfoCircle className="h-5 w-5 shrink-0 text-orange-400" />
                        <div className="text-sm text-gray-300">
                            <p>
                                Your question will be publicly visible on the{" "}
                                <Link href="/questions" className="text-orange-500 hover:text-orange-400">
                                    questions page
                                </Link>
                                . You can always edit or delete it later.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Question Form */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                    <QuestionForm />
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center text-sm text-gray-400">
                    <Link href="/questions" className="hover:text-white">
                        ← Back to all questions
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AskQuestionPage;
