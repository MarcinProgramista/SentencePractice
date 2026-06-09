/* eslint-disable react-hooks/immutability */
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
  const [selectedRating, setSelectedRating] = useState(0);
  const [randomMode, setRandomMode] = useState(false);
  const [learningMode, setLearningMode] = useState("DE_EN");

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
      (selectedRating === 0 ||
        (learningMode === "DE_EN"
          ? sentence.rating_de_en === selectedRating
          : sentence.rating_en_de === selectedRating)) &&
      (sentence.source_text.toLowerCase().includes(search.toLowerCase()) ||
        sentence.target_text.toLowerCase().includes(search.toLowerCase())),
  );
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        handleNext();
      }

      if (e.key === "ArrowLeft") {
        handlePrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSentence, filteredSentences]);
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

    if (randomMode && filteredSentences.length > 1) {
      let randomIndex;

      do {
        randomIndex = Math.floor(Math.random() * filteredSentences.length);
      } while (filteredSentences[randomIndex].id === selectedSentence.id);

      setSelectedSentence(filteredSentences[randomIndex]);
      return;
    }

    if (currentIndex < filteredSentences.length - 1) {
      setSelectedSentence(filteredSentences[currentIndex + 1]);
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
  const currentPartCount = sentences.filter(
    (sentence) => sentence.part_id === selectedPartId,
  ).length;
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
            width: "600px",
            borderRight: "1px solid #3b4252",
            padding: "10px",
            textAlign: "left",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px",
            }}
          >
            {" "}
            <div
              style={{
                display: "flex",
                gap: "8px",
                marginBottom: "15px",
              }}
            >
              <button
                onClick={() => setLearningMode("DE_EN")}
                style={{
                  backgroundColor:
                    learningMode === "DE_EN" ? "#5e81ac" : "#2e3440",
                }}
              >
                DE → EN
              </button>

              <button
                onClick={() => setLearningMode("EN_DE")}
                style={{
                  backgroundColor:
                    learningMode === "EN_DE" ? "#5e81ac" : "#2e3440",
                }}
              >
                EN → DE
              </button>
            </div>
            <select
              value={selectedPartId}
              onChange={(e) => setSelectedPartId(Number(e.target.value))}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #3b4252",
                backgroundColor: "#2e3440",
                color: "#eceff4",
              }}
            >
              {parts.map((part) => {
                const count = sentences.filter(
                  (sentence) => sentence.part_id === part.id,
                ).length;

                return (
                  <option key={part.id} value={part.id}>
                    {part.level_name} - {part.name} ({count}/200)
                  </option>
                );
              })}
            </select>
            <select
              value={selectedRating}
              onChange={(e) => setSelectedRating(Number(e.target.value))}
              style={{
                width: "140px",
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #3b4252",
                backgroundColor: "#2e3440",
                color: "#eceff4",
              }}
            >
              <option value={0}>All ⭐</option>
              <option value={1}>⭐ 1</option>
              <option value={2}>⭐ 2</option>
              <option value={3}>⭐ 3</option>
              <option value={4}>⭐ 4</option>
              <option value={5}>⭐ 5</option>
            </select>
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
              currentPartCount={currentPartCount}
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
          <div
            style={{
              display: "flex",
              gap: "8px",
              marginBottom: "15px",
            }}
          >
            <button
              onClick={() => setAutoMode(!autoMode)}
              style={{
                backgroundColor: autoMode ? "#5e81ac" : "#2e3440",
                color: "#eceff4",
                border: "1px solid #3b4252",
                borderRadius: "6px",
                padding: "8px 12px",
              }}
            >
              Auto
            </button>

            <button
              onClick={() => setRandomMode(!randomMode)}
              style={{
                backgroundColor: randomMode ? "#5e81ac" : "#2e3440",
                color: "#eceff4",
                border: "1px solid #3b4252",
                borderRadius: "6px",
                padding: "8px 12px",
              }}
            >
              Random
            </button>

            <button
              onClick={() => setAutoReveal(!autoReveal)}
              style={{
                backgroundColor: autoReveal ? "#5e81ac" : "#2e3440",
                color: "#eceff4",
                border: "1px solid #3b4252",
                borderRadius: "6px",
                padding: "8px 12px",
              }}
            >
              Auto Reveal
            </button>
            <select
              title="Reveal Delay"
              value={revealDelay}
              onChange={(e) => setRevealDelay(Number(e.target.value))}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                backgroundColor: "#2e3440",
                color: "#eceff4",
                border: "1px solid #3b4252",
              }}
            >
              <option value={1}>Reveal: 1s</option>
              <option value={2}>Reveal: 2s</option>
              <option value={3}>Reveal: 3s</option>
              <option value={5}>Reveal: 5s</option>
              <option value={10}>Reveal: 10s</option>
            </select>
            <select
              title="Repeat Audio"
              value={repeatCount}
              onChange={(e) => setRepeatCount(Number(e.target.value))}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                backgroundColor: "#2e3440",
                color: "#eceff4",
                border: "1px solid #3b4252",
              }}
            >
              <option value={1}>1x</option>
              <option value={2}>2x</option>
              <option value={3}>3x</option>
              <option value={5}>5x</option>
            </select>
            <select
              title="Next Delay"
              value={nextDelay}
              onChange={(e) => setNextDelay(Number(e.target.value))}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                backgroundColor: "#2e3440",
                color: "#eceff4",
                border: "1px solid #3b4252",
              }}
            >
              <option value={1}>Next: 1s</option>
              <option value={2}>Next: 2s</option>
              <option value={3}>Next: 3s</option>
              <option value={5}>Next: 5s</option>
              <option value={10}>Next: 10s</option>
            </select>
          </div>
          <div
            style={{
              height: "70vh",
              overflowY: "auto",
              paddingRight: "5px",
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
              learningMode={learningMode}
            />
          </div>
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
            setSelectedSentence={setSelectedSentence}
            learningMode={learningMode}
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
