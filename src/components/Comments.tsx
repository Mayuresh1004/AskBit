"use client";

import { tablesDB } from "@/src/models/client/config";
import { commentCollection, db } from "@/src/models/name";
import { useAuthStore } from "@/src/store/Auth";
import { cn } from "@/src/lib/utils"
import convertDateToRelativeTime from "@/src/utils/relativeTime";
import slugify from "@/src/utils/slugify";
import { IconTrash } from "@tabler/icons-react";
import { ID, Models } from "appwrite";
import Link from "next/link";
import React from "react";
import { Comment, User } from "@/src/types/database";

const Comments = ({
    comments: _comments,
    type,
    typeId,
    className,
}: {
    comments: Comment[];
    type: "question" | "answer";
    typeId: string;
    className?: string;
}) => {
    const [comments, setComments] = React.useState(_comments);
    const [newComment, setNewComment] = React.useState("");
    const { user } = useAuthStore();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!newComment || !user) return;

        try {
            const response = await tablesDB.createRow({
                databaseId: db,
                tableId: commentCollection,
                rowId: ID.unique(),
                data: {
                    type: type,
                    typeId: typeId,
                    // answerId: type === "answer" ? typeId : null,
                    content: newComment,
                    authorId: user.$id,
                },
            });

            setNewComment(() => "");
            setComments(prev => [{ ...response, author: user } as any, ...prev]);
        } catch (error: any) {
            window.alert(error?.message || "Error creating comment");
        }
    };

    const deleteComment = async (commentId: string) => {
        try {
            await tablesDB.deleteRow({
                databaseId: db,
                tableId: commentCollection,
                rowId: commentId,
            });

            setComments(prev => prev.filter(comment => comment.$id !== commentId));
        } catch (error: any) {
            window.alert(error?.message || "Error deleting comment");
        }
    };

    return (
        <div className={cn("flex flex-col gap-2 pl-4", className)}>
            {comments.map(comment => (
                <React.Fragment key={comment.$id}>
                    <hr className="border-white/40" />
                    <div className="flex gap-2">
                        <p className="text-sm">
                            {comment.content} -{" "}
                            <Link
                                href={`/users/${comment.authorId}/${slugify(comment.author?.name || 'Unknown')}`}
                                className="text-orange-500 hover:text-orange-600"
                            >
                                {comment.author?.name || 'Unknown'}
                            </Link>{" "}
                            <span className="opacity-60">
                                {convertDateToRelativeTime(new Date(comment.$createdAt))}
                            </span>
                        </p>
                        {user?.$id === comment.authorId ? (
                            <button
                                onClick={() => deleteComment(comment.$id)}
                                className="shrink-0 text-red-500 hover:text-red-600"
                            >
                                <IconTrash className="h-4 w-4" />
                            </button>
                        ) : null}
                    </div>
                </React.Fragment>
            ))}
            <hr className="border-white/40" />
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
                <textarea
                    className="w-full rounded-md border border-white/20 bg-white/10 p-2 outline-none"
                    rows={1}
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={e => setNewComment(() => e.target.value)}
                />
                <button className="shrink-0 rounded bg-orange-500 px-4 py-2 font-bold text-white hover:bg-orange-600">
                    Add Comment
                </button>
            </form>
        </div>
    );
};

export default Comments;