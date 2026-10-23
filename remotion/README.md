# Vidéos Inspi Story (Remotion)

Typographie arabe animée, synchronisée mot à mot sur la voix (palette bordeaux / crème / pêche,
encadrés, cercle et volets en transition).

| Vidéo | Compositions | Script de montage |
| --- | --- | --- |
| « التوبة » | `Tawba`, `Tawba-Vertical` | [SCRIPT-tawba.md](./SCRIPT-tawba.md) |
| « الدائرة », avec le logo en fin | `Daira`, `Daira-Vertical` | [SCRIPT-daira.md](./SCRIPT-daira.md) |

## Lancer

```console
npm i
npm run dev                                   # aperçu dans Remotion Studio
npx remotion render Daira out/daira-16x9.mp4  # n'importe quelle composition ci-dessus
npm run render                                # out/tawba-16x9.mp4
npm run render:vertical                       # out/tawba-9x16.mp4
```

## Organisation

| Fichier | Rôle |
| --- | --- |
| `src/<vidéo>/script.ts` | **Le script** : textes et instant (en secondes de voix) où chaque mot apparaît |
| `src/<vidéo>/` | Assemblage de la vidéo (voix + scènes + transitions) |
| `src/components/StoryScene.tsx` | Scène générique pilotée par le script (titre, sous-titre, citation, encadré…) |
| `src/components/LogoOutro.tsx` | Carte de fin animée avec le logo Inspi Story (`public/brand/`) |
| `src/components/` | Révélation mot à mot, encadré, étoile, filigrane, volets, grain |
| `src/theme.ts` | Palette, police Amiri (fichiers locaux dans `public/fonts`), courbes d'animation |
| `public/<vidéo>/voix.m4a` | Piste son de la vidéo |

## Monter une nouvelle vidéo dans le même style

1. Copier `src/daira/` (le modèle le plus simple : une liste de scènes `SceneSpec`) et mettre la
   nouvelle piste son dans `public/<vidéo>/voix.m4a` (ajuster `VOICE.duration`).
2. Réécrire les textes dans `script.ts`, puis enregistrer la composition dans `src/Root.tsx`.
3. Recaler chaque `at` sur l'instant où le mot est prononcé. Une transcription avec horodatage
   mot par mot (Whisper) donne ces temps directement ; `npm run dev` permet de vérifier à l'oreille.
4. `br(...)` autour d'un mot force un retour à la ligne avant lui dans la version verticale.
