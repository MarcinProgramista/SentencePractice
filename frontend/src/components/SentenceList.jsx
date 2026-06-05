function SentenceList({ sentences, onSentenceClick, selectedSentence }) {
  return (
    <>
      {sentences.map((sentence) => (
        <div
          key={sentence.id}
          onClick={() => onSentenceClick(sentence)}
          style={{
            cursor: "pointer",
            padding: "5px",
            backgroundColor:
              selectedSentence?.id === sentence.id ? "#2d3748" : "transparent",
          }}
        >
          {sentence.source_text} → {sentence.target_text}
        </div>
      ))}
    </>
  );
}

export default SentenceList;
