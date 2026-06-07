import { useEffect, useRef } from "react";
function SentenceDetails({ selectedSentence, showAnswer, setShowAnswer }) {
  const audioRef = useRef(null);
  useEffect(() => {
    console.log("Sentence changed");
    console.log(selectedSentence?.audio_file);

    if (audioRef.current) {
      console.log("Audio element found");

      audioRef.current.load();

      audioRef.current.play().catch((err) => {
        console.log("PLAY ERROR", err);
      });
    }
  }, [selectedSentence]);
  if (!selectedSentence) {
    return <div>Select sentence</div>;
  }

  return (
    <div>
      <h1
        onClick={() => setShowAnswer(!showAnswer)}
        style={{ cursor: "pointer" }}
      >
        {selectedSentence.target_text}
      </h1>
      <audio ref={audioRef} controls>
        <source
          src={`http://localhost:3000/audio/${selectedSentence.audio_file}`}
          type="audio/mpeg"
        />
      </audio>
      {!showAnswer && (
        <p
          style={{
            color: "#888",
            fontSize: "0.9rem",
          }}
        >
          Click sentence to reveal translation
        </p>
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
