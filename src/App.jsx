import { useState, useEffect } from "react";

export default function App() {
  const [wordData, setWordData] = useState(null);

  async function fetchWord() {
    try {
      // Fetch random word
      const randomRes = await fetch("https://random-word-api.herokuapp.com/word");
      const [randomWord] = await randomRes.json();

      // Fetch definition
      const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
      const dictData = await dictRes.json();

      setWordData({ word: randomWord, data: dictData[0] });
    } catch (err) {
      console.error("Error fetching word:", err);
    }
  }

  useEffect(() => {
    fetchWord();
  }, []);

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light">
      {wordData ? (
        <div className="card shadow-lg w-75 mb-3">
          <div className="card-body">
            <h1 className="card-title text-primary">{wordData.word}</h1>
            {wordData.data?.meanings?.map((meaning, i) => (
              <div key={i} className="mb-3">
                <h5 className="text-secondary">{meaning.partOfSpeech}</h5>
                <ul>
                  {meaning.definitions.map((def, j) => (
                    <li key={j}>{def.definition}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <button
        onClick={fetchWord}
        className="btn btn-primary mt-3 px-4"
      >
        Refresh Word
      </button>
    </div>
  );
}
