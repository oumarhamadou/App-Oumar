# Oumar — Reel (RU)

Vidéo verticale 1080×1920 (45 s, 30 fps) réalisée avec Remotion, en russe,
style Apple sur grilles verte, blanche et bleue.

## Commandes

```console
npm i                     # installer les dépendances
npm run dev               # ouvrir Remotion Studio (aperçu + édition)
npx remotion render OumarReel out/oumar-reel-ru.mp4 --crf=18
```

## Personnaliser

- Profil (nom, publications, abonnés, abonnements, bio) : `defaultProps` de
  `OumarReel` dans `src/Root.tsx`, ou le panneau Props du Studio.
- Photo de profil : remplacer `public/avatar.jpg` (carré, 600×600 ou plus).
- Textes et timing : un fichier par scène dans `src/scenes/`.
- Polices et sons sont inclus dans `public/` : le rendu fonctionne hors-ligne.
