function SentenceList({ sentences, onSentenceClick, selectedSentence }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {sentences.map((sentence, index) => (
        <div
          key={sentence.id}
          onClick={() => onSentenceClick(sentence)}
          style={{
            width: "90%",
            maxWidth: "500px",
            cursor: "pointer",
            padding: "12px",
            marginBottom: "10px",
            border: "1px solid #3b4252",
            borderRadius: "8px",
            backgroundColor:
              selectedSentence?.id === sentence.id ? "#4c566a" : "#1e2330",
            color: "#eceff4",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <span
                style={{
                  marginRight: "10px",
                  color: "#888",
                  fontWeight: "bold",
                }}
              >
                {String(index + 1).padStart(3, "0")}
              </span>

              <span>{sentence.source_text}</span>
            </div>

            <div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // edit
                }}
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // delete
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SentenceList;
