import env from "@/src/app/env";
import { Client, Account, Avatars, Databases, Storage, TablesDB } from "appwrite";

const client = new Client()
    .setEndpoint(env.appwrite.endpoint) // Your API Endpoint
    .setProject(env.appwrite.projectId); // Your project ID


const tablesDB = new TablesDB(client);
const account = new Account(client);
const avatars = new Avatars(client);
const storage = new Storage(client);
const database = new Databases(client)


export { client,database, tablesDB, account, avatars, storage };