import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { chatAPI, bookingAPI } from '../services/api';
import toast from 'react-hot-toast';
import io from 'socket.io-client';
import { FiSend, FiArrowLeft, FiUser, FiCheck, FiCheckCircle } from 'react-icons/fi';

const Chat = () => {
  const { bookingId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [booking, setBooking] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    fetchBookingDetails();
    fetchMessages();
    
    // Socket connection
    const socketUrl = process.env.REACT_APP_API_URL || `http://${window.location.hostname}:5000`;
    socketRef.current = io(socketUrl, {
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5
    });
    socketRef.current.emit('join', user._id);

    // Listen for new messages
    socketRef.current.on('newMessage', (message) => {
      const msgBookingId = message.bookingId?._id || message.bookingId;
      if (msgBookingId === bookingId) {
        setMessages(prev => [...prev, message]);
        scrollToBottom();
        
        // Mark as read if chat is open
        chatAPI.markAsRead(bookingId);
      }
    });

    // Listen for typing indicator
    socketRef.current.on('userTyping', ({ bookingId: typingBookingId, isTyping: typing }) => {
      if (typingBookingId === bookingId) {
        setIsTyping(typing);
      }
    });

    // Listen for read receipts
    socketRef.current.on('messagesRead', ({ bookingId: readBookingId }) => {
      if (readBookingId === bookingId) {
        setMessages(prev => prev.map(msg => 
          msg.senderId._id === user._id ? { ...msg, isRead: true } : msg
        ));
      }
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [bookingId, user._id]);

  const fetchBookingDetails = async () => {
    try {
      const { data } = await bookingAPI.getAll();
      const currentBooking = data.find(b => b._id === bookingId);
      
      if (!currentBooking) {
        toast.error('Booking not found');
        navigate('/profile');
        return;
      }

      setBooking(currentBooking);
      console.log('booking data:', JSON.stringify(currentBooking, null, 2));

      if (user.role === 'user') {
        const workerUserId = currentBooking.workerId?.userId?._id || currentBooking.workerId?.userId;
        setOtherUser({ 
          _id: workerUserId, 
          name: currentBooking.workerId?.userId?.name,
          skills: currentBooking.workerId?.skills || []
        });
      } else {
        const customerId = currentBooking.userId?._id || currentBooking.userId;
        setOtherUser({ _id: customerId, name: currentBooking.userId?.name, skills: [] });
      }
    } catch (error) {
      console.error('Fetch booking error:', error);
      toast.error('Failed to load booking details');
    }
  };

  const fetchMessages = async () => {
    try {
      const { data } = await chatAPI.getMessages(bookingId);
      setMessages(data);
      setLoading(false);
      await chatAPI.markAsRead(bookingId);
      setTimeout(() => scrollToBottom(), 300);
    } catch (error) {
      console.error('Fetch messages error:', error);
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const receiverId = user.role === 'user'
      ? booking?.workerId?.userId?._id || booking?.workerId
      : booking?.userId?._id || booking?.userId;

    if (!receiverId) {
      toast.error('Cannot find receiver');
      return;
    }

    try {
      const { data } = await chatAPI.sendMessage({
        bookingId,
        receiverId,
        message: newMessage.trim()
      });

      setMessages(prev => [...prev, data]);
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Send message error:', error);
      toast.error('Failed to send message');
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);

    // Emit typing indicator
    socketRef.current.emit('typing', {
      bookingId,
      receiverId: otherUser?._id,
      isTyping: true
    });

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      socketRef.current.emit('typing', {
        bookingId,
        receiverId: otherUser?._id,
        isTyping: false
      });
    }, 2000);
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50 dark:bg-gray-900 overflow-hidden">

      <main className="flex-1 flex flex-col container mx-auto px-4 py-4 max-w-4xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-white dark:bg-gray-800 rounded-t-2xl shadow-lg p-4 flex items-center space-x-4">
          <button
            onClick={() => navigate('/profile')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
          >
            <FiArrowLeft size={24} className="text-gray-700 dark:text-gray-300" />
          </button>

          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl">
            {otherUser?.name?.charAt(0).toUpperCase()}
          </div>

          <div className="flex-grow">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white">
              {otherUser?.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {user.role === 'worker' ? 'Customer' : `Worker • ${otherUser?.skills?.join(', ') || ''}`}
            </p>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-grow bg-white dark:bg-gray-800 shadow-lg overflow-y-auto p-4 space-y-4" style={{ minHeight: 0 }}>
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 dark:text-gray-400">
              <FiUser size={48} className="mb-4" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => {
              const senderId = msg.senderId?._id?.toString() || msg.senderId?.toString();
              const currentUserId = user._id?.toString() || user.id?.toString();
              const isSender = senderId === currentUserId;
              return (
                <div
                  key={msg._id}
                  className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-xs lg:max-w-md">
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isSender
                          ? 'bg-blue-600 text-white'
                          : 'bg-green-500 text-white'
                      }`}
                    >
                      <p className="break-words">{msg.message}</p>
                    </div>
                    <div className={`flex items-center space-x-1 mt-1 text-xs text-gray-500 dark:text-gray-400 ${isSender ? 'justify-end' : 'justify-start'}`}>
                      <span>{formatTime(msg.createdAt)}</span>
                      {isSender && (
                        msg.isRead
                          ? <FiCheckCircle size={14} className="text-blue-500" />
                          : <FiCheck size={14} />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-gray-200 dark:bg-gray-700 rounded-2xl px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="bg-white dark:bg-gray-800 rounded-b-2xl shadow-lg p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type a message..."
              className="flex-grow px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-full focus:border-blue-500 focus:outline-none transition"
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiSend size={20} />
            </button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default Chat;
