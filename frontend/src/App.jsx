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
    <div
      style={{
        maxWidth: "700px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Language Learning</h1>

      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "300px",
          padding: "12px",
          marginBottom: "15px",
          borderRadius: "8px",
          border: "1px solid #3b4252",
          backgroundColor: "#1e2330",
          color: "#eceff4",
          boxSizing: "border-box",
        }}
      />

      <SentenceList
        sentences={filteredSentences}
        onSentenceClick={handleSentenceClick}
        selectedSentence={selectedSentence}
        showAnswer={showAnswer}
        setShowAnswer={setShowAnswer}
      />

      {selectedSentence && (
        <>
          <hr />

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <button onClick={handlePrevious}>Previous</button>

            <button onClick={handleNext}>Next</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
