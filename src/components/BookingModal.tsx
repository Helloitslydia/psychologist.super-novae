import React from 'react';
import { X } from 'lucide-react';
import type { TimeSlot, Psychologist } from '../types';
import { supabase } from '../lib/supabase';
import { useLanguage } from '../context/LanguageContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (formData: { firstName: string; lastName: string; whatsapp: string; email: string }) => void;
  timeSlot: TimeSlot;
  psychologist: Psychologist;
  loading: boolean;
  error: string | null;
}

export function BookingModal({
  isOpen,
  onClose,
  onConfirm,
  timeSlot,
  psychologist,
  loading,
  error
}: BookingModalProps) {
  const { t, language } = useLanguage();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [whatsapp, setWhatsapp] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [validationError, setValidationError] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString(
      language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR',
      {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 max-w-md w-full my-auto">
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-xl font-semibold">{t('confirmAppointment')}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <p className="font-medium text-gray-700">{t('psychologist')}</p>
            <p className="text-gray-600">{psychologist.name}</p>
          </div>

          <div>
            <p className="font-medium text-gray-700">{t('dateTime')}</p>
            <p className="text-gray-600">{formatDateTime(timeSlot.startTime)}</p>
          </div>

          <div>
            <p className="font-medium text-gray-700">{t('price')}</p>
            <div>
              <p className="text-gray-600">{psychologist.hourlyRate}€ / séance</p>
              <p className="text-sm text-green-600 font-medium mt-1">{t('coveredBySuperNovae')}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('firstName')}
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('firstName')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('lastName')}
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder={t('lastName')}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t('whatsappNumber')}
            </label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="06XXXXXXXX"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
          )}

          {validationError && (
            <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">{validationError}</div>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={loading}
          >
            {t('cancel')}
          </button>
          <button
            onClick={async () => {
              if (!whatsapp.trim()) {
                setValidationError(t('requiredField'));
                return;
              }
              if (!firstName.trim() || !lastName.trim()) {
                setValidationError(t('allFieldsRequired'));
                return;
              }
              if (!email.trim()) {
                setValidationError(t('requiredField'));
                return;
              }
              if (!email.includes('@')) {
                setValidationError(t('invalidEmail'));
                return;
              }
              
              // Reset validation error
              setValidationError(null);
              
              // Basic phone number validation (at least 8 digits)
              const whatsappRegex = /^[0-9\s]{8,}$/;
              if (!whatsappRegex.test(whatsapp.trim())) {
                setValidationError(t('invalidWhatsapp'));
                return;
              }
              
              onConfirm({
                firstName,
                lastName,
                whatsapp,
                email
              });
            }}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? t('confirming') : t('confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}