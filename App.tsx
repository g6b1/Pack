
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_ITEMS, THEMES } from './constants.ts';
import { ChecklistItem, Theme, View } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import ThemeSelector from './components/ThemeSelector.tsx';
import AddItemModal from './components/AddItemModal.tsx';

const App: React.FC = () => {
  const [items, setItems] = useState<ChecklistItem[]>(() => {
    try {
      const saved = localStorage.getItem('checkly-items-v3');
      return saved ? JSON.parse(saved) : INITIAL_ITEMS;
    } catch (e) {
      return INITIAL_ITEMS;
    }
  });

  const [listTitle, setListTitle] = useState<string>(() => {
    return localStorage.getItem('checkly-list-title') || 'Essentials';
  });

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [activeTheme, setActiveTheme] = useState<Theme>(THEMES[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('checkly-items-v3', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('checkly-list-title', listTitle);
  }, [listTitle]);

  const resetItems = useCallback(() => {
    setItems([]);
  }, []);

  const addItem = useCallback((item: Omit<ChecklistItem, 'id' | 'checked'>) => {
    const newItem: ChecklistItem = {
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      checked: false
    };
    setItems(prev => [newItem, ...prev]);
    setIsAddModalOpen(false);
  }, []);

  const addMultipleItems = useCallback((newItems: Omit<ChecklistItem, 'id' | 'checked'>[]) => {
    const formattedItems: ChecklistItem[] = newItems.map(item => ({
      ...item,
      id: Math.random().toString(36).substring(2, 9),
      checked: false
    }));
    setItems(prev => [...formattedItems, ...prev]);
    setIsAddModalOpen(false);
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-black/5 bg-white">
      <div className={`relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl border-x border-black/[0.02] bg-gradient-to-br transition-all duration-700 ${activeTheme.gradient}`}>
        
        {/* Decorative subtle mesh */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full w-full relative z-10"
            >
              <Dashboard 
                listTitle={listTitle}
                onUpdateTitle={setListTitle}
                items={items}
                onDelete={deleteItem}
                onReset={resetItems}
                onOpenThemes={() => setCurrentView('themes')}
                onOpenAdd={() => setIsAddModalOpen(true)}
              />
            </motion.div>
          )}

          {currentView === 'themes' && (
            <motion.div
              key="themes"
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="h-full w-full relative z-10"
            >
              <ThemeSelector 
                activeTheme={activeTheme}
                onSelectTheme={(theme) => {
                  setActiveTheme(theme);
                  setCurrentView('dashboard');
                }}
                onBack={() => setCurrentView('dashboard')}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAddModalOpen && (
            <AddItemModal 
              onClose={() => setIsAddModalOpen(false)}
              onAdd={addItem}
              onAddMultiple={addMultipleItems}
            />
          )}
        </AnimatePresence>

        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-black/5 pointer-events-none z-50"></div>
      </div>
    </div>
  );
};

export default App;
