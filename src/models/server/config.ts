import env from '@/app/env'
import {Avatars, Client, Databases, Storage, TablesDB, Users} from "node-appwrite"
import { db, questionCollection } from '../name';

let client = new Client();

client
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId) // Your project ID
    .setKey(env.appwrite.apiKey) // Your secret API key
;


const tablesDB = new TablesDB(client);
const database = new Databases(client)
const avatars = new Avatars(client);
const storage = new Storage(client);
const users = new Users(client)



export { client,database, tablesDB, users, avatars, storage };