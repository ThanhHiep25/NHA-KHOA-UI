'use client'

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { login } from '@/services/auth_api';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const { t } = useTranslation();
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const res = await login(email, password);
        if (res.success) {
            // Lưu token vào localStorage hoặc cookie nếu cần
            localStorage.setItem('accessToken', res.data.accessToken);
            localStorage.setItem('refreshToken', res.data.refreshToken);
            // Đóng modal hoặc chuyển hướng
            onClose();
        } else {
            alert(res.message || 'Đăng nhập thất bại');
        }
    } catch (error) {
        alert('Đăng nhập thất bại');
    }
};

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Đăng ký với:', { email, password });
        onClose(); // Đóng pop-up sau khi gửi form
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { y: "-100vh", opacity: 0 },
        visible: { y: "0", opacity: 1, transition: { duration: 0.5, damping: 25, stiffness: 500 } },
        exit: { y: "100vh", opacity: 0 },
    };

    if (!isOpen) return null;

    return (
        <motion.div
            className="absolute w-full h-screen top-0 left-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-3xl"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose} // Đóng modal khi click ra ngoài
        >
            <motion.div
                className="bg-white p-8 rounded-lg shadow-xl w-full max-w-xl mx-4 md:mx-0 relative"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()} // Ngăn chặn sự kiện nổi bọt
            >
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close modal"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
                <AnimatePresence mode="wait">
                    {isRegistering ? (
                        <motion.div
                            key="register"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Image src="/LOGO/Logo_Horizontal_Light_1-1024x237.png.webp" alt="Logo" width={200} height={100}
                            className='mb-8 mx-auto'
                             />
                            <form onSubmit={handleRegisterSubmit} className="space-y-4">
                                {/* Form fields */}
                                <div>
                                    <label className="block text-purple-700">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full mt-1 p-3 border-b-2 border-b-yellow-600 border-gray-300 focus:outline-none"
                                        required
                                    />
                                </div>

                                 <div>
                                    <label className="block text-purple-700">{t('name')}</label>
                                    <input
                                        type="name"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full mt-1 p-3 border-b-2 border-b-yellow-600 border-gray-300 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-purple-700">{t('phone')}</label>
                                    <input
                                        type="phone"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                        className="w-full mt-1 p-3 border-b-2 border-b-yellow-600 border-gray-300 focus:outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-purple-700">{t('password')}</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full mt-1 p-3 border-b-2 border-b-yellow-600 border-gray-300 focus:outline-none"
                                        required
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md transition duration-300 hover:bg-purple-700"
                                >
                                    {t('register')}
                                </motion.button>
                            </form>
                            <button
                                onClick={() => setIsRegistering(false)}
                                className="w-full mt-4 text-center text-purple-600 font-medium hover:underline"
                            >
                                Bạn đã có tài khoản? Đăng nhập ngay
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="login "
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <Image src="/LOGO/Logo_Horizontal_Light_1-1024x237.png.webp" alt="Logo" width={200} height={100}
                            className='mb-4 mx-auto'
                            />
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                                {/* Form fields */}
                                <div>
                                    <label className="block text-purple-700">Email</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full mt-1 p-3 border-b-2 border-b-yellow-600 border-gray-300 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-purple-700">Mật khẩu</label>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full mt-1 p-3 border-b-2 border-b-yellow-600 border-gray-300 focus:outline-none"
                                        required
                                    />
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    type="submit"
                                    className="w-full bg-gradient-to-bl from-purple-500 hover:from-yellow-600 hover:to-purple-600 to-yellow-600 text-white font-semibold py-3 rounded-md transition duration-300 hover:bg-blue-700"
                                >
                                    {t('login')}
                                </motion.button>
                            </form>
                            <button
                                onClick={() => setIsRegistering(true)}
                                className="w-full mt-4 text-center text-blue-600 font-medium hover:underline"
                            >
                                Bạn chưa có tài khoản? Đăng ký ngay
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </motion.div>
    );
};

export default AuthModal;