/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { getSentences, deleteSentence } from "./api/sentenceApi";
import SentenceList from "./components/SentenceList.jsx";
import AddSentenceForm from "./components/AddSentenceForm";
import SentenceDetails from "./components/SentenceDetails";

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
  const handleDeleteSentence = async (sentenceId) => {
    try {
      await deleteSentence(sentenceId);

      await fetchSentences();

      if (selectedSentence?.id === sentenceId) {
        setSelectedSentence(null);
        setShowAnswer(false);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleSentenceUpdated = async () => {
    await fetchSentences();

    setSelectedSentence(null);
    setShowAnswer(false);
  };

  const handleEditSentence = (sentence) => {
    setEditingSentence(sentence);
    setShowForm(true);
  };
  return (
    <div
      style={{
        maxWidth: "none",

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
          onSentenceAdded={handleSentenceUpdated}
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
          display: "flex",

          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "500px",
            borderRight: "1px solid #3b4252",
          }}
        >
          <SentenceList
            sentences={filteredSentences}
            onSentenceClick={handleSentenceClick}
            selectedSentence={selectedSentence}
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
            handleDeleteSentence={handleDeleteSentence}
            handleEditSentence={handleEditSentence}
          />
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SentenceDetails
            selectedSentence={selectedSentence}
            showAnswer={showAnswer}
            setShowAnswer={setShowAnswer}
          />
        </div>
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
