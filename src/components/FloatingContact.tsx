import React, { useState } from 'react';
import { Phone, MessageSquare, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = "+8801648506538";
  const whatsappUrl = `https://wa.me/8801648506538`;

  const toggleOpen = () => setIsOpen(!isOpen);

  return (
    <div className="fixed bottom-32 right-6 z-[110]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-4 mb-4"
          >
            {/* WhatsApp Button */}
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 bg-green-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/30 active:scale-95 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageSquare className="w-6 h-6" />
            </motion.a>

            {/* Call Button */}
            <motion.a
              href={`tel:${phoneNumber}`}
              className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-600/30 active:scale-95 transition-transform"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Phone className="w-6 h-6" />
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={toggleOpen}
        className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all ${
          isOpen ? 'bg-slate-900 text-white' : 'bg-blue-600 text-white shadow-blue-600/40'
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Smartphone className="w-7 h-7" />}
      </motion.button>
    </div>
  );
};
