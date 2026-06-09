/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { updateRating } from "../api/sentenceApi";
function SentenceDetails({
  selectedSentence,
  showAnswer,
  setShowAnswer,
  autoReveal,
  repeatCount,
  revealDelay,
  onRatingUpdated,
  setSelectedSentence,
  learningMode,
}) {
  const [playCount, setPlayCount] = useState(0);
  const audioRef = useRef(null);
  useEffect(() => {
    if (!audioRef.current) return;

    setPlayCount(1);

    audioRef.current.load();

    if (learningMode === "DE_EN") {
      audioRef.current.play().catch(() => {});
    }
  }, [selectedSentence, learningMode]);
  useEffect(() => {
    if (!autoReveal || !selectedSentence) return;

    setShowAnswer(false);

    const timer = setTimeout(() => {
      setShowAnswer(true);
    }, revealDelay * 1000);

    return () => clearTimeout(timer);
  }, [selectedSentence, autoReveal]);
  const handleRating = async (rating) => {
    if (!selectedSentence) return;

    try {
      const updatedSentence = await updateRating(
        selectedSentence.id,
        rating,
        learningMode,
      );

      setSelectedSentence(updatedSentence);

      await onRatingUpdated();
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = document.activeElement?.tagName;

      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        setShowAnswer((prev) => !prev);
      }

      if (e.key.toLowerCase() === "a") {
        if (audioRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      }
      if (selectedSentence && ["1", "2", "3", "4", "5"].includes(e.key)) {
        handleRating(Number(e.key));
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSentence, learningMode]);
  if (!selectedSentence) {
    return <div>Select sentence</div>;
  }
  const question =
    learningMode === "DE_EN"
      ? selectedSentence.target_text
      : selectedSentence.source_text;

  const answer =
    learningMode === "DE_EN"
      ? selectedSentence.source_text
      : selectedSentence.target_text;

  const currentRating =
    learningMode === "DE_EN"
      ? selectedSentence.rating_de_en
      : selectedSentence.rating_en_de;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
        textAlign: "center",
      }}
    >
      <h1
        onClick={() => setShowAnswer(!showAnswer)}
        style={{ cursor: "pointer" }}
      >
        {question}
      </h1>
      <audio
        ref={audioRef}
        controls
        onEnded={() => {
          if (playCount < repeatCount) {
            setPlayCount((prev) => prev + 1);

            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        }}
      >
        <source
          src={`http://localhost:3000/audio/${selectedSentence.audio_file}`}
          type="audio/mpeg"
        />
      </audio>
      {!showAnswer && (
        <>
          <p
            style={{
              color: "#888",
              fontSize: "0.9rem",
            }}
          >
            Click sentence to reveal translation
          </p>

          <div style={{ marginTop: "20px", fontSize: "24px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => handleRating(star)}
                style={{
                  cursor: "pointer",
                  color: star <= currentRating ? "#e5c07b" : "#555",
                }}
              >
                ★
              </span>
            ))}
          </div>
        </>
      )}
      {showAnswer && (
        <>
          <h1
            style={{
              color: "green",
              fontStyle: "italic",
            }}
          >
            {answer}
          </h1>
        </>
      )}
    </div>
  );
}

export default SentenceDetails;
