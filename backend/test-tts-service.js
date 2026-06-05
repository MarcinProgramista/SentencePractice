import { generateAudio } from "./services/ttsService.js";

const fileName = await generateAudio("Ich bin hier");

console.log(fileName);
