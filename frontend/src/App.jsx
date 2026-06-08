/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import {
  getSentences,
  deleteSentence,
  incrementReviewCount,
} from "./api/sentenceApi";
import SentenceList from "./components/SentenceList.jsx";
import AddSentenceForm from "./components/AddSentenceForm";
import SentenceDetails from "./components/SentenceDetails";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { getParts } from "./api/partApi";

function App() {
  const [sentences, setSentences] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSentence, setSelectedSentence] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingSentence, setEditingSentence] = useState(null);
  const [autoMode, setAutoMode] = useState(false);
  const [revealDelay, setRevealDelay] = useState(3);
  const [nextDelay, setNextDelay] = useState(2);
  const [autoReveal, setAutoReveal] = useState(false);
  const [repeatCount, setRepeatCount] = useState(1);
  const [parts, setParts] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState(1);
  useEffect(() => {
    const fetchParts = async () => {
      const data = await getParts();

      setParts(data);

      if (data.length > 0) {
        setSelectedPartId(data[0].id);
      }
    };

    fetchParts();
  }, []);
  const fetchSentences = async () => {
    const data = await getSentences();
    setSentences(data);
  };

  useEffect(() => {
    fetchSentences();
  }, []);

  const filteredSentences = sentences.filter(
    (sentence) =>
      sentence.part_id === selectedPartId &&
      (sentence.source_text.toLowerCase().includes(search.toLowerCase()) ||
        sentence.target_text.toLowerCase().includes(search.toLowerCase())),
  );
  const handleSentenceClick = async (sentence) => {
    await incrementReviewCount(sentence.id);

    await fetchSentences();

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

      // setShowAnswer(false);
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
  useEffect(() => {
    if (!autoMode || !selectedSentence) return;

    const timer = setTimeout(
      () => {
        handleNext();
      },
      (revealDelay + nextDelay) * 1000,
    );

    return () => clearTimeout(timer);
  }, [autoMode, selectedSentence]);
  return (
    <div
      style={{
        maxWidth: "none",
      }}
    >
      <div
        style={{
          display: "flex",
          marginTop: "30px",
          alignItems: "flex-start",
        }}
      >
        <div
          style={{
            width: "500px",
            borderRight: "1px solid #3b4252",
            padding: "10px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "8px",
              flexWrap: "wrap",
              marginBottom: "15px",
            }}
          >
            {parts.map((part) => (
              <button
                key={part.id}
                onClick={() => setSelectedPartId(part.id)}
                style={{
                  backgroundColor:
                    selectedPartId === part.id ? "#5e81ac" : "#2e3440",
                }}
              >
                {part.level_name} - {part.name}
              </button>
            ))}
          </div>
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
          <label style={{ display: "block", marginBottom: "8px" }}>
            <input
              type="checkbox"
              checked={autoMode}
              onChange={(e) => setAutoMode(e.target.checked)}
            />
            Auto Mode
          </label>
          <label style={{ display: "block", marginBottom: "8px" }}>
            <input
              type="checkbox"
              checked={autoReveal}
              onChange={(e) => setAutoReveal(e.target.checked)}
            />
            Auto Reveal Translation
          </label>
          <div style={{ marginBottom: "15px" }}>
            <label>
              Reveal Delay:
              <select
                value={revealDelay}
                onChange={(e) => setRevealDelay(Number(e.target.value))}
              >
                <option value={1}>1 second</option>
                <option value={2}>2 seconds</option>
                <option value={3}>3 seconds</option>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
              </select>
            </label>
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label>
              Next Delay:
              <select
                value={nextDelay}
                onChange={(e) => setNextDelay(Number(e.target.value))}
              >
                <option value={1}>1 second</option>
                <option value={2}>2 seconds</option>
                <option value={3}>3 seconds</option>
                <option value={5}>5 seconds</option>
                <option value={10}>10 seconds</option>
              </select>
            </label>
          </div>
          <div style={{ marginBottom: "15px" }}>
            <label>
              Repeat audio:
              <select
                value={repeatCount}
                onChange={(e) => setRepeatCount(Number(e.target.value))}
              >
                <option value={1}>1 time</option>
                <option value={2}>2 times</option>
                <option value={3}>3 times</option>
                <option value={5}>5 times</option>
              </select>
            </label>
          </div>

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
            autoReveal={autoReveal}
            repeatCount={repeatCount}
            revealDelay={revealDelay}
            onRatingUpdated={fetchSentences}
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
                background: "transparent",
              }}
            >
              <FaArrowLeft /> Previous
            </button>
            <button
              onClick={handleNext}
              style={{
                marginBottom: "15px",
                padding: "10px 20px",
                borderRadius: "8px",
                background: "transparent",
              }}
            >
              <FaArrowRight /> Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
