# PSS - Plateforme Super-Novae

[![Netlify Status](https://api.netlify.com/api/v1/badges/toautqoefpfspjqezkyr/deploy-status)](https://app.netlify.com/sites/toautqoefpfspjqezkyr/deploys)

Une plateforme complète de santé mentale connectant les patients avec des psychologues.

## 🛠 Stack Technique

### Frontend
- React 18 avec TypeScript
- Vite pour le bundling et le développement
- Tailwind CSS pour le styling
- Lucide React pour les icônes
- React Router pour la navigation

### Backend
- Supabase pour la base de données PostgreSQL
- Authentification intégrée
- Row Level Security (RLS) pour la sécurité des données
- Stockage de fichiers sécurisé

### Déploiement
- Hébergement sur Netlify
- CI/CD automatisé
- HTTPS par défaut

## 🎯 Fonctionnalités Implémentées

### Système d'Authentification
- Connexion sécurisée pour les psychologues
- Gestion des rôles (patient/psychologue)
- Protection des routes sensibles

### Gestion des Rendez-vous
- Création de créneaux horaires par les psychologues
- Système de réservation pour les patients
- Confirmation automatique des rendez-vous
- Historique des consultations

### Profils Psychologues
- Création et gestion de profil
- Upload de photo de profil
- Gestion des langues parlées
- Configuration des disponibilités

### Interface Patient
- Recherche de psychologues
- Filtrage par langue
- Prise de rendez-vous simplifiée
- Système de feedback post-consultation

### Ressources en Santé Mentale
- Publication de contenus éducatifs
- Système de commentaires modérés
- Support de fichiers PDF et images
- Partage de liens externes

### Tableau de Bord Administratif
- Vue d'ensemble des psychologues
- Statistiques des rendez-vous
- Gestion des contenus
- Modération des commentaires

## 📋 User Stories

### En tant que Patient
- Je peux rechercher un psychologue par nom ou langue
- Je peux voir les disponibilités d'un psychologue
- Je peux prendre rendez-vous sans créer de compte
- Je peux laisser un feedback après ma consultation
- Je peux accéder aux ressources en santé mentale
- Je peux commenter les ressources partagées

### En tant que Psychologue
- Je peux créer et gérer mon profil professionnel
- Je peux définir mes disponibilités
- Je peux voir mes rendez-vous à venir
- Je peux gérer l'historique des consultations
- Je peux publier des ressources éducatives
- Je peux modérer les commentaires sur mes contenus
- Je peux générer des rapports d'activité

### En tant qu'Administrateur
- Je peux gérer les comptes psychologues
- Je peux voir les statistiques globales
- Je peux accéder aux tableaux de bord individuels
- Je peux modérer les contenus publiés

## 🔒 Sécurité

- Authentification sécurisée via Supabase
- Protection des données sensibles
- Row Level Security pour l'isolation des données
- Validation des entrées utilisateur
- Gestion sécurisée des fichiers

## 🌐 Internationalisation

- Support multilingue (Français, Arabe, Anglais)
- Interface adaptée aux différentes cultures
- Assistance pour les non-lecteurs
- Adaptation dynamique du contenu

## 📱 Responsive Design

- Interface adaptative sur tous les écrans
- Optimisé pour mobile
- Navigation intuitive
- Accessibilité respectée

## 🚀 Performance

- Chargement optimisé des ressources
- Mise en cache intelligente
- Lazy loading des images
- Optimisation des requêtes base de données

## 📈 Évolutions Futures

- Intégration de la visioconférence
- Système de paiement en ligne
- Application mobile native
- Notifications push
- Chat en temps réel

## 🤝 Support

Pour toute assistance technique ou demande d'évolution, contactez l'équipe de développement.