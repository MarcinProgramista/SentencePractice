import { useEffect, useState } from "react";
import { getSentences } from "./api/sentenceApi";
import SentenceList from "./components/SentenceList";

function App() {
  const [sentences, setSentences] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSentences();
      setSentences(data);
    };

    fetchData();
  }, []);

  const filteredSentences = sentences.filter(
    (sentence) =>
      sentence.source_text.toLowerCase().includes(search.toLowerCase()) ||
      sentence.target_text.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSentenceClick = (sentence) => {
    setSelectedSentence(sentence);
    setShowAnswer(false);
  };

  return (
    <>
      <h1>Language Learning</h1>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <SentenceList
        sentences={filteredSentences}
        onSentenceClick={handleSentenceClick}
        selectedSentence={selectedSentence}
      />

      {selectedSentence && (
        <>
          <hr />

          <h3>English</h3>
          <p>{selectedSentence.source_text}</p>

          <button onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>

          {showAnswer && (
            <>
              <h3>German</h3>
              <p>{selectedSentence.target_text}</p>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                }}
              >
                <audio controls>
                  <source
                    src={`http://localhost:3000/audio/${selectedSentence.audio_file}`}
                    type="audio/mpeg"
                  />
                </audio>
              </div>
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;
