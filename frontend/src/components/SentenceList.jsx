function SentenceList({ sentences }) {
  return (
    <>
      {sentences.map((sentence) => (
        <div key={sentence.id}>
          <strong>{sentence.source_text}</strong>
          <br />
          {sentence.target_text}
        </div>
      ))}
    </>
  );
}

export default SentenceList;
