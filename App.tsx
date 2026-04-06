
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { INITIAL_ITEMS, THEMES } from './constants.ts';
import { ChecklistItem, Theme, View } from './types.ts';
import Dashboard from './components/Dashboard.tsx';
import ThemeSelector from './components/ThemeSelector.tsx';
import AddItemModal from './components/AddItemModal.tsx';
import ShareModal from './components/ShareModal.tsx';

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
  const [activeTheme, setActiveTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('checkly-theme');
    if (saved) {
      const theme = THEMES.find(t => t.id === saved);
      if (theme) return theme;
    }
    return THEMES.find(t => t.id === 'silk-grey') || THEMES[0];
  });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ChecklistItem | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('checkly-items-v3', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('checkly-list-title', listTitle);
  }, [listTitle]);

  useEffect(() => {
    localStorage.setItem('checkly-theme', activeTheme.id);
  }, [activeTheme]);

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

  const updateItem = useCallback((id: string, updates: Partial<ChecklistItem>) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...updates } : item));
    setIsAddModalOpen(false);
    setEditingItem(null);
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

  const togglePin = useCallback((id: string) => {
    setItems(prev => {
      const itemIndex = prev.findIndex(item => item.id === id);
      if (itemIndex === -1) return prev;
      
      const item = prev[itemIndex];
      const isPinning = !item.pinned;
      const updatedItem = { ...item, pinned: isPinning };
      
      const newItems = [...prev];
      newItems.splice(itemIndex, 1);
      
      if (isPinning) {
        return [updatedItem, ...newItems];
      } else {
        return [...newItems, updatedItem];
      }
    });
  }, []);

  const handleReorder = useCallback((newItems: ChecklistItem[]) => {
    setItems(newItems);
  }, []);

  const handleImportList = useCallback((title: string, newItems: ChecklistItem[]) => {
    if (confirm(`Import pack "${title}"? This will add to your current pack.`)) {
      setListTitle(title);
      // Generate new IDs to avoid collisions
      const itemsWithNewIds = newItems.map(item => ({
        ...item,
        id: Math.random().toString(36).substring(2, 9),
        checked: false
      }));
      setItems(prev => [...itemsWithNewIds, ...prev]);
      setIsShareModalOpen(false);
    }
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-black/5 bg-white">
      <div className={`relative flex h-screen w-full flex-col overflow-hidden max-w-md mx-auto shadow-2xl border-x border-black/[0.02] bg-gradient-to-br transition-all duration-700 ${activeTheme.gradient}`}>
        
        {/* Decorative subtle mesh */}
        <div className="absolute inset-0 bg-gradient-mesh opacity-50 pointer-events-none"></div>

        <AnimatePresence initial={false}>
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
                activeTheme={activeTheme}
                onDelete={deleteItem}
                onTogglePin={togglePin}
                onReorder={handleReorder}
                onEdit={(item) => {
                  setEditingItem(item);
                  setIsAddModalOpen(true);
                }}
                onReset={resetItems}
                onOpenThemes={() => setCurrentView('themes')}
                onOpenAdd={() => {
                  setEditingItem(null);
                  setIsAddModalOpen(true);
                }}
                onOpenShare={() => setIsShareModalOpen(true)}
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
              onClose={() => {
                setIsAddModalOpen(false);
                setEditingItem(null);
              }}
              onAdd={addItem}
              onUpdate={updateItem}
              onAddMultiple={addMultipleItems}
              editingItem={editingItem}
              activeTheme={activeTheme}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isShareModalOpen && (
            <ShareModal 
              listTitle={listTitle}
              items={items}
              onClose={() => setIsShareModalOpen(false)}
              onImport={handleImportList}
            />
          )}
        </AnimatePresence>

        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 rounded-full bg-black/5 pointer-events-none z-50"></div>
      </div>
    </div>
  );
};

export default App;
