import React, { useState } from 'react';
import { X, Mail, User, Globe, Lock } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CreatePsychologistModalProps {
  onClose: () => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'fr', name: '🇫🇷 Français' },
  { code: 'en', name: '🇬🇧 Anglais' },
  { code: 'es', name: '🇪🇸 Espagnol' },
  { code: 'ar', name: '🇸🇦 Arabe' }
];

export function CreatePsychologistModal({ onClose }: CreatePsychologistModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    languages: ['fr'],
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('No user data returned');

      // Create profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id,
          role: 'psychologist',
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email
        });

      if (profileError) throw profileError;

      // Create psychologist record
      const { error: psychError } = await supabase
        .from('psychologists')
        .insert({
          id: authData.user.id,
          languages: formData.languages,
          description: formData.description
        });

      if (psychError) throw psychError;

      onClose();
    } catch (err) {
      console.error('Error creating psychologist:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-md w-full my-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold">Créer un compte psychologue</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Mail size={20} className="text-gray-500" />
                Email
              </div>
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-gray-500" />
                  Prénom
                </div>
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <div className="flex items-center gap-2">
                  <User size={20} className="text-gray-500" />
                  Nom
                </div>
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Lock size={20} className="text-gray-500" />
                Mot de passe
              </div>
            </label>
            <input
              type="password"
              required
              minLength={8}
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="mt-1 text-sm text-gray-500">
              Minimum 8 caractères
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Globe size={20} className="text-gray-500" />
                Langues parlées
              </div>
            </label>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {SUPPORTED_LANGUAGES.map(lang => (
                <label
                  key={lang.code}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    formData.languages.includes(lang.code)
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.languages.includes(lang.code)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          languages: [...prev.languages, lang.code]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          languages: prev.languages.filter(l => l !== lang.code)
                        }));
                      }
                    }}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{lang.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Expérience, spécialités, approche..."
            />
          </div>

          {error && (
            <div className="p-3 rounded-md bg-red-50 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer le compte'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}