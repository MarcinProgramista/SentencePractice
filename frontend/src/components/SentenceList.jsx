function SentenceList({ sentences, onSentenceClick }) {
  return (
    <>
      {sentences.map((sentence) => (
        <div key={sentence.id} onClick={() => onSentenceClick(sentence)}>
          {sentence.source_text} → {sentence.target_text}
        </div>
      ))}
    </>
  );
}

export default SentenceList;
