/* eslint react/prop-types: 0 */
// eslint-disable-next-line
import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

import "./home.css";

function Home({setLoginUser}){
  const { transcript, resetTranscript } = useSpeechRecognition();

  const handleSpeechRecognition = () => {
    SpeechRecognition.startListening();
  };

  const handleStop = () => {
    SpeechRecognition.stopListening();
    setMessage(transcript);
    resetTranscript();
  }

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      console.error('Text-to-speech is not supported in this browser.');
    }
  };

  const handleSpeak = () => {
    const text = chats[chats.length - 1].content;
    speak(text);
  };

  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    scrollTo(0, 1e10);

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chats,
      }),
    })
    .then((response) => response.json())
    .then((data) => {
      msgs.push(data.output);
      setChats(msgs);
      setIsTyping(false);
      scrollTo(0, 1e10);
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <main>
      <button className="logout" onClick={() => setLoginUser({})}>Logout</button>
      <h1>ChatBot</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : "assistant_msg"}>
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p className="assistant_msg">
          <i>{isTyping ? "Typing" : ""}</i>
        </p>
      </div>

      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          className="inp"
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
      <button className="start" onClick={handleSpeechRecognition}>Voice Search</button>
      <button className="start stop" onClick={handleStop}>Stop Search</button>
      <button className="start stop" onClick={handleSpeak}>Voice Result</button>
    </main>
  );
}

export default Home;
