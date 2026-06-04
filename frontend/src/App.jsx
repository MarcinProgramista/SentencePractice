import { useEffect } from "react";
import { getSentences } from "./api/sentenceApi";
import { useState } from "react";

function App() {
  const [sentences, setSentences] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSentences();
      setSentences(data);
    };

    fetchData();
  }, []);

  return (
    <>
      <h1>Language Learning</h1>

      {sentences.map((sentence) => (
        <div key={sentence.id}>
          {sentence.source_text} → {sentence.target_text}
        </div>
      ))}
    </>
  );
}

export default App;
