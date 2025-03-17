"use client";

import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Globe, Plus, Moon, Sun, X } from 'lucide-react';
import { useWebsites } from '@/hooks/useWebsites';
import { subMinutes, parseISO, isWithinInterval } from 'date-fns';
import axios from 'axios';
import { API_BACKEND_URL } from '@/config';
import { useAuth } from '@clerk/nextjs';

function StatusCircle({ status }: { status: string }) {
  return (
    <div className={`w-3 h-3 rounded-full ${status === 'up' ? 'bg-green-500' : 'bg-red-500'}`} />
  );
}

function aggregateTicksToWindows(ticks: Array<{ createdAt: string; status: string }>) {
  const now = new Date();
  const thirtyMinutesAgo = subMinutes(now, 30);
  
  // Create 10 three-minute windows
  const windows = Array.from({ length: 10 }, (_, i) => {
    const end = subMinutes(now, i * 3);
    const start = subMinutes(end, 3);
    return { start, end, isUp: false };
  });

  // Filter ticks to last 30 minutes and aggregate them into windows
  const recentTicks = ticks.filter(tick => {
    const tickDate = parseISO(tick.createdAt);
    return tickDate >= thirtyMinutesAgo;
  });

  windows.forEach(window => {
    const windowTicks = recentTicks.filter(tick => {
      const tickDate = parseISO(tick.createdAt);
      return isWithinInterval(tickDate, { start: window.start, end: window.end });
    });

    // Consider window up if majority of ticks are up
    const upTicks = windowTicks.filter(tick => tick.status === 'up').length;
    window.isUp = windowTicks.length > 0 && (upTicks / windowTicks.length) >= 0.5;
  });

  return windows.reverse().map(window => window.isUp);
}

function calculateUptimePercentage(ticks: Array<{ status: string }>) {
  if (!ticks.length) return 0;
  const upTicks = ticks.filter(tick => tick.status === 'up').length;
  return Number(((upTicks / ticks.length) * 100).toFixed(1));
}

function UptimeTicks({ checks }: { checks: boolean[] }) {
  return (
    <div className="flex gap-1 mt-4">
      {checks.map((check, index) => (
        <div
          key={index}
          className={`w-8 h-2 rounded ${
            check ? 'bg-green-500' : 'bg-red-500'
          }`}
        />
      ))}
    </div>
  );
}

function WebsiteCard({ website }: { website: { id: string; url: string; ticks: Array<{ id: string; createdAt: string; status: string; latency: number }> } }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const aggregatedTicks = useMemo(() => 
    aggregateTicksToWindows(website.ticks),
    [website.ticks]
  );

  const uptimePercentage = useMemo(() => 
    calculateUptimePercentage(website.ticks),
    [website.ticks]
  );

  const currentStatus = website.ticks[0]?.status || 'down';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-colors duration-200">
      <div
        className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-4">
          <StatusCircle status={currentStatus} />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{website.url}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">ID: {website.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {uptimePercentage}% uptime
          </span>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400 dark:text-gray-500" />
          )}
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-700">
          <div className="mt-3">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Last 30 minutes status (3-minute windows)</h4>
            <UptimeTicks checks={aggregatedTicks} />
          </div>
        </div>
      )}
    </div>
  );
}

interface CreateWebsiteModalProps {
  isOpen: boolean;
  onClose: (url: string) => void;
  onSubmit: (url: string | null) => void;
}

function CreateWebsiteModal({ isOpen, onClose, onSubmit }: CreateWebsiteModalProps) {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic URL validation
    try {
      new URL(url);
      setError('');
      onSubmit(url);
      setUrl('');
      onClose(url);
    } catch {
      setError('Please enter a valid URL (e.g., https://example.com)');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md relative">
        <button
          onClick={() => onClose(url)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>
        
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Add New Website</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Website URL
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
              {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => onClose(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => onClose(url)}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
              >
                Add Website
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function CreateWebsiteButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 shadow-sm"
      onClick={onClick}
    >
      <Plus className="w-5 h-5" />
      <span>Add Website</span>
    </button>
  );
}

function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </button>
  );
}

function App() {
  const {websites, refreshWebsites} = useWebsites();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { getToken } = useAuth();
  const handleCreateWebsite = (url: string) => {
    // TODO: Implement the API call to create a new website
    console.log('Creating website with URL:', url);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Globe className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Uptime Monitor</h1>
          </div>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <CreateWebsiteButton onClick={() => setIsCreateModalOpen(true)} />
          </div>
        </div>
        
        <div className="space-y-4">
          {websites.map((website) => (
            <WebsiteCard key={website.id} website={website} />
          ))}
        </div>
      </div>

      <CreateWebsiteModal
        isOpen={isCreateModalOpen}
        onClose={async (url) => {
                if(url === null){
                    setIsCreateModalOpen(false);
                    return;
                }
                const token = await getToken();
                setIsCreateModalOpen(false)
                axios.post(`${API_BACKEND_URL}/api/v1/website`, {
                    url,
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                .then(() => {
                    refreshWebsites();
                })
            }
        }
        onSubmit={handleCreateWebsite}
      />
    </div>
  );
}

export default App;