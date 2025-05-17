export type CalendarDatesType = {
  weekStart: Date; // Monday
  rangeStart?: Date;
  rangeEnd?: Date;
  title?: string;
};

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
