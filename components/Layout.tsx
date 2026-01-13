
import React from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { mockStore } from '../services/mockStore';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = mockStore.getUser();

  if (!user) return <>{children}</>;

  const isFullPage = ['/creative', '/characters'].includes(location.pathname);

  return (
    <div className="h-screen flex flex-col bg-black text-white overflow-hidden font-inter select-none">
      <nav className="bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-50 flex-shrink-0">
        <div className="flex items-center gap-12">
          <div className="text-2xl font-[900] tracking-tighter text-white uppercase italic">
            PRISM<span className="text-[#CCFF00]">.</span>STUDIO
          </div>
          <div className="flex gap-2">
            <NavItem to="/studio">Studio</NavItem>
            <NavItem to="/creative">Creative</NavItem>
            <NavItem to="/assets">Assets</NavItem>
            <NavItem to="/characters">Characters</NavItem>
            <NavItem to="/saved-prompts">Prompts</NavItem>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[9px] uppercase font-black tracking-[0.2em] text-slate-500">Available Credits</span>
            <span className="text-sm font-black italic text-[#CCFF00]">{user.credits} CR</span>
          </div>
          <button 
            onClick={() => { mockStore.setUser(null); navigate('/login'); }} 
            className="p-2 hover:bg-white/5 rounded-[2px] transition-colors text-slate-400 hover:text-[#CCFF00]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </button>
        </div>
      </nav>
      <main className={`flex-1 overflow-hidden flex flex-col ${isFullPage ? 'p-0' : 'p-6'}`}>
        {children}
      </main>
    </div>
  );
};

const NavItem: React.FC<{ to: string, children: React.ReactNode }> = ({ to, children }) => (
  <NavLink 
    to={to} 
    className={({ isActive }) => 
      `px-4 py-2 rounded-[2px] text-[10px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-[#CCFF00] bg-[#CCFF00]/5' : 'text-slate-500 hover:text-white hover:bg-white/5'}`
    }
  >
    {children}
  </NavLink>
);
