import * as SQLite from "expo-sqlite";

export type CheckInMoodType = {
  color: number;
  tags: number[];
  competency: number;
  statementResponse: number;
  company?: string;
};

export type CheckInType = {
  id: number;
  date: Date;
  mood: string;
  note: string;
};

export type InsightType = {
  id: number;
  date: Date;
  check_ins: string;
  summary: string;
};

export const initDB = async (db: SQLite.SQLiteDatabase) => {
  //await db.closeAsync();
  //SQLite.deleteDatabaseSync("mood.db");
  //await db.runAsync(`DELETE FROM check_ins WHERE id = 1`);
  //await db.execAsync(`DELETE FROM check_in_record;`);

  try {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS check_ins (id INTEGER PRIMARY KEY AUTOINCREMENT, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, mood TEXT NOT NULL, note TEXT);
        `);

    await db.execAsync(`
          CREATE TABLE IF NOT EXISTS insights (id INTEGER PRIMARY KEY AUTOINCREMENT, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, check_ins TEXT NOT NULL, summary TEXT NOT NULL);
          `);

    await db.execAsync(`
            CREATE TABLE IF NOT EXISTS check_in_record (id INTEGER PRIMARY KEY AUTOINCREMENT, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
            `);
  } catch (error) {
    console.error("Error initializing DB tables:", error);
  }
};
