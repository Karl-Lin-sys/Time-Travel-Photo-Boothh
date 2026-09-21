export interface HistoricalEra {
  id: string;
  name: string;
  year: string;
  category: 'Ancient' | 'Medieval' | 'Renaissance' | 'Modern' | 'Future';
  role: string;
  tagline: string;
  scenePrompt: string;
  iconName: string;
  colorScheme: {
    accent: string;
    border: string;
    badge: string;
  };
}

export interface PhotoAnalysis {
  summary: string;
  expression: string;
  lighting: string;
  eraMatches: {
    eraId: string;
    eraName: string;
    role: string;
    matchScore: number;
    reason: string;
    customPromptAdjustment?: string;
  }[];
  personaKeywords: string[];
}

export interface GeneratedPostcard {
  id: string;
  originalImage: string;
  resultImage: string;
  era: HistoricalEra;
  promptUsed: string;
  timestamp: number;
  analysis?: PhotoAnalysis;
  editHistory: {
    editPrompt: string;
    imageUrl: string;
    timestamp: number;
  }[];
}
