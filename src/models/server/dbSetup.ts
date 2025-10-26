import {db} from '../name'
import createAnswerTable from './answer.collection'
import createCommentTable from './comment.collection'
import { database, tablesDB } from './config'
import createQuestionTable from './question.collection'
import getOrCreateStorage from './storageSetup'
import createVoteTable from './vote.collection'


export default async function getOrCreateDB(){
    try {
        await tablesDB.get(db)
        console.log("Database Connected");
        
    } catch (error) {
        try {
            await tablesDB.create(db, db)
            console.log("Database Created");
            //create Tables
            await Promise.all([
                createAnswerTable(),
                createCommentTable(),
                createQuestionTable(),
                createVoteTable()
            ])

            console.log("Tables Created");
            console.log("Database Connected");
            
            
        } catch (error) {
            console.error("Error creating database or table ",error)
        }
    }

    return tablesDB
}