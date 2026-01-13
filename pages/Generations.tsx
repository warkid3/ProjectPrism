
import React, { useState, useEffect } from 'react';
// Fix: Use GenerationJob instead of Generation to resolve Error on line 3
import { GenerationJob } from '../types';
import { mockStore } from '../services/mockStore';

export const GenerationsPage: React.FC = () => {
  // Fix: Use GenerationJob type
  const [gens, setGens] = useState<GenerationJob[]>([]);

  useEffect(() => {
    // Fix: Use getJobs instead of getGenerations to resolve Error on line 10
    setGens(mockStore.getJobs());
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Generation History</h1>
      </div>

      {gens.length === 0 ? (
        <div className="py-40 text-center border border-slate-800 rounded-2xl bg-slate-900/50">
          <p className="text-slate-500 italic">You haven't generated any content yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {gens.map(gen => (
            <div key={gen.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col hover:border-slate-600 transition-all group">
              <div className="aspect-[3/4] bg-slate-800 relative overflow-hidden">
                {/* Fix: Check for review or posted status and use correct property names */}
                {(gen.status === 'posted' || gen.status === 'review') ? (
                  <>
                    <img src={gen.output_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Generated" />
                    {gen.video_url && (
                      <div className="absolute top-2 left-2 bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg">VIDEO</div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent animate-spin rounded-full mb-4"></div>
                    <span className="text-sm font-medium text-slate-400">Rendering digital twin...</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="bg-white text-black text-xs font-bold px-4 py-2 rounded-lg hover:bg-slate-200">VIEW FULL</button>
                  <button className="bg-indigo-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-700">DOWNLOAD</button>
                </div>
              </div>
              <div className="p-4 bg-slate-900">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] text-slate-500 font-mono uppercase">{new Date(gen.created_at).toLocaleDateString()}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${(gen.status === 'posted' || gen.status === 'review') ? 'bg-emerald-900/40 text-emerald-400' : 'bg-amber-900/40 text-amber-400'}`}>
                    {gen.status}
                  </span>
                </div>
                {/* Fix: Use prompt as a reference descriptor instead of style_image_url */}
                <div className="text-xs text-slate-400 line-clamp-2 italic">
                  Prompt: {gen.prompt.substring(0, 30)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
