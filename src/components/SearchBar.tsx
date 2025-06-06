import React from 'react';
import { Search, Globe } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string, language: string) => void;
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = React.useState('');
  const [language, setLanguage] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, language);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Rechercher par prénom..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="absolute right-3 top-3 text-gray-400" size={20} />
        </div>
        <div className="flex-1 relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les langues</option>
            <option value="fr">🇫🇷 Français</option>
            <option value="en">🇬🇧 Anglais</option>
            <option value="es">🇪🇸 Espagnol</option>
            <option value="de">🇩🇪 Allemand</option>
            <option value="it">🇮🇹 Italien</option>
            <option value="pt">🇵🇹 Portugais</option>
            <option value="nl">🇳🇱 Néerlandais</option>
            <option value="ar">🇸🇦 Arabe</option>
            <option value="zh">🇨🇳 Chinois</option>
            <option value="ja">🇯🇵 Japonais</option>
          </select>
          <Globe className="absolute right-3 top-3 text-gray-400" size={20} />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Rechercher
        </button>
      </div>
    </form>
  );
}