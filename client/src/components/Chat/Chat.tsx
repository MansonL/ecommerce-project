import axios from 'axios';
import React, { useContext, useState } from 'react';
import { IMongoPopulatedMessages } from '../../../../server/src/interfaces/messages';
import { IUserShortInfo } from '../../../../server/src/interfaces/users';
import { UserContext } from '../UserProvider';
import './chat.css';

interface IChatProps {
    type: 'new' | 'created';
    messages: IMongoPopulatedMessages[];
    submitMessage: (message: string) => void;
    otherUser: IUserShortInfo | undefined;
    showError: (error: any) => void;
    handleChatSelection: (user: IUserShortInfo) => void;
    backToChats: () => void;
}

export function Chat({
    type,
    messages,
    submitMessage,
    otherUser,
    showError,
    handleChatSelection,
    backToChats,
}: IChatProps) {
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
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

    const searchUser = () => {
        axios
            .get<IUserShortInfo[]>(`http://localhost:8080/api/users/exists?fullname=${username}`)
            .then((response) => {
                const searchedUsers = response.data;
                setUsers(searchedUsers);
            })
            .catch((error) => showError(error));
    };

    const handleUserSelection = (user: IUserShortInfo) => {
        setUsers([]);
        handleChatSelection(user);
    };

    return (
        <>
            <div className="main-chat">
                {type === 'created' && otherUser ? (
                    <header className="selected-chat-header">
                        {window.innerWidth < 1024 && (
                            <i className="back-to-chats-icon" onClick={backToChats}>
                                <img
                                    src="/icons/back.png"
                                    alt="back to chats"
                                    style={{ width: '100%' }}
                                />
                            </i>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', flexGrow: '1' }}>
                            <img
                                className="user-img"
                                src={otherUser.avatar ? otherUser.avatar : '/icons/avatar.png'}
                                alt="user avatar"
                            />
                            <h1>{`${otherUser.name} ${otherUser.surname}`}</h1>
                        </div>
                    </header>
                ) : (
                    <header
                        className="selected-chat-header"
                        style={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            alignItems: 'center',
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
                                    {users.map((user, idx) => {
                                        return (
                                            <li
                                                className="search-users-result"
                                                key={user._id.toString()}
                                                onClick={() => handleUserSelection(user)}
                                            >
                                                <img
                                                    src={
                                                        user.avatar
                                                            ? user.avatar
                                                            : '/icons/avatar.png'
                                                    }
                                                    alt="user avatar"
                                                    className="user-img"
                                                />
                                                <span>{`${user.name} ${user.surname}`}</span>
                                            </li>
                                        );
                                    })}
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
                )}
                <ul className="msgs-container">
                    {messages.length > 0 ? (
                        messages.map((message, idx) => {
                            const sentOrReceivedClassname =
                                typeof message.from === 'string'
                                    ? 'sent-msg-container'
                                    : 'received-msg-container';
                            return (
                                <>
                                    <li
                                        className={sentOrReceivedClassname}
                                        key={message._id.toString()}
                                    >
                                        <header className="msg-header">
                                            <span className="msg-date">{message.timestamp}</span>
                                        </header>
                                        <span className="msg">{message.message}</span>
                                    </li>
                                </>
                            );
                        })
                    ) : (
                        <>
                            <span className="no-msg" style={{ margin: 'auto' }}>
                                No messages. Type and send a message to start the conversation.
                            </span>
                        </>
                    )}
                </ul>
                <footer className="main-chat-footer">
                    <textarea
                        name="message"
                        onKeyUp={autoGrow}
                        value={message}
                        onChange={handleMessageChange}
                    />
                    <button className="send-msg-btn" onClick={() => submitMessage(message)}>
                        Send
                    </button>
                </footer>
            </div>
        </>
    );
}
