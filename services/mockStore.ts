
import { User, CharacterModel, Asset, GenerationJob, Status, PromptingModel, ImageModel, VideoModel } from '../types';

const STORAGE_KEYS = {
  USER: 'prism_user',
  CHARACTERS: 'prism_characters',
  ASSETS: 'prism_assets',
  JOBS: 'prism_jobs',
  INBOX: 'prism_inbox',
  STARRED_PROMPTS: 'prism_starred_prompts'
};

const generateMockJobs = (characters: CharacterModel[]): GenerationJob[] => {
  const statuses: Status[] = ['queued', 'processing', 'review', 'posted', 'archived'];
  const pModels: PromptingModel[] = ['Gemini 1.5 Flash', 'xAI Grok Beta'];
  const iModels: ImageModel[] = ['Pony Realism (SDXL)', 'Nano Banana Pro', 'Seedream 4.5'];
  const vModels: VideoModel[] = ['Wan 2.6', 'Kling 2.6 Pro', 'LTX-2'];

  return Array.from({ length: 20 }).map((_, i) => {
    const char = characters[i % characters.length] || { id: 'default', name: 'Unknown', trigger_word: 'unknown' };
    const isNsfw = i % 4 === 0;
    const needsVideo = i % 3 === 0;
    const status = statuses[i % statuses.length];
    
    return {
      id: `job-${Math.random().toString(36).substr(2, 5)}`,
      character_id: char.id,
      prompting_model: isNsfw ? 'xAI Grok Beta' : pModels[i % pModels.length],
      image_model: isNsfw ? 'Pony Realism (SDXL)' : iModels[i % iModels.length],
      video_model: needsVideo ? vModels[i % vModels.length] : undefined,
      status: status,
      is_nsfw: isNsfw,
      prompt: isNsfw 
        ? `Cinematic low-angle shot of @${char.name} in provocative pose, neon lighting, highly detailed skin texture.`
        : `A high-fashion editorial portrait of @${char.name} wearing a chrome techwear jacket in a rain-slicked Tokyo street.`,
      output_url: status === 'posted' || status === 'review' || status === 'archived' ? `https://picsum.photos/seed/${i + 100}/800/1200` : undefined,
      video_url: needsVideo && (status === 'posted' || status === 'review' || status === 'archived') ? 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHc3MmZiaWd3NGRzcm54d3ZqODJzOW1idG9tbmJqOHlhdnd5YnRwaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/L59a6Qp7qU3p5L1d4g/giphy.gif' : undefined,
      created_at: new Date(Date.now() - i * 3600000).toISOString(),
      progress: status === 'processing' ? 45 : (status === 'review' || status === 'posted' || status === 'archived' ? 100 : 0)
    };
  });
};

export const mockStore = {
  getUser: (): User | null => {
    const user = localStorage.getItem(STORAGE_KEYS.USER);
    return user ? JSON.parse(user) : null;
  },
  setUser: (user: User | null) => {
    if (user) localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEYS.USER);
  },

  getCharacters: (): CharacterModel[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CHARACTERS);
    if (!data) {
      const initial: CharacterModel[] = [
        { id: 'c1', user_id: '1', name: 'Luna Cyber', trigger_word: 'luna_v3', status: 'ready', created_at: new Date().toISOString() },
        { id: 'c2', user_id: '1', name: 'Kaelen Void', trigger_word: 'kaelen_model', status: 'ready', created_at: new Date().toISOString() }
      ];
      localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },
  saveCharacter: (character: CharacterModel) => {
    const chars = mockStore.getCharacters();
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify([...chars, character]));
  },
  updateCharacterStatus: (id: string, status: CharacterModel['status']) => {
    const chars = mockStore.getCharacters();
    const updated = chars.map(c => c.id === id ? { ...c, status } : c);
    localStorage.setItem(STORAGE_KEYS.CHARACTERS, JSON.stringify(updated));
  },

  getAssets: (): Asset[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ASSETS);
    if (!data) {
      const initial: Asset[] = [
        { id: 'a1', url: 'https://picsum.photos/seed/prism1/600/800', caption: 'Vibrant Neon Cityscape', type: 'image', source: 'scraped', collection: 'Urban Core' },
        { id: 'a2', url: 'https://picsum.photos/seed/prism2/600/800', caption: 'High Fashion Studio Silhouette', type: 'image', source: 'scraped', collection: 'Vogue X' },
        { id: 'a3', url: 'https://picsum.photos/seed/prism3/600/800', caption: 'Minimalist Tech Noir', type: 'image', source: 'upload' },
        { id: 'a4', url: 'https://picsum.photos/seed/prism4/600/800', caption: 'Cyberpunk Portrait Reference', type: 'image', source: 'scraped', collection: 'Urban Core' }
      ];
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },

  getInbox: (): Asset[] => {
    const data = localStorage.getItem(STORAGE_KEYS.INBOX);
    return data ? JSON.parse(data) : [];
  },
  saveInbox: (item: Asset) => {
    const items = mockStore.getInbox();
    localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify([item, ...items]));
  },
  updateInbox: (id: string, caption: string) => {
    const items = mockStore.getInbox();
    const updated = items.map(i => i.id === id ? { ...i, caption } : i);
    localStorage.setItem(STORAGE_KEYS.INBOX, JSON.stringify(updated));
  },

  getJobs: (): GenerationJob[] => {
    const data = localStorage.getItem(STORAGE_KEYS.JOBS);
    if (!data) {
      const chars = mockStore.getCharacters();
      const initial = generateMockJobs(chars);
      localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(data);
  },
  saveJob: (job: GenerationJob) => {
    const jobs = mockStore.getJobs();
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify([job, ...jobs]));
  },
  updateJob: (id: string, updates: Partial<GenerationJob>) => {
    const jobs = mockStore.getJobs();
    const updated = jobs.map(j => j.id === id ? { ...j, ...updates } : j);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
  },
  bulkUpdateJobs: (ids: string[], status: Status) => {
    const jobs = mockStore.getJobs();
    const updated = jobs.map(j => ids.includes(j.id) ? { ...j, status } : j);
    localStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(updated));
  },

  getStarredPrompts: (): string[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STARRED_PROMPTS);
    return data ? JSON.parse(data) : [];
  },
  starPrompt: (text: string) => {
    const prompts = mockStore.getStarredPrompts();
    if (!prompts.includes(text)) {
      localStorage.setItem(STORAGE_KEYS.STARRED_PROMPTS, JSON.stringify([...prompts, text]));
    }
  },
  unstarPrompt: (text: string) => {
    const prompts = mockStore.getStarredPrompts();
    localStorage.setItem(STORAGE_KEYS.STARRED_PROMPTS, JSON.stringify(prompts.filter(p => p !== text)));
  }
};
