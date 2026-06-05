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
  const handleNext = () => {
    if (!selectedSentence) return;

    const currentIndex = filteredSentences.findIndex(
      (sentence) => sentence.id === selectedSentence.id,
    );

    if (currentIndex < filteredSentences.length - 1) {
      setSelectedSentence(filteredSentences[currentIndex + 1]);

      setShowAnswer(false);
    }
  };
  const handlePrevious = () => {
    if (!selectedSentence) return;

    const currentIndex = filteredSentences.findIndex(
      (sentence) => sentence.id === selectedSentence.id,
    );

    if (currentIndex > 0) {
      setSelectedSentence(filteredSentences[currentIndex - 1]);

      setShowAnswer(false);
    }
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

          <button onClick={() => setShowAnswer(!showAnswer)}>
            {showAnswer ? "Hide Answer" : "Show Answer"}
          </button>
          <div style={{ marginTop: "10px" }}>
            <button onClick={handlePrevious}>Previous</button>

            <button style={{ marginLeft: "10px" }} onClick={handleNext}>
              Next
            </button>
          </div>
          {showAnswer && (
            <>
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
