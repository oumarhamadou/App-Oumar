# Vidéo « Что происходит после… » (version russe)

Vidéo Remotion 1080×1080, 30 fps, ~24,7 s : animations UI/SaaS, palette Apple, carte finale « Oumar · Видеомонтажёр ».

## Avant de lancer

La photo d'Oumar n'est pas versionnée (dépôt public). Placez-la dans `public/img/` :

- `public/img/oumar-avatar.jpg` — carré 512×512 centré sur le visage

## Commandes

```console
npm i
npm run dev                                  # Remotion Studio
npx remotion render OumarRU out/oumar-ru.mp4 # rendu final
```

## Structure

- `src/OumarVideo.tsx` — enchaînement des scènes (composition `OumarRU`)
- `src/scenes/` — Hook, Composer, Notifications, Chat, Phrase, EndCard (chacune prévisualisable seule)
- `public/sfx/`, `public/audio/music.wav` — bruitages et musique originaux, synthétisés pour cette vidéo
- `public/fonts/` — Inter / Inter Display (licence SIL OFL)
