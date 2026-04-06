
import { ChecklistItem, Theme } from './types.ts';

export const INITIAL_ITEMS: ChecklistItem[] = [
  {
    id: '1',
    label: 'AirPods',
    subtext: 'Check battery',
    icon: '🎧',
    color: 'bg-[#E2F0F7]', // Pastel Blue
    checked: false,
  },
  {
    id: '2',
    label: 'Wallet',
    subtext: 'Cards inside',
    icon: '💳',
    color: 'bg-[#E2F7ED]', // Pastel Mint
    checked: false,
  },
  {
    id: '3',
    label: 'Keys',
    subtext: 'Door & Gate',
    icon: '🔑',
    color: 'bg-[#F7F4E2]', // Pastel Lemon
    checked: false,
  },
  {
    id: '4',
    label: 'Water',
    subtext: 'Stay hydrated',
    icon: '💧',
    color: 'bg-[#E8E2F7]', // Pastel Lavender
    checked: false,
  },
];

export const PRESET_PACKS = [
  {
    id: 'hiking',
    name: 'Hiking',
    icon: '🥾',
    color: 'bg-[#E2F7ED]',
    items: [
      { label: 'Hiking Boots', icon: '🥾', color: 'bg-[#F7F4E2]' },
      { label: 'Water Bottle', icon: '💧', color: 'bg-[#E2F0F7]' },
      { label: 'Trail Map', icon: '🗺️', color: 'bg-[#E2F7ED]' },
      { label: 'Granola Bars', icon: '🥨', color: 'bg-[#F7E8E2]' },
    ]
  },
  {
    id: 'beach',
    name: 'Beach',
    icon: '🏖️',
    color: 'bg-[#F7F4E2]',
    items: [
      { label: 'Towel', icon: '🧣', color: 'bg-[#E8E2F7]' },
      { label: 'Sunscreen', icon: '🧴', color: 'bg-[#F7F4E2]' },
      { label: 'Swimwear', icon: '🩱', color: 'bg-[#E2F7ED]' },
      { label: 'Sunglasses', icon: '🕶️', color: 'bg-[#F1F5F9]' },
    ]
  },
  {
    id: 'airport',
    name: 'Airport',
    icon: '✈️',
    color: 'bg-[#E2F0F7]',
    items: [
      { label: 'Passport', icon: '🛂', color: 'bg-[#E8E2F7]' },
      { label: 'Tickets', icon: '🎟️', color: 'bg-[#E2F7ED]' },
      { label: 'Charger', icon: '⚡', color: 'bg-[#F7F4E2]' },
      { label: 'Headphones', icon: '🎧', color: 'bg-[#E2F0F7]' },
    ]
  },
  {
    id: 'work',
    name: 'Work',
    icon: '💼',
    color: 'bg-[#F1F5F9]',
    items: [
      { label: 'Laptop', icon: '💻', color: 'bg-[#E2F0F7]' },
      { label: 'Notebook', icon: '📔', color: 'bg-[#E2F7ED]' },
      { label: 'Coffee', icon: '☕', color: 'bg-[#F7E8E2]' },
      { label: 'ID Badge', icon: '🪪', color: 'bg-[#F1F5F9]' },
    ]
  },
  {
    id: 'school',
    name: 'School',
    icon: '🏫',
    color: 'bg-[#E8E2F7]',
    items: [
      { label: 'Books', icon: '📚', color: 'bg-[#E2F7ED]' },
      { label: 'Pens', icon: '🖋️', color: 'bg-[#F1F5F9]' },
      { label: 'Lunch', icon: '🍱', color: 'bg-[#F7E2EB]' },
      { label: 'Laptop', icon: '💻', color: 'bg-[#E2F0F7]' },
    ]
  },
  {
    id: 'library',
    name: 'Library',
    icon: '🏛️',
    color: 'bg-[#F7E2EB]',
    items: [
      { label: 'Library Card', icon: '🪪', color: 'bg-[#E2F0F7]' },
      { label: 'Notebook', icon: '📒', color: 'bg-[#F7F4E2]' },
      { label: 'Silence', icon: '🤫', color: 'bg-[#F1F5F9]' },
      { label: 'Laptop', icon: '💻', color: 'bg-[#E2F7ED]' },
    ]
  },
  {
    id: 'gym',
    name: 'Gym',
    icon: '🏋️',
    color: 'bg-[#E2F0F7]',
    items: [
      { label: 'Shoes', icon: '👟', color: 'bg-[#F1F5F9]' },
      { label: 'Water', icon: '💧', color: 'bg-[#E2F0F7]' },
      { label: 'Towel', icon: '🧣', color: 'bg-[#E8E2F7]' },
      { label: 'Protein', icon: '🥤', color: 'bg-[#F7E8E2]' },
    ]
  },
  {
    id: 'camping',
    name: 'Camping',
    icon: '⛺',
    color: 'bg-[#F7F4E2]',
    items: [
      { label: 'Tent', icon: '⛺', color: 'bg-[#E2F7ED]' },
      { label: 'Sleeping Bag', icon: '🛌', color: 'bg-[#E8E2F7]' },
      { label: 'Flashlight', icon: '🔦', color: 'bg-[#F7F4E2]' },
      { label: 'First Aid', icon: '🩹', color: 'bg-[#F7E2EB]' },
    ]
  },
  {
    id: 'photography',
    name: 'Photo',
    icon: '📸',
    color: 'bg-[#F1F5F9]',
    items: [
      { label: 'Camera', icon: '📸', color: 'bg-[#E2F0F7]' },
      { label: 'Lenses', icon: '🔍', color: 'bg-[#E2F7ED]' },
      { label: 'SD Cards', icon: '💾', color: 'bg-[#F1F5F9]' },
      { label: 'Tripod', icon: '🔭', color: 'bg-[#F7F4E2]' },
    ]
  },
  {
    id: 'firstaid',
    name: 'First Aid',
    icon: '🩹',
    color: 'bg-[#F7E2EB]',
    items: [
      { label: 'Bandages', icon: '🩹', color: 'bg-[#F7E2EB]' },
      { label: 'Antiseptic', icon: '🧪', color: 'bg-[#E2F7ED]' },
      { label: 'Painkillers', icon: '💊', color: 'bg-[#E8E2F7]' },
      { label: 'Gloves', icon: '🧤', color: 'bg-[#F1F5F9]' },
    ]
  }
];

