import * as SQLite from "expo-sqlite";

export type CheckInMoodType = {
  color: number;
  tags: number[];
  competency: number;
  statementResponse: number;
};

export type CheckInType = {
  id: number;
  date: Date;
  mood: string;
};

export const initDB = async (db: SQLite.SQLiteDatabase) => {
  //await db.closeAsync();
  //SQLite.deleteDatabaseSync("mood.db");
  //await db.runAsync(`DELETE FROM check_ins WHERE id = 1`);

  try {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS check_ins (id INTEGER PRIMARY KEY NOT NULL, date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, mood TEXT NOT NULL, note TEXT);
        `);
  } catch (error) {
    console.log(error);
  }
};
