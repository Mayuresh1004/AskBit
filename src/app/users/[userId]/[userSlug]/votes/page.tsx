import Pagination from "@/src/components/Pagination";
import { answerCollection, db, questionCollection, voteCollection } from "@/src/models/name";
import { tablesDB } from "@/src/models/server/config";
import convertDateToRelativeTime from "@/src/utils/relativeTime";
import slugify from "@/src/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: Promise<{ page?: string; voteStatus?: "upvoted" | "downvoted" }>;
}) => {
    const { userId, userSlug } = await params;
    const resolvedSearchParams = await searchParams;
    const page = resolvedSearchParams.page || "1";

    const query = [
        Query.equal("votedById", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+page - 1) * 25),
        Query.limit(25),
    ];

    if (resolvedSearchParams.voteStatus) query.push(Query.equal("voteStatus", resolvedSearchParams.voteStatus));

    const votes = await tablesDB.listRows({
        databaseId: db,
        tableId: voteCollection,
        queries: query,
    });

    votes.rows = await Promise.all(
        votes.rows.map(async vote => {
            const questionOfTypeQuestion =
                vote.type === "question"
                    ? await tablesDB.getRow({
                          databaseId: db,
                          tableId: questionCollection,
                          rowId: vote.typeId,
                          queries: [Query.select(["title"])],
                      })
                    : null;

            if (questionOfTypeQuestion) {
                return {
                    ...vote,
                    question: questionOfTypeQuestion,
                };
            }

            const answer = await tablesDB.getRow({
                databaseId: db,
                tableId: answerCollection,
                rowId: vote.typeId,
            });
            const questionOfTypeAnswer = await tablesDB.getRow({
                databaseId: db,
                tableId: questionCollection,
                rowId: answer.questionId,
                queries: [Query.select(["title"])],
            });

            return {
                ...vote,
                question: questionOfTypeAnswer,
            };
        })
    );

    return (
        <div className="px-4">
            <div className="mb-4 flex justify-between">
                <p>{votes.total} votes</p>
                <ul className="flex gap-1">
                    <li>
                        <Link
                            href={`/users/${userId}/${userSlug}/votes`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                !resolvedSearchParams.voteStatus ? "bg-white/20" : "hover:bg-white/20"
                            }`}
                        >
                            All
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`/users/${userId}/${userSlug}/votes?voteStatus=upvoted`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                resolvedSearchParams?.voteStatus === "upvoted"
                                    ? "bg-white/20"
                                    : "hover:bg-white/20"
                            }`}
                        >
                            Upvotes
                        </Link>
                    </li>
                    <li>
                        <Link
                            href={`/users/${userId}/${userSlug}/votes?voteStatus=downvoted`}
                            className={`block w-full rounded-full px-3 py-0.5 duration-200 ${
                                resolvedSearchParams?.voteStatus === "downvoted"
                                    ? "bg-white/20"
                                    : "hover:bg-white/20"
                            }`}
                        >
                            Downvotes
                        </Link>
                    </li>
                </ul>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {votes.rows.map(vote => (
                    <div
                        key={vote.$id}
                        className="rounded-xl border border-white/40 p-4 duration-200 hover:bg-white/10"
                    >
                        <div className="flex">
                            <p className="mr-4 shrink-0">{vote.voteStatus}</p>
                            <p>
                                <Link
                                    href={`/questions/${vote.question.$id}/${slugify(vote.question.title)}`}
                                    className="text-orange-500 hover:text-orange-600"
                                >
                                    {vote.question.title}
                                </Link>
                            </p>
                        </div>
                        <p className="text-right text-sm">
                            {convertDateToRelativeTime(new Date(vote.$createdAt))}
                        </p>
                    </div>
                ))}
            </div>
            <Pagination total={votes.total} limit={25} />
        </div>
    );
};

export default Page;