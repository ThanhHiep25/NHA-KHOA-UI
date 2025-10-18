'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import http from '@/services/http';
import { toast } from 'react-toastify';

interface AppointmentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AppointmentModal: React.FC<AppointmentModalProps> = ({
    isOpen,
    onClose,
}) => {
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [activeTab, setActiveTab] = useState('consultation');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');

    interface Service {
        id: number;
        name: string;
        price?: number;
        description?: string;
        durationMinutes?: number;
    }

    interface Dentist {
        id: number;
        name: string;
        userId?: number;
        specialization?: string;
        email?: string;
        phone?: string;
        active?: boolean;
        bio?: string;
    }

    const [services, setServices] = useState<Service[]>([]);
    const [dentists, setDentists] = useState<Dentist[]>([]);
    const [serviceId, setServiceId] = useState<number | ''>('');
    const [dentistId, setDentistId] = useState<number | ''>('');

    const [consultationMethod, setConsultationMethod] = useState('Zalo');
    const [consultationContent, setConsultationContent] = useState('');

    const formatDateForBackend = (isoDate: string) => {
        if (!isoDate) return isoDate;
        // if already contains '/', assume it's already in expected format
        if (isoDate.includes('/')) return isoDate;
        const parts = isoDate.split('-');
        if (parts.length === 3) return `${parts[2]}/${parts[1]}/${parts[0]}`;
        return isoDate;
    };

    useEffect(() => {
        if (!isOpen) return;

        (async () => {
            try {
                const res = await http.get('/api/services');
                const json = res.data;
                if (json && Array.isArray(json.data)) setServices(json.data);
            } catch (err) {
                console.error('Failed to load services', err);
            }
        })();

        (async () => {
            try {
                const res = await http.get('/api/dentists');
                const json = res.data;
                if (json && Array.isArray(json.data)) setDentists(json.data);
            } catch (err) {
                console.error('Failed to load dentists', err);
            }
        })();
    }, [isOpen]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            setFeedback(null);

            if (activeTab === 'consultation') {
                const payload = {
                    fullName: name,
                    email,
                    phone,
                    method: consultationMethod,
                    content: consultationContent || notes,
                };

                const res = await http.post('/api/public/consultation', payload);
                const json = res.data;
                if (json && json.success) {
                    setFeedback({ type: 'success', message: json.message || 'Gửi tư vấn thành công' });
                    toast.success('Gửi tư vấn thành công', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                    });
                    setName('');
                    setEmail('');
                    setPhone('');
                    setConsultationMethod('Zalo');
                    setConsultationContent('');
                    setNotes('');
                    //  setTimeout(() => onClose(), 1200);
                } else {
                    setFeedback({ type: 'error', message: json?.message || 'Gửi tư vấn thất bại' });
                }
                return;
            }

            if (activeTab === 'appointment') {
                const payload = {
                    fullName: name,
                    email,
                    phone,
                    serviceId: Number(serviceId) || 0,
                    // convert yyyy-MM-dd -> dd/MM/yyyy for backend
                    date: formatDateForBackend(date),
                    time,
                    dentistId: Number(dentistId) || 0,
                    notes,
                };

                const res = await http.post('/api/public/quick-booking', payload);
                const json = res.data;
                if (json && json.success) {
                    setFeedback({ type: 'success', message: json.message || 'Đặt hẹn thành công' });
                    //setTimeout(() => onClose(), 1200);
                } else {
                    setFeedback({ type: 'error', message: json?.message || 'Đặt hẹn thất bại' });
                }
                return;
            }
        } catch (err) {
            console.error('Submit error', err);
            setFeedback({ type: 'error', message: 'Lỗi mạng hoặc máy chủ' });
        } finally {
            setLoading(false);
        }
    };

    const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
    const modalVariants = {
        hidden: { y: '50vh', opacity: 0 },
        visible: { y: '0', opacity: 1, transition: { duration: 0.4, damping: 25, stiffness: 500 } },
        exit: { y: '100vh', opacity: 0 },
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                variants={backdropVariants}
                initial="hidden"           
                animate="visible"
                exit="hidden"
                onClick={onClose}
            >
                <motion.div
                    className="bg-white p-8 rounded-3xl shadow-xl w-full md:max-w-4xl max-w-lg mx-auto relative h-full md:h-auto"
                    variants={modalVariants}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-8 cursor-pointer text-gray-400 hover:text-white hover:bg-gray-400 backdrop-blur-2xl rounded-full transition-colors flex items-center gap-2 p-2"
                        aria-label="Close modal"
                    >
                        <svg className="w-6 h-6 hover:bg-red-500 rounded-2xl " fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                        Đóng
                    </button>

                    {/* Header Tab */}
                    <div className="flex justify-center mb-6 mt-5 border-b border-gray-200">
                        <button
                            className={`py-2 px-4 font-semibold w-full relative ${activeTab === 'consultation' ? 'text-white bg-purple-500 rounded-md' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('consultation')}
                        >
                            Tư vấn
                            {activeTab === 'consultation' && <motion.div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-purple-600 rounded-t-lg" layoutId="underline" />}
                        </button>

                        <button
                            className={`py-2 px-4 font-semibold w-full relative ${activeTab === 'appointment' ? 'text-white bg-purple-500 rounded-md' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => setActiveTab('appointment')}
                        >
                            Đặt lịch hẹn
                            {activeTab === 'appointment' && <motion.div className="absolute bottom-[-2px] left-0 right-0 h-1 bg-purple-600 rounded-t-lg" layoutId="underline" />}
                        </button>
                    </div>

                    <AnimatePresence mode="wait">
                        {activeTab === 'consultation' && (
                            <motion.form key="consultation" onSubmit={handleSubmit} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }} className="space-y-4 overflow-y-auto h-[70vh] scrollbar-hide overflow-x-hidden">
                                <div className="flex items-center gap-1">
                                    <motion.img src="/IMGLADING/Camtudental-doctor-holding-phone-to-support-customers-797x1024.png" alt="Image" className='w-20 h-40 object-cover' />
                                    <h1 className='md:text-5xl text-5xl roboto-900 bg-clip-text bg-gradient-to-bl from-purple-600 via-yellow-400 to-purple-600 text-transparent mb-4'>Tư vấn dịch vụ nha khoa</h1>
                                </div>

                                <div className="md:flex md:items-center md:justify-between md:gap-10">
                                    <div className="mt-5 md:w-full">
                                        <label className="block text-purple-700">Họ và tên</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-3 border-b border-b-yellow-400 border-gray-300 focus:outline-none" required />
                                    </div>
                                    <div className="mt-5 md:w-full">
                                        <label className="block text-purple-700">Email</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-3 border-b border-b-yellow-400 border-gray-300 focus:outline-none" required />
                                    </div>
                                </div>

                                <div className="mt-5 md:flex md:items-center md:justify-between md:gap-10">
                                    <div className="mt-5 md:w-full">
                                        <label className="block text-purple-700">Số điện thoại</label>
                                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 p-3 border-b border-b-yellow-400 border-gray-300 focus:outline-none" required />
                                    </div>

                                    <div className="md:w-full mt-5">
                                        <h3 className="text-purple-700 mb-4">Phương thức tư vấn</h3>
                                        <div className="w-full flex flex-wrap gap-4 items-center">
                                            {/* Tiêu đề cho các tùy chọn radio */}


                                            {/* Nhóm các radio buttons */}
                                            <div className="flex flex-wrap gap-4">
                                                {/* Radio button cho Zalo */}
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="consultationMethod"
                                                        value="Zalo"
                                                        checked={consultationMethod === "Zalo"}
                                                        onChange={(e) => setConsultationMethod(e.target.value)}
                                                        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                                    />
                                                    <span className="text-yellow-500">Zalo</span>
                                                </label>

                                                {/* Radio button cho Hotline */}
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="consultationMethod"
                                                        value="Hotline"
                                                        checked={consultationMethod === "Hotline"}
                                                        onChange={(e) => setConsultationMethod(e.target.value)}
                                                        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                                    />
                                                    <span className="text-yellow-500">Hotline</span>
                                                </label>

                                                {/* Radio button cho Email */}
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="consultationMethod"
                                                        value="Email"
                                                        checked={consultationMethod === "Email"}
                                                        onChange={(e) => setConsultationMethod(e.target.value)}
                                                        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                                    />
                                                    <span className="text-yellow-500">Email</span>
                                                </label>

                                                {/* Radio button cho Phone */}
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="consultationMethod"
                                                        value="Phone"
                                                        checked={consultationMethod === "Phone"}
                                                        onChange={(e) => setConsultationMethod(e.target.value)}
                                                        className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                                                    />
                                                    <span className="text-yellow-500">Phone</span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5">
                                    <label className="block text-purple-700">Nội dung tư vấn</label>
                                    <textarea value={consultationContent || notes} onChange={(e) => { setConsultationContent(e.target.value); setNotes(e.target.value); }} rows={4} className="w-full mt-1 p-3 border border-yellow-400 rounded-2xl focus:outline-none " />
                                </div>

                                {feedback && <div className={`p-3 rounded-md ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{feedback.message}</div>}

                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md transition duration-300 hover:bg-purple-700" disabled={loading}>
                                    {loading ? 'Đang gửi...' : 'Gửi yêu cầu tư vấn'}
                                </motion.button>
                            </motion.form>
                        )}

                        {activeTab === 'appointment' && (
                            <motion.form key="appointment" onSubmit={handleSubmit} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.3 }} className="space-y-4 overflow-y-auto h-[70vh] scrollbar-hide overflow-x-hidden">
                                <div className="flex items-center gap-1">
                                    <motion.img src="/IMGLADING/Camtudental-doctor-holding-phone-to-support-customers-797x1024.png" alt="Image" className='w-20 h-40 object-cover' />
                                    <h1 className='md:text-5xl text-5xl roboto-900 bg-clip-text bg-gradient-to-bl from-purple-600 via-yellow-400 to-purple-600 text-transparent mb-4'>Vui lòng điền thông tin đặt hẹn</h1>
                                </div>

                                <div className="md:flex md:items-center md:justify-between md:gap-10">
                                    <div className="md:w-full">
                                        <label className="block text-purple-700">Họ và tên</label>
                                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 p-3 border-b-2 border-b-yellow-400 border-gray-300 focus:outline-none" required />
                                    </div>
                                    <div className="md:w-full">
                                        <label className="block text-purple-700">Email</label>
                                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 p-3 border-b-2 border-b-yellow-400 border-gray-300 focus:outline-none" required />
                                    </div>
                                </div>

                                <div className="md:flex md:items-center md:justify-between md:gap-10">
                                    <div className="md:w-full">
                                        <label className="block text-purple-700">Số điện thoại</label>
                                        <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full mt-1 p-3 border-b-2 border-b-yellow-400 border-gray-300 focus:outline-none" required />
                                    </div>

                                    <div className="md:w-full">
                                        <h3 className="text-purple-700 mb-4">Chọn dịch vụ</h3>
                                        <select value={serviceId} onChange={(e) => setServiceId(e.target.value === '' ? '' : Number(e.target.value))} 
                                        className="w-full p-3 rounded-md border border-yellow-400 focus:outline-none" required>
                                            <option value="">Chọn dịch vụ</option>
                                            {services.map((s) => <option key={s.id} value={s.id}>{s.name}{s.price ? ` - $${s.price}` : ''}</option>)}
                                        </select>
                                    </div>

                                </div>

                                <div className="md:flex md:items-center md:justify-between md:gap-10">
                                    <div className="md:w-full">
                                        <h3 className="text-purple-700 mb-4">Chọn nha sĩ</h3>
                                        <select value={dentistId} onChange={(e) => setDentistId(e.target.value === '' ? '' : Number(e.target.value))}
                                            className="w-full p-3 rounded-md border border-yellow-400 focus:outline-none"
                                            required>
                                            <option value="">Chọn nha sĩ</option>
                                            {dentists.map((d) => <option key={d.id} value={d.id}>{d.name}{d.specialization ? ` - ${d.specialization}` : ''}</option>)}
                                        </select>
                                    </div>

                                    <div className="md:w-full">
                                        <h3 className="text-purple-700 mb-4">Phương thức tư vấn</h3>
                                        <div className="w-full flex flex-wrap gap-4">
                                            <div className="flex items-center gap-2"><input type="checkbox" name="rangsu" id="rangsu" className="text-purple-600" value={""} /><label className="block text-yellow-500">Răng Sứ</label></div>
                                            <div className="flex items-center gap-2"><input type="checkbox" name="implant" id="implant" className="text-purple-600" value={""} /><label className="block text-yellow-500">Implant</label></div>
                                            <div className="flex items-center gap-2"><input type="checkbox" name="general" id="general" className="text-purple-600" value={""} /><label className="block text-yellow-500">Tổng quát/Vệ sinh răng</label></div>
                                            <div className="flex items-center gap-2"><input type="checkbox" name="whitening" id="whitening" className="text-purple-600" value={""} /><label className="block text-yellow-500">Tẩy trắng</label></div>
                                            <div className="flex items-center gap-2"><input type="checkbox" name="other" id="other" className="text-purple-600" value={""} /><label className="block text-yellow-500">Khác</label></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-purple-700">Ngày</label>
                                        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-1 p-3 border-b-2 border-b-yellow-400 border-gray-300 focus:outline-none" required />
                                    </div>
                                    <div>
                                        <label className="block text-purple-700">Giờ</label>
                                        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className="w-full mt-1 p-3 border-b-2 border-b-yellow-400 border-gray-300 focus:outline-none" required />
                                    </div>
                                </div>

                                {feedback && <div className={`p-3 rounded-md ${feedback.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{feedback.message}</div>}

                                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="submit" className="w-full mt-10 bg-purple-600 text-white font-semibold py-3 rounded-md transition duration-300 hover:bg-purple-700" disabled={loading}>
                                    {loading ? 'Đang gửi...' : 'Gửi yêu cầu hẹn'}
                                </motion.button>
                            </motion.form>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AppointmentModal;
