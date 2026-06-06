function SentenceDetails({ selectedSentence, showAnswer, setShowAnswer }) {
  if (!selectedSentence) {
    return <div>Select sentence</div>;
  }

  return (
    <div>
      <h2>{selectedSentence.source_text}</h2>

      <button onClick={() => setShowAnswer(!showAnswer)}>
        {showAnswer ? "Hide Answer" : "Show Answer"}
      </button>

      {showAnswer && (
        <>
          <div>{selectedSentence.target_text}</div>

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
