import { useState } from "react";

function AddSentenceForm() {
  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");

  return (
    <div
      style={{
        border: "1px solid #3b4252",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "20px",
        backgroundColor: "#1e2330",
      }}
    >
      <h2>Add Sentence</h2>

      <div style={{ marginBottom: "10px" }}>
        <label>English sentence</label>
        <br />
        <input
          type="text"
          value={sourceText}
          onChange={(e) => setSourceText(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            borderRadius: "6px",
            border: "1px solid #3b4252",
            backgroundColor: "#2e3440",
            color: "#eceff4",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>German sentence</label>
        <br />
        <input
          type="text"
          value={targetText}
          onChange={(e) => setTargetText(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "5px",
            borderRadius: "6px",
            border: "1px solid #3b4252",
            backgroundColor: "#2e3440",
            color: "#eceff4",
            boxSizing: "border-box",
          }}
        />
      </div>

      <button type="button">Add Sentence</button>
    </div>
  );
}

export default AddSentenceForm;
