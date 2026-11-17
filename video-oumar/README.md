# Vidéo de présentation d'Oumar (Remotion), en français et en russe

Une vidéo carrée (1080×1080, 30 i/s, environ 40 s) en motion design, avec voix off.
Elle reprend la structure de la vidéo de référence (« Hey, I'm a motion designer… ») :
typographie animée, éléments d'interface (stepper 1 000 $, champ de prompt IA, menu,
onglets, iMessage, carrousel des réseaux, calendrier) et une carte finale avec le
pseudo Instagram **@oumar__hamadou**.

Deux compositions partagent les mêmes scènes :

| Composition     | Voix                                   | Fichier final              |
| --------------- | -------------------------------------- | -------------------------- |
| `VideoOumar-FR` | fr-FR-RemyMultilingualNeural (homme)   | `out/video-oumar-fr.mp4`   |
| `VideoOumar-RU` | ru-RU-DmitryNeural (homme)             | `out/video-oumar-ru.mp4`   |

## Textes de la voix off

**Français.** Salut, je suis motion designer, je m'appelle Oumar, et je me lance un défi : gagner
mille dollars grâce au montage vidéo. Depuis quelques années, je fais ce que j'aime le plus :
monter des vidéos. Aujourd'hui, j'ai zéro client, pas d'audience, pas d'agence derrière moi,
juste une obsession : créer de meilleures vidéos. Alors, à partir d'aujourd'hui, je publie sur
Instagram, X et YouTube. Je vais continuer à créer, continuer à publier, et voir ce qui se passe,
jusqu'à décrocher mon premier client. Honnêtement, je ne sais pas combien de temps ça va prendre.
Et c'est justement ça qui est excitant.

**Русский.** Привет, я моушн-дизайнер, меня зовут Умар, и я бросаю себе вызов: заработать тысячу
долларов на монтаже видео. Последние несколько лет я занимаюсь тем, что люблю больше всего:
монтирую видео. Сейчас у меня ноль клиентов, ни аудитории, ни агентства за спиной, только
одержимость: делать видео лучше. Поэтому с сегодняшнего дня я публикую в Instagram, X и YouTube.
Я буду продолжать создавать, продолжать публиковать и смотреть, что будет, пока не найду своего
первого клиента. Честно говоря, я не знаю, сколько времени это займёт. И именно в этом весь азарт.

## Commandes

```bash
npm install
npm run dev         # Remotion Studio : prévisualiser les deux versions et chaque scène
npm run render:fr   # out/video-oumar-fr.mp4 (rendu + mastering audio à -14 LUFS)
npm run render:ru   # out/video-oumar-ru.mp4
npm run render      # les deux
```

## Modifier le texte, la voix ou ajouter une langue

1. **Ce que dit la voix** : `LANGS` dans `scripts/generate_voiceover.py` (une liste de phrases par
   scène, la voix, le débit et les pauses). Puis :
   ```bash
   pip install edge-tts
   python3 scripts/generate_voiceover.py ru   # ou fr
   ```
   Cela réécrit `public/voiceover/voix-oumar-<langue>.mp3` et `src/voiceover-<langue>.json`
   (horodatage de chaque mot). Toutes les animations se recalent dessus automatiquement.
2. **Ce qui s'affiche à l'écran** : `src/locales.tsx`. Chaque texte indique le numéro du mot
   prononcé avec lequel il apparaît (0 = premier mot de la scène). Si vous changez une phrase,
   vérifiez ces numéros avec le JSON généré.
3. **Nouvelle langue** : ajoutez une entrée dans `LANGS` (script) et dans `LOCALES` (`src/locales.tsx`),
   puis une `<Composition>` dans `src/Root.tsx`.

La carte finale (pseudo, sous-titre) et le volume de la musique sont des props des compositions
(`signature`, `tagline`, `musicVolume`), modifiables dans le Studio.

## Structure

- `src/Video.tsx` : la vidéo complète (scènes, voix, musique, bruitages), pour une langue donnée
- `src/scenes/` : une scène par phrase, prévisualisable seule dans le Studio (dossiers « Scenes-FR » / « Scenes-RU »)
- `src/locales.tsx` : textes à l'écran par langue ; `src/timeline.ts` : timing des scènes depuis la voix
- `scripts/` : génération de la voix off, de la musique de fond et des petits bruitages

## Ressources

- Musique de fond et bruitages « pop » / « typing » : synthétisés par les scripts de `scripts/` (originaux, libres de droits).
- Bruitages whoosh / click / switch : bibliothèque de sons de Remotion (remotion.media).
- Police Inter (licence SIL Open Font License, voir `public/fonts/LICENSE-Inter.txt`).
