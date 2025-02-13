import tagsData from "data/tags.json";
import { CheckInMoodType, CheckInType } from "data/database";

export const getStatement = (statement: string, response: number) => {
  const percentage = Math.round(response * 100);
  let start = "";

  switch (true) {
    case response >= 0.85:
      start = `I strongly agreed (${percentage}%) that `;
      break;
    case response >= 0.65:
      start = `I agreed (${percentage}%) that `;
      break;
    case response >= 0.55:
      start = `I somewhat agreed (${percentage}%) that `;
      break;
    case response >= 0.45:
      start = `I neither agreed nor disagreed (${percentage}%) that `;
      break;
    case response >= 0.35:
      start = `I somewhat disagreed (${percentage}%) that `;
      break;
    case response >= 0.15:
      start = `I disagreed (${percentage}%) that `;
      break;
    default:
      start = `I strongly disagreed (${percentage}%) that `;
  }

  return start + statement + " at my company.";
};

export type PromptDataType = {
  date: string;
  time: string;
  mood: number;
  feelings: string[];
  note: string;
};

export const getPromptData = (checkIns: CheckInType[]) => {
  const data: PromptDataType[] = [];
  const ids = []; // Used to collect check-in IDs

  // Loop check-ins and create prompt objects
  for (let i = 0; i < checkIns.length; i++) {
    let checkIn = checkIns[i];
    let utc = new Date(`${checkIn.date}Z`);
    let local = new Date(utc);
    let mood: CheckInMoodType = JSON.parse(checkIn.mood);
    let tags: string[] = [];

    // Get tag names
    for (let i = 0; i < mood.tags.length; i++) {
      tags.push(tagsData.filter((tag) => tag.id === mood.tags[i])[0].name);
    }

    data.push({
      date: local.toDateString(),
      time: local.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }),
      mood: mood.color,
      feelings: tags,
      note: checkIn.note,
    });

    ids.push(checkIn.id);
  }

  return { data, ids };
};
