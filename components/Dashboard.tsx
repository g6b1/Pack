
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { ChecklistItem } from '../types.ts';

interface DashboardProps {
  items: ChecklistItem[];
  listTitle: string;
  onUpdateTitle: (title: string) => void;
  onDelete: (id: string) => void;
  onReset: () => void;
  onOpenThemes: () => void;
  onOpenAdd: () => void;
}

const SwipeableItem: React.FC<{
  item: ChecklistItem;
  index: number;
  onDelete: (id: string) => void;
}> = ({ item, index, onDelete }) => {
  const x = useMotionValue(0);
  const backgroundOpacity = useTransform(x, [-120, -40, 0], [1, 0.4, 0]);
  const iconScale = useTransform(x, [-120, -40, 0], [1.1, 0.9, 0.7]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 15 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, x: -200, scale: 0.9 }}
      transition={{ delay: index * 0.03, type: 'spring', damping: 25, stiffness: 300 }}
      className="relative mb-3.5 group"
    >
      {/* Remove Action Background */}
      <motion.div 
        style={{ opacity: backgroundOpacity }}
        className="absolute inset-0 bg-[#FF3B30] rounded-[22px] flex items-center justify-end px-8 z-0"
      >
        <motion.span style={{ scale: iconScale }} className="material-symbols-outlined text-white font-bold">
          delete_sweep
        </motion.span>
      </motion.div>

      {/* Main Item Card */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -140, right: 0 }}
        dragElastic={0.05}
        onDragEnd={(_, info) => {
          if (info.offset.x < -100) {
            onDelete(item.id);
          } else {
            x.set(0);
          }
        }}
        style={{ x }}
        className="relative z-10 ios-glass flex items-center p-4 rounded-[22px] active:scale-[0.98] transition-transform duration-200 cursor-grab active:cursor-grabbing item-card-shadow"
      >
        {/* Pastel Apple Contact Style Icon */}
        <div className={`flex size-12 items-center justify-center rounded-full ${item.color} mr-4 ring-2 ring-white shadow-sm overflow-hidden`}>
          <span className="text-2xl leading-none select-none filter drop-shadow-sm">{item.icon}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-bold tracking-tight text-slate-900 leading-tight">
            {item.label}
          </h3>
          <p className="text-[12px] font-semibold text-slate-400 truncate tracking-wide">
            {item.subtext}
          </p>
        </div>

        <div className="opacity-10 group-hover:opacity-20 transition-opacity">
           <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ items, listTitle, onUpdateTitle, onDelete, onReset, onOpenThemes, onOpenAdd }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(listTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditingTitle && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingTitle]);

  const handleTitleSubmit = () => {
    const finalTitle = tempTitle.trim() || 'Essentials';
    onUpdateTitle(finalTitle);
    setTempTitle(finalTitle);
    setIsEditingTitle(false);
  };

  return (
    <div className="relative flex h-full flex-col px-6">
      <header className="flex items-center pt-16 pb-10 justify-between">
        <div className="flex flex-col flex-1 mr-4">
          {isEditingTitle ? (
            <input
              ref={inputRef}
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className="text-4xl font-[900] tracking-tighter text-slate-900 leading-none bg-transparent border-none p-0 focus:ring-0 w-full"
            />
          ) : (
            <h2 
              onClick={() => setIsEditingTitle(true)}
              className="text-4xl font-[900] tracking-tighter text-slate-900 leading-none cursor-text active:opacity-70 transition-opacity"
            >
              {listTitle}
            </h2>
          )}
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mt-2">
            {items.length} {items.length === 1 ? 'item' : 'items'} in pack
          </p>
        </div>
        <button 
          onClick={onOpenThemes}
          className="size-11 flex items-center justify-center rounded-full bg-white/60 backdrop-blur-md shadow-sm border border-white active:scale-90 transition-all shrink-0"
        >
          <span className="material-symbols-outlined text-slate-600 text-[20px]">palette</span>
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-40">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <SwipeableItem 
              key={item.id} 
              item={item} 
              index={index} 
              onDelete={onDelete}
            />
          ))}
        </AnimatePresence>
        
        {items.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center pt-24 text-center px-10"
          >
            <div className="size-28 rounded-full bg-white/50 backdrop-blur-xl flex items-center justify-center mb-6 shadow-xl border border-white">
              <span className="text-6xl select-none">🎒</span>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Pack is Empty</h3>
            <p className="text-[14px] font-semibold text-slate-400 leading-relaxed">
              Everything is ready to go. Tap the button below to add more.
            </p>
          </motion.div>
        )}
      </main>

      {/* Action Bar */}
      <div className="absolute bottom-10 left-0 right-0 px-8 flex items-center justify-between pointer-events-none z-30">
        <motion.button 
          whileTap={{ scale: 0.96 }}
          onClick={onReset}
          className="h-14 px-8 rounded-full ios-glass text-slate-900 font-black text-[14px] tracking-tight pointer-events-auto shadow-lg shadow-black/5"
        >
          Clear All
        </motion.button>
        
        <motion.button 
          whileTap={{ scale: 0.92 }}
          onClick={onOpenAdd}
          className="size-16 bg-black flex items-center justify-center rounded-full shadow-2xl pointer-events-auto"
        >
          <span className="material-symbols-outlined text-white text-4xl">add</span>
        </motion.button>
      </div>

      {items.length > 0 && (
        <div className="absolute bottom-[110px] left-0 right-0 flex justify-center pointer-events-none opacity-20">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900">
            Swipe left to remove
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
