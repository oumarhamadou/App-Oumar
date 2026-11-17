# Vidéo de présentation d'Oumar (Remotion)

Une vidéo carrée (1080×1080, 30 i/s, environ 40 s) en motion design, avec une voix off en français.
Elle reprend la structure de la vidéo de référence (« Hey, I'm a motion designer… ») :
typographie animée, éléments d'interface (stepper 1 000 $, champ de prompt IA, menu,
onglets, iMessage, carrousel des réseaux, calendrier) et une carte finale avec le nom.

## Texte de la voix off

> Salut, je suis motion designer, je m'appelle Oumar, et je me lance un défi : gagner mille
> dollars grâce au montage vidéo. Depuis quelques années, je fais ce que j'aime le plus :
> monter des vidéos. Aujourd'hui, j'ai zéro client, pas d'audience, pas d'agence derrière moi,
> juste une obsession : créer de meilleures vidéos. Alors, à partir d'aujourd'hui, je publie
> sur Instagram, X et YouTube. Je vais continuer à créer, continuer à publier, et voir ce qui
> se passe, jusqu'à décrocher mon premier client. Honnêtement, je ne sais pas combien de
> temps ça va prendre. Et c'est justement ça qui est excitant.

## Commandes

```bash
npm install
npm run dev      # ouvre Remotion Studio pour prévisualiser
npm run render   # exporte out/video-oumar.mp4 (rendu + mastering audio à -14 LUFS)
```

## Modifier le texte ou la voix

1. Changez les phrases dans `SCRIPT` (et éventuellement `VOICE`, `RATE`) dans
   `scripts/generate_voiceover.py`. Gardez les mêmes identifiants de scène.
2. Régénérez la voix et les horodatages des mots :
   ```bash
   pip install edge-tts
   python3 scripts/generate_voiceover.py
   ```
   Cela réécrit `public/voiceover/voix-oumar.mp3` et `src/voiceover.json`. Toutes les
   animations se recalent automatiquement sur les nouveaux horodatages.
3. Si vous changez les mots affichés à l'écran, modifiez aussi la scène correspondante
   dans `src/scenes/`.

La voix est « fr-FR-RemyMultilingualNeural » (voix masculine jeune et naturelle de Microsoft Edge TTS).
Pour une voix plus expressive, vous pouvez générer le même texte avec un autre service (ElevenLabs,
par exemple) : il suffit de remplacer le MP3 et de garder des horodatages de mots au même format.

La carte finale (nom et sous-titre) et le volume de la musique sont des props de la
composition `VideoOumar` (`signature`, `tagline`, `musicVolume`), modifiables dans le Studio.

## Structure

- `src/Video.tsx` : la vidéo complète (scènes, voix, musique, bruitages)
- `src/scenes/` : une scène par phrase, aussi prévisualisable seule dans le Studio (dossier « Scenes »)
- `src/timeline.ts` : calcule le début de chaque scène à partir des horodatages de la voix
- `scripts/` : génération de la voix off, de la musique de fond et des petits bruitages

## Ressources

- Musique de fond et bruitages « pop » / « typing » : synthétisés par les scripts de `scripts/` (originaux, libres de droits).
- Bruitages whoosh / click / switch : bibliothèque de sons de Remotion (remotion.media).
- Police Inter (licence SIL Open Font License, voir `public/fonts/LICENSE-Inter.txt`).
