import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMongoPopulatedMessages } from "../../../../server/src/interfaces/messages";
import { Chat } from "../../components/Chat/Chat";
import { ChatList } from "../../components/ChatsList/ChatsList";
import { OperationResult } from "../../components/Result/OperationResult";
import { UserContext } from "../../components/UserProvider";

export function ChatContainer() {

  const { user, token, loggedIn } = useContext(UserContext);
  const [chats, setChats] = useState<Map<string, IMongoPopulatedMessages[]>>();
  const [selectedChat, setSelectedChat] = useState([])
  const [messages, setMessages] = useState<IMongoPopulatedMessages[] | boolean>(false);

  const [showNewChat, setShowNewChat] = useState(false);


  const [showResult, setShowResult] = useState(false);
  const [fetchResult, setFetchResult] = useState(
    "error" || "success" || "warning"
  );
  const [resultMsg, setResultMsg] = useState("");

  const navigate = useNavigate();

  const fetchChats = () => {
    axios
      .get<Map<string, IMongoPopulatedMessages[]>>("http://localhost:8080/api/messages/list", {
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

  const newChatHandler = () => {
    setShowNewChat(true);
    setShowResult(false);
  };

  const chatSelectionHandler = (user_id: string) => {
    const selectedUserLatestMsgs = chats?.forEach((conversation, user, map) => {
      if(user === user_id && conversation)
      setMessages(conversation)
    })
    axios.get<IMongoPopulatedMessages[]>(`http://localhost:8080/api/messages/list?user=${user_id}`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`
        }
      }
    ).then(response => {
      const data = response.data;
      setMessages(data);
    }).catch(error => {
      setShowResult(true);
      setFetchResult(
        `${
          error.response.data.message === "No messages." ? "warning" : "error"
        }`
      );
      setResultMsg(error.response.data.message);
    });
  }

  useEffect(() => {
    if (!loggedIn) navigate("../login");
    else fetchChats();
  }, [loggedIn]);

  return (
    <>
      {window.innerWidth < 1024 ? (
        <main>
          <ChatList chats={chats} chatSelectionHandler={chatSelectionHandler}/>
        </main>
      ) : (
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
        <Chat type="new" messages={messages} submitMessage/>
      ) : user.isAdmin ? 
      (<>
          <div className="no-msgs-container">
            <button className="submit-btn" onClick={newChatHandler}>
              New chat
            </button>
          </div>
          <ChatList chats={chats} chatSelectionHandler={chatSelectionHandler}/>
          <Chat type="new" />
        </>
      ) : <></>}
    </>
  );
