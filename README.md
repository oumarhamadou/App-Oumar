# Prisme — IA · Économie · Finance

Prisme est une plateforme web qui rend l'intelligence artificielle, l'économie et la finance compréhensibles par tous. Elle réunit des actualités expliquées, un assistant pédagogique, un centre de connaissances avec simulateurs, des parcours d'apprentissage et un tableau de bord personnalisable.

> Le nom « Prisme » (un faisceau complexe décomposé en couleurs lisibles) est modifiable dans `src/lib/site.ts`.

## Fonctionnalités

| Module | Ce qu'il fait |
| --- | --- |
| **Fil d'actualité** (`/actualites`) | Agrège 10 flux RSS publics (presse, institutions, Google Actualités), classe chaque article par thème, affiche résumé, source et date. Filtres par domaine, thème et mot-clé ; mode « Pour vous » classé selon vos intérêts. Chaque article a une fiche « Pourquoi c'est important » et un bouton **Expliquer avec l'IA** (résumé, points clés, concepts liés). |
| **Assistant pédagogique** (`/assistant`) | « Mentor », propulsé par Claude : réponses en streaming adaptées au niveau (débutant, intermédiaire, avancé), recherche web avec **sources citées**, lecture d'un lien à résumer, modes « expliquer », « résumer », « comparer », « me tester ». Conversation conservée localement. |
| **Espace IA** (`/ia`) | Tendances commentées, annuaire de 20 outils filtrable par usage (études, travail, création, entrepreneuriat, automatisation, développement), notions clés, bonnes pratiques. |
| **Centre de connaissances** (`/savoir`) | 16 notions (inflation, taux, banques centrales, PIB, marchés, obligations, budget, diversification, analyse financière, modèle économique, change, commerce, monnaie, cryptoactifs…) expliquées à **3 niveaux**, avec exemple chiffré, quiz, sources ; 5 études de cas avec graphiques ; explorateur de données macroéconomiques. |
| **Simulateurs** (`/savoir/simulateurs`) | Intérêts composés (avec frais), pouvoir d'achat, crédit, budget 50/30/20, prix des obligations, seuil de rentabilité. |
| **Apprendre** (`/apprendre`) | 4 parcours, 16 leçons courtes avec exercice pratique et quiz, suivi de progression, série de jours, recommandations. |
| **Tableau de bord** (`/`) | 8 widgets réorganisables et masquables : à la une, marchés (devises BCE, cryptoactifs), indicateurs économiques, progression, recommandations, tendances IA, concept du jour, liste de lecture. |
| **Personnalisation** | Accueil en deux étapes (niveau, thèmes suivis), favoris, listes de lecture, historique, notifications in-app et navigateur, mode clair/sombre/système, export/import des données. |
| **Recherche** | Palette universelle (`Ctrl/⌘ + K` ou `/`), insensible aux accents, et page de recherche avancée. |

## Démarrer

Prérequis : Node.js 20.9 ou plus récent.

```bash
npm install
cp .env.example .env.local   # puis renseignez ANTHROPIC_API_KEY
npm run dev                  # http://localhost:3000
```

| Commande | Rôle |
| --- | --- |
| `npm run dev` | Serveur de développement |
| `npm run build` / `npm start` | Build et serveur de production |
| `npm run lint` | ESLint |
| `npm run typecheck` | Vérification TypeScript |
| `npm test` | Tests unitaires (Vitest) |

### Variables d'environnement

| Variable | Obligatoire | Effet |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | Non | Active l'assistant Claude et les explications d'articles. Sans clé, l'assistant répond en **mode hors ligne** à partir des fiches de la plateforme. |
| `ASSISTANT_WEB_SEARCH` | Non | `false` désactive la recherche web de l'assistant. |
| `NEXT_PUBLIC_SITE_URL` | Non | URL publique, pour `sitemap.xml` et `robots.txt`. |
| `COINGECKO_API_KEY` | Non | Clé « demo » CoinGecko si l'API publique limite les requêtes. |

