
export interface ChecklistItem {
  id: string;
  label: string;
  subtext: string;
  icon: string;
  color: string;
  checked: boolean;
  pinned?: boolean;
}

export interface Theme {
  id: string;
  name: string;
  gradient: string;
  textColor: string;
  mutedColor: string;
  accentColor: string;
  iconBg: string;
}

export type View = 'dashboard' | 'themes' | 'add';
