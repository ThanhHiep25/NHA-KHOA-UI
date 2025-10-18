'use client'

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Send, CheckCircle } from 'lucide-react';

interface ChatPopupProps {
  onClose: () => void;
}

// Định nghĩa giao diện cho mỗi tin nhắn
interface Message {
  sender: 'user' | 'bot';
  content: React.ReactNode;
}

const chatVariants = {
  hidden: { opacity: 0, scale: 0.8, y: 50 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { stiffness: 200, damping: 20 } },
  exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
};

const ChatPopup: React.FC<ChatPopupProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      // Thêm tin nhắn của người dùng vào danh sách
      const newUserMessage: Message = { sender: 'user', content: inputValue.trim() };
      setMessages((prevMessages) => [...prevMessages, newUserMessage]);
      setInputValue('');

      // Mô phỏng phản hồi của bot sau 1 giây
      setTimeout(() => {
        const botResponseContent = (
          <div className="flex flex-col">
            <p className="font-semibold mb-2 text-lg text-gray-800">Hoàng Bình Dental</p>
            <p className="text-gray-700 text-sm">Cảm ơn bạn đã liên hệ!</p>
            <p className="mt-1 text-gray-700 text-sm">Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
            <p>Giờ làm việc</p>
            <ul className="list-disc list-inside text-sm text-gray-700">
              <li>Thứ 2 - Thứ 7: 8:00 - 20:00</li>
              <li>Chủ Nhật: 9:00 - 18:00</li>
            </ul>
            <hr className="my-4 border-t border-gray-300" />
            <div className="bg-white rounded-lg p-4 leading-7">
              <p className='mt-2 text-yellow-500'>Hotline: 0123456789</p>
              <p className='text-yellow-500'>Email: 6lG1I@example.com</p>
              <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d4649.278443867385!2d106.6907236!3d10.7745378!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f396a9573b1%3A0x3ef2307ad14f1770!2zQ8O0bmcgdmnDqm4gVGFvIMSQw6Bu!5e1!3m2!1svi!2s!4v1758459270684!5m2!1svi!2s"
               className='w-full h-40 rounded-lg'></iframe>
            </div>

            <button
              onClick={() => {
                window.open('/pages/services', '_blank');
              }}
              className="mt-2 bg-blue-500 text-white text-sm cursor-pointer px-3 py-1 rounded-full w-fit">
              Xem thêm
            </button>
          </div>
        );
        const newBotMessage: Message = { sender: 'bot', content: botResponseContent };
        setMessages((prevMessages) => [...prevMessages, newBotMessage]);
      }, 1000);
    }
  };

  // Tự động cuộn xuống dưới cùng khi có tin nhắn mới
  useEffect(() => {
    if (messages.length > 0) {
      const chatContainer = document.querySelector('.custom-scrollbar');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <motion.div
      className="fixed bottom-30 right-8 z-50 w-80 md:w-96 max-h-[60vh] bg-white rounded-3xl shadow-2xl flex flex-col"
      variants={chatVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}
    >
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-300 rounded-t-3xl">
        <div className="flex items-center gap-2" title='Chat bot HoangBinh Dental - Đã xác minh'>
          <motion.img src="/LOGO/tooth.png" alt="logo tooth" className="w-8 h-8" />
          <span className="font-semibold text-gray-400">HoangBinh Dental</span>
          <CheckCircle size={16} className="text-blue-500" />
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Đóng chat"
        >
          <X size={20} />
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto custom-scrollbar bg-gradient-to-bl from-purple-200 via-white to-blue-200">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center py-4">Chào bạn! Chúng tôi có thể giúp gì cho bạn?</p>
        ) : (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-2 p-3 rounded-lg max-w-[80%] ${message.sender === 'user' ? 'bg-yellow-400/40 backdrop-blur-2xl text-gray-600 ml-auto' : 'bg-purple-600/40 backdrop-blur-2xl text-white mr-auto'
                }`}
            >
              {message.content}
            </div>
          ))
        )}
      </div>

      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-gray-300 flex items-center rounded-b-3xl">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="flex-1 bg-white text-gray-600 p-2 rounded-lg focus:outline-none"
          placeholder="Nhập tin nhắn của bạn..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors"
          aria-label="Gửi tin nhắn"
        >
          <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default ChatPopup;
