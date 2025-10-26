import { IndexType, Permission } from 'node-appwrite';
import { tablesDB } from './config';
import env from '@/src/app/env';
import { db, questionCollection } from '../name';

export default async function createQuestionTable() {
  const databaseId = db;
  const tableId = questionCollection;

  // Create table
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

  // Create columns
  await Promise.all([
    tablesDB.createStringColumn(databaseId, tableId, 'title', 100, true),
    tablesDB.createStringColumn(databaseId, tableId, 'content', 10000, true),
    tablesDB.createStringColumn(databaseId, tableId, 'authorId', 100, true),
    tablesDB.createStringColumn(databaseId, tableId, 'tags', 100, true, undefined, true),
    tablesDB.createStringColumn(databaseId, tableId, 'attachmentId', 100, false),
  ]);

  console.log("⏳ Waiting for column availability...");
  await new Promise((resolve) => setTimeout(resolve, 3000)); // Important delay

  // Create indexes ✅ correct field names
  const indexes = [
    { column: 'title', type: IndexType.Fulltext },
    { column: 'content', type: IndexType.Fulltext },
  ];

  for (const idx of indexes) {
    await tablesDB.createIndex({
      databaseId,
      tableId,
      key: `${idx.column}_index`,
      type: idx.type,
      columns: [idx.column],
      orders: ['asc'],
    });
  }

  console.log("✅ Indexes created successfully.");
}
