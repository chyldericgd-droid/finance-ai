# Finance AI OS · v4.6 (design violet Android-17 + Google Drive)

PWA brutaliste de gestion financière. Design violet/indigo restauré (≈2800 lignes, tous les paramètres conservés) + nouveau module **Sauvegarde Google Drive** importé depuis la version verte v4.5.

## ✨ Ce qui a changé vs ta dernière version

- **Design** : ton design violet Android-17 d'origine est restauré à 100 % (couleurs `--acc:#8b5cf6`, `--bg:#09090f`, etc., toutes les cards/onglets/objectifs/KPIs intacts).
- **Réglages → Sauvegarde** :
  - 🆕 Carte **☁️ Sauvegarde Google Drive** : connexion GIS Token Client, sauvegarde manuelle, restauration, déconnexion.
  - 💾 Carte **Sauvegarde locale** : ton ancien export/import base64 + CSV.
- **Auto-backup** : 3 s après chaque écriture IndexedDB (`dbPut`/`dbDel`/`dbClear`) si tu es connecté à Drive et en ligne.
- **Reprise après offline** : un `online` listener relance la sauvegarde si du retard s'est accumulé.
- **PWA** : favicon + apple-touch-icon ajoutés, script `gsi/client` chargé en `async defer`.

## 🚀 Déploiement

1. Pousse les fichiers à la racine du repo (Netlify ou GitHub Pages).
2. URL exacte : `https://financeai2.netlify.app` (déjà autorisée dans Google OAuth).
3. Aucune build, site statique.

## 🔑 Google Drive (déjà câblé)

- **Client ID** : `548605771267-a8nskjhah481vb3n60t6liibl8i7ia6h.apps.googleusercontent.com`
- **Origine autorisée** : `https://financeai2.netlify.app`
- **Scope** : `drive.file` (l'app n'accède qu'au fichier `finance-ai-backup.json` qu'elle crée)
- Pas de `client_secret` côté navigateur (flux Token Client GIS).

## 📁 Fichiers

- `index.html` — app complète
- `sw.js` — service worker (cache shell, network-first)
- `manifest.json` — PWA manifest + raccourcis
- `icon-192.png`, `icon-512.png` — icônes
- `README.md` — ce fichier
