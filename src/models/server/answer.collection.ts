import { IndexType, Permission } from 'node-appwrite';
import { tablesDB } from './config';
import env from '@/app/env';
import { answerCollection, db } from '../name';

export default async function createAnswerTable() {
  const databaseId = db;
  const tableId = answerCollection;

  // 1️⃣ Create the table
  await tablesDB.createTable({
    databaseId,
    tableId,
    name: 'Answers',
    permissions: [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ],
  });

  console.log("✅ Answer Table created.");

  //create columns
  await Promise.all([
    tablesDB.createStringColumn(databaseId,tableId,'content',10000,true),
    tablesDB.createStringColumn(databaseId,tableId,'questionId',100,true),
    tablesDB.createStringColumn(databaseId,tableId,'authorId',100,true),
  ])

//   // 2️⃣ Create indexes
//   const indexes = [
//     { field: 'title', type: IndexType.Fulltext },
//     { field: 'content', type: IndexType.Fulltext },
//     { field: 'authorId', type: IndexType.Fulltext },
//     { field: 'tags', type: IndexType.Fulltext },
//     { field: 'attachmentId', type: IndexType.Fulltext },
//   ];

//   for (const idx of indexes) {
//     await tablesDB.createIndex({
//       databaseId,
//       tableId,
//       key: `${idx.field}_index`,
//       type: idx.type,
//       columns: [idx.field],
//       orders: ['asc'],
//     });
//   }

//   console.log("✅ Indexes created successfully.");
}
