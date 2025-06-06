interface Translations {
  [key: string]: {
    searchTitle: string;
    searchSubtitle: string;
    searchPlaceholder: string;
    allLanguages: string;
    loading: string;
    noPsychologist: string;
    bookAppointment: string;
    nextAvailability: string;
    backToSearch: string;
    noAvailability: string;
    loadingAvailability: string;
    confirmAppointment: string;
    psychologist: string;
    dateTime: string;
    price: string;
    firstName: string;
    lastName: string;
    email: string;
    whatsappNumber: string;
    cancel: string;
    confirm: string;
    confirming: string;
    mentalHealthResources: string;
    patientMode: string;
    psychologistMode: string;
   appointmentConfirmed: string;
   duration: string;
   yourWhatsapp: string;
   yourEmail: string;
   dontForgetNote: string;
   backToHome: string;
   hour: string;
  languagesNotSpecified: string;
  loadingSlots: string;
  noSlots: string;
  selectDate: string;
  coveredBySuperNovae: string;
  requiredField: string;
  invalidEmail: string;
  invalidWhatsapp: string;
  allFieldsRequired: string;
  slotAlreadyBooked: string;
  bookingError: string;
  };
}

export const translations: Translations = {
  fr: {
    searchTitle: 'Prenez rendez-vous avec votre psychologue',
    searchSubtitle: 'Prenez rendez-vous avec un professionnel de la santé mentale. Initiative Super-Novae dans le cadre du projet Humanitaire',
    searchPlaceholder: 'Rechercher par prénom...',
    allLanguages: 'Toutes les langues',
    loading: 'Chargement des psychologues...',
    noPsychologist: 'Aucun psychologue trouvé',
    bookAppointment: 'Prendre rendez-vous',
    nextAvailability: 'Prochaine disponibilité: Aujourd\'hui',
    backToSearch: 'Retour à la recherche',
    noAvailability: 'Aucune disponibilité pour le moment',
    loadingAvailability: 'Chargement des disponibilités...',
    confirmAppointment: 'Confirmer le rendez-vous',
    psychologist: 'Psychologue',
    dateTime: 'Date et heure',
    price: 'Tarif',
    firstName: 'Prénom',
    lastName: 'Nom',
    email: 'Email',
    whatsappNumber: 'Numéro WhatsApp',
    cancel: 'Annuler',
    confirm: 'Confirmer',
    confirming: 'Confirmation...',
    mentalHealthResources: 'Ressources santé mentale',
    patientMode: 'Mode Patient',
    psychologistMode: 'Accès psychologue',
    appointmentConfirmed: 'Votre rendez-vous est confirmé !',
    duration: 'Durée',
    yourWhatsapp: 'Votre numéro WhatsApp',
    yourEmail: 'Votre email',
    dontForgetNote: 'N\'oubliez pas de noter ce rendez-vous dans votre agenda !',
    backToHome: 'Retour à l\'accueil',
    hour: 'heure',
    languagesNotSpecified: 'Langues non spécifiées',
    loadingSlots: 'Chargement des disponibilités...',
    noSlots: 'Aucune disponibilité pour le moment',
    selectDate: 'Sélectionnez une date',
    coveredBySuperNovae: 'Pris en charge par Super-Novae',
    requiredField: 'Ce champ est requis',
    invalidEmail: 'Veuillez entrer une adresse email valide',
    invalidWhatsapp: 'Le numéro WhatsApp doit contenir au moins 8 chiffres',
    allFieldsRequired: 'Tous les champs sont obligatoires',
    slotAlreadyBooked: 'Ce créneau a déjà été réservé. Veuillez en choisir un autre.',
    bookingError: 'Une erreur est survenue lors de la réservation. Veuillez réessayer.'
  },
  ar: {
    searchTitle: 'احجز موعدًا مع طبيبك النفسي',
    searchSubtitle: 'احجز موعدًا مع متخصص في الصحة النفسية. مبادرة Super-Novae كجزء من المشروع الإنساني',
    searchPlaceholder: 'البحث بالاسم الأول...',
    allLanguages: 'كل اللغات',
    loading: 'جاري تحميل الأطباء النفسيين...',
    noPsychologist: 'لم يتم العثور على طبيب نفسي',
    bookAppointment: 'حجز موعد',
    nextAvailability: 'التوفر القادم: اليوم',
    backToSearch: 'العودة إلى البحث',
    noAvailability: 'لا يوجد مواعيد متاحة حاليًا',
    loadingAvailability: 'جاري تحميل المواعيد المتاحة...',
    confirmAppointment: 'تأكيد الموعد',
    psychologist: 'الطبيب النفسي',
    dateTime: 'التاريخ والوقت',
    price: 'السعر',
    firstName: 'الاسم الأول',
    lastName: 'اسم العائلة',
    email: 'البريد الإلكتروني',
    whatsappNumber: 'رقم الواتساب',
    cancel: 'إلغاء',
    confirm: 'تأكيد',
    confirming: 'جاري التأكيد...',
    mentalHealthResources: 'موارد الصحة النفسية',
    patientMode: 'وضع المريض',
    psychologistMode: 'الوصول إلى الطبيب النفسي',
    appointmentConfirmed: 'تم تأكيد موعدك!',
    duration: 'المدة',
    yourWhatsapp: 'رقم الواتساب الخاص بك',
    yourEmail: 'بريدك الإلكتروني',
    dontForgetNote: 'لا تنس تدوين هذا الموعد في مفكرتك!',
    backToHome: 'العودة إلى الصفحة الرئيسية',
    hour: 'ساعة',
    languagesNotSpecified: 'اللغات غير محددة',
    loadingSlots: 'جاري تحميل المواعيد المتاحة...',
    noSlots: 'لا يوجد مواعيد متاحة حاليًا',
    selectDate: 'اختر تاريخًا',
    coveredBySuperNovae: 'تغطيه Super-Novae',
    requiredField: 'هذا الحقل مطلوب',
    invalidEmail: 'الرجاء إدخال عنوان بريد إلكتروني صالح',
    invalidWhatsapp: 'يجب أن يحتوي رقم الواتساب على 8 أرقام على الأقل',
    allFieldsRequired: 'جميع الحقول مطلوبة',
    slotAlreadyBooked: 'هذا الموعد محجوز بالفعل. الرجاء اختيار موعد آخر.',
    bookingError: 'حدث خطأ أثناء الحجز. الرجاء المحاولة مرة أخرى.'
  },
  en: {
    searchTitle: 'Book an Appointment with Your Psychologist',
    searchSubtitle: 'Schedule a consultation with a mental health professional. Super-Novae initiative as part of the Humanitarian project',
    searchPlaceholder: 'Search by first name...',
    allLanguages: 'All languages',
    loading: 'Loading psychologists...',
    noPsychologist: 'No psychologist found',
    bookAppointment: 'Book Appointment',
    nextAvailability: 'Next availability: Today',
    backToSearch: 'Back to Search',
    noAvailability: 'No availability at the moment',
    loadingAvailability: 'Loading availability...',
    confirmAppointment: 'Confirm Appointment',
    psychologist: 'Psychologist',
    dateTime: 'Date and Time',
    price: 'Price',
    firstName: 'First Name',
    lastName: 'Last Name',
    email: 'Email',
    whatsappNumber: 'WhatsApp Number',
    cancel: 'Cancel',
    confirm: 'Confirm',
    confirming: 'Confirming...',
    mentalHealthResources: 'Mental Health Resources',
    patientMode: 'Patient Mode',
    psychologistMode: 'Psychologist Access',
    appointmentConfirmed: 'Your appointment is confirmed!',
    duration: 'Duration',
    yourWhatsapp: 'Your WhatsApp Number',
    yourEmail: 'Your Email',
    dontForgetNote: 'Don\'t forget to note this appointment in your calendar!',
    backToHome: 'Back to Home',
    hour: 'hour',
    languagesNotSpecified: 'Languages not specified',
    loadingSlots: 'Loading availability...',
    noSlots: 'No availability at the moment',
    selectDate: 'Select a Date',
    coveredBySuperNovae: 'Covered by Super-Novae',
    requiredField: 'This field is required',
    invalidEmail: 'Please enter a valid email address',
    invalidWhatsapp: 'WhatsApp number must contain at least 8 digits',
    allFieldsRequired: 'All fields are required',
    slotAlreadyBooked: 'This time slot is already booked. Please choose another one.',
    bookingError: 'An error occurred during booking. Please try again.'
  }
};