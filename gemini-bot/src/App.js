import { useState } from "react";

const App = () => {
  const [value, setValue] = useState("")
  const [error, setError] = useState("")
  const [chatHistory, setChatHistory] = useState([])

  

  const magicOptions = [
    "What are some of the most famous unsolved mysteries in history?",
    "What are the latest missions or projects in space exploration, and what are their objectives?",
    "How do stories of resilience and perseverance inspire us to overcome our own challenges?",
    "Can you give me a riddle that challenges both logic and lateral thinking?",
    "Can you explain the significance of famous artworks like the Mona Lisa or Starry Night?"
  ]
  const surprise = () => {
    const randomIndex = magicOptions[Math.floor(Math.random() * magicOptions.length)];
    setValue(randomIndex);
  }

  const getResponse = async () => {
    if (!value) {
      setError("Error! Please ask a question");
      return;
    }
    try {
      const options = {
        method: "POST",
        body: JSON.stringify({
          history: chatHistory,
          message: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const response = await fetch("http://localhost:8000/gemini", options);
      const data = await response.text();

      setChatHistory(oldChatHistory => [...oldChatHistory, {
        role: "user",
        parts: value
      },
      {
        role: "model",
        parts: data
      }
      ])
      setValue("")

    }
    catch (error) {
      setError("Something went wrong, please try again");
    }
  };

  const clear = () => {
    setChatHistory([]);
    setValue("");
    setError("");
  }


  return (
    <div className="App">
     <header className="Header">
        <h1>Gemini-Inator</h1>
      </header>
      <section className="Search-Section" >

        <p>Ask me anything!

          <button className="magic" onClick={surprise}
            disabled={!chatHistory}>
            Surprise Me!
          </button>

        </p>

        <div className="input-container">
          <input
            value={value}
            placeholder="Who is pewdiepie....?"
            onChange={e => setValue(e.target.value)}
          />

          {!error && <button onClick={getResponse}>Ask Me</button>}
          {error && <button disabled={!chatHistory} onClick={clear}>Clear</button>}
        </div>
        {error && <p>{error}</p>}
        <div className="search-result">
          {chatHistory.map((chatItem, _index) => <div key={_index}>
            <p className="answer">{chatItem.role}:{chatItem.parts}</p>
          </div>)}
        </div>
      </section>


    </div>
  )
}
export default App;