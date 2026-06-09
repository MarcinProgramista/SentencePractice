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
}) {
  const [playCount, setPlayCount] = useState(0);
  const audioRef = useRef(null);
  useEffect(() => {
    if (audioRef.current) {
      setPlayCount(1);

      audioRef.current.load();

      audioRef.current.play().catch(() => {});
    }
  }, [selectedSentence]);
  useEffect(() => {
    if (!autoReveal || !selectedSentence) return;

    setShowAnswer(false);

    const timer = setTimeout(() => {
      setShowAnswer(true);
    }, revealDelay * 1000);

    return () => clearTimeout(timer);
  }, [selectedSentence, autoReveal]);
  if (!selectedSentence) {
    return <div>Select sentence</div>;
  }
  const handleRating = async (rating) => {
    try {
      const updatedSentence = await updateRating(selectedSentence.id, rating);

      setSelectedSentence(updatedSentence);

      await onRatingUpdated();
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <h1
        onClick={() => setShowAnswer(!showAnswer)}
        style={{ cursor: "pointer" }}
      >
        {selectedSentence.target_text}
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
                  color: star <= selectedSentence.rating ? "#e5c07b" : "#555",
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
            {selectedSentence.source_text}
          </h1>
        </>
      )}
    </div>
  );
}

export default SentenceDetails;
