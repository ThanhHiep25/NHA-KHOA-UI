'use client'

import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../languageSwitcher/LanguageSwitcher";
import AuthModal from "../auth/AuthForms";


// Simulate user authentication and data
interface User {
    name: string;
    avatarUrl: string;
}

const menuItems = [
    { labelKey: "Home", path: "/" },
    { labelKey: "About", path: "/pages/about" },
    {
        labelKey: "Services",
        path: "",
        submenuItems: [
            { labelKey: "cosmetic_porcelain_teeth", path: "" },
            { labelKey: "porcelain_veneer", path: "" },
            { labelKey: "invisalign_orthodontics", path: "" },
            { labelKey: "single_implant", path: "" },
            { labelKey: "full_arch_implant", path: "" },
            { labelKey: "in_office_zoom_whitening", path: "" },
            { labelKey: "periodontal_treatment", path: "" },
        ],
    },
    {
        labelKey: "Pricing",
        path: "",
        submenuItems: [
            { labelKey: "dental_exam_pricing", path: "" },
            { labelKey: "veneer_porcelain_pricing", path: "" },
            { labelKey: "minor_surgery_pricing", path: "" },
            { labelKey: "orthodontic_pricing", path: "" },
            { labelKey: "children_dental_pricing", path: "" },
            { labelKey: "implant_surgery_pricing", path: "" },
            { labelKey: "fixed_removable_prosthetics_pricing", path: "" },
        ],
    },
    { labelKey: "Contact", path: "/page/contact" },
];

