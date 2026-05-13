# Finance AI · v4.5

PWA brutaliste de gestion financière avec IA Groq + sauvegarde Google Drive.

## 🚀 Déploiement (Netlify / GitHub Pages)

1. **Pousse ces fichiers à la racine du repo** (pas dans un sous-dossier).
2. **Netlify**: glisse le dossier ou connecte le repo. Aucune config build (site statique).
3. **GitHub Pages**: Settings → Pages → Source = `main` / root.
4. URL doit être exactement : `https://financeai2.netlify.app` (déjà autorisée dans Google OAuth).

## 🔑 Configuration Google Drive (déjà faite)

- **Client ID** intégré: `548605771267-a8nskjhah481vb3n60t6liibl8i7ia6h.apps.googleusercontent.com`
- **Origine autorisée**: `https://financeai2.netlify.app`
- **Scope**: `drive.file` (accès uniquement aux fichiers créés par l'app)

⚠️ Le **client_secret n'est PAS utilisé** côté navigateur (sécurité). On utilise le flux **Token Client** de Google Identity Services — uniquement le client_id est nécessaire. **Ne pousse jamais le client_secret sur GitHub public.**

## 🤖 IA Groq (à configurer)

Dans **Réglages → IA Groq**, colle ta clé depuis https://console.groq.com/keys.
L'IA est disponible :
- Bouton flottant ✨ (visible sur toutes les pages, online uniquement)
- Conseil court sur l'accueil (cache 10 min pour économiser tokens)
- Chat complet contextualisé avec tes données du mois

## ✨ Fonctionnalités v4.5

- IndexedDB offline-first (try/catch partout)
- Service Worker (cache shell, network-first nav, jamais les APIs Groq/Google)
- **Sauvegarde Google Drive** auto (3s après chaque modif si online) + manuelle
- Sauvegarde locale base64 (export/import) — inclut **budgets**
- Notifications + vibrations sur dépassement de budget
- Graphique de tendance 14 jours (SVG area chart)
- Police **Inter + JetBrains Mono** (rendu PWA Android optimal)
- Badge Online/Offline **fixe** (z-index 150, ne défile plus, se cache pendant les modals)
- Manifest + raccourcis (ajout dépense/revenu rapide)
- FAB IA + FAB ajout transaction
- Filtres transactions (tout/revenus/dépenses/transferts)
- Multi-devise (FCFA / EUR / USD)

## 📁 Fichiers

- `index.html` — app complète (single file, ~30 KB)
- `sw.js` — service worker
- `manifest.json` — PWA manifest
- `icon-192.png`, `icon-512.png` — icônes
- `README.md` — ce fichier

Tout doit être à la racine du repo.

## 🐛 Si l'OAuth échoue

1. Vérifie que tu accèdes via `https://financeai2.netlify.app` (pas via preview)
2. Dans Google Cloud Console → OAuth Consent Screen, ajoute ton email comme **Test User** (si app en mode "Testing")
3. Active l'API Google Drive: https://console.cloud.google.com/apis/library/drive.googleapis.com
4. Vérifie que `https://financeai2.netlify.app` est dans **Origines JavaScript autorisées** (pas "URI de redirection")
