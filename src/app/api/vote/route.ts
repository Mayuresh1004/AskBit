import { answerCollection, db, questionCollection, voteCollection } from "@/models/name";
import { tablesDB, users } from "@/models/server/config";
import { UserPrefs } from "@/store/Auth";
import { NextRequest, NextResponse } from "next/server";
import { ID, Query } from "node-appwrite";

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

        if (response.rows.length > 0) {
            
            await tablesDB.deleteRow({
                databaseId: db,
                tableId: voteCollection,
                rowId: response.rows[0].$id,
            })

            //decrease the reputation
            const QuestionOrAnswer = await tablesDB.getRow({
                databaseId: db,
                tableId: type==="question"? questionCollection : answerCollection ,
                rowId: typeId,
                queries: [
                    Query.equal("type",type==="question"? questionCollection : answerCollection ),
                    Query.equal("typeId",typeId ),
                ]
            })

            const authorPrefs = await users.getPrefs<UserPrefs>(QuestionOrAnswer.authorId)

            await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId,{
                reputation:response.rows[0].voteStatus === "upvoted" ? Number(authorPrefs.reputation)-1 : Number(authorPrefs.reputation)+1
            })

        }
        //that means pev vote doesnt exist or vote state changes
        if (response.rows[0]?.voteStatus !== voteStatus ) {
            const row = await tablesDB.createRow({
                databaseId: db,
                tableId: voteCollection,
                rowId:ID.unique(),
                data: {
                    type: type,
                    typeId: typeId,
                    votedById: votedById,
                    voteStatus: voteStatus
                }
            })

            //increase or decrease the reputation

             const QuestionOrAnswer = await tablesDB.getRow({
                databaseId: db,
                tableId: type==="question"? questionCollection : answerCollection ,
                rowId: typeId,
                queries: [
                    Query.equal("type",type==="question"? questionCollection : answerCollection ),
                    Query.equal("typeId",typeId ),
                ]
            })

            const authorPrefs = await users.getPrefs<UserPrefs>(QuestionOrAnswer.authorId)

            // if vote was present
            if (response.rows[0]) {
                await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId,{
                    reputation: response.rows[0].voteStatus === "upvoted" ? Number(authorPrefs.reputation)-1 : Number(authorPrefs.reputation)+1
                })
            } else{
                await users.updatePrefs<UserPrefs>(QuestionOrAnswer.authorId,{
                    reputation: voteStatus === "upvoted"? Number(authorPrefs.reputation)+1 : Number(authorPrefs.reputation)-1
                })
            }
        }

        const [upvotes, downvotes] = await Promise.all([
            tablesDB.listRows({
                databaseId: db,
                tableId: voteCollection,
                queries: [
                    Query.equal("type",type),
                    Query.equal("typeId",typeId),
                    Query.equal("votedById",votedById ),
                    Query.equal("voteStatus", "upvoted"),
                    Query.limit(1)
                ]
            }),
            tablesDB.listRows({
                databaseId: db,
                tableId: voteCollection,
                queries: [
                    Query.equal("type",type),
                    Query.equal("typeId",typeId),
                    Query.equal("votedById",votedById ),
                    Query.equal("voteStatus", "downvoted"),
                    Query.limit(1)
                ]
            }),
        ])

        return NextResponse.json(
            {
                data: {
                    row: null, voteResult: upvotes.total - downvotes.total
                },
                message: "message handled"
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