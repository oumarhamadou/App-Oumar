# Oumar — Reel (RU)

Vidéo verticale 1080×1920 (18 s, 30 fps) réalisée avec Remotion, en russe.

- Montage, animations et effets d'interface : calqués sur la référence
  « A new beginning » (mots qui arrivent en flou, roue de mots, drop sur le
  logo Instagram, carte profil, zoom sur « Подписаться », avatar qui se pose
  dans la pastille, révélation plein écran).
- Typographie et palette : reprises de la référence « My Creation »
  (grotesque + Didone condensée + script, vert/blanc/noir), sur grilles
  blanche, verte et bleue.
- Musique : composition originale style SaaS (112,5 BPM), synthétisée par
  `scripts/make_soundtrack.py` et calée image par image sur le montage.

## Commandes

```console
npm i                     # installer les dépendances
npm run dev               # ouvrir Remotion Studio (aperçu + édition)
./scripts/build_audio.sh  # régénérer la musique (python3 + numpy + ffmpeg)
npx remotion render OumarReel out/oumar-reel-ru.mp4 --crf=18
```

## Personnaliser

- Profil (nom, publications, abonnés, abonnements, bio) : `defaultProps` de
  `OumarReel` dans `src/Root.tsx`, ou le panneau Props du Studio.
- Photo de profil : remplacer `public/avatar.jpg` (carré, 600×600 ou plus).
- Textes : un fichier par scène dans `src/scenes/`.
- Timing : `src/timeline.ts` (1 temps = 16 images). Si le timing change,
  reporter les numéros d'images dans `scripts/make_soundtrack.py`.
- Polices et musique sont inclus dans `public/` : le rendu fonctionne
  hors-ligne.
