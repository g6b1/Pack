
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence, Reorder, useDragControls, animate } from 'framer-motion';
import { ChecklistItem, Theme } from '../types.ts';

interface DashboardProps {
  items: ChecklistItem[];
  listTitle: string;
  activeTheme: Theme;
  onUpdateTitle: (title: string) => void;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onReorder: (newItems: ChecklistItem[]) => void;
  onEdit: (item: ChecklistItem) => void;
  onReset: () => void;
  onOpenThemes: () => void;
  onOpenAdd: () => void;
  onOpenShare: () => void;
}

const SwipeableItem: React.FC<{
  item: ChecklistItem;
  activeTheme: Theme;
  onDelete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onEdit: (item: ChecklistItem) => void;
  isReorderable?: boolean;
}> = ({ item, activeTheme, onDelete, onTogglePin, onEdit, isReorderable = true }) => {
  const x = useMotionValue(0);
  const dragControls = useDragControls();
  const [isDragging, setIsDragging] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  
  // Transforms for swipe actions
  const deleteOpacity = useTransform(x, [-120, -40, 0], [1, 0.4, 0]);
  const deleteScale = useTransform(x, [-120, -40, 0], [1.1, 0.9, 0.7]);
  
  const pinOpacity = useTransform(x, [0, 40, 120], [0, 0.4, 1]);
  const pinScale = useTransform(x, [0, 40, 120], [0.7, 0.9, 1.1]);
  const pinRotate = useTransform(x, [0, 120], [0, 15]);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const isLongPressActive = useRef(false);

  const handlePointerDown = (event: React.PointerEvent) => {
    if (!isReorderable || Math.abs(x.get()) > 5) return;
    
    isLongPressActive.current = false;
    longPressTimer.current = setTimeout(() => {
      isLongPressActive.current = true;
      setIsDragging(true);
      x.set(0);
      dragControls.start(event);
    }, 500);
  };

  const handlePointerUp = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleDragStart = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleClick = () => {
    if (Math.abs(x.get()) > 5 || isLongPressActive.current || isDragging) return;
    
    setIsClicked(true);
    setTimeout(() => {
      onEdit(item);
      setIsClicked(false);
    }, 200);
  };

  const springConfig = { type: "spring", damping: 25, stiffness: 300, mass: 0.8 };

  const content = (
    <div className="relative mb-3.5 group">
      {/* Swipe Actions Background */}
      <div className="absolute inset-0 rounded-[22px] overflow-hidden pointer-events-none">
        {/* Delete Action (Left Swipe) */}
        <motion.div 
          style={{ opacity: deleteOpacity }}
          className="absolute inset-0 bg-[#FF3B30] flex items-center justify-end px-8"
        >
          <motion.span style={{ scale: deleteScale }} className="material-symbols-outlined text-white font-bold">
            delete_sweep
          </motion.span>
        </motion.div>

        {/* Pin Action (Right Swipe) */}
        <motion.div 
          style={{ opacity: pinOpacity }}
          className="absolute inset-0 bg-[#FFD60A] flex items-center justify-start px-8"
        >
          <motion.span style={{ scale: pinScale, rotate: pinRotate }} className="material-symbols-outlined text-slate-900 font-bold">
            {item.pinned ? 'keep_off' : 'keep'}
          </motion.span>
        </motion.div>
      </div>

      {/* Main Item Card */}
      <motion.div
        drag={isDragging ? false : "x"}
        dragConstraints={{ left: -140, right: 140 }}
        dragElastic={0.05}
        onDragStart={handleDragStart}
        onDragEnd={(_, info) => {
          if (isDragging) return;
          if (info.offset.x < -100) {
            onDelete(item.id);
          } else {
            if (info.offset.x > 100) {
              onTogglePin(item.id);
            }
            animate(x, 0, { type: "spring", bounce: 0.2, duration: 0.5 });
          }
        }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onClick={handleClick}
        animate={{ 
          scale: isClicked ? 0.94 : (isDragging ? 1.02 : 1),
          backgroundColor: isClicked ? 'rgba(255, 255, 255, 0.6)' : 'rgba(255, 255, 255, 0)',
          boxShadow: isDragging ? "0 20px 40px rgba(0,0,0,0.12)" : "0 4px 12px rgba(0,0,0,0.05)"
        }}
        transition={springConfig}
        style={{ x }}
        className={`relative z-10 ios-glass flex items-center p-4 rounded-[22px] cursor-grab active:cursor-grabbing border transition-colors duration-200 ${item.pinned ? 'border-white/60 bg-white/40' : 'border-white/20'}`}
      >
        <div className="relative mr-4">
          <div className={`flex size-12 items-center justify-center rounded-full ${item.color} ring-2 ring-white shadow-sm overflow-hidden`}>
            <span className="text-2xl leading-none select-none filter drop-shadow-sm">{item.icon}</span>
          </div>
          {item.pinned && (
            <motion.div 
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute -top-1 -right-1 z-20"
            >
              <span className={`material-symbols-outlined text-[20px] ${activeTheme.accentColor} fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)] leading-none select-none`}>star</span>
            </motion.div>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className={`text-[17px] font-bold tracking-tight leading-tight ${activeTheme.textColor}`}>
            {item.label}
          </h3>
          <p className={`text-[12px] font-bold truncate tracking-wide opacity-80 ${activeTheme.mutedColor}`}>
            {item.subtext}
          </p>
        </div>

        {isReorderable && (
          <div className={`opacity-10 group-hover:opacity-30 transition-opacity ${activeTheme.textColor}`}>
             <span className="material-symbols-outlined text-[18px]">drag_indicator</span>
          </div>
        )}
      </motion.div>
    </div>
  );

  const itemTransition = { 
    type: 'spring', 
    damping: 28, 
    stiffness: 260,
    mass: 0.8
  };

  if (!isReorderable) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        transition={itemTransition}
      >
        {content}
      </motion.div>
    );
  }

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      onDragEnd={() => setIsDragging(false)}
      transition={itemTransition}
    >
      {content}
    </Reorder.Item>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ items, listTitle, activeTheme, onUpdateTitle, onDelete, onTogglePin, onReorder, onEdit, onReset, onOpenThemes, onOpenAdd, onOpenShare }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [tempTitle, setTempTitle] = useState(listTitle);
  const inputRef = useRef<HTMLInputElement>(null);

  const pinnedItems = items.filter(i => i.pinned);
  const unpinnedItems = items.filter(i => !i.pinned);

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

  const handleReorderUnpinned = (newUnpinned: ChecklistItem[]) => {
    onReorder([...pinnedItems, ...newUnpinned]);
  };

  return (
    <div className="relative flex h-full flex-col">
      <header className="flex items-center pt-16 pb-10 justify-between px-6">
        <div className="flex flex-col flex-1 mr-4">
          {isEditingTitle ? (
            <input
              ref={inputRef}
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
              className={`text-4xl font-[900] tracking-tighter leading-none bg-transparent border-none p-0 focus:ring-0 w-full ${activeTheme.textColor}`}
            />
          ) : (
            <h2 
              onClick={() => setIsEditingTitle(true)}
              className={`text-4xl font-[900] tracking-tighter leading-none cursor-text active:opacity-70 transition-opacity ${activeTheme.textColor}`}
            >
              {listTitle}
            </h2>
          )}
          <p className={`text-[11px] font-black uppercase tracking-[0.25em] mt-2 ${activeTheme.accentColor} opacity-70`}>
            {items.length} {items.length === 1 ? 'item' : 'items'} in pack
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={onOpenShare}
            className="size-11 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-xl shadow-sm border border-white/40 active:scale-90 transition-all shrink-0"
          >
            <span className={`material-symbols-outlined text-[22px] ${activeTheme.textColor}`}>qr_code_2</span>
          </button>
          
          <button 
            onClick={onOpenThemes}
            className="size-11 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-xl shadow-sm border border-white/40 active:scale-90 transition-all shrink-0"
          >
            <span className={`material-symbols-outlined text-[20px] ${activeTheme.textColor}`}>palette</span>
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar pb-40 px-6">
        <AnimatePresence mode="popLayout">
          {pinnedItems.map((item) => (
            <SwipeableItem 
              key={item.id} 
              item={item} 
              activeTheme={activeTheme}
              onDelete={onDelete}
              onTogglePin={onTogglePin}
              onEdit={onEdit}
              isReorderable={false}
            />
          ))}
        </AnimatePresence>

        <Reorder.Group axis="y" values={unpinnedItems} onReorder={handleReorderUnpinned} className="overflow-visible">
          <AnimatePresence mode="popLayout">
            {unpinnedItems.map((item) => (
              <SwipeableItem 
                key={item.id} 
                item={item} 
                activeTheme={activeTheme}
                onDelete={onDelete}
                onTogglePin={onTogglePin}
                onEdit={onEdit}
              />
            ))}
          </AnimatePresence>
        </Reorder.Group>
        
        {items.length === 0 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="flex flex-col items-center justify-center pt-24 text-center px-10"
          >
            <div className="size-28 rounded-full bg-white/40 backdrop-blur-2xl flex items-center justify-center mb-6 shadow-xl border border-white/50">
              <span className="text-6xl select-none">🎒</span>
            </div>
            <h3 className={`text-2xl font-black mb-2 tracking-tight ${activeTheme.textColor}`}>Pack is Empty</h3>
            <p className={`text-[14px] font-bold leading-relaxed opacity-70 ${activeTheme.mutedColor}`}>
              Everything is ready to go. Tap the button below to add more.
            </p>
          </motion.div>
        )}
      </main>

      {/* Bottom Blur Fade Overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/20 via-white/10 to-transparent backdrop-blur-[2px] pointer-events-none z-20" />

      {/* Action Bar */}
      <div className="absolute bottom-10 left-0 right-0 px-8 flex items-center justify-between pointer-events-none z-30">
        <motion.button 
          whileTap={{ scale: 0.94 }}
          onClick={onReset}
          className="h-14 px-8 rounded-full ios-glass font-black text-[14px] tracking-tight pointer-events-auto shadow-lg shadow-black/5 border border-white/20"
          style={{ color: activeTheme.textColor.replace('text-', '') }}
        >
          <span className={activeTheme.textColor}>Clear All</span>
        </motion.button>
        
        <motion.button 
          whileTap={{ scale: 0.92 }}
          onClick={onOpenAdd}
          className="size-16 bg-white/30 backdrop-blur-3xl flex items-center justify-center rounded-full shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] border border-white/40 pointer-events-auto"
        >
          <span className={`material-symbols-outlined text-4xl ${activeTheme.textColor}`}>add</span>
        </motion.button>
      </div>

      {items.length > 0 && items.length <= 3 && (
        <div className="absolute bottom-[110px] left-0 right-0 flex justify-center pointer-events-none opacity-20">
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${activeTheme.textColor}`}>
            Swipe right to pin
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
