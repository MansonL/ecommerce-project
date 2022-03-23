import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMongoPopulatedMessages } from "../../../../server/src/interfaces/messages";
import { Chat } from "../Chat/Chat";
import { OperationResult } from "../Result/OperationResult";
import { UserContext } from "../UserProvider";
import "./chatslist.css";

export function ChatList() {
  const { user, token, loggedIn } = useContext(UserContext);

  const [chats, setChats] = useState<Map<string, IMongoPopulatedMessages[]>>();

  const [showResult, setShowResult] = useState(false);
  const [fetchResult, setFetchResult] = useState(
    "error" || "success" || "warning"
  );
  const [resultMsg, setResultMsg] = useState("");
  const [showNewChat, setShowNewChat] = useState(false);

  const navigate = useNavigate();

  const newChatHandler = () => {
    setShowNewChat(true);
    setShowResult(false);
  };

  const fetchChats = () => {
    axios
      .get("http://localhost:8080/api/messages/list", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        setChats(data);
      })
      .catch((error) => {
        setShowResult(true);
        setFetchResult(
          `${
            error.response.data.message === "No messages." ? "warning" : "error"
          }`
        );
        setResultMsg(error.response.data.message);
      });
  };

  useEffect(() => {
    if (!loggedIn) navigate("../login");
    else fetchChats();
  }, [loggedIn]);

  return (
    <>
      {showResult ? (
        <>
          <OperationResult resultMessage={resultMsg} result={fetchResult} />
          <div className="no-msgs-container">
            <button className="submit-btn" onClick={newChatHandler}>
              New chat
            </button>
          </div>
        </>
      ) : showNewChat && user.isAdmin ? (
        <Chat type="new" />
      ) : (
        <div className="chats-list">
          <header>
            <h5 className="chats-header">Chats</h5>
          </header>
          <section className="chats">
            <ul>
              {(function () {
                const elements: JSX.Element[] = [];
                chats?.forEach((conversations, user, map) => {
                  const otherUser =
                    conversations[0].from._id === user
                      ? conversations[0].from
                      : conversations[0].to;
                  elements.push(
                    <>
                      <li className="chat">
                        <img
                          src={otherUser.avatar}
                          alt="user avatar"
                          className="user-img"
                        />
                        <div className="user-info-container">
                          <span className="user-name">{`${otherUser.name} ${otherUser.surname}`}</span>
                          <span className="chat-last-message">
                            {conversations[0].message}
                          </span>
                        </div>
                      </li>
                      <div className="user-chat-divisor" />
                    </>
                  );
                });
                return elements;
              })()}
            </ul>
          </section>
        </div>
      )}
    </>
  );
}
