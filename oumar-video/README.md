# Oumar — Reel (RU)

Vidéo de 18 s (30 fps) réalisée avec Remotion, en russe, pour @oumar_hamadou,
en deux formats : horizontal 1920×1080 (`OumarReelHorizontal`) et vertical
1080×1920 (`OumarReel`). Les scènes s'adaptent au format.

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
npx remotion render OumarReelHorizontal out/oumar-reel-ru-horizontal.mp4 --crf=18
npx remotion render OumarReel out/oumar-reel-ru-vertical.mp4 --crf=18
```

## Personnaliser

- Profil (pseudo, nom, publications, abonnés, abonnements, bio) :
  `defaultProps` dans `src/Root.tsx`, ou le panneau Props du Studio.
- Photo de profil : remplacer `public/avatar.jpg` (carré, 600×600 ou plus).
- Textes : un fichier par scène dans `src/scenes/`.
- Timing : `src/timeline.ts` (1 temps = 16 images). Si le timing change,
  reporter les numéros d'images dans `scripts/make_soundtrack.py`.
- Polices et musique sont inclus dans `public/` : le rendu fonctionne
  hors-ligne.
