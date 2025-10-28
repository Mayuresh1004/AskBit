"use client";

import { tablesDB } from "@/src/models/client/config";
import { db, voteCollection } from "@/src/models/name";
import { useAuthStore } from "@/src/store/Auth";
import { cn } from "@/src/lib/utils";
import { IconCaretUpFilled, IconCaretDownFilled } from "@tabler/icons-react";
import { ID, Models, Query } from "appwrite";
import { useRouter } from "next/navigation";
import React from "react";
import { Vote } from "@/src/types/database";

const VoteButtons = ({
    type,
    id,
    upvotes,
    downvotes,
    className,
}: {
    type: "question" | "answer";
    id: string;
    upvotes: Vote[];
    downvotes: Vote[];
    className?: string;
}) => {
    const [votedRow, setVotedRow] = React.useState<Vote | null>(); // undefined means not fetched yet
    const [voteResult, setVoteResult] = React.useState<number>((upvotes?.length || 0) - (downvotes?.length || 0));

    const { user } = useAuthStore();
    const router = useRouter();

    React.useEffect(() => {
        (async () => {
            if (user) {
                try {
                    const response = await tablesDB.listRows({
                        databaseId: db,
                        tableId: voteCollection,
                        queries: [
                            Query.equal("type", type),
                            Query.equal("typeId", id),
                            Query.equal("votedById", user.$id),
                        ],
                    });
                    // Handle both 'documents' and 'rows' properties (different SDK versions)
                    const votes = (response as any).documents || (response as any).rows || [];
                    setVotedRow(() => votes[0] || null);
                } catch (error) {
                    console.error("Error fetching vote:", error);
                    setVotedRow(() => null);
                }
            }
        })();
    }, [user, id, type]);

    const toggleUpvote = async () => {
        if (!user) return router.push("/login");

        if (votedRow === undefined) return;

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "upvoted",
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setVoteResult(() => data.data.voteResult);
            setVotedRow(() => data.data.row || null);
            
            // Refetch current user vote to update highlighting
            const currentVote = await tablesDB.listRows({
                databaseId: db,
                tableId: voteCollection,
                queries: [
                    Query.equal("type", type),
                    Query.equal("typeId", id),
                    Query.equal("votedById", user.$id),
                ],
            });
            const votes = (currentVote as any).documents || (currentVote as any).rows || [];
            setVotedRow(() => votes[0] || null);
        } catch (error: any) {
            console.error("Vote error:", error);
            window.alert(error?.message || error?.error || "Something went wrong");
        }
    };

    const toggleDownvote = async () => {
        if (!user) return router.push("/login");

        if (votedRow === undefined) return;

        try {
            const response = await fetch(`/api/vote`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    votedById: user.$id,
                    voteStatus: "downvoted",
                    type,
                    typeId: id,
                }),
            });

            const data = await response.json();

            if (!response.ok) throw data;

            setVoteResult(() => data.data.voteResult);
            setVotedRow(() => data.data.row || null);
            
            // Refetch current user vote to update highlighting
            const currentVote = await tablesDB.listRows({
                databaseId: db,
                tableId: voteCollection,
                queries: [
                    Query.equal("type", type),
                    Query.equal("typeId", id),
                    Query.equal("votedById", user.$id),
                ],
            });
            const votes = (currentVote as any).documents || (currentVote as any).rows || [];
            setVotedRow(() => votes[0] || null);
        } catch (error: any) {
            console.error("Vote error:", error);
            window.alert(error?.message || error?.error || "Something went wrong");
        }
    };

    // Debug logging
    React.useEffect(() => {
        console.log("Current vote state:", { votedRow, voteResult, id });
    }, [votedRow, voteResult, id]);

    return (
        <div className={cn("flex shrink-0 flex-col items-center justify-start gap-y-4 text-white", className)}>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10 text-white",
                    votedRow && votedRow.voteStatus === "upvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/60"
                )}
                onClick={toggleUpvote}
            >
                <IconCaretUpFilled />
            </button>
            <span>{voteResult}</span>
            <button
                className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border p-1 duration-200 hover:bg-white/10 text-white",
                    votedRow && votedRow.voteStatus === "downvoted"
                        ? "border-orange-500 text-orange-500"
                        : "border-white/60"
                )}
                onClick={toggleDownvote}
            >
                <IconCaretDownFilled />
            </button>
        </div>
    );
};

export default VoteButtons;