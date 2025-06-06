import React, { useState } from 'react';
import { X, Link, Upload, File, Image } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ContentManagementModalProps {
  onClose: () => void;
  onSave: () => void;
  psychologistId: string;
}

export function ContentManagementModal({
  onClose,
  onSave,
  psychologistId
}: ContentManagementModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploadType, setUploadType] = useState<'url' | 'file'>('url');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setUrl('');
    setFile(null);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let fileUrl = null;
      let fileType = null;

      // Handle file upload if a file is selected
      if (uploadType === 'file' && file) {
        const fileExt = file.name.split('.').pop()?.toLowerCase();
        
        // Validate file type
        if (!fileExt || !['pdf', 'jpg', 'jpeg', 'png', 'gif'].includes(fileExt)) {
          setError('Format de fichier non supporté. Utilisez PDF ou images (JPG, PNG, GIF)');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          setError('Le fichier ne doit pas dépasser 5MB');
          return;
        }

        const fileName = `${Date.now()}-${file.name}`;
        const filePath = `psychologist-content/${fileName}`;

        // Upload file to storage
        const { error: uploadError } = await supabase.storage
          .from('content-files')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('content-files')
          .getPublicUrl(filePath);

        fileUrl = publicUrl;
        fileType = fileExt === 'pdf' ? 'pdf' : 'image';
      } else if (uploadType === 'url' && url) {
        // Validate URL format
        if (!url.match(/^https?:\/\/.+/)) {
        setError('L\'URL doit commencer par http:// ou https://');
        return;
      }
      }

      const { error: insertError } = await supabase
        .from('psychologist_content')
        .insert({
          psychologist_id: psychologistId,
          title,
          description,
          url: uploadType === 'url' ? url : null,
          file_url: fileUrl,
          file_type: fileType
        });

      if (insertError) throw insertError;

      onSave();
      resetForm();
      onClose();
    } catch (err) {
      console.error('Error creating content:', err);
      setError('Une erreur est survenue lors de la création du contenu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold">Ajouter un contenu</h3>
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
              Titre
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Titre du contenu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description détaillée du contenu..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de contenu
            </label>
            <div className="flex gap-4 mb-4">
              <button
                type="button"
                onClick={() => setUploadType('url')}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
                  uploadType === 'url'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Link size={20} />
                URL externe
              </button>
              <button
                type="button"
                onClick={() => setUploadType('file')}
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-lg border ${
                  uploadType === 'file'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                <Upload size={20} />
                Fichier
              </button>
            </div>

            {uploadType === 'url' ? (
              <div className="relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value || '')}
                  disabled={loading}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://..."
                />
                <Link className="absolute left-3 top-2.5 text-gray-400" size={20} />
              </div>
            ) : (
              <div className="space-y-2">
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.gif"
                  onChange={(e) => {
                    const selectedFile = e.target.files?.[0] || null;
                    setFile(selectedFile);
                  }}
                  disabled={loading}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-2 p-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  {file ? (
                    <>
                      {file.type.startsWith('image/') ? (
                        <Image size={24} className="text-blue-500" />
                      ) : (
                        <File size={24} className="text-blue-500" />
                      )}
                      <span className="text-blue-700">{file.name}</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} className="text-gray-400" />
                      <span className="text-gray-600">
                        Cliquez ou déposez un fichier ici (PDF ou image, max 5MB)
                      </span>
                    </>
                  )}
                </label>
                <p className="text-sm text-gray-500">
                  Formats acceptés: PDF, JPG, PNG, GIF (max 5MB)
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={loading || (uploadType === 'url' && !url) || (uploadType === 'file' && !file)}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}