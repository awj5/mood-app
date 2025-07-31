export type CalendarDatesType = {
  weekStart: Date; // Monday
  rangeStart?: Date;
  rangeEnd?: Date;
  title?: string;
};

export type CheckInMoodType = {
  color: number;
  busyness: number;
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

export type CompanyCheckInType = {
  id: number;
  value: CheckInMoodType;
  date: Date;
};

export type ReminderType = {
  days: { sun: boolean; mon: boolean; tue: boolean; wed: boolean; thu: boolean; fri: boolean; sat: boolean };
  time: string;
};

export type PromptCheckInType = {
  date: string;
  id: number;
  time?: string;
  mood: number;
  feelings: string[];
  workload: string;
  note: string;
};

export type MessageType = {
  role: string;
  content: string;
  button?: string;
  height?: number;
  hasPro?: boolean;
};