## Architecture

- **Next.js 16** (App Router, Cache Components, pré-rendu partiel), **React 19**, **TypeScript**, **Tailwind CSS 4**.
- **Données serveur mises en cache** avec `"use cache"` : actualités rafraîchies toutes les 30 minutes, marchés toutes les heures. Chaque source est interrogée indépendamment ; une source en panne ne bloque pas les autres.
- **Données utilisateur** (profil, favoris, progression, notifications) stockées dans le navigateur via Zustand (`localStorage`), sans compte. Le store est isolé dans `src/lib/store.ts` pour pouvoir le brancher plus tard sur une base de données.
- **IA** : SDK officiel `@anthropic-ai/sdk`, modèle `claude-opus-5-5`, réponses en streaming (NDJSON), outils serveur de recherche et de lecture web pour les sources, repli automatique côté serveur (`fallbacks: "default"`) si une requête est refusée, sorties structurées validées par Zod pour les explications d'articles, limitation de débit par adresse IP.

```
src/
├── app/                 Pages et routes API (assistant, news, news/explain, markets, status)
├── components/          Interface : shell, dashboard, news, assistant, charts, simulators, learn…
├── content/             Contenus éditoriaux typés : concepts, études de cas, parcours, outils IA
├── hooks/               Hooks client (actualités, heure courante, statut IA…)
└── lib/
    ├── ai/              Client Claude, prompts, réponses hors ligne, événements de streaming
    ├── news/            Flux RSS, analyse RSS/Atom, classification thématique, exemples éditoriaux
    ├── markets/         Devises (BCE via Frankfurter), cryptoactifs (CoinGecko), macro (Banque mondiale)
    ├── simulators.ts    Calculs financiers purs (testés)
    ├── search.ts        Moteur de recherche plein texte
    ├── recommend.ts     Recommandations par affinité thématique
    └── store.ts         État utilisateur persistant
```

### Sources de données

| Donnée | Source | Repli si indisponible |
| --- | --- | --- |
| Actualités | Flux RSS listés dans `src/lib/news/feeds.ts` | 16 exemples éditoriaux résumant des événements réels et datés, signalés comme tels |
| Devises | Taux de référence BCE (API Frankfurter) | Moyennes annuelles 2024 de la BCE, signalées « Hors ligne » |
| Cryptoactifs | API publique CoinGecko | Message « indisponible » (aucun chiffre inventé) |
| Inflation, croissance | API Banque mondiale | Instantané 2015-2023 arrondi, signalé comme tel |

Ajouter une source d'actualité : une entrée dans `FEEDS` (`src/lib/news/feeds.ts`). Ajouter un concept, une leçon ou un outil : une entrée typée dans `src/content/`.

## Qualité

- 38 tests unitaires : calculs financiers, analyse RSS/Atom, classification, recherche, recommandations, analyse des API de marché, intégrité des contenus (liens, réponses de quiz).
- Accessibilité : navigation au clavier, rôles ARIA (onglets, interrupteurs, listes de choix), contraste clair/sombre, `prefers-reduced-motion`, chaque graphique a une **vue tableau**.
- Graphiques : palette catégorielle validée pour les daltonismes, déclinée par thème, sans double axe.
- Intégration continue : `.github/workflows/ci.yml` (lint, types, tests, build).

## Feuille de route

- Comptes utilisateurs et synchronisation multi-appareils (remplacer le stockage local du store).
- Interface multilingue (anglais, arabe…) et contenus traduits.
- Communauté d'apprentissage : discussions, partage de listes, défis.
- Alertes de marché personnalisées et résumé hebdomadaire par e-mail.
- Données supplémentaires (indices boursiers, taux directeurs, BRVM) et analyses générées par l'IA.

## Avertissement

Les contenus de Prisme sont éducatifs et ne constituent pas un conseil en investissement. L'IA peut se tromper : vérifiez les informations importantes auprès des sources citées.
