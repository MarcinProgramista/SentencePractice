import { FaEdit, FaTrash } from "react-icons/fa";
function SentenceList({
  sentences,
  onSentenceClick,
  selectedSentence,
  handleDeleteSentence,
  handleEditSentence,
  learningMode,
}) {
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

              <span>
                {learningMode === "DE_EN"
                  ? sentence.target_text
                  : sentence.source_text}
              </span>
            </div>

            <div>
              <span
                style={{
                  marginRight: "10px",
                  color: "#e5c07b",
                  fontSize: "12px",
                }}
              >
                ⭐{" "}
                {learningMode === "DE_EN"
                  ? sentence.rating_de_en
                  : sentence.rating_en_de}
              </span>
              <span
                style={{
                  marginRight: "10px",
                  color: "#888",
                  fontSize: "12px",
                }}
              >
                👁 {sentence.review_count}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditSentence(sentence);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",
                  color: "#88c0d0",
                }}
              >
                <FaEdit />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();

                  const confirmed = window.confirm(
                    `Delete sentence?\n\n${sentence.source_text}`,
                  );

                  if (!confirmed) return;

                  handleDeleteSentence(sentence.id);
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "16px",

                  color: "#bf616a",
                }}
              >
                <FaTrash />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SentenceList;
