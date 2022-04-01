import axios, { AxiosResponse } from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IMongoPopulatedMessages } from "../../../../server/src/interfaces/messages";
import { Chat } from "../Chat/Chat";
import { OperationResult } from "../Result/OperationResult";
import { UserContext } from "../UserProvider";
import "./chatslist.css";

interface IChatListProps {
  chats: Map<string, IMongoPopulatedMessages[]> | undefined;
  chatSelectionHandler: (selected: string) => void;
}

export function ChatList(props: IChatListProps) {
  return (
    <>
      <div className="chats-list">
        <header>
          <h4 className="chats-header">Chats</h4>
        </header>
        <section className="chats">
          <ul>
            {(function () {
              const elements: JSX.Element[] = [];
              props.chats?.forEach((conversations, user, map) => {
                const otherUser =
                  conversations[0].from._id === user
                    ? conversations[0].from
                    : conversations[0].to;
                elements.push(
                  <>
                    <li
                      className="chat"
                      onClick={() => props.chatSelectionHandler(user)}
                    >
                      <img
                        src={
                          otherUser.avatar
                            ? otherUser.avatar
                            : "/icons/avatar.png"
                        }
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
              return elements.length > 0 ? (
                elements
              ) : (
                <>
                  <div style={{ textAlign: "center", marginTop: "3rem" }}>
                    There are no chats started. Start one by pressing the button
                    above...
                  </div>
                </>
              );
            })()}
          </ul>
        </section>
      </div>
    </>
  );
}
