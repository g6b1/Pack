
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChecklistItem } from '../types.ts';
import { SUGGESTED_ITEMS, PRESET_PACKS } from '../constants.ts';

interface AddItemModalProps {
  onClose: () => void;
  onAdd: (item: Omit<ChecklistItem, 'id' | 'checked'>) => void;
  onAddMultiple: (items: Omit<ChecklistItem, 'id' | 'checked'>[]) => void;
}

const PASTEL_COLORS = [
  'bg-[#E2F0F7]', // Blue
  'bg-[#E2F7ED]', // Mint
  'bg-[#E8E2F7]', // Lavender
  'bg-[#F7E2EB]', // Rose
  'bg-[#F7F4E2]', // Lemon
  'bg-[#F7E8E2]', // Peach
  'bg-[#F1F5F9]', // Grey
];

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onAdd, onAddMultiple }) => {
  const [customLabel, setCustomLabel] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📌');

  const handleQuickAdd = () => {
    if (customLabel.trim()) {
      const randomColor = PASTEL_COLORS[Math.floor(Math.random() * PASTEL_COLORS.length)];
      onAdd({
        label: customLabel,
        subtext: 'Added just now',
        icon: selectedEmoji,
        color: randomColor
      });
      setCustomLabel('');
    }
  };

  return (
    <div className="absolute inset-0 z-[100] flex flex-col justify-end">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/10 backdrop-blur-[12px]"
      />
      
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: 'spring', damping: 35, stiffness: 300 }}
        className="relative w-full h-[88%] bg-white rounded-t-[44px] shadow-2xl flex flex-col overflow-hidden"
      >
        <div className="flex justify-center pt-4 pb-2 shrink-0">
          <div className="w-10 h-1.5 bg-slate-100 rounded-full"></div>
        </div>

        <div className="px-8 flex items-center justify-between pt-4 pb-6 shrink-0">
          <h2 className="text-2xl font-[900] tracking-tighter text-slate-900 leading-none">Add to Pack</h2>
          <button 
            onClick={onClose}
            className="size-10 rounded-full bg-slate-100 flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px] text-slate-500">close</span>
          </button>
        </div>

        <div className="px-8 flex-1 overflow-y-auto no-scrollbar pb-32">
          {/* Preset Packs Section */}
          <div className="mb-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300 mb-6">Pack Templates</h3>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2">
              {PRESET_PACKS.map((pack) => (
                <motion.button 
                  key={pack.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onAddMultiple(pack.items.map(i => ({ ...i, subtext: `${pack.name} Essential` })))}
                  className="flex flex-col items-center gap-3 shrink-0"
                >
                  <div className={`size-20 rounded-[28px] ${pack.color} flex flex-col items-center justify-center shadow-sm border-2 border-white ring-1 ring-slate-100`}>
                    <span className="text-3xl mb-1">{pack.icon}</span>
                  </div>
                  <span className="text-[12px] font-bold text-slate-600 tracking-tight">{pack.name}</span>
                </motion.button>
              ))}
            </div>
          </div>

          <div className="mb-10">
            <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300 mb-6">Quick Items</h3>
            <div className="grid grid-cols-3 gap-y-8 gap-x-4">
              {SUGGESTED_ITEMS.map((item, idx) => (
                <motion.button 
                  key={idx}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => onAdd({ ...item, subtext: 'Essential' })}
                  className="flex flex-col items-center gap-3"
                >
                  <div className={`size-16 rounded-full ${item.color} flex items-center justify-center shadow-sm ring-4 ring-white`}>
                    <span className="text-3xl select-none filter drop-shadow-sm">{item.icon}</span>
                  </div>
                  <span className="text-[13px] font-bold text-slate-600 tracking-tight">{item.label}</span>
                </motion.button>
              ))}
            </div>
          </div>
          
          <div className="mt-4">
             <h3 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-300 mb-6">Custom</h3>
             <div className="bg-slate-50 rounded-[32px] p-6 ring-1 ring-slate-100">
                <div className="flex items-center gap-4 mb-6">
                   <div className="size-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-sm border border-slate-100">
                     {selectedEmoji}
                   </div>
                   <div className="flex-1">
                      <input 
                        autoFocus
                        value={customLabel}
                        onChange={(e) => setCustomLabel(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleQuickAdd()}
                        className="w-full bg-transparent border-none focus:ring-0 text-xl font-bold text-slate-900 placeholder:text-slate-200 p-0" 
                        placeholder="Type item name..." 
                        type="text"
                      />
                   </div>
                </div>
                
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
                  {['📍', '🎒', '🔋', '🧢', '🧥', '💊', '📸', '🔦', '🥪', '💵', '📱', '🩹'].map(emoji => (
                    <button 
                      key={emoji}
                      onClick={() => setSelectedEmoji(emoji)}
                      className={`text-2xl min-w-[44px] size-11 rounded-full flex items-center justify-center transition-all shrink-0 ${selectedEmoji === emoji ? 'bg-black text-white scale-110 shadow-lg' : 'bg-white hover:bg-slate-50 border border-slate-100'}`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={handleQuickAdd}
                  disabled={!customLabel.trim()}
                  className="w-full bg-black text-white h-16 rounded-[24px] flex items-center justify-center font-black text-[17px] tracking-tight active:scale-[0.98] transition-all disabled:opacity-10 shadow-xl"
                >
                  Add to Pack
                </button>
              </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AddItemModal;
