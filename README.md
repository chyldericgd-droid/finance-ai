# Finance-AI

PWA personnelle de finance avec IA online (Lovable AI Gateway) + mode hors-ligne scripté.

## Démarrage local
```
bun install
bun run dev
```

## Variables d'environnement
- `LOVABLE_API_KEY` (serveur uniquement) — auto-fournie sur Lovable. Sur ton propre hébergement, demande-la depuis ton workspace Lovable ou remplace `src/lib/ai.functions.ts` par un autre fournisseur (Groq, OpenAI, etc.).

## Déploiement

### Option A — Lovable (le plus simple)
Clique sur **Publish** dans l'éditeur. URL stable: `project--<id>.lovable.app`.

### Option B — GitHub + Netlify
1. Pousse ce dossier sur un repo GitHub.
2. Sur Netlify: **Add new site → Import from Git** → sélectionne le repo.
3. Build command: `bun install && bun run build` · Publish dir: `dist`.
4. Ajoute la variable d'env `LOVABLE_API_KEY` dans Site settings → Environment.

### Option C — Cloudflare Pages
`wrangler.jsonc` est déjà configuré. `bunx wrangler deploy`.

## PWA / installation
Le manifest force `display_override: ["fullscreen", "standalone"]` → l'app s'ouvre en plein écran sur Android. Sur iOS, **Ajouter à l'écran d'accueil** depuis Safari.

## APK Android via PWABuilder
1. Déploie l'app (étapes ci-dessus).
2. Va sur https://www.pwabuilder.com → colle l'URL publique.
3. Onglet **Package for Stores → Android → Generate Package**.
4. Récupère l'APK signé. Installe via USB (ADB) ou Google Play.
5. Pour empêcher Android d'arrêter les fonctions en arrière-plan: désactive l'optimisation batterie pour l'app (Réglages → Apps → Finance-AI → Batterie → Sans restriction).

## Sécurité
La clé Groq précédemment partagée dans le chat est exposée publiquement: **révoque-la** sur https://console.groq.com/keys. Cette app utilise désormais Lovable AI côté serveur, jamais de clé exposée au navigateur.
