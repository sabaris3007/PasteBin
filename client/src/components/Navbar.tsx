import React from 'react';
import { Code2, PlusCircle, Globe, FileCode2 } from 'lucide-react';

interface NavbarProps {
  activeTab: 'create' | 'explore' | 'docs';
  setActiveTab: (tab: 'create' | 'explore' | 'docs') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={() => setActiveTab('create')}>
          <div className="brand-icon">
            <Code2 size={20} />
          </div>
          <span>PasteBin</span>
        </div>

        <nav className="nav-links">
          <button
            className={`nav-btn ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            <PlusCircle size={17} />
            <span>New Snippet</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <Globe size={17} />
            <span>Explore</span>
          </button>

          <button
            className={`nav-btn ${activeTab === 'docs' ? 'active' : ''}`}
            onClick={() => setActiveTab('docs')}
          >
            <FileCode2 size={17} />
            <span>API Docs</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
