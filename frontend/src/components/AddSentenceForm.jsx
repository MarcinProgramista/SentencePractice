/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { createSentence, updateSentence } from "../api/sentenceApi";
import { getParts } from "../api/partApi";
function AddSentenceForm({
  onSentenceAdded,
  editingSentence,
  setEditingSentence,
  setShowForm,
  currentPartCount,
}) {
  const [sourceText, setSourceText] = useState("");
  const [targetText, setTargetText] = useState("");
  const [parts, setParts] = useState([]);
  const [selectedPartId, setSelectedPartId] = useState("");

  const [languages, setLanguages] = useState([]);
  const [sourceLanguageId, setSourceLanguageId] = useState(1);
  const [targetLanguageId, setTargetLanguageId] = useState(2);
  const fetchLanguages = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/languages");

      const data = await response.json();

      setLanguages(data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    if (editingSentence) {
      setSourceText(editingSentence.source_text);
      setTargetText(editingSentence.target_text);
      setSelectedPartId(editingSentence.part_id);

      setSourceLanguageId(editingSentence.source_language_id);
      setTargetLanguageId(editingSentence.target_language_id);
    }
  }, [editingSentence]);

  useEffect(() => {
    const fetchParts = async () => {
      try {
        const data = await getParts();

        setParts(data);

        if (data.length > 0 && !editingSentence) {
          setSelectedPartId(data[0].id);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchParts();
    fetchLanguages();
  }, []);
  const handleAddSentence = async () => {
    try {
      if (!sourceText.trim() || !targetText.trim()) {
        return;
      }

      const sentence = {
        source_language_id: sourceLanguageId,
        target_language_id: targetLanguageId,
        source_text: sourceText,
        target_text: targetText,
        audio_file: "",
        part_id: selectedPartId,
      };

      if (editingSentence) {
        await updateSentence(editingSentence.id, sentence);
        setEditingSentence(null);
      } else {
        if (currentPartCount >= 200) {
          alert("This part already contains 200 sentences");
          return;
        }
        if (sourceLanguageId === targetLanguageId) {
          alert("Source and target language cannot be the same");
          return;
        }
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
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
          }}
        >
          <select
            value={sourceLanguageId}
            onChange={(e) => setSourceLanguageId(Number(e.target.value))}
            style={{ flex: 1 }}
          >
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>

          <select
            value={targetLanguageId}
            onChange={(e) => setTargetLanguageId(Number(e.target.value))}
            style={{ flex: 1 }}
          >
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.name}
              </option>
            ))}
          </select>
        </div>
        <label>Source sentence</label>
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
        <label>Target sentence</label>
        <div style={{ marginBottom: "10px" }}>
          <label>Part</label>
          <br />

          <select
            value={selectedPartId}
            onChange={(e) => setSelectedPartId(Number(e.target.value))}
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
          >
            {parts.map((part) => (
              <option key={part.id} value={part.id}>
                {part.level_name} - {part.name}
              </option>
            ))}
          </select>
        </div>
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
