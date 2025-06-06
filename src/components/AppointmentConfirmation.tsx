import React from 'react';
import { Calendar, Clock, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { TimeSlot, Psychologist } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AppointmentConfirmationProps {
  psychologist: Psychologist;
  timeSlot: TimeSlot;
  patientInfo: {
    firstName: string;
    lastName: string;
    whatsapp: string;
    email: string;
  };
}

export function AppointmentConfirmation({ 
  psychologist, 
  timeSlot,
  patientInfo 
}: AppointmentConfirmationProps) {
  const navigate = useNavigate();
  const { t, language } = useLanguage();

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString(language === 'ar' ? 'ar-SA' : language === 'en' ? 'en-US' : 'fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-center mb-8">
            <CheckCircle className="text-green-500 w-16 h-16" />
          </div>
          
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
            {t('appointmentConfirmed')}
          </h1>

          <div className="space-y-6">
            <div className="border-t border-b border-gray-200 py-6 space-y-4">
              <div className="flex items-start gap-4">
                <Calendar className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{t('dateTime')}</p>
                  <p className="text-gray-600">{formatDateTime(timeSlot.startTime)}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{t('duration')}</p>
                  <p className="text-gray-600">1 {t('hour')}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{t('psychologist')}</p>
                  <p className="text-gray-600">{psychologist.name}</p>
                  {psychologist.address && (
                    <p className="text-gray-600">{psychologist.address}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Phone className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{t('yourWhatsapp')}</p>
                  <p className="text-gray-600">{patientInfo.whatsapp}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="w-6 h-6 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-900">{t('yourEmail')}</p>
                  <p className="text-gray-600">{patientInfo.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <p className="text-blue-800 text-center font-medium">
                {t('dontForgetNote')}
              </p>
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                {t('backToHome')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}