const Menu: React.FC = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Thay đổi thành false để ban đầu hiển thị nút Đăng nhập
    const [user, setUser] = useState<User | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false); // Thêm trạng thái để kiểm soát modal
    
    const router = useRouter();
    const dropdownTimerRef = useRef<NodeJS.Timeout | null>(null);
    const { t } = useTranslation();


    const handleNavigation = (path: string) => {
        router.push(path);
        setIsMenuOpen(false);
        setIsLoggedIn(false);
        setUser(null);
    };

    const handleMouseEnter = (label: string) => {
        if (dropdownTimerRef.current) {
            clearTimeout(dropdownTimerRef.current);
        }
        setActiveDropdown(label);
    };

    const handleMouseLeave = () => {
        dropdownTimerRef.current = setTimeout(() => {
            setActiveDropdown(null);
        }, 200);
    };

    const handleMobileClick = (item: typeof menuItems[0]) => {
        if (item.submenuItems) {
            setActiveDropdown(activeDropdown === item.labelKey ? null : item.labelKey);
        } else {
            handleNavigation(item.path);
        }
    };

    return (
        <div className="h-20 flex md:justify-center justify-between md:gap-60 items-center p-3 sticky top-0 z-50 text-gray-600 bg-white backdrop-blur-md shadow-lg">
            {/* ... Phần code logo và menu hiện có ... */}
            <div className="flex items-center gap-2 justify-center ml-3 cursor-pointer">
                <Link href="/page/home">
                    <div className="flex items-center gap-2 justify-center">
                        <Image
                            src="/LOGO/Logo_Horizontal_Light_1-1024x237.png.webp"
                            width={200}
                            height={42}
                            className="h-10"
                            alt="logo"
                            priority
                        />
                    </div>
                </Link>
            </div>
            
            {/* Menu trên Desktop */}
            <div className="hidden md:flex items-center justify-center gap-4 mr-10">
                {menuItems.map((item, i) => (
                    <div
                        key={item.labelKey}
                        className="relative"
                        onMouseEnter={() => handleMouseEnter(item.labelKey)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <Link href={item.path} className="h-full">
                            <motion.div
                                variants={{
                                    hidden: { opacity: 0, x: "100%" },
                                    animate: { opacity: 1, x: 0 },
                                    hover: { scale: 1.05 },
                                    tap: { scale: 0.9 },
                                }}
                                className="h-full font-bold text-lg px-4 py-1 rounded-lg relative overflow-hidden hover:text-white
                                hover:bg-gray-400/40 text-gray-400
                                bg-transparent transition-colors duration-200"
                                initial="hidden"
                                animate="animate"
                                whileHover="hover"
                                whileTap="tap"
                                custom={i}
                            >
                                {t(item.labelKey)}
                            </motion.div>
                        </Link>
                        
                        {item.submenuItems && activeDropdown === item.labelKey && (
                            <motion.div
                                onMouseEnter={() => handleMouseEnter(item.labelKey)}
                                className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-md p-2 w-70 z-50 flex flex-col items-start"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {item.submenuItems.map((subItem) => (
                                    <Link href={subItem.path} key={subItem.labelKey} className="w-full">
                                        <div className="w-full text-left py-4 px-4 hover:bg-gray-100 rounded-md transition-colors duration-200 cursor-pointer">
                                            {t(subItem.labelKey)}
                                        </div>
                                    </Link>
                                ))}
                            </motion.div>
                        )}
                    </div>
                ))}
                
                {/* Authentication buttons on Desktop */}
                <div className="flex items-center gap-4">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-2 cursor-pointer">
                            <Image
                                src={user?.avatarUrl || '/images/default-avatar.jpg'}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="rounded-full border-2 border-purple-500"
                            />
                            <span className="font-semibold text-gray-700 hidden lg:block">{user?.name}</span>
                        </div>
                    ) : (
                        <motion.button
                            onClick={() => setShowAuthModal(true)} // Thêm onClick để mở modal
                            whileTap={{ scale: 0.95 }}
                            className="text-lg font-bold text-white py-2 px-4 rounded-lg
                            bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                        >
                            {t('login')}
                        </motion.button>
                    )}
                    <LanguageSwitcher />
                </div>
            </div>

            {/* Hamburger cho Mobile */}
            <div className="md:hidden mr-3">
                <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label="Toggle menu"
                >
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                        )}
                    </svg>
                </button>
            </div>
            
            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={{
                            hidden: { opacity: 0, x: "100%" },
                            visible: { opacity: 1, x: 0 },
                            exit: { opacity: 0, x: "100%" },
                        }}
                        className="fixed top-20 left-0 w-full z-40 flex flex-col items-center justify-center space-y-8 md:hidden bg-black/80 h-[calc(100vh-80px)]"
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        {menuItems.map((item, i) => (
                            <div key={item.labelKey} className="w-full text-center">
                                <motion.button
                                    whileTap={{ scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="text-lg font-bold text-white py-2 w-full text-center hover:bg-white hover:text-black transition-colors duration-300"
                                    initial="hidden"
                                    animate="visible"
                                    custom={i}
                                    onClick={() => handleMobileClick(item)}
                                >
                                    {t(item.labelKey)}
                                </motion.button>
                                
                                <AnimatePresence>
                                    {item.submenuItems && activeDropdown === item.labelKey && (
                                        <motion.div
                                            className="flex flex-col items-center w-full mt-2"
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3, type: "tween" }}
                                        >
                                            {item.submenuItems.map((subItem) => (
                                                <motion.div
                                                    key={subItem.labelKey}
                                                    initial={{ opacity: 0, y: -10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="w-full"
                                                >
                                                    <Link href={subItem.path}>
                                                        <motion.button
                                                            whileTap={{ scale: 0.95 }}
                                                            className="text-sm font-light text-gray-300 py-2 w-full text-center hover:bg-gray-800 hover:text-white transition-colors duration-300"
                                                            onClick={() => setIsMenuOpen(false)}
                                                        >
                                                            {t(subItem.labelKey)}
                                                        </motion.button>
                                                    </Link>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}

                        {/* Authentication buttons on Mobile */}
                        <div className="flex flex-col items-center justify-center mt-8 space-y-4">
                            {isLoggedIn ? (
                                <div className="flex flex-col items-center gap-2 cursor-pointer">
                                    <Image
                                        src={user?.avatarUrl || '/images/default-avatar.jpg'}
                                        alt="User Avatar"
                                        width={60}
                                        height={60}
                                        className="rounded-full border-2 border-purple-500"
                                    />
                                    <span className="font-semibold text-white">{user?.name}</span>
                                </div>
                            ) : (
                                <motion.button
                                    onClick={() => { setShowAuthModal(true); setIsMenuOpen(false); }}
                                    whileTap={{ scale: 0.95 }}
                                    className="text-lg font-bold text-white py-2 px-4 rounded-lg w-full
                                    bg-blue-600 hover:bg-blue-700 transition-colors duration-300"
                                >
                                    {t('login')}
                                </motion.button>
                            )}
                            <LanguageSwitcher />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
        </div>
    );
};

export default Menu;