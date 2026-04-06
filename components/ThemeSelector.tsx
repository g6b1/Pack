
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
    <div className="flex h-full flex-col pt-16 pb-10">
      <header className="flex items-center justify-between mb-8 px-8">
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="size-11 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-xl shadow-sm border border-white/40 transition-all"
        >
          <span className={`material-symbols-outlined text-[20px] ${activeTheme.textColor}`}>arrow_back_ios_new</span>
        </motion.button>
        <div className="flex flex-col items-center">
          <h1 className={`text-xl font-[900] tracking-tighter leading-none ${activeTheme.textColor}`}>Themes</h1>
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] mt-1 opacity-50 ${activeTheme.mutedColor}`}>Personalize Pack</p>
        </div>
        <div className="w-11"></div>
      </header>

      <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-6 -my-6">
        <div className="grid grid-cols-2 gap-6 pb-20">
          {THEMES.map((theme, idx) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                delay: idx * 0.04, 
                type: 'spring', 
                damping: 25, 
                stiffness: 220,
                mass: 0.8
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectTheme(theme)}
              className={`relative group cursor-pointer aspect-[4/5.5] rounded-[40px] transition-all duration-500 ${activeTheme.id === theme.id ? 'ring-4 ring-white ring-offset-4 ring-offset-black/5 shadow-2xl' : 'shadow-xl hover:shadow-2xl'}`}
            >
              {/* Theme Card Body */}
              <div className="absolute inset-0 rounded-[40px] overflow-hidden">
                {/* Theme Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.gradient}`}></div>
                
                {/* Gloss & Texture Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/20 opacity-60"></div>
                <div className="absolute inset-0 bg-gradient-mesh opacity-10"></div>
                
                {/* Mini Preview HUD */}
                <div className="absolute inset-0 p-5 flex flex-col">
                  <div className="flex-1 flex flex-col gap-2.5 opacity-30">
                    <div className={`h-2.5 w-14 rounded-full ${theme.iconBg} opacity-60`}></div>
                    <div className="flex flex-col gap-2 mt-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-7 w-full rounded-2xl bg-white/50 border border-white/30"></div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    <div className={`size-8 rounded-full ${theme.iconBg} shadow-lg flex items-center justify-center text-white ring-2 ring-white/30`}>
                      <span className="material-symbols-outlined text-[14px] font-bold">auto_awesome</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme Name Label - Positioned outside the main overflow to ensure visibility */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-[85%]">
                <div className="bg-white/80 backdrop-blur-xl py-2.5 px-4 rounded-2xl shadow-lg border border-white/50 flex items-center justify-center">
                  <p className={`${theme.textColor} font-black text-[12px] tracking-tight leading-none whitespace-nowrap`}>
                    {theme.name}
                  </p>
                </div>
              </div>

              {activeTheme.id === theme.id && (
                <motion.div 
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="absolute -top-2 -right-2 bg-white text-slate-900 size-9 rounded-full flex items-center justify-center shadow-2xl border border-black/5 z-20"
                >
                  <span className="material-symbols-outlined text-[18px] font-black">check</span>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        className="pt-6 flex justify-center"
      >
        <div className={`px-5 py-2.5 rounded-full border border-black/5 bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-[0.25em] ${activeTheme.textColor}`}>
          Scroll for more
        </div>
      </motion.div>
    </div>
  );
};

export default ThemeSelector;
