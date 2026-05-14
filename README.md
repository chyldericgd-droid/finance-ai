# Finance AI OS · v4.7 (Android 17 / iOS bubble polish + i18n complet + onboarding)

PWA brutaliste de gestion financière — autonome, offline-first, zéro dépendance serveur.

## Nouveautés v4.7

- **Design Android 17 / iOS bubble** : couches CSS additionnelles (sans toucher aux couleurs ni à la structure) — coins plus ronds (squircle), animations springy (cubic-bezier `.34,1.56,.64,1`), bulles actives sur la nav, glassmorphism raffiné, FAB qui se déforme, modales avec spring-up sheet, inputs plus larges et plus doux.
- **i18n complet** : toutes les sections de la page Paramètres (Comptes, Catégories, Objectifs, Notifications, Groq, Vie & Prévisions, Devise, Langue, Virement, Google Drive, Sauvegarde locale, Zone dangereuse) passent par `t()`. Les noms par défaut des comptes et catégories sont traduits dynamiquement (FR / EN / ES / PT).
- **Onboarding au premier lancement** : modale plein écran avec choix de la langue + devise (XOF, XAF, EUR, USD, GBP, CAD, MAD, NGN ou personnalisée). Persistance dans `localStorage` + DB IndexedDB.
- **Aucune logique modifiée** : KPIs, IA, Drive, calculs, navigation — tout fonctionne comme avant.

## Déploiement

1. Pousse ces fichiers à la racine du repo (Netlify / GitHub Pages).
2. Aucun build, site statique.
3. Origine OAuth Google déjà autorisée pour `https://financeai2.netlify.app`.

## Fichiers

- `index.html` — app complète
- `sw.js` — service worker
- `manifest.json` — PWA manifest + raccourcis
- `icon-96.png`, `icon-192.png`, `icon-512.png` — icônes
