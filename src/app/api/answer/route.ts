import { answerCollection, db } from "@/models/name";
import { tablesDB, users } from "@/models/server/config";
import { NextRequest, NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { UserPrefs } from '@/store/Auth'

export async function POST(request: NextRequest){
    try {

        const {questionId, authorId, answer} = await request.json()

        const response = await tablesDB.createRow({
            databaseId: db,
            tableId: answerCollection,
            rowId:ID.unique(),
            data: {
                questionId: questionId,
                authorId: authorId,
                content: answer
            }
        })

        //Increase author reputation
        const prefs = await users.getPrefs<UserPrefs>(authorId)

        await users.updatePrefs(authorId,{
            reputation: Number(prefs.reputation) + 1
        })

        return NextResponse.json(response,{
            status:201
        })

        
    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Error creating answer"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
        
    }
}

export async function DELETE(request:NextRequest){
    try {

        const {answerId} = await request.json()
        
        const answer = await tablesDB.getRow({
            databaseId: db,
            tableId: answerCollection,
            rowId: answerId
        })

        const response = await tablesDB.deleteRow({
            databaseId: db,
            tableId: answerCollection,
            rowId: answerId
        })

        //decrease the reputation
        const prefs = await users.getPrefs<UserPrefs>(answer.authorId)

        await users.updatePrefs(answer.authorId,{
            reputation: Number(prefs.reputation) - 1
        })

        return NextResponse.json(
            {
                data: response
            },
            {
            status:200
        })


    } catch (error: any) {
        return NextResponse.json(
            {
                error: error?.message || "Error deleting answer"
            },
            {
                status: error?.status || error?.code || 500
            }
        )
        
    }
}