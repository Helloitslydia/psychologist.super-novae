import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { Appointment } from '../types';

interface ConsultationDetailsModalProps {
  appointment: Appointment;
  onClose: () => void;
  onSave: () => void;
}

export function ConsultationDetailsModal({
  appointment,
  onClose,
  onSave
}: ConsultationDetailsModalProps) {
  const [status, setStatus] = useState(appointment.consultation_status || '');
  const [summary, setSummary] = useState(appointment.consultation_summary || '');
  const [feedback, setFeedback] = useState(appointment.satisfaction_feedback || '');
  const [rating, setRating] = useState(appointment.satisfaction_rating || 0);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('appointments')
        .update({
          consultation_status: status,
          consultation_summary: summary,
          satisfaction_feedback: feedback,
          satisfaction_rating: rating
        })
        .eq('id', appointment.id);

      if (error) throw error;
      onSave();
      onClose();
    } catch (error) {
      console.error('Error updating consultation details:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold">Détails de la consultation</h3>
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
              Statut de la séance
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Sélectionnez un statut</option>
              <option value="completed">Conduit en totalité</option>
              <option value="partial">Partiellement conduit</option>
              <option value="cancelled">Annulé</option>
              <option value="no_show">Non-présent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Résumé de la séance
            </label>
            <textarea
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Sujets abordés, recommandations, etc."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Note de satisfaction
            </label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={`${
                      star <= rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    } hover:scale-110 transition-transform`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating ? `${rating}/5` : 'Non noté'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Retours de satisfaction
            </label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Retours du patient sur la séance"
            />
          </div>

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
              disabled={loading}
            >
              {loading ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}