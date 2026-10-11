export interface FeatureTourItem {
  id: string;
  badge: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  terminalCommand?: string;
  highlights: string[];
  metrics: { label: string; value: string }[];
}

export interface CliCommand {
  cmd: string;
  description: string;
  output: string[];
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  popular?: boolean;
  features: string[];
  cta: string;
}

export interface CommandPaletteAction {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Documentation' | 'Tools';
  shortcut?: string;
  action: () => void;
}
