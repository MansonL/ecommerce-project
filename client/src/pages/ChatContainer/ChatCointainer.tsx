import axios from "axios";
import moment from "moment";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  IMongoPopulatedMessages,
  INew_Message,
} from "../../../../server/src/interfaces/messages";
import { CUDResponse } from "../../../../server/src/interfaces/others";
import { IUserShortInfo } from "../../../../server/src/interfaces/users";
import { Chat } from "../../components/Chat/Chat";
import { ChatList } from "../../components/ChatsList/ChatsList";
import { OperationResult } from "../../components/Result/OperationResult";
import { UserContext } from "../../components/UserProvider";
import "./chatcontainer.css";

export function ChatContainer() {
  const { user, token, loggedIn } = useContext(UserContext);
  const [chats, setChats] = useState<Map<string, IMongoPopulatedMessages[]>>(
    new Map<string, IMongoPopulatedMessages[]>()
  );
  const [messages, setMessages] = useState<IMongoPopulatedMessages[]>([]);
  const [selectedUser, setSelectedUser] = useState<IUserShortInfo>();

  const [showNewChat, setShowNewChat] = useState(false);

  const [showResult, setShowResult] = useState(false);
  const [operationResult, setOperationResult] = useState(
    "error" || "success" || "warning"
  );
  const [resultMsg, setResultMsg] = useState("");

  const navigate = useNavigate();

  const commonCatchHandler = (error: any) => {
    console.log(error);
    setShowResult(true);
    setOperationResult(
      `${error.response.data.message === "No messages." ? "warning" : "error"}`
    );
    setResultMsg(error.response.data.message);
  };

  const fetchChats = () => {
    console.log(`Updating chats`);
    axios
      .get<Map<string, IMongoPopulatedMessages[]>>(
        "http://localhost:8080/api/messages/list",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;
        setChats(data);
      })
      .catch(commonCatchHandler);
  };

  const fetchOneChat = (user_id: string) => {
    axios
      .get<IMongoPopulatedMessages[]>(
        `http://localhost:8080/api/messages/list?user=${user_id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        const data = response.data;
        setMessages(data);
      })
      .catch(commonCatchHandler);
  };

  const chatSelectionHandler = (otherUser: IUserShortInfo) => {
    if (chats.size > 0) {
      const latestMessages = chats.get(otherUser._id);
      if (latestMessages) setMessages(latestMessages);
    }
    setSelectedUser(otherUser);
    fetchOneChat(otherUser._id);
  };

  const submitMessage = (message: string) => {
    const newMessage: INew_Message = {
      timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
      from: user._id,
      to: selectedUser?._id as string,
      message: message,
      type: "user",
    };
    axios
      .post<CUDResponse>(
        "http://localhost:8080/api/messages/save",
        newMessage,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        // Using as string cause the message submitting is only triggered when a destination user is selected, so we are going to have this user id
        fetchOneChat(selectedUser?._id as string);
      })
      .catch((error) => {
        setShowResult(true);
        setResultMsg(error.response.data.message);
        setOperationResult("error");
      });
  };

  const closeMsg = () => setShowResult(false);

  useEffect(() => {
    //if (!loggedIn) navigate("../login");
    /*else*/ fetchChats();
  }, [loggedIn]);

  return (
    <>
      {window.innerWidth > 1024 ? (
        <>
          {showResult && (
            <OperationResult
              closeMsg={closeMsg}
              result={operationResult}
              resultMessage={resultMsg}
            />
          )}
          <div className="chat-container">
            <ChatList
              chats={chats}
              chatSelectionHandler={chatSelectionHandler}
            />
            {selectedUser ? (
              <Chat
                handleChatSelection={chatSelectionHandler}
                showError={commonCatchHandler}
                submitMessage={submitMessage}
                type="created"
                messages={messages}
                otherUser={selectedUser}
              />
            ) : (
              <Chat
                handleChatSelection={chatSelectionHandler}
                showError={commonCatchHandler}
                submitMessage={submitMessage}
                type="new"
                messages={[]}
                otherUser={undefined}
              />
            )}
          </div>
        </>
      ) : (
        <>
          {selectedUser ? (
            <>
              {showResult && (
                <OperationResult
                  closeMsg={closeMsg}
                  result={operationResult}
                  resultMessage={resultMsg}
                />
              )}
              <Chat
                handleChatSelection={chatSelectionHandler}
                showError={commonCatchHandler}
                submitMessage={submitMessage}
                type="created"
                messages={messages}
                otherUser={selectedUser}
              />
            </>
          ) : (
            <>
              {showNewChat ? (
                <>
                  {showResult && (
                    <OperationResult
                      closeMsg={closeMsg}
                      result={operationResult}
                      resultMessage={resultMsg}
                    />
                  )}
                  <div className="submit-row" style={{ marginTop: "2rem" }}>
                    <button
                      className="submit-btn"
                      onClick={() => setShowNewChat(false)}
                    >
                      Back to chats
                    </button>
                  </div>

                  <Chat
                    handleChatSelection={chatSelectionHandler}
                    showError={commonCatchHandler}
                    submitMessage={submitMessage}
                    type="new"
                    messages={[]}
                    otherUser={undefined}
                  />
                </>
              ) : (
                <>
                  {showResult && (
                    <OperationResult
                      closeMsg={closeMsg}
                      result={operationResult}
                      resultMessage={resultMsg}
                    />
                  )}
                  <div className="submit-row" style={{ marginTop: "2rem" }}>
                    <button
                      className="submit-btn"
                      onClick={() => setShowNewChat(true)}
                    >
                      New chat
                    </button>
                  </div>
                  <ChatList
                    chats={chats}
                    chatSelectionHandler={chatSelectionHandler}
                  />
                </>
              )}
            </>
          )}
        </>
      )}
    </>
  );
}
