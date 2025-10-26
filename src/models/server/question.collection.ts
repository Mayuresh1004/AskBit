import { IndexType, Permission } from 'node-appwrite';
import { tablesDB } from './config';
import env from '@/src/app/env';
import { db, questionCollection } from '../name';

export default async function createQuestionTable() {
  const databaseId = db;
  const tableId = questionCollection;

  // 1️⃣ Create the table
  await tablesDB.createTable({
    databaseId,
    tableId,
    name: 'Questions',
    permissions: [
      Permission.read("any"),
      Permission.create("users"),
      Permission.update("users"),
      Permission.delete("users"),
    ],
  });

  console.log("✅ Question Table created.");

  //create columns
  await Promise.all([
    tablesDB.createStringColumn(databaseId,tableId,'title',100,true),
    tablesDB.createStringColumn(databaseId,tableId,'content',10000,true),
    tablesDB.createStringColumn(databaseId,tableId,'authorId',100,true),
    tablesDB.createStringColumn(databaseId,tableId,'tags',100,true,undefined,true),
    tablesDB.createStringColumn(databaseId,tableId,'attachmentId',100,false),
  ])

  // 2️⃣ Create indexes
  const indexes = [
    { field: 'title', type: IndexType.Fulltext },
    { field: 'content', type: IndexType.Fulltext },
    { field: 'authorId', type: IndexType.Fulltext },
    { field: 'tags', type: IndexType.Fulltext },
    { field: 'attachmentId', type: IndexType.Fulltext },
  ];

  for (const idx of indexes) {
    await tablesDB.createIndex({
      databaseId,
      tableId,
      key: `${idx.field}_index`,
      type: idx.type,
      columns: [idx.field],
      orders: ['asc'],
    });
  }

  console.log("✅ Indexes created successfully.");
}
