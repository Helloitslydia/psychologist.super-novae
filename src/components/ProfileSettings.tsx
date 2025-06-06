import React, { useEffect, useContext, useState } from 'react';
import { X, Upload, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { ToastContext } from './ToastProvider';

const SUPPORTED_LANGUAGES = [
  { code: 'fr', name: '🇫🇷 Français' },
  { code: 'en', name: '🇬🇧 Anglais' },
  { code: 'es', name: '🇪🇸 Espagnol' },
  { code: 'de', name: '🇩🇪 Allemand' },
  { code: 'it', name: '🇮🇹 Italien' },
  { code: 'pt', name: '🇵🇹 Portugais' },
  { code: 'nl', name: '🇳🇱 Néerlandais' },
  { code: 'ar', name: '🇸🇦 Arabe' },
  { code: 'zh', name: '🇨🇳 Chinois' },
  { code: 'ja', name: '🇯🇵 Japonais' }
];

interface ProfileSettingsProps {
  onClose: () => void;
}

export function ProfileSettings({ onClose }: ProfileSettingsProps) {
  const { showToast } = useContext(ToastContext);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: psychologist } = await supabase
        .from('psychologists')
        .select('photo_url, languages')
        .eq('id', user.id);

      if (psychologist && psychologist.length > 0) {
        setPhotoUrl(psychologist[0].photo_url || '');
        setSelectedLanguages(psychologist[0].languages || ['fr']);
      }
    };

    fetchProfile();
  }, []);

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast('Veuillez sélectionner une image', 'error');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showToast('L\'image ne doit pas dépasser 5MB', 'error');
      return;
    }

    setUploadLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `psychologist-photos/${fileName}`;

      // Upload the file
      const { error: uploadError } = await supabase.storage
        .from('photos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(filePath);

      // Update the psychologist profile
      const { error: updateError } = await supabase
        .from('psychologists')
        .update({ photo_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setPhotoUrl(publicUrl);
      showToast('Photo mise à jour avec succès', 'success');
    } catch (error) {
      console.error('Error uploading photo:', error);
      showToast('Erreur lors de la mise à jour de la photo', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleLanguageToggle = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code)
        ? prev.filter(lang => lang !== code)
        : [...prev, code]
    );
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const { error } = await supabase
        .from('psychologists')
        .update({ languages: selectedLanguages })
        .eq('id', user.id);

      if (error) throw error;

      showToast('Profil mis à jour avec succès', 'success');
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
      showToast('Erreur lors de la mise à jour du profil', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold">Paramètres du profil</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-6">
          {/* Photo upload section */}
          <div>
            <h4 className="font-medium mb-4">Photo de profil</h4>
            <div className="flex items-center space-x-6">
              <div className="relative">
                <img
                  src={photoUrl || 'https://toautqoefpfspjqezkyr.supabase.co/storage/v1/object/public/photos/psychologist-photos/541fb796-dbb9-4058-a1a4-a65541b81c3c-1745962564439.jpg'}
                  alt="Profile"
                  className="w-32 h-32 rounded-lg object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg opacity-0 hover:opacity-100 transition-opacity">
                  <label
                    className="cursor-pointer p-2 rounded-full bg-white text-gray-700 hover:bg-gray-100"
                    htmlFor="photo-upload"
                  >
                    <Upload size={20} />
                  </label>
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploadLoading}
                  />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-2">
                  Formats acceptés : JPG, PNG, GIF
                </p>
                <p className="text-sm text-gray-600">
                  Taille maximale : 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Languages section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              <div className="flex items-center gap-2">
                <Globe size={20} className="text-gray-500" />
                Langues parlées (sélectionnez une ou plusieurs)
              </div>
            </label>
            <div className="mt-2 grid grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50">
              {SUPPORTED_LANGUAGES.map(lang => (
                <label
                  key={lang.code}
                  className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
                    selectedLanguages.includes(lang.code)
                      ? 'bg-blue-100 text-blue-900'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(lang.code)}
                    onChange={() => handleLanguageToggle(lang.code)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-base">{lang.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>
    </div>
  );
}