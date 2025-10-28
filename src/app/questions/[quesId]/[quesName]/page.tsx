import Answers from "@/src/components/Answers";
import Comments from "@/src/components/Comments";
import { MarkdownPreview } from "@/src/components/RTE";
import VoteButtons from "@/src/components/VoteButtons";
import { avatars } from "@/src/models/client/config";
import {
    answerCollection,
    db,
    voteCollection,
    questionCollection,
    commentCollection,
    questionAttachmentBucket,
} from "@/src/models/name";
import { tablesDB, users } from "@/src/models/server/config";
import { storage } from "@/src/models/client/config";
import { UserPrefs } from "@/src/store/Auth";
import { Question, Answer, Comment, Vote, User } from "@/src/types/database";
import convertDateToRelativeTime from "@/src/utils/relativeTime";
import slugify from "@/src/utils/slugify";
import { IconEdit, IconMessageCircle, IconThumbUp } from "@tabler/icons-react";
import Link from "next/link";
import { Query } from "node-appwrite";
import { notFound } from "next/navigation";
import React from "react";
import DeleteQuestion from "./DeleteQuestion";
import EditQuestion from "./EditQuestion";
import { Particles } from "@/src/components/magicui/particles";
import { ShimmerButton } from "@/src/components/magicui/shimmer-button";

