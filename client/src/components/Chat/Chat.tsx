import React, { useState } from "react";
import "./chat.css";

export function Chat() {
  const [messages, setMessages] = useState([]);

  const autoGrow = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = ev.currentTarget;
    if (textarea.scrollHeight > textarea.clientHeight)
      textarea.style.height = `${textarea.scrollHeight}px`;
  };

  return (
    <>
      <div className="main-chat">
        <header className="main-chat-header">
          <h1>User name</h1>
        </header>
        <div className="msgs-container">
          <div className="received-msg-container">
            <header className="msg-header">
              <span className="msg-date">12/27/2000 16:45hs.</span>
            </header>
            <span className="msg">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum
              eum odit ea est minima neque asperiores enim quo quas? Mollitia
              eaque corrupti ipsam ut nemo, quasi quia at reiciendis laborum.
            </span>
          </div>
          <div className="sent-msg-container">
            {" "}
            <header className="msg-header">
              <span className="msg-date">12/27/2000 16:45hs.</span>
            </header>
            <span className="msg">
              Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ipsum
              eum odit ea est minima neque asperiores enim quo quas? Mollitia
              eaque corrupti ipsam ut nemo, quasi quia at reiciendis laborum.
            </span>
          </div>
        </div>
        <footer className="main-chat-footer">
          <textarea name="message" onKeyUp={autoGrow}></textarea>
          <button className="send-msg-btn">Send</button>
        </footer>
      </div>
    </>
  );
}
