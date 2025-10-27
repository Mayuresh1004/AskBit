import { IndexType, Permission } from 'node-appwrite';
import { tablesDB,storage } from './config';
import env from '@/app/env';
import { questionAttachmentBucket } from '../name';


export default async function getOrCreateStorage(){

    const bucketId = questionAttachmentBucket;
    try {
        await storage.getBucket(bucketId);
        console.log("Storage Connected");
        
    } catch (error) {
        try {
            await storage.createBucket({
                bucketId,
                name:bucketId,
                permissions: [
                    Permission.read("any"),
                    Permission.create("users"),
                    Permission.update("users"),
                    Permission.delete("users"),
                ],
                fileSecurity:false,
                enabled:undefined,
                maximumFileSize:undefined,
                allowedFileExtensions:[
                    "jpg","png","gif","jpeg","webp","heic","pdf"
                ]
            })

            console.log("Storage Created");
            console.log("Storage Connected");
            
        } catch (error) {
            console.error("Error Creating Storage: ",error)
        }
    }
}