import React, { useState, useRef, useEffect } from 'react';
import { Search, Phone, Video, Paperclip, Send, MoreVertical, ArrowLeft, Reply, Trash2, X, Forward } from 'lucide-react';

// Dummy Data
const contactsData = [
  { id: 1, name: 'PRAJWAL (Grade 8)', avatar: 'https://i.pravatar.cc/150?u=prajwal', online: true, lastSeen: 'Online' },
  { id: 2, name: 'jagannath k', avatar: 'https://i.pravatar.cc/150?u=jagannath', online: false, lastSeen: '2 hours ago' },
  { id: 3, name: 'Parent', avatar: 'https://i.pravatar.cc/150?u=parent', online: true, lastSeen: 'Online' },
  { id: 4, name: 'Class Teacher', avatar: 'https://i.pravatar.cc/150?u=teacher', online: false, lastSeen: 'Yesterday' },
  { id: 5, name: 'Math Teacher', avatar: 'https://i.pravatar.cc/150?u=math', online: true, lastSeen: 'Online' },
  { id: 6, name: 'School Admin', avatar: 'https://i.pravatar.cc/150?u=admin', online: false, lastSeen: '2 days ago' },
];

const messagesData = {
  1: [
    { id: 1, sender: 'other', text: 'Hey, how are you doing?', time: '10:00 AM' },
    { id: 2, sender: 'me', text: "I'm good, thanks for asking! How about you?", time: '10:01 AM' },
    { id: 3, sender: 'other', text: "Doing great! Just working on that new project. It's quite challenging.", time: '10:01 AM' },
    { id: 4, sender: 'me', text: 'I can imagine. Let me know if you need any help!', time: '10:02 AM' },
  ],
  2: [
    { id: 1, sender: 'other', text: 'Did you see the latest design mockups?', time: '9:30 AM' },
    { id: 2, sender: 'me', text: 'Yes, they look amazing! Great job.', time: '9:32 AM' },
  ],
  3: [],
  4: [
    { id: 1, sender: 'other', text: 'Please ensure Aarjav brings his sports kit tomorrow.', time: '10:30 AM' },
  ],
  5: [
    { id: 1, sender: 'other', text: 'Aarjav is doing great in Algebra!', time: 'Yesterday' },
  ],
  6: [
    { id: 1, sender: 'other', text: 'School will remain closed on Friday due to public holiday.', time: '2 days ago' },
    { id: 2, sender: 'other', attachment: 'notice.pdf', time: '2 days ago' },
  ],
};

const ContactItem = ({ contact, isSelected, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center p-4 cursor-pointer transition-colors border-l-4 ${
      isSelected ? 'bg-blue-50 border-blue-500' : 'border-transparent hover:bg-gray-50'
    }`}
  >
    <div className="relative">
      <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
      <span
        className={`absolute bottom-0 right-0 block h-3.5 w-3.5 rounded-full border-2 border-white ${
          contact.online ? 'bg-green-500' : 'bg-gray-400'
        }`}
      ></span>
    </div>
    <div className="ml-4 flex-1">
      <p className="font-semibold text-gray-800">{contact.name}</p>
      <p className="text-sm text-gray-500">{contact.lastSeen}</p>
    </div>
  </div>
);

const MessageBubble = ({ message, onReply, onForward }) => {
  const isOutgoing = message.sender === 'me';
  return (
    <div className={`flex my-2 ${isOutgoing ? 'justify-end' : 'justify-start'} group items-center`}>
      {!isOutgoing && (
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity mr-2 order-last">
          <button onClick={() => onReply(message)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Reply">
            <Reply size={16} />
          </button>
          <button onClick={() => onForward(message)} className="p-2 text-gray-400 hover:text-green-500 transition-colors" title="Forward">
            <Forward size={16} />
          </button>
        </div>
      )}
      <div
        className={`max-w-sm lg:max-w-lg px-5 py-3 rounded-3xl shadow-sm ${
          isOutgoing
            ? 'bg-green-500 text-white rounded-br-lg'
            : 'bg-blue-100 text-blue-900 rounded-bl-lg'
        }`}
      >
        {message.isForwarded && (
          <div className={`flex items-center gap-1 text-xs mb-1 italic ${isOutgoing ? 'text-green-100' : 'text-blue-500'}`}>
            <Forward size={12} /> Forwarded
          </div>
        )}
        {message.replyTo && (
          <div className={`mb-2 p-2 rounded border-l-4 text-xs ${isOutgoing ? 'bg-green-600 border-green-800 text-green-100' : 'bg-blue-200 border-blue-400 text-blue-800'}`}>
            <p className="font-bold">{message.replyTo.sender === 'me' ? 'You' : 'Them'}</p>
            <p className="truncate">{message.replyTo.text || (message.replyTo.attachment ? 'Attachment' : '')}</p>
          </div>
        )}
        {message.text && <p className="text-sm">{message.text}</p>}
        {message.attachment && (
          <div className="mt-2 p-2 bg-white/20 rounded-lg">
            <p className="text-sm font-medium">{message.attachment}</p>
          </div>
        )}
        <p className={`text-xs mt-1.5 ${isOutgoing ? 'text-green-100' : 'text-blue-500'} text-right`}>
          {message.time}
        </p>
      </div>
      {isOutgoing && (
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity mr-2 order-first">
          <button onClick={() => onForward(message)} className="p-2 text-gray-400 hover:text-green-500 transition-colors" title="Forward">
            <Forward size={16} />
          </button>
          <button onClick={() => onReply(message)} className="p-2 text-gray-400 hover:text-blue-500 transition-colors" title="Reply">
            <Reply size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

const ChatPage = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);
  const ws = useRef(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [showOptions, setShowOptions] = useState(false);
  const [forwardingMessage, setForwardingMessage] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // WebSocket connection effect
  useEffect(() => {
    if (!selectedContact) return;

    // In a real app, you'd get the current user's ID after login.
    // For this demo, we'll use a placeholder.
    const currentUserId = 'my-user-id';

    // Replace with your actual WebSocket server URL
    // We pass the user's ID as a query parameter for identification on the server.
    ws.current = new WebSocket(`ws://localhost:8080?userId=${currentUserId}`);

    ws.current.onopen = () => {
      console.log('WebSocket connection established.');
    };

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);

      // Only process messages from the currently selected contact
      if (data.senderId === selectedContact.id) {
        if (data.type === 'chat') {
          setMessages((prevMessages) => [...prevMessages, data.message]);
          setIsTyping(false); // A new message means they stopped typing
        } else if (data.type === 'typing') {
          setIsTyping(data.isTyping);
        }
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed.');
    };

    // Cleanup on component unmount
    return () => {
      ws.current?.close();
    };
    // This effect should re-run if the selected contact changes to establish a new context.
  }, [selectedContact?.id]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (!selectedContact) return;
    setIsTyping(false); // Reset typing status when contact changes
    setMessages(messagesData[selectedContact.id] || []);
    scrollToBottom();
    setReplyingTo(null);
    setShowOptions(false);
    setShowForwardModal(false);
  }, [selectedContact]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e) => {
    setInputText(e.target.value);

    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;

    // If we're not already in a "typing" state, send a 'start typing' event.
    if (!typingTimeoutRef.current) {
      ws.current.send(JSON.stringify({ type: 'typing', isTyping: true, recipientId: selectedContact.id }));
    } else {
      // If we are already typing, just clear the old timeout.
      clearTimeout(typingTimeoutRef.current);
    }

    // Set a new timeout to send a "stop typing" event after 2 seconds of inactivity.
    typingTimeoutRef.current = setTimeout(() => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
      ws.current.send(JSON.stringify({ type: 'typing', isTyping: false, recipientId: selectedContact.id }));
      typingTimeoutRef.current = null; // Reset the ref
    }, 2000);
  };

  const handleReply = (message) => {
    setReplyingTo(message);
  };

  const handleForward = (message) => {
    setForwardingMessage(message);
    setShowForwardModal(true);
  };

  const confirmForward = (contact) => {
    if (!forwardingMessage) return;

    const newMessage = {
      id: Date.now(),
      sender: 'me',
      text: forwardingMessage.text,
      attachment: forwardingMessage.attachment,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isForwarded: true
    };

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'chat', message: newMessage, recipientId: contact.id }));
    }

    if (messagesData[contact.id]) {
      messagesData[contact.id].push(newMessage);
    } else {
      messagesData[contact.id] = [newMessage];
    }

    if (selectedContact && selectedContact.id === contact.id) {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    }

    setShowForwardModal(false);
    setForwardingMessage(null);
  };

  const handleClearChat = () => {
    if (window.confirm('Are you sure you want to clear the chat history?')) {
      setMessages([]);
      // Note: This only clears local state. In a real app, you'd call an API.
      setShowOptions(false);
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputText.trim() === '' || !ws.current || ws.current.readyState !== WebSocket.OPEN) {
      return;
    }

    // When a message is sent, clear any "typing" timeout and send a "stop typing" event.
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    ws.current.send(JSON.stringify({ type: 'typing', isTyping: false, recipientId: selectedContact.id }));

    const newMessage = {
      type: 'chat',
      message: {
        id: messages.length + 1,
        sender: 'me',
        text: inputText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        replyTo: replyingTo ? { sender: replyingTo.sender, text: replyingTo.text, attachment: replyingTo.attachment } : null
      },
      recipientId: selectedContact.id, // Send recipient ID to the server
    };

    // Send the message to the WebSocket server
    ws.current.send(JSON.stringify(newMessage));

    // Optimistically update the UI. A more robust solution might wait for the server to echo the message back.
    setMessages((prevMessages) => [...prevMessages, newMessage.message]);
    setInputText('');
    setReplyingTo(null);
  };

  return (
    <div className="flex h-screen font-sans bg-gradient-to-br from-blue-100 to-purple-100 text-gray-800">
      {/* Sidebar */}
      <aside className={`${isMobile && showChat ? 'hidden' : 'flex'} w-full md:w-80 lg:w-96 bg-white/90 backdrop-blur-lg border-r border-gray-200/80 flex-col`}>
        {/* Search bar */}
        <div className="p-4 border-b border-gray-200/80">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search contacts..."
              className="w-full pl-12 pr-4 py-3 bg-gray-100 border-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-white transition-all"
            />
          </div>
        </div>
        {/* Contacts list */}
        <div className="flex-1 overflow-y-auto">
          {contactsData.map(contact => (
            <ContactItem
              key={contact.id}
              contact={contact}
              isSelected={selectedContact?.id === contact.id}
              onClick={() => {
                setSelectedContact(contact);
                if (isMobile) setShowChat(true);
              }}
            />
          ))}
        </div>
      </aside>

      {/* Main Chat Window */}
      <main className={`${isMobile && !showChat ? 'hidden' : 'flex'} flex-1 flex-col bg-transparent`}>
        {/* Chat Header */}
        <header className="bg-white/80 backdrop-blur-lg border-b border-gray-200/80 p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={() => setShowChat(false)}
                className="p-2 mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            {selectedContact && (
              <>
                <img src={selectedContact.avatar} alt={selectedContact.name} className="w-12 h-12 rounded-full object-cover" />
                <div className="ml-4">
                  <p className="text-lg font-semibold text-gray-900">{selectedContact.name}</p>
                  {isTyping ? (
                    <p className="text-sm text-sky-600 font-medium animate-pulse">is typing...</p>
                  ) : (
                    <p className="text-sm text-gray-500">{selectedContact.lastSeen}</p>
                  )}
                </div>
              </>
            )}
          </div>
          {selectedContact && (
            <div className="flex items-center gap-2">
              <button className="p-3 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-full transition-colors"><Phone size={20} /></button>
              <button className="p-3 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-full transition-colors"><Video size={20} /></button>
              <div className="relative">
                <button onClick={() => setShowOptions(!showOptions)} className="p-3 text-gray-500 hover:bg-blue-100 hover:text-blue-600 rounded-full transition-colors"><MoreVertical size={20} /></button>
                {showOptions && (
                  <div className="absolute right-0 top-full mt-2 bg-white shadow-lg rounded-lg py-2 w-48 z-10 border border-gray-100">
                    <button onClick={handleClearChat} className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 flex items-center gap-2">
                      <Trash2 size={16} /> Clear Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </header>

        {/* Messages Area */}
        {selectedContact ? (
          <div className="flex-1 p-6 overflow-y-auto">
            {messages.map(message => (<MessageBubble key={message.id} message={message} onReply={handleReply} onForward={handleForward} />))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a contact to start chatting</p>
          </div>
        )}

        {/* Message Input */}
        {selectedContact && (
          <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200/80 p-4">
            {replyingTo && (
              <div className="flex items-center justify-between bg-gray-50 p-2 px-4 rounded-lg mb-2 border border-gray-200">
                <div className="text-sm">
                  <span className="text-blue-600 font-semibold">Replying to {replyingTo.sender === 'me' ? 'yourself' : selectedContact.name}</span>
                  <p className="text-gray-500 truncate max-w-xs">{replyingTo.text || (replyingTo.attachment ? 'Attachment' : '')}</p>
                </div>
                <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-red-500"><X size={16} /></button>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="flex items-center gap-4">
              <button type="button" className="p-3 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"><Paperclip size={22} /></button>
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-1 px-5 py-3 bg-gray-100 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
              <button type="submit" className="p-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors disabled:bg-gray-300 shadow-lg shadow-blue-500/30" disabled={!inputText.trim()}>
                <Send size={20} />
              </button>
            </form>
          </footer>
        )}
      </main>

      {/* Forward Message Modal */}
      {showForwardModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-96 max-h-[80vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="text-lg font-bold text-gray-800">Forward to...</h3>
              <button onClick={() => { setShowForwardModal(false); setForwardingMessage(null); }} className="text-gray-500 hover:text-gray-700"><X size={20} /></button>
            </div>
            <div className="overflow-y-auto flex-1 space-y-2">
              {contactsData.map(contact => (
                <div key={contact.id} onClick={() => confirmForward(contact)} className="flex items-center p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors">
                  <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                  <span className="font-medium text-gray-700">{contact.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;