function SentenceList({ sentences }) {
  return (
    <>
      {sentences.map((sentence) => (
        <div key={sentence.id}>
          {sentence.source_text} → {sentence.target_text}
        </div>
      ))}
    </>
  );
}

export default SentenceList;
