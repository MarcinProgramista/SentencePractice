function SentenceList({
  sentences,
  onSentenceClick,
  selectedSentence,
  showAnswer,
  setShowAnswer,
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {sentences.map((sentence) => (
        <div
          key={sentence.id}
          onClick={() => onSentenceClick(sentence)}
          style={{
            width: "100%",
            maxWidth: "500px",
            cursor: "pointer",
            padding: "12px",
            marginBottom: "10px",
            border: "1px solid #3b4252",
            borderRadius: "8px",
            backgroundColor:
              selectedSentence?.id === sentence.id ? "#4c566a" : "#1e2330",
            color: "#eceff4",
            textAlign: "center",
          }}
        >
          <div>{sentence.source_text}</div>

          {selectedSentence?.id === sentence.id && (
            <>
              {showAnswer && (
                <>
                  <div style={{ marginTop: "15px" }}>
                    {sentence.target_text}
                  </div>

                  <div
                    style={{
                      marginTop: "15px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <audio controls>
                      <source
                        src={`http://localhost:3000/audio/${sentence.audio_file}`}
                        type="audio/mpeg"
                      />
                    </audio>
                  </div>
                </>
              )}
              <div style={{ marginTop: "10px" }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAnswer(!showAnswer);
                  }}
                  style={{
                    marginBottom: "15px",
                    padding: "10px 20px",
                    borderRadius: "8px",
                  }}
                >
                  {showAnswer ? "Hide Answer" : "Show Answer"}
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}

export default SentenceList;
