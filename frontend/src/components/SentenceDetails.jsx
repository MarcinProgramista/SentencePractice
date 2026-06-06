function SentenceDetails({ selectedSentence, showAnswer, setShowAnswer }) {
  if (!selectedSentence) {
    return <div>Select sentence</div>;
  }

  return (
    <div>
      <h1
        onClick={() => setShowAnswer(!showAnswer)}
        style={{ cursor: "pointer" }}
      >
        {selectedSentence.source_text}
      </h1>

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
            {selectedSentence.target_text}
          </h1>

          <audio controls>
            <source
              src={`http://localhost:3000/audio/${selectedSentence.audio_file}`}
              type="audio/mpeg"
            />
          </audio>
        </>
      )}
    </div>
  );
}

export default SentenceDetails;
