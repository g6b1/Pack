
import React from 'react';
import { motion } from 'framer-motion';
import { Theme } from '../types.ts';
import { THEMES } from '../constants.ts';

interface ThemeSelectorProps {
  activeTheme: Theme;
  onSelectTheme: (theme: Theme) => void;
  onBack: () => void;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ activeTheme, onSelectTheme, onBack }) => {
  return (
    <div className="flex h-full flex-col px-8 pt-16 pb-10">
      <header className="flex items-center justify-between mb-10">
        <button 
          onClick={onBack}
          className="size-11 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-md shadow-sm transition-all active:scale-90"
        >
          <span className="material-symbols-outlined text-[20px] text-slate-800">arrow_back_ios_new</span>
        </button>
        <h1 className="text-xl font-black tracking-tight text-slate-800">Themes</h1>
        <div className="w-11"></div>
      </header>

      <div className="grid grid-cols-2 gap-4 flex-1 overflow-y-auto no-scrollbar pb-10">
        {THEMES.map((theme) => (
          <motion.div
            key={theme.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectTheme(theme)}
            className={`relative group cursor-pointer aspect-[3/4] rounded-[32px] overflow-hidden shadow-2xl transition-all ${activeTheme.id === theme.id ? 'ring-4 ring-white ring-offset-2 ring-offset-primary/20' : ''}`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}></div>
            
            {/* Gloss Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20 opacity-40"></div>
            
            <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col gap-1">
              <div className={`size-8 rounded-full ${theme.iconBg} mb-1 shadow-lg flex items-center justify-center text-white ring-2 ring-white/30`}>
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
              </div>
              <p className={`${theme.textColor} font-black text-sm tracking-tight`}>{theme.name}</p>
            </div>

            {activeTheme.id === theme.id && (
              <div className="absolute top-4 right-4 bg-white text-primary size-8 rounded-full flex items-center justify-center shadow-xl">
                <span className="material-symbols-outlined text-[18px] font-bold">check</span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      <div className="pt-4 flex justify-center opacity-40">
        <div className="px-4 py-2 rounded-full border border-black/10 text-[11px] font-black uppercase tracking-widest text-slate-800">
          Scroll for more
        </div>
      </div>
    </div>
  );
};

export default ThemeSelector;
