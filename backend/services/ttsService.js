import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export const generateAudio = async (text) => {
  const now = new Date();

  const timestamp =
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    "_" +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0");

  const safeText = text
    .replaceAll(" ", "_")
    .replace(/[^a-zA-Z0-9_]/g, "")
    .slice(0, 50);

  const fileName = `${timestamp}_${safeText}.mp3`;

  await execAsync(
    `edge-tts --voice de-DE-KatjaNeural --text "${text}" --write-media audio/${fileName}`,
  );

  return fileName;
};