const Page = async ({ params }: { params: Promise<{ quesId: string; quesName: string }> }) => {
    const { quesId, quesName } = await params;
    
    try {
        const [question, answers, upvotes, downvotes, comments] = await Promise.all([
            tablesDB.getRow({
                databaseId: db,
                tableId: questionCollection,
                rowId: quesId,
            }) as unknown as Promise<Question>,
            tablesDB.listRows({
                databaseId: db,
                tableId: answerCollection,
                queries: [
                    Query.orderDesc("$createdAt"),
                    Query.equal("questionId", quesId),
                ],
            }) as unknown as Promise<{ documents: Answer[]; total: number }>,
            tablesDB.listRows({
                databaseId: db,
                tableId: voteCollection,
                queries: [
                    Query.equal("typeId", quesId),
                    Query.equal("type", "question"),
                    Query.equal("voteStatus", "upvoted"),
                ],
            }) as unknown as Promise<{ documents: Vote[]; total: number }>,
            tablesDB.listRows({
                databaseId: db,
                tableId: voteCollection,
                queries: [
                    Query.equal("typeId", quesId),
                    Query.equal("type", "question"),
                    Query.equal("voteStatus", "downvoted"),
                ],
            }) as unknown as Promise<{ documents: Vote[]; total: number }>,
            tablesDB.listRows({
                databaseId: db,
                tableId: commentCollection,
                queries: [
                    Query.equal("type", "question"),
                    Query.equal("typeId", quesId),
                    Query.orderDesc("$createdAt"),
                ],
            }) as unknown as Promise<{ documents: Comment[]; total: number }>,
        ]);

        // Check if question exists
        if (!question) {
            return notFound();
        }

        // since it is dependent on the question, we fetch it here outside of the Promise.all
        const author = await users.get<UserPrefs>(question.authorId);
        
        const commentsDocuments = comments?.documents || [];
        const answersDocuments = answers?.documents || [];
        
        const [commentsData, answersData] = await Promise.all([
            Promise.all(
                commentsDocuments.map(async comment => {
                    const author = await users.get<UserPrefs>(comment.authorId);
                    return {
                        ...comment,
                        author: {
                            $id: author.$id,
                            name: author.name,
                            reputation: author.prefs.reputation,
                        },
                    };
                })
            ),
            Promise.all(
                answersDocuments.map(async answer => {
                const [author, comments, upvotes, downvotes] = await Promise.all([
                    users.get<UserPrefs>(answer.authorId),
                    tablesDB.listRows({
                        databaseId: db,
                        tableId: commentCollection,
                        queries: [
                            Query.equal("typeId", answer.$id),
                            Query.equal("type", "answer"),
                            Query.orderDesc("$createdAt"),
                        ],
                    }) as unknown as Promise<{ documents: Comment[]; total: number }>,
                    tablesDB.listRows({
                        databaseId: db,
                        tableId: voteCollection,
                        queries: [
                            Query.equal("typeId", answer.$id),
                            Query.equal("type", "answer"),
                            Query.equal("voteStatus", "upvoted"),
                        ],
                    }) as unknown as Promise<{ documents: Vote[]; total: number }>,
                    tablesDB.listRows({
                        databaseId: db,
                        tableId: voteCollection,
                        queries: [
                            Query.equal("typeId", answer.$id),
                            Query.equal("type", "answer"),
                            Query.equal("voteStatus", "downvoted"),
                        ],
                    }) as unknown as Promise<{ documents: Vote[]; total: number }>,
                ]);

                const answerComments = comments?.documents || [];
                const commentsWithAuthors = await Promise.all(
                    answerComments.map(async comment => {
                        const author = await users.get<UserPrefs>(comment.authorId);
                        return {
                            ...comment,
                            author: {
                                $id: author.$id,
                                name: author.name,
                                reputation: author.prefs.reputation,
                            },
                        };
                    })
                );

                return {
                    ...answer,
                    comments: commentsWithAuthors,
                    upvotesRows: upvotes?.documents || [],
                    downvotesRows: downvotes?.documents || [],
                    author: {
                        $id: author.$id,
                        name: author.name,
                        reputation: author.prefs.reputation,
                    },
                };
            })
        ),
    ]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            <Particles
                className="absolute inset-0"
                quantity={80}
                ease={80}
                color="#ffffff"
                refresh
            />
            <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-6">
                <div className="flex">
                    <div className="w-full">
                                <h1 className="mb-3 text-4xl font-bold bg-gradient-to-r from-white via-white to-orange-300 bg-clip-text text-transparent">{question.title}</h1>
                        <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-white">
                                Asked {convertDateToRelativeTime(new Date(question.$createdAt))}
                            </span>
                            <span className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-white">
                                <IconMessageCircle className="h-4 w-4" />
                                {answersData.length} {answersData.length === 1 ? 'answer' : 'answers'}
                            </span>
                            <span className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-white">
                                <IconThumbUp className="h-4 w-4" />
                                {(upvotes?.total || 0) + (downvotes?.total || 0)} {((upvotes?.total || 0) + (downvotes?.total || 0)) === 1 ? 'vote' : 'votes'}
                            </span>
                        </div>
                    </div>
                    <Link href="/questions/ask" className="ml-auto inline-block shrink-0">
                        <ShimmerButton className="shadow-2xl">
                            <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                                Ask a question
                            </span>
                        </ShimmerButton>
                    </Link>
                </div>
                <div className="my-6 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>
                <div className="flex gap-4">
                    <div className="flex shrink-0 flex-col items-center gap-4">
                        <VoteButtons
                            type="question"
                            id={question.$id}
                            className="w-full"
                            upvotes={upvotes?.documents || []}
                            downvotes={downvotes?.documents || []}
                        />
                        <EditQuestion
                            questionId={question.$id}
                            questionTitle={question.title}
                            authorId={question.authorId}
                        />
                        <DeleteQuestion questionId={question.$id} authorId={question.authorId} />
                    </div>
                    <div className="w-full overflow-auto">
                        <div className="rounded-xl border border-orange-500/20 bg-white/5 p-6 backdrop-blur-sm">
                            <MarkdownPreview 
                                className="rounded-lg p-4 prose prose-invert  max-w-none prose-headings:text-white prose-p:text-white prose-a:text-white prose-strong:text-white prose-code:text-white prose-pre:bg-transparent prose-pre:text-white [&>div]:bg-transparent [&>div]:text-white [&>div>p]:text-white" 
                                data-color-mode="dark"
                                source={question.content} 
                            />
                        </div>
                        {question.attachmentId && (
                            <picture>
                                <img
                                    src={
                                        storage.getFilePreview(
                                            questionAttachmentBucket,
                                            question.attachmentId
                                        ).toString()
                                    }
                                    alt={question.title}
                                    className="mt-3 rounded-lg"
                                />
                            </picture>
                        )}
                        {question.tags && question.tags.length > 0 && (
                            <div className="mt-4 flex flex-wrap items-center gap-2">
                                {question.tags.map((tag: string) => (
                                    <Link
                                        key={tag}
                                        href={`/questions?tag=${tag}`}
                                        className="group inline-block rounded-lg border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-sm font-semibold text-orange-300 transition-all duration-200 hover:border-orange-400 hover:bg-orange-500/20 hover:text-orange-200 hover:shadow-lg hover:shadow-orange-500/20"
                                    >
                                        #{tag}
                                    </Link>
                                ))}
                            </div>
                        )}
                        <div className="mt-6 flex items-center justify-end gap-3 rounded-xl border border-orange-500/20 p-4 backdrop-blur-sm text-white">
                            <picture>
                                <img
                                    src={avatars.getInitials(author.name, 48, 48).toString()}
                                    alt={author.name}
                                    className="rounded-full ring-2 ring-orange-500/30"
                                />
                            </picture>
                            <div className="block leading-tight">
                                <Link
                                    href={`/users/${author.$id}/${slugify(author.name)}`}
                                    className="block font-bold text-lg text-white hover:text-white/80 transition-colors"
                                >
                                    {author.name}
                                </Link>
                                <p className="text-sm text-white">
                                    Reputation: <span className="rounded-full bg-white/10 px-2 py-0.5 font-semibold text-white">{author.prefs.reputation}</span>
                                </p>
                            </div>
                        </div>
                        <Comments
                            comments={commentsData as any}
                            className="mt-4"
                            type="question"
                            typeId={question.$id}
                        />
                        <div className="my-6 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>
                    </div>
                </div>
                <Answers answers={answersData as any} questionId={question.$id} />
            </div>
        </div>
    );
    } catch (error) {
        console.error("Error loading question:", error);
        return notFound();
    }
};

export default Page;