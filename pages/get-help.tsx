import { useContext, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { UserContext } from '@/context/UserContext';

const GetHelp = ({ }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext)!;
  const flatListRef = useRef(null);

  const userName = `${user?.firstName} ${user?.lastName}`;
  const userImage = user?.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const response = await axios.get(`https://www.offerboats.com/getHelpMessages/${user._id}`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        _id: new Date().toISOString(),
        messageText: [{
          sender: 'user',
          message: message,
          createdAt: new Date().toISOString(),
        }],
        sender: user.userType,
        createdAt: new Date().toISOString(),
      };

      setMessages((prevMessages: any) => [...prevMessages, newMessage]);

      try {
        await axios.post(`https://www.offerboats.com/sendHelpMessage`, {
          userId: user._id,
          sender: user.userType,
          messageText: { sender: 'user', message: message },
        });
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setMessage('');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="spinner" /></div>;
  }

  return (
          <div className="bg-white p-6 rounded-md shadow-md h-screen flex flex-col">
        <h1 className="heading">Get Help</h1>
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center mb-4">
          <img src={userImage} alt="User" className="w-12 h-12 rounded-full mr-4" />
          <div>
            <h2 className="text-lg font-semibold">{userName}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
        </div>
        <div ref={flatListRef} className="flex-grow overflow-y-auto bg-gray-100 p-4 rounded-lg">
          {[...messages].map((item, index) => (
            item.messageText.map((messageItem:any, msgIndex:any) => (
              <div key={`${item._id}-${msgIndex}`} className={`mb-2 p-2 rounded-lg ${messageItem.sender === 'user' ? 'bg-gray-200 text-right' : 'bg-gray-200'}`}>
                <p>{messageItem.message}</p>
                <p className="text-xs text-gray-500">{new Date(messageItem.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
              </div>
            ))
          ))}
        </div>
        <div className="mt-4">
          <p className="text-sm text-red-500">Please leave your message, and our support team will connect with you shortly.</p>
          <div className="flex mt-2">
            <input
              type="text"
              className="flex-grow border rounded-l px-4 py-2"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage} className="bg-blue-500 text-white px-4 py-2 rounded-r">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetHelp;
