import React, {  useContext, useEffect, useState } from 'react';
import { socket } from '../lib/socket';
import axios from 'axios';
import moment from 'moment'
import { UserContext } from './components/UserProvider';
import { IMongoPopulatedMessages, INew_Message } from '../../../server/src/interfaces/messages';
import { takeChats } from '../utils/utilities';
import { Types } from 'mongoose';
import './chat.css';

export function Chat(){
  
  const { user, loggedIn, token } = useContext(UserContext);

  const [sentMessages, setSentMessages] = useState<{
    [index: string]: IMongoPopulatedMessages[];
  }>({})

  const [receivedMessages, setReceivedMessages] = useState<{
    [index: string]: IMongoPopulatedMessages[];
  }>({})

  const [message, setMessage] = useState('');
  
  const [selectedChat, setSelectedChat] = useState('');

  /**
   * Set the width according the compression of the data normalized vs the denormalized data.
   *
  const [barWidth, setBarWidth] = useState(0);
  */

  /**
   * 
   * Message submit handler
   * @param e just for preventing default submit action
   * 
   */
   const sendMessage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); 
    if(message.length > 0){
      const msg : INew_Message = {
        timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
        from: new Types.ObjectId(user.user_id),
        to: new Types.ObjectId(selectedChat),
        message: message,
        type: 'user',
      }
      await axios.post('http://localhost:8080/api/messages/save', msg, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
      setMessage('')
      socket.emit('messages');
    }
  }

  /**
   * 
   * Sockets
   * 
   *
  */
  const messagesUpdateListener = () => {
      axios.get<IMongoPopulatedMessages[]>
          (`http://localhost:8080/api/messages/list/${token}`).then(response => {
        const newMessages = response.data;
        const { receivedMessages, sentMessages } = takeChats(user.user_id, newMessages);
        setReceivedMessages(receivedMessages);
        setSentMessages(sentMessages);
      })
  }

  const selectedUserChat = receivedMessages[selectedChat][0].from;
  const receivedFromSelected = receivedMessages[selectedChat];
  const sentToSelected = sentMessages[selectedChat];
  const selectedMessages = sentToSelected.concat(receivedFromSelected).sort((a, b) => {
      return moment.utc(a.timestamp).diff(moment.utc(b.timestamp))
  })

  useEffect(() => {
    socket.emit('messages');
    socket.emit('users');
    socket.on('messagesUpdate', messagesUpdateListener);
    return () => {
      socket.off('messagesUpdate', messagesUpdateListener);
    }
  }, [])
  
  return (
        <React.Fragment>
        <section className="body-container">
    <div className="chat-container">
      <ul className="chats">
        { Object.keys(receivedMessages).map((user_id, idx) => {
          const user = receivedMessages[user_id][0].from;
          const lastMessage = receivedMessages[user_id].length;
          return (
            <li className="chat" id={user_id} onClick={(e) => setSelectedChat(e.currentTarget.id)}>
          <img className="chat-image" src={user.data.avatar} alt=""/>
          <div className="chat-info">
            <span style={{fontSize:"0.8rem"}} className="chat-text" >{`${user.data.name} ${user.data.surname}`}</span>
            <span className="chat-text">{receivedMessages[user_id][lastMessage].message}</span>
          </div>
        </li>
          )
        })}
       
      </ul>
      <div className="selected-chat">
        <header className="chat-header">
          <img style={{maxWidth:"12%"}} className="chat-image" src={selectedUserChat.data.avatar} alt=""/>
          <span>{`${selectedUserChat.data.name} ${selectedUserChat.data.surname}`}</span>
        </header>
        <div className="chat-body">
          {
            selectedMessages.map(message => {
              return (
                <p className={message.from._id === user.user_id ? `from-me` : `from-other`}>{message.timestamp}<br/>{message.message}</p>
              )
            })
          }
        </div>
        <div className="chat-footer">
          <textarea name="message" id="message" disabled={loggedIn ? false : true} cols={30} rows={2} value={message} onChange={e => setMessage(e.target.value)}></textarea>
          <button className="send-message-btn" onClick={sendMessage}><img style={{width:"100%"}} src="https://static.thenounproject.com/png/3061866-200.png" alt=""/></button>
        </div>
      </div>
    </div>
  </section>
</React.Fragment>
    )
}