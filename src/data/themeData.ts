export type ThemeAccent = 'emerald' | 'cyan' | 'indigo' | 'violet' | 'amber';

export interface ThemeConfig {
  id: ThemeAccent;
  name: string;
  hex: string;
  gradHex: string;
  className: string;
  rgb: string;
  rgbHover: string;
  rgbLight: string;
  rgbGrad: string;
}

export const themes: ThemeConfig[] = [
  { 
    id: 'emerald', 
    name: 'Biohazard Emerald', 
    hex: '#10B981', 
    gradHex: '#06B6D4',
    className: 'theme-emerald', 
    rgb: '16 185 129',
    rgbHover: '5 150 105',
    rgbLight: '52 211 153',
    rgbGrad: '6 182 212'
  },
  { 
    id: 'cyan', 
    name: 'Cyber Cyan', 
    hex: '#06B6D4', 
    gradHex: '#3B82F6',
    className: 'theme-cyan', 
    rgb: '6 182 212',
    rgbHover: '8 145 178',
    rgbLight: '34 211 238',
    rgbGrad: '59 130 246'
  },
  { 
    id: 'indigo', 
    name: 'Linear Indigo', 
    hex: '#6366F1', 
    gradHex: '#8B5CF6',
    className: 'theme-indigo', 
    rgb: '99 102 241',
    rgbHover: '79 70 229',
    rgbLight: '129 140 248',
    rgbGrad: '139 92 246'
  },
  { 
    id: 'violet', 
    name: 'Raycast Violet', 
    hex: '#8B5CF6', 
    gradHex: '#D946EF',
    className: 'theme-violet', 
    rgb: '139 92 246',
    rgbHover: '124 58 237',
    rgbLight: '167 139 250',
    rgbGrad: '217 70 239'
  },
  { 
    id: 'amber', 
    name: 'Hyper Amber', 
    hex: '#F59E0B', 
    gradHex: '#EF4444',
    className: 'theme-amber', 
    rgb: '245 158 11',
    rgbHover: '217 119 6',
    rgbLight: '251 191 36',
    rgbGrad: '239 68 68'
  },
];
