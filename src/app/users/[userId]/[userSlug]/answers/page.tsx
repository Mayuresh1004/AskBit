import Pagination from "@/components/Pagination";
import { MarkdownPreview } from "@/components/RTE";
import { answerCollection, db, questionCollection } from "@/models/name";
import { tablesDB } from "@/models/server/config";
import slugify from "@/utils/slugify";
import Link from "next/link";
import { Query } from "node-appwrite";
import React from "react";

const Page = async ({
    params,
    searchParams,
}: {
    params: Promise<{ userId: string; userSlug: string }>;
    searchParams: { page?: string };
}) => {
    const { userId, userSlug } = await params;
    searchParams.page ||= "1";

    const queries = [
        Query.equal("authorId", userId),
        Query.orderDesc("$createdAt"),
        Query.offset((+searchParams.page - 1) * 25),
        Query.limit(25),
    ];

    const answers = await tablesDB.listRows({
        databaseId: db,
        tableId: answerCollection,
        queries: queries,
    });

    answers.rows = await Promise.all(
        answers.rows.map(async ans => {
            const question = await tablesDB.getRow({
                databaseId: db,
                tableId: questionCollection,
                rowId: ans.questionId,
                queries: [Query.select(["title"])],
            });
            return { ...ans, question };
        })
    );

    return (
        <div className="px-4">
            <div className="mb-4">
                <p>{answers.total} answers</p>
            </div>
            <div className="mb-4 max-w-3xl space-y-6">
                {answers.rows.map(ans => (
                    <div key={ans.$id}>
                        <div className="max-h-40 overflow-auto">
                            <MarkdownPreview source={ans.content} className="rounded-lg p-4" />
                        </div>
                        <Link
                            href={`/questions/${ans.questionId}/${slugify(ans.question.title)}`}
                            className="mt-3 inline-block shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600"
                        >
                            Question
                        </Link>
                    </div>
                ))}
            </div>
            <Pagination total={answers.total} limit={25} />
        </div>
    );
};

export default Page;