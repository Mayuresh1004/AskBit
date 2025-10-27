import { tablesDB, users } from "@/models/server/config";
import { answerCollection, db, voteCollection, questionCollection } from "@/models/name";
import { Query } from "node-appwrite";
import { Suspense } from "react";
import Link from "next/link";
import QuestionCard from "@/components/QuestionCard";
import { UserPrefs } from "@/store/Auth";
import Pagination from "@/components/Pagination";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import Search from "./Search";

const Page = async ({
    searchParams,
}: {
    searchParams: { page?: string; tag?: string; search?: string };
}) => {
    searchParams.page ||= "1";

    const queries = [
        Query.orderDesc("$createdAt"),
        Query.offset((+searchParams.page - 1) * 25),
        Query.limit(25),
    ];

    if (searchParams.tag) queries.push(Query.equal("tags", searchParams.tag));
    if (searchParams.search)
        queries.push(
            Query.or([
                Query.search("title", searchParams.search),
                Query.search("content", searchParams.search),
            ])
        );

    const questions = await tablesDB.listRows({
        databaseId: db,
        tableId: questionCollection,
        queries: queries,
    });
    console.log("Questions", questions)

    questions.rows = await Promise.all(
        questions.rows.map(async ques => {
            const [author, answers, votes] = await Promise.all([
                users.get<UserPrefs>(ques.authorId),
                tablesDB.listRows({
                    databaseId: db,
                    tableId: answerCollection,
                    queries: [
                        Query.equal("questionId", ques.$id),
                        Query.limit(1), // for optimization
                    ],
                }),
                tablesDB.listRows({
                    databaseId: db,
                    tableId: voteCollection,
                    queries: [
                        Query.equal("type", "question"),
                        Query.equal("typeId", ques.$id),
                        Query.limit(1), // for optimization
                    ],
                }),
            ]);

            return {
                ...ques,
                totalAnswers: answers.total,
                totalVotes: votes.total,
                author: {
                    $id: author.$id,
                    reputation: author.prefs.reputation,
                    name: author.name,
                },
            };
        })
    );

    return (
        <div className="relative min-h-screen bg-black">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20" />
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
            
            <div className="relative z-10 container mx-auto px-4 pb-20 pt-36">
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="mb-4 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-5xl font-bold text-transparent sm:text-6xl">
                        All Questions
                    </h1>
                    <p className="text-xl text-gray-400">
                        Discover answers from our community of experts
                    </p>
                </div>

                {/* Search and Ask Button */}
                <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex w-full flex-row gap-4 sm:max-w-md">
                        <input
                            type="text"
                            placeholder="Search questions..."
                            className="flex h-12 w-full min-w-0 rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder:text-gray-400 backdrop-blur-sm transition-all focus:border-blue-500 focus:bg-white/20 focus:outline-none"
                        />
                        <button
                            type="submit"
                            className="shrink-0 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-3 font-semibold text-white transition-all hover:from-blue-600 hover:to-purple-600 hover:shadow-lg"
                        >
                            Search
                        </button>
                    </div>
                    <Link href="/questions/ask">
                        <ShimmerButton className="shadow-2xl">
                            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                Ask a Question
                            </span>
                        </ShimmerButton>
                    </Link>
                </div>

                {/* Stats */}
                <div className="mb-8 flex items-center justify-center">
                    <div className="rounded-full bg-white/10 px-6 py-2 backdrop-blur-sm">
                        <span className="text-sm text-gray-300">
                            <span className="font-semibold text-white">{questions.total}</span> questions found
                        </span>
                    </div>
                </div>

                {/* Questions Grid */}
                <div className="mb-8 space-y-6">
                    {questions.rows.length > 0 ? (
                        questions.rows.map(ques => (
                            <div key={ques.$id} className="group">
                                <QuestionCard ques={ques as any} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20">
                            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-white/10 flex items-center justify-center">
                                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">No questions yet</h3>
                            <p className="mb-6 text-gray-400">Be the first to ask a question!</p>
                            <Link href="/questions/ask">
                                <ShimmerButton className="shadow-2xl">
                                    <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                        Ask the First Question
                                    </span>
                                </ShimmerButton>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {questions.total > 25 && (
                    <div className="flex justify-center">
                        <Suspense fallback={<div className="text-gray-400">Loading pagination...</div>}>
                            <Pagination total={questions.total} limit={25} />
                        </Suspense>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;