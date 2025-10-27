import { IndexType, Permission } from 'node-appwrite';
import { tablesDB } from './config';
import env from '@/src/app/env';
import { db, questionCollection, voteCollection } from '../name';

export default async function createVoteTable() {
  const databaseId = db;
  const tableId = voteCollection;

  // 1️⃣ Create the table
  await tablesDB.createTable({
    databaseId,
    tableId,
    name: 'Votes',
    permissions: [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ],
  });

  console.log("✅ Vote Table created.");

  //create columns
  await Promise.all([
    tablesDB.createEnumColumn(databaseId,tableId,'type',['question','answer'],true),
    tablesDB.createStringColumn(databaseId,tableId,'typeId',100,true),
    tablesDB.createEnumColumn(databaseId,tableId,'voteStatus',['upvoted','downvoted'],true),
    tablesDB.createStringColumn(databaseId,tableId,'votedById',100,true),
  ])

  // 2️⃣ Create indexes
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
