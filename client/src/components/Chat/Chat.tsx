import axios from "axios";
import React, { useContext, useState } from "react";
import { IMongoPopulatedMessages } from "../../../../server/src/interfaces/messages";
import { IUserShortInfo } from "../../../../server/src/interfaces/users";
import { UserContext } from "../UserProvider";
import "./chat.css";

interface IChatProps {
  type: "new" | "created";
  messages: IMongoPopulatedMessages[];
  submitMessage: (message: string, user_id: string) => void;
}

export function Chat(props: IChatProps) {
  const { user, token } = useContext(UserContext);
  const [message, setMessage] = useState("");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<IUserShortInfo[]>([]);

  const handleMessageChange = (ev: React.ChangeEvent<HTMLTextAreaElement>) =>
    setMessage(ev.target.value);

  const handleUsernameChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    setUsername(ev.target.value);

  const autoGrow = (ev: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = ev.currentTarget;
    if (textarea.scrollHeight > textarea.clientHeight)
      textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const otherUser =
    props.messages[0].from._id === user._id
      ? props.messages[0].to
      : props.messages[0].from;

  const searchUser = () => {
    axios
      .get<IUserShortInfo[]>(`http://localhost:8080/api/users/exists?fullname=${username}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const searchedUsers = response.data;
        setUsers(searchedUsers);
      });
  };

  return (
    <>
      {props.type === "created" ? (
        <div className="main-chat">
          <header className="main-chat-header">
            <h1>{`${otherUser.name} ${otherUser.surname}`}</h1>
          </header>
          <ul className="msgs-container">
            {props.messages.map((message) => {
              const sentOrReceivedClassname =
                message.to._id === otherUser._id
                  ? "sent-msg-container"
                  : "received-msg-container";
              return (
                <>
                  <li className={sentOrReceivedClassname}>
                    <header className="msg-header">
                      <span className="msg-date">{message.timestamp}</span>
                    </header>
                    <span className="msg">{message.message}</span>
                  </li>
                </>
              );
            })}
          </ul>
          <footer className="main-chat-footer">
            <textarea
              name="message"
              onKeyUp={autoGrow}
              value={message}
              onChange={handleMessageChange}
            />
            <button
              className="send-msg-btn"
              onClick={() => props.submitMessage(message, otherUser._id)}
            >
              Send
            </button>
          </footer>
        </div>
      ) : (
        <div className="main-chat">
          <header
            className="main-chat-header"
            style={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
            }}
          >
            <div className="search-user-container">
              <input
                type="email"
                className="new-chat-username-input"
                placeholder="Input the email of the user you want to chat to..."
                value={username}
                onChange={handleUsernameChange}
              />
              <div className="searched-users">
                <ul>
                  <li className="search-users-result">
                    <img
                      src="/icons/avatar.png"
                      alt="user avatar"
                      className="user-img"
                    />
                    <span className="user-fullname">Lautaro Manson</span>
                  </li>
                </ul>
              </div>
            </div>
            <img
              src="/icons/search.png"
              alt="search icon"
              className="search-user-icon"
              onClick={searchUser}
            />
          </header>
          <div className="msgs-container" style={{ height: "2rem" }} />
          <footer className="main-chat-footer">
            <textarea name="message" onKeyUp={autoGrow}></textarea>
            <button className="send-msg-btn">Send</button>
          </footer>
        </div>
      )}
    </>
  );
}
