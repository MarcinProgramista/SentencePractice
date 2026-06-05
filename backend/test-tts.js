import fs from "fs";
import pkg from "edge-tts";

const { Communicate } = pkg;

const communicate = new Communicate("Guten Morgen", "de-DE-KatjaNeural");

const chunks = [];

for await (const chunk of communicate.stream()) {
  if (chunk.type === "audio") {
    chunks.push(chunk.data);
  }
}

fs.writeFileSync("./audio/test.mp3", Buffer.concat(chunks));

console.log("MP3 generated");
