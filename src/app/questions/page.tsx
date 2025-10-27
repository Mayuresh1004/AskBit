import { tablesDB, users } from "@/src/models/server/config";
import { answerCollection, db, voteCollection, questionCollection } from "@/src/models/name";
import { Query } from "node-appwrite";
import React from "react";
import Link from "next/link";
import QuestionCard from "@/src/components/QuestionCard";
import { UserPrefs } from "@/src/store/Auth";
import Pagination from "@/src/components/Pagination";
import { ShimmerButton } from "@/src/components/magicui/shimmer-button";
import { Particles } from "@/src/components/magicui/particles";
import Search from "./Search";
import { IconPlus, IconSearch } from "@tabler/icons-react";

const Page = async ({
    searchParams,
}: {
    searchParams: Promise<{ page?: string; tag?: string; search?: string }>;
}) => {
    const params = await searchParams;
    params.page ||= "1";

    const queries = [
        Query.orderDesc("$createdAt"),
        Query.offset((+params.page - 1) * 25),
        Query.limit(25),
    ];

    if (params.tag) queries.push(Query.equal("tags", params.tag));
    if (params.search)
        queries.push(
            Query.or([
                Query.search("title", params.search),
                Query.search("content", params.search),
            ])
        );

    const questions = await tablesDB.listRows({
        databaseId: db,
        tableId: questionCollection,
        queries: queries,
    });

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
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Particles
                className="absolute inset-0"
                quantity={80}
                ease={80}
                color="#ffffff"
                refresh
            />
            
            <div className="relative container mx-auto px-4 pb-20 pt-6">
                {/* Header Section */}
                <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-4xl font-bold text-white">All Questions</h1>
                        <p className="mt-2 text-gray-300">
                            {params.search && (
                                <span className="flex items-center gap-2">
                                    <IconSearch className="h-4 w-4" />
                                    Showing results for &quot;{params.search}&quot;
                                </span>
                            )}
                            {params.tag && (
                                <span className="flex items-center gap-2">
                                    Tagged with <span className="text-orange-500">#{params.tag}</span>
                                </span>
                            )}
                            {!params.search && !params.tag && (
                                <>Browse through all questions from the community</>
                            )}
                        </p>
                    </div>
                    <Link href="/questions/ask">
                        <ShimmerButton className="shadow-2xl">
                            <span className="flex items-center gap-2 whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                <IconPlus className="h-5 w-5" />
                                Ask a question
                            </span>
                        </ShimmerButton>
                    </Link>
                </div>

                {/* Stats and Search */}
                <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                    <div className="mb-6">
                        <Search />
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="rounded-lg bg-white/10 px-4 py-2">
                            <span className="text-gray-400">Total Questions: </span>
                            <span className="font-bold text-white">{questions.total}</span>
                        </div>
                        <div className="rounded-lg bg-white/10 px-4 py-2">
                            <span className="text-gray-400">Showing: </span>
                            <span className="font-bold text-white">
                                {questions.rows.length > 0 
                                    ? `${((+params.page - 1) * 25) + 1}-${Math.min(+params.page * 25, questions.total)}`
                                    : "0"}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Questions List */}
                {questions.rows.length > 0 ? (
                    <div className="mb-8 space-y-4">
                        {questions.rows.map(ques => (
                            <QuestionCard key={ques.$id} ques={ques} />
                        ))}
                    </div>
                ) : (
                    <div className="mb-8 rounded-2xl border border-white/10 bg-white/5 p-12 text-center">
                        <p className="text-xl text-gray-400">No questions found</p>
                        <p className="mt-2 text-sm text-gray-500">
                            {params.search || params.tag
                                ? "Try adjusting your search or filters"
                                : "Be the first to ask a question!"}
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {questions.total > 0 && (
                    <div className="flex justify-center">
                        <Pagination total={questions.total} limit={25} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Page;
