import { useState, useEffect } from "react";

// Main React component
export default function App() {
  // State to store the current word and its dictionary data
  const [wordData, setWordData] = useState(null);

  // Optional local fallback word bank (not currently used)
  const WORD_BANK = [
    "apple", "banana", "cherry", "dragonfruit", "elderberry",
    "fig", "grape", "honeydew", "kiwi", "lemon",
    "mango", "nectarine", "orange", "papaya", "quince",
    "raspberry", "strawberry", "tangerine", "ugli", "watermelon",
    "xigua", "yam", "zucchini"
  ];

  // Helper function to pick a random word from the WORD_BANK
  function getRandomWord() {
    const idx = Math.floor(Math.random() * WORD_BANK.length);
    return WORD_BANK[idx];
  }

  // Fetch a random word + its dictionary definition
  async function fetchWord() {
    try {
      // Get random word from external API
      const randomResp = await fetch("https://random-word-api.vercel.app/api?words=1");
      const randomList = await randomResp.json();
      const randomWord = randomList[0];

      // Fetch definition of that word from dictionary API
      const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${randomWord}`);
      const dictData = await dictRes.json();
      console.log("dictData[0]", dictData[0]);


      // Save both word + definition into state
      setWordData({ word: randomWord, data: dictData[0] });
    } catch (err) {
      console.error("Error fetching word:", err);
    }
  }

  // Run fetchWord() once when the component loads
  useEffect(() => {
    fetchWord();
    console.log("wordData", wordData);  
  }, []);

  // JSX (UI that React renders)
  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-secondary">
      {wordData ? (
        // If we have word data, show it inside a Bootstrap card
        <div className="card shadow-lg w-75 mb-3">
          <div className="card-body">
            <h1 className="card-title text-primary">{wordData.word}</h1>
            
            {/* Loop through each meaning returned by the API */}
            {wordData.data?.meanings?.map((meaning, i) => (
              <div key={i} className="mb-3">
                <h5 className="text-secondary">{meaning.partOfSpeech}</h5>
                <ul>
                  {/* Loop through definitions for that meaning */}
                  {meaning.definitions.map((def, j) => (
                    <li key={j}>{def.definition}</li>
                  ))}
                </ul>
              </div>
            ))}

          </div>
        </div>
      ) : (
        // If no data yet, show loading text
        <p>Loading...</p>
      )}

      {/* Button fetches a new random word */}
      <button
        onClick={fetchWord}
        className="btn btn-primary mt-3 px-4"
      >
        Refresh Word
      </button>
    </div>
  );
}
