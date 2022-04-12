import { useContext } from 'react';
import { IChats } from '../../../../server/src/interfaces/messages';
import { IUserShortInfo } from '../../../../server/src/interfaces/users';
import { UserContext } from '../UserProvider';
import './chatslist.css';

interface IChatList {
    chats: IChats | undefined;
    chatSelectionHandler: (selected: IUserShortInfo) => void;
    showNewChat: () => void;
}

export function ChatList({ chats, chatSelectionHandler, showNewChat }: IChatList) {
    const { user } = useContext(UserContext);

    return (
        <>
            <div className="chats-list">
                <header className="chats-header">
                    <h4 className="chats-header-title">Chats</h4>
                    <i onClick={showNewChat} className="new-chat-icon">
                        <img src="/icons/plus.png" style={{ width: '100%' }} alt="new chat" />
                    </i>
                </header>
                <section className="chats">
                    <ul>
                        {(function () {
                            const elements: JSX.Element[] = [];
                            if (!chats)
                                return (
                                    <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                                        There are no chats started. Start one by pressing the button
                                        above...
                                    </div>
                                );
                            Object.entries(chats).forEach(([otherUserId, messages]) => {
                                const otherUser =
                                    messages[0].from.toString() === user._id
                                        ? (messages[0].to as IUserShortInfo)
                                        : (messages[0].from as IUserShortInfo);

                                elements.push(
                                    <>
                                        <li
                                            className="chat"
                                            onClick={() => chatSelectionHandler(otherUser)}
                                            key={otherUser._id.toString()}
                                        >
                                            <img
                                                src={
                                                    otherUser.avatar
                                                        ? otherUser.avatar
                                                        : '/icons/avatar.png'
                                                }
                                                alt="user avatar"
                                                className="user-img"
                                            />
                                            <div className="user-info-container">
                                                <span className="user-name">{`${otherUser.name} ${otherUser.surname}`}</span>
                                                <span className="chat-last-message">
                                                    {messages[0].message}
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
        </>
    );
}
