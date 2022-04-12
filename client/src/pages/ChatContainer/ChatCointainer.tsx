import axios from 'axios';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    IChats,
    IMongoPopulatedMessages,
    INew_Message,
} from '../../../../server/src/interfaces/messages';
import { CUDResponse } from '../../../../server/src/interfaces/others';
import { IUserShortInfo } from '../../../../server/src/interfaces/users';
import { Chat } from '../../components/Chat/Chat';
import { ChatList } from '../../components/ChatsList/ChatsList';
import { OperationResult } from '../../components/Result/OperationResult';
import { UserContext } from '../../components/UserProvider';
import { socket } from '../../lib/socket';
import './chatcontainer.css';

export function ChatContainer() {
    const { user, token, loggedIn } = useContext(UserContext);
    const [chats, setChats] = useState<IChats>();
    const [messages, setMessages] = useState<IMongoPopulatedMessages[]>([]);
    const [selectedUser, setSelectedUser] = useState<IUserShortInfo>();

    const [showNewChat, setShowNewChat] = useState(false);

    const [showResult, setShowResult] = useState(false);
    const [operationResult, setOperationResult] = useState('error' || 'success' || 'warning');
    const [resultMsg, setResultMsg] = useState('');

    const navigate = useNavigate();

    const commonCatchHandler = (error: any) => {
        setShowResult(true);
        setOperationResult(
            `${error.response.data.message === 'No messages.' ? 'warning' : 'error'}`
        );
        setResultMsg(error.response.data.message);
    };

    const fetchChats = () => {
        console.log(`Updating chats`);
        axios
            .get<IChats>('http://localhost:8080/api/messages/list', {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                console.log(response);
                const data = response.data;
                setChats(data);
            })
            .catch(commonCatchHandler);
    };

    const fetchOneChat = async (user_id: string) => {
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

    const chatSelectionHandler = async (otherUser: IUserShortInfo) => {
        if (chats && chats[otherUser._id.toString()]) {
            const latestMessages = chats[otherUser._id.toString()];
            setMessages(latestMessages);
        }
        await fetchOneChat(otherUser._id.toString());
        setSelectedUser(otherUser);
    };

    const submitMessage = (message: string) => {
        const newMessage: INew_Message = {
            timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
            from: user._id,
            to: selectedUser?._id.toString() as string,
            message: message,
            type: 'user',
        };
        axios
            .post<CUDResponse>('http://localhost:8080/api/messages/save', newMessage, {
                withCredentials: true,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(() => {
                // Using as string cause the message submitting is only triggered when a destination user is selected, so we are going to have this user id
                fetchOneChat(selectedUser?._id.toString() as string);
            })
            .catch((error) => {
                setShowResult(true);
                setResultMsg(error.response.data.message);
                setOperationResult('error');
            });
    };

    const closeMsg = () => setShowResult(false);

    socket.on('chats', (data: IChats | string) => {
        if (typeof data === 'string') {
            setShowResult(true);
            setResultMsg(data);
            setOperationResult('warning');
        } else setChats(data);
    });

    socket.on('incoming message', (data: IMongoPopulatedMessages[] | string) => {
        if (typeof data === 'string') {
            setShowResult(true);
            setResultMsg(data);
            setOperationResult('warning');
        } else setMessages(data);
    });

    useEffect(() => {
        if (!loggedIn) navigate('../login');
        else fetchChats();
    }, [loggedIn]);

    console.log(chats);

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
                            showNewChat={() => setSelectedUser(undefined)}
                        />
                        {selectedUser ? (
                            <Chat
                                handleChatSelection={chatSelectionHandler}
                                showError={commonCatchHandler}
                                submitMessage={submitMessage}
                                type="created"
                                messages={messages}
                                otherUser={selectedUser}
                                backToChats={() => {}}
                            />
                        ) : (
                            <Chat
                                handleChatSelection={chatSelectionHandler}
                                showError={commonCatchHandler}
                                submitMessage={submitMessage}
                                type="new"
                                messages={[]}
                                otherUser={undefined}
                                backToChats={() => {}}
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
                                backToChats={() => {
                                    setShowNewChat(false);
                                    setSelectedUser(undefined);
                                }}
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

                                    <Chat
                                        handleChatSelection={chatSelectionHandler}
                                        showError={commonCatchHandler}
                                        submitMessage={submitMessage}
                                        type="new"
                                        messages={[]}
                                        otherUser={undefined}
                                        backToChats={() => {
                                            setShowNewChat(false);
                                            setSelectedUser(undefined);
                                        }}
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
                                    <ChatList
                                        chats={chats}
                                        chatSelectionHandler={chatSelectionHandler}
                                        showNewChat={() => setShowNewChat(true)}
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
