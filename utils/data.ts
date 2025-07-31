import * as Crypto from "expo-crypto";
import { getLocales } from "expo-localization";
import * as Device from "expo-device";
import axios from "axios";
import tagsData from "data/tags.json";
import competenciesData from "data/competencies.json";
import { CheckInType, CheckInMoodType, PromptCheckInType, MessageType, CompanyCheckInType } from "types";
import { removeAccess } from "./helpers";

export const requestAIResponse = async (
  type: string,
  message: MessageType[],
  uuid?: string | null,
  proID?: string | null,
  category?: number
) => {
  const localization = getLocales();
  const isSimulator = Device.isDevice === false;

  try {
    const response = await axios.post(
      !isSimulator ? "https://mood-web-zeta.vercel.app/api/ai" : "http://localhost:3000/api/ai",
      {
        type: type,
        message: message,
        loc: localization[0].languageTag,
        ...(uuid && uuid != null && { uuid: uuid }),
        ...(proID && proID != null && { proid: proID }),
        ...(category && { category: category }),
      }
    );

    return response.data.response;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) removeAccess(); // User doesn't exist
    console.error(error);
  }
};

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

  const competency = competenciesData[0].competencies.filter((item) => item.id === statement)[0]; // Get statement
  let companyName = company ?? "my company";
  if (companyName.endsWith(".")) companyName = companyName.slice(0, -1); // Remove . at end of comapmy name if exists
  return `${start} ${type === "neg" ? competency.negStatement : competency.posStatement} at ${companyName}.`;
};

export const getPromptCheckIns = (checkIns: CheckInType[] | CompanyCheckInType[]) => {
  const data: PromptCheckInType[] = []; // Check-ins formatted for AI prompt
  const ids = []; // Used to collect check-in IDs

  // Loop check-ins and create prompt objects
  for (const checkIn of checkIns) {
    const utc = new Date(`${checkIn.date}Z`);
    const local = new Date(utc.getTime() ? utc : checkIn.date); // Don't use UTC if date doesn't include time (company check-in)
    const mood: CheckInMoodType = "mood" in checkIn ? JSON.parse(checkIn.mood) : checkIn.value; // Determine if company check-in
    const tags = [];
    let busyness = "";

    // Get tag names
    for (const tag of mood.tags) {
      tags.push(tagsData.filter((item) => item.id === tag)[0].name);
    }

    switch (mood.busyness) {
      case 0:
        busyness = "Slow";
        break;
      case 2:
        busyness = "Busy";
        break;
      case 3:
        busyness = "Maxed out";
        break;
      default:
        busyness = "Steady";
    }

    data.push({
      date: local.toDateString(),
      id: checkIn.id,
      ...("mood" in checkIn && { time: local.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" }) }), // Is user check-in
      mood: mood.color,
      feelings: tags,
      workload: busyness,
      note:
        "note" in checkIn && checkIn.note
          ? checkIn.note.replace("[NOTE FROM USER]:", "")
          : !("note" in checkIn)
          ? getStatement(mood.competency, mood.statementResponse, "pos", mood.company)
          : "",
    });

    ids.push(checkIn.id);
  }

  return { data, ids };
};

export const generateHash = async (ids: number[]) => {
  const json = JSON.stringify(ids);
  return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, json);
};
