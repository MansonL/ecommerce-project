import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMongoPopulatedMessages } from "../../../../server/src/interfaces/messages";
import { OperationResult } from "../Result/OperationResult";
import { UserContext } from "../UserProvider";
import "./chatslist.css";

export function ChatList() {

  const { token, loggedIn } = useContext(UserContext);

  const [chats, setChats] = useState<Map<string, IMongoPopulatedMessages[]>>()

  const [showResult, setShowResult] = useState(false);
  const [fetchResult, setFetchResult] = useState(
    "error" || "success" || "warning"
  );
  const [resultMsg, setResultMsg] = useState("");

  const navigate = useNavigate();


  const fetchChats = () => 
  {
    axios.get('http://localhost:8080/api/messages/list', {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }).then(response => {
      const data = response.data;
      setChats(data);
    }).catch(error => {
      setShowResult(true);
      setFetchResult(`${error.response.data.message === 'No messages.' ? 'warning' : 'error'}`);
      setResultMsg(error.response.data.message)
    })
  }

  useEffect(() => {
    if(!loggedIn)
      navigate('../login');
    else
      fetchChats()
  }, [loggedIn])

  return (
    <>
    { showResult ? <OperationResult resultMessage={resultMsg} result={fetchResult}/> : 
      <div className="chats-list">
        <header>
          <h5 className="chats-header">Chats</h5>
        </header>
        <section className="chats">
          <ul>
            {}
            <li className="chat">
              <img src="/icons/avatar.png" alt="" className="user-img" />
              <div className="user-info-container">
                <span className="user-name">User name</span>
                <span className="chat-last-message">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis, ab quos. Doloribus odio cumque libero, totam rerum
                  architecto tempora, quae sequi asperiores minus recusandae
                  aut, earum voluptate quis enim culpa!
                </span>
              </div>
            </li>
            <div className="user-chat-divisor" />
            <li className="chat">
              <img src="/icons/avatar.png" alt="" className="user-img" />
              <div className="user-info-container">
                <span className="user-name">User name</span>
                <span className="chat-last-message">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis, ab quos. Doloribus odio cumque libero, totam rerum
                  architecto tempora, quae sequi asperiores minus recusandae
                  aut, earum voluptate quis enim culpa!
                </span>
              </div>
            </li>
            <div className="user-chat-divisor" />
            <li className="chat">
              <img src="/icons/avatar.png" alt="" className="user-img" />
              <div className="user-info-container">
                <span className="user-name">User name</span>
                <span className="chat-last-message">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis, ab quos. Doloribus odio cumque libero, totam rerum
                  architecto tempora, quae sequi asperiores minus recusandae
                  aut, earum voluptate quis enim culpa!
                </span>
              </div>
            </li>
            <div className="user-chat-divisor" />
            <li className="chat">
              <img src="/icons/avatar.png" alt="" className="user-img" />
              <div className="user-info-container">
                <span className="user-name">User name</span>
                <span className="chat-last-message">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis, ab quos. Doloribus odio cumque libero, totam rerum
                  architecto tempora, quae sequi asperiores minus recusandae
                  aut, earum voluptate quis enim culpa!
                </span>
              </div>
            </li>
            <div className="user-chat-divisor" />
            <li className="chat">
              <img src="/icons/avatar.png" alt="" className="user-img" />
              <div className="user-info-container">
                <span className="user-name">User name</span>
                <span className="chat-last-message">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis, ab quos. Doloribus odio cumque libero, totam rerum
                  architecto tempora, quae sequi asperiores minus recusandae
                  aut, earum voluptate quis enim culpa!
                </span>
              </div>
            </li>
            <div className="user-chat-divisor" />
            <li className="chat">
              <img src="/icons/avatar.png" alt="" className="user-img" />
              <div className="user-info-container">
                <span className="user-name">User name</span>
                <span className="chat-last-message">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis, ab quos. Doloribus odio cumque libero, totam rerum
                  architecto tempora, quae sequi asperiores minus recusandae
                  aut, earum voluptate quis enim culpa!
                </span>
              </div>
            </li>
            <div className="user-chat-divisor" />
            <li className="chat">
              <img src="/icons/avatar.png" alt="" className="user-img" />
              <div className="user-info-container">
                <span className="user-name">User name</span>
                <span className="chat-last-message">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis, ab quos. Doloribus odio cumque libero, totam rerum
                  architecto tempora, quae sequi asperiores minus recusandae
                  aut, earum voluptate quis enim culpa!
                </span>
              </div>
            </li>
            <div className="user-chat-divisor" />
            <li className="chat">
              <img src="/icons/avatar.png" alt="" className="user-img" />
              <div className="user-info-container">
                <span className="user-name">User name</span>
                <span className="chat-last-message">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis, ab quos. Doloribus odio cumque libero, totam rerum
                  architecto tempora, quae sequi asperiores minus recusandae
                  aut, earum voluptate quis enim culpa!
                </span>
              </div>
            </li>
            <div className="user-chat-divisor" />
          </ul>
        </section>
      </div>
}
      </>
  );
}
