/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { getSentences, deleteSentence } from "./api/sentenceApi";
import SentenceList from "./components/SentenceList";
import AddSentenceForm from "./components/AddSentenceForm";

function App() {
  const [sentences, setSentences] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSentence, setEditingSentence] = useState(null);

  const fetchSentences = async () => {
    const data = await getSentences();
    setSentences(data);
  };

  useEffect(() => {
    fetchSentences();
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
  const handleDeleteSentence = async () => {
    if (!selectedSentence) return;

    try {
      await deleteSentence(selectedSentence.id);

      await fetchSentences();

      setSelectedSentence(null);
      setShowAnswer(false);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>Language Learning</h1>
      <button
        onClick={() => setShowForm(!showForm)}
        style={{
          marginBottom: "15px",
          padding: "10px 20px",
          borderRadius: "8px",
        }}
      >
        {showForm ? "Hide Form" : "Add Sentence"}
      </button>

      {showForm && (
        <AddSentenceForm
          onSentenceAdded={fetchSentences}
          editingSentence={editingSentence}
          setEditingSentence={setEditingSentence}
          setShowForm={setShowForm}
        />
      )}
      <br />
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

      <div
        style={{
          maxHeight: "500px",
          overflowY: "auto",
          overflowX: "hidden",
          marginTop: "15px",
        }}
      >
        <SentenceList
          sentences={filteredSentences}
          onSentenceClick={handleSentenceClick}
          selectedSentence={selectedSentence}
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
        />
      </div>

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
            <button
              onClick={handlePrevious}
              style={{
                marginBottom: "15px",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              Previous
            </button>
            <button
              onClick={() => {
                setEditingSentence(selectedSentence);
                setShowForm(true);
              }}
              style={{
                marginBottom: "15px",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              Edit
            </button>
            <button
              onClick={handleDeleteSentence}
              style={{
                marginBottom: "15px",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              Delete
            </button>
            <button
              onClick={handleNext}
              style={{
                marginBottom: "15px",
                padding: "10px 20px",
                borderRadius: "8px",
              }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
