import * as Crypto from "expo-crypto";
import tagsData from "data/tags.json";
import guidelinesData from "data/guidelines.json";
import { CheckInMoodType } from "database";
import { CompanyCheckInType } from "app/company";
import { CheckInType } from "types";

export const getStatement = (statement: number, response: number, type: string, company?: string) => {
  const percentage = Math.round(response * 100);
  let start = "";

  switch (true) {
    case response >= 0.85:
      start = `I strongly agreed (${percentage}%) that`;
      break;
    case response >= 0.65:
      start = `I agreed (${percentage}%) that`;
      break;
    case response >= 0.55:
      start = `I somewhat agreed (${percentage}%) that`;
      break;
    case response >= 0.45:
      start = `I neither agreed nor disagreed (${percentage}%) that`;
      break;
    case response >= 0.35:
      start = `I somewhat disagreed (${percentage}%) that`;
      break;
    case response >= 0.15:
      start = `I disagreed (${percentage}%) that`;
      break;
    default:
      start = `I strongly disagreed (${percentage}%) that`;
  }

  const competency = guidelinesData[0].competencies.filter((item) => item.id === statement)[0];

  let companyName = company ? company : "my company";

  if (companyName.endsWith(".")) {
    companyName = companyName.slice(0, -1);
  }

  return `${start} ${type === "neg" ? competency.negStatement : competency.posStatement} at ${companyName}.`;
};

export type PromptDataType = {
  date: string;
  id: number;
  time?: string;
  mood: number;
  feelings: string[];
  note: string;
};

export const getPromptData = (checkIns: CheckInType[] | CompanyCheckInType[]) => {
  const data: PromptDataType[] = [];
  const ids = []; // Used to collect check-in IDs

  // Loop check-ins and create prompt objects
  for (let i = 0; i < checkIns.length; i++) {
    let checkIn = checkIns[i];
    let utc = new Date(`${checkIn.date}Z`);
    let local = new Date(utc.getTime() ? utc : checkIn.date); // Don't use UTC if date doesn't include time
    let mood: CheckInMoodType = "mood" in checkIn ? JSON.parse(checkIn.mood) : checkIn.value; // Determine if company check-in
    let tags: string[] = [];

    // Get tag names
    for (let i = 0; i < mood.tags.length; i++) {
      tags.push(tagsData.filter((tag) => tag.id === mood.tags[i])[0].name);
    }

    data.push({
      date: local.toDateString(),
      id: checkIn.id,
      ...("mood" in checkIn && { time: local.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) }),
      mood: mood.color,
      feelings: tags,
      note:
        "note" in checkIn && checkIn.note
          ? checkIn.note.replace("[NOTE FROM USER]:", "")
          : "note" in checkIn
          ? checkIn.note
          : getStatement(mood.competency, mood.statementResponse, "pos", mood.company),
    });

    ids.push(checkIn.id);
  }

  return { data, ids };
};

export const generateHash = async (ids: number[]) => {
  const json = JSON.stringify(ids);
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, json);
};
