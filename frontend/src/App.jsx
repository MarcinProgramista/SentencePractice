import { useEffect, useState } from "react";
import { getSentences } from "./api/sentenceApi";
import SentenceList from "./components/SentenceList";

function App() {
  const [sentences, setSentences] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSentence, setSelectedSentence] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getSentences();
      setSentences(data);
    };

    fetchData();
  }, []);
  const filteredSentences = sentences.filter(
    (sentence) =>
      sentence.source_text.toLowerCase().includes(search.toLowerCase()) ||
      sentence.target_text.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <h1>Language Learning</h1>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <SentenceList
        sentences={filteredSentences}
        onSentenceClick={setSelectedSentence}
      />
      {selectedSentence && (
        <>
          <hr />

          <h2>Selected sentence</h2>

          <p>{selectedSentence.source_text}</p>
          <p>{selectedSentence.target_text}</p>
        </>
      )}
    </>
  );
}

export default App;
