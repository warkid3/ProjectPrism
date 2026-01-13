
import React, { useState, useEffect } from 'react';
// Fix: Use Asset instead of StyleReference to resolve Error on line 3
import { Asset } from '../types';
import { mockStore } from '../services/mockStore';

export const InboxPage: React.FC = () => {
  // Fix: Use Asset[] state type
  const [items, setItems] = useState<Asset[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setItems(mockStore.getInbox());
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    
    // Simulate multi-file upload processing
    setTimeout(() => {
      // Fix: Create valid Asset objects matching the type definition
      const newItems: Asset[] = files.map((f, i) => ({
        id: Math.random().toString(36).substr(2, 9),
        url: `https://picsum.photos/seed/${Math.random()}/600/800`,
        caption: 'New Reference',
        type: 'image',
        source: 'upload'
      }));

      newItems.forEach(item => mockStore.saveInbox(item));
      setItems(prev => [...newItems, ...prev]);
      setIsUploading(false);
    }, 1500);
  };

  const handleUpdateCaption = (id: string, caption: string) => {
    mockStore.updateInbox(id, caption);
    setItems(prev => prev.map(item => item.id === id ? { ...item, caption } : item));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Inbox</h1>
          <p className="text-slate-400 text-sm mt-1">Reference styles from scraped content or manual uploads</p>
        </div>
        <div className="flex gap-4">
          <label className="cursor-pointer bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg font-medium transition-colors border border-slate-700 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
            Upload Styles
            <input type="file" multiple accept="image/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {isUploading && (
        <div className="bg-indigo-600/20 border border-indigo-500/50 p-4 rounded-xl flex items-center gap-3 animate-pulse">
          <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent animate-spin rounded-full"></div>
          <span className="text-indigo-300 font-medium">Analyzing style cues from uploaded images...</span>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {items.map(item => (
          <div key={item.id} className="group bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-all shadow-lg">
            <div className="aspect-[3/4] overflow-hidden relative">
              <img src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.caption} />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                <button className="text-xs bg-white text-black px-2 py-1 rounded font-bold self-start mb-1 hover:bg-slate-200 transition-colors">USE STYLE</button>
              </div>
            </div>
            <div className="p-3">
              <input 
                className="w-full bg-transparent text-sm text-slate-300 focus:outline-none focus:text-white border-b border-transparent focus:border-indigo-500 py-0.5"
                value={item.caption}
                onChange={(e) => handleUpdateCaption(item.id, e.target.value)}
                placeholder="Add caption..."
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
