function SentenceDetails({ selectedSentence }) {
  if (!selectedSentence) {
    return <div>Select sentence</div>;
  }

  return (
    <div>
      <h2>{selectedSentence.source_text}</h2>
    </div>
  );
}

export default SentenceDetails;