export const THEMES: Theme[] = [
  {
    id: 'cotton-candy',
    name: 'Cotton Candy',
    gradient: 'from-[#FDF2F8] to-[#EEF2FF]',
    textColor: 'text-slate-800',
    mutedColor: 'text-slate-500',
    accentColor: 'text-pink-600',
    iconBg: 'bg-[#FBCFE8]',
  },
  {
    id: 'soft-mint',
    name: 'Soft Mint',
    gradient: 'from-[#ECFDF5] to-[#F0FDFA]',
    textColor: 'text-teal-900',
    mutedColor: 'text-teal-700/60',
    accentColor: 'text-teal-600',
    iconBg: 'bg-[#A7F3D0]',
  },
  {
    id: 'lavender-mist',
    name: 'Lavender Mist',
    gradient: 'from-[#F5F3FF] to-[#FAF5FF]',
    textColor: 'text-indigo-900',
    mutedColor: 'text-indigo-700/60',
    accentColor: 'text-indigo-600',
    iconBg: 'bg-[#DDD6FE]',
  },
  {
    id: 'peach-fuzz',
    name: 'Peach Fuzz',
    gradient: 'from-[#FFF7ED] to-[#FFF1F2]',
    textColor: 'text-rose-900',
    mutedColor: 'text-rose-700/60',
    accentColor: 'text-rose-600',
    iconBg: 'bg-[#FED7AA]',
  },
  {
    id: 'frozen-lake',
    name: 'Frozen Lake',
    gradient: 'from-[#F0F9FF] to-[#E0F2FE]',
    textColor: 'text-sky-900',
    mutedColor: 'text-sky-700/60',
    accentColor: 'text-sky-600',
    iconBg: 'bg-[#BAE6FD]',
  },
  {
    id: 'silk-grey',
    name: 'Silk Grey',
    gradient: 'from-[#F8FAFC] to-[#F1F5F9]',
    textColor: 'text-slate-900',
    mutedColor: 'text-slate-500',
    accentColor: 'text-slate-600',
    iconBg: 'bg-[#E2E8F0]',
  }
];

export const SUGGESTED_ITEMS = [
  { label: 'Laptop', icon: '💻', color: 'bg-[#E2F0F7]' },
  { label: 'Glasses', icon: '👓', color: 'bg-[#F1F5F9]' },
  { label: 'Charger', icon: '⚡', color: 'bg-[#F7F4E2]' },
  { label: 'Passport', icon: '✈️', color: 'bg-[#E8E2F7]' },
  { label: 'Umbrella', icon: '☂️', color: 'bg-[#E2F7ED]' },
  { label: 'Notebook', icon: '📔', color: 'bg-[#F7E2EB]' },
];
