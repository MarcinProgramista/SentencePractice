import { useEffect } from "react";
import { getSentences } from "./api/sentenceApi";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      const data = await getSentences();
      console.log(data);
    };

    fetchData();
  }, []);

  return <h1>Language Learning</h1>;
}

export default App;
