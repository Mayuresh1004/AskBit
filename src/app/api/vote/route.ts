import { answerCollection, db, questionCollection, voteCollection } from "@/src/models/name";
import { tablesDB, users } from "@/src/models/server/config";
import { UserPrefs } from "@/src/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest){
    try {

        // grab the data
        const {votedById, voteStatus, type, typeId} = await request.json()
        //list-document
        const response = await tablesDB.listRows({
            databaseId: db,
            tableId: voteCollection,
            queries: [
                Query.equal("type",type),
                Query.equal("typeId",typeId),
                Query.equal("votedById",votedById ),
            ]
        })

        let newVoteRow = null;
        
        if (response.rows.length > 0) {
            // User already voted - toggle behavior
            const existingVote = response.rows[0];
            
            if (existingVote.voteStatus === voteStatus) {
                // Same vote clicked - remove the vote (unvote)
                await tablesDB.deleteRow({
                    databaseId: db,
                    tableId: voteCollection,
                    rowId: existingVote.$id,
                });

                // Decrease the reputation
                const QuestionOrAnswer = await tablesDB.getRow({
                    databaseId: db,
                    tableId: type==="question"? questionCollection : answerCollection,
                    rowId: typeId,
                });

                const authorPrefs = await users.getPrefs<UserPrefs>(QuestionOrAnswer.authorId);
                await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
                    reputation: voteStatus === "upvoted" ? Number(authorPrefs.reputation)-1 : Number(authorPrefs.reputation)+1
                });
                
                newVoteRow = null; // Vote removed
            } else {
                // Different vote - update existing vote
                await tablesDB.deleteRow({
                    databaseId: db,
                    tableId: voteCollection,
                    rowId: existingVote.$id,
                });

                // Increase reputation for new vote, decrease for old vote
                const QuestionOrAnswer = await tablesDB.getRow({
                    databaseId: db,
                    tableId: type==="question"? questionCollection : answerCollection,
                    rowId: typeId,
                });

                const authorPrefs = await users.getPrefs<UserPrefs>(QuestionOrAnswer.authorId);
                
                // Add effect of new vote and remove effect of old vote
                const reputationChange = (voteStatus === "upvoted" ? 2 : -2);
                await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
                    reputation: Number(authorPrefs.reputation) + reputationChange
                });
                
                // Create new vote row
                newVoteRow = await tablesDB.createRow({
                    databaseId: db,
                    tableId: voteCollection,
                    rowId: ID.unique(),
                    data: {
                        type: type,
                        typeId: typeId,
                        votedById: votedById,
                        voteStatus: voteStatus
                    }
                });
            }
        } else {
            // No existing vote - create new vote
            newVoteRow = await tablesDB.createRow({
                databaseId: db,
                tableId: voteCollection,
                rowId: ID.unique(),
                data: {
                    type: type,
                    typeId: typeId,
                    votedById: votedById,
                    voteStatus: voteStatus
                }
            });

            // Increase reputation
            const QuestionOrAnswer = await tablesDB.getRow({
                databaseId: db,
                tableId: type==="question"? questionCollection : answerCollection,
                rowId: typeId,
            });

            const authorPrefs = await users.getPrefs<UserPrefs>(QuestionOrAnswer.authorId);
            await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId, {
                reputation: voteStatus === "upvoted"? Number(authorPrefs.reputation)+1 : Number(authorPrefs.reputation)-1
            });
        }

        // Get total vote counts for display
        const allVotes = await tablesDB.listRows({
            databaseId: db,
            tableId: voteCollection,
            queries: [
                Query.equal("type", type),
                Query.equal("typeId", typeId),
            ]
        });

        const upCount = allVotes.rows.filter(v => v.voteStatus === "upvoted").length;
        const downCount = allVotes.rows.filter(v => v.voteStatus === "downvoted").length;

        return NextResponse.json(
            {
                data: {
                    row: newVoteRow,
                    voteResult: upCount - downCount
                },
                message: "vote handled"
            },
            {
                status: 200
            }
        )

        
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Error in voting"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
        
    }
    
}