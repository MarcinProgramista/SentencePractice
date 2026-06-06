/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { createSentence, updateSentence } from "../api/sentenceApi";
function AddSentenceForm({
  onSentenceAdded,
  editingSentence,
  setEditingSentence,
  setShowForm,
}) {
  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");
  useEffect(() => {
    if (editingSentence) {
      setSourceText(editingSentence.source_text);
      setTargetText(editingSentence.target_text);
    }
  }, [editingSentence]);
  const handleAddSentence = async () => {
    try {
      if (!sourceText.trim() || !targetText.trim()) {
        return;
      }

      const sentence = {
        source_language_id: 1,
        target_language_id: 2,
        source_text: sourceText,
        target_text: targetText,
        audio_file: "",
      };

      if (editingSentence) {
        await updateSentence(editingSentence.id, sentence);
        setEditingSentence(null);
      } else {
        await createSentence(sentence);
      }

      await onSentenceAdded();

      setSourceText("");
      setTargetText("");

      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };
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
      {editingSentence ? <h2>Update Sentence</h2> : <h2>Add Sentence</h2>}

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

      <button type="button" onClick={handleAddSentence}>
        {editingSentence ? "Update Sentence" : "Add Sentence"}
      </button>
    </div>
  );
}

export default AddSentenceForm;
