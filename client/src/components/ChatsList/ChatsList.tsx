import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMongoPopulatedMessages } from "../../../../server/src/interfaces/messages";
import { Chat } from "../Chat/Chat";
import { OperationResult } from "../Result/OperationResult";
import { UserContext } from "../UserProvider";
import "./chatslist.css";

interface IChatListProps {
  chats: Map<string, IMongoPopulatedMessages[]>;

}

export function ChatList() {

  



  return (
    <>
       : (
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
