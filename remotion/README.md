# Vidéo « التوبة » (Remotion)

Typographie arabe animée, synchronisée mot à mot sur la voix, dans le style de la vidéo de
référence (palette bordeaux / crème / pêche, encadrés, cercle et volets en transition).
Le déroulé complet est dans [SCRIPT.md](./SCRIPT.md).

## Lancer

```console
npm i
npm run dev              # aperçu dans Remotion Studio
npm run render           # out/tawba-16x9.mp4 (1920×1080)
npm run render:vertical  # out/tawba-9x16.mp4 (1080×1920)
```

## Organisation

| Fichier | Rôle |
| --- | --- |
| `src/script.ts` | **Le script** : textes et instant (en secondes de voix) où chaque mot apparaît |
| `src/theme.ts` | Palette, police Amiri (fichiers locaux dans `public/fonts`), courbes d'animation |
| `src/Tawba.tsx` | Assemblage : voix + scènes + volets + grain |
| `src/scenes/` | Intro bordeaux, 3 conditions sur crème, droits d'autrui, 4ᵉ condition, récap |
| `src/components/` | Révélation mot à mot, encadré, étoile, filigrane, volets, grain |
| `public/voix.m4a` | Piste voix |

## Monter une nouvelle vidéo dans le même style

1. Remplacer `public/voix.m4a` par la nouvelle voix (et ajuster `VOICE.duration`).
2. Réécrire les textes dans `src/script.ts`.
3. Recaler chaque `at` sur l'instant où le mot est prononcé. Une transcription avec horodatage
   mot par mot (Whisper) donne ces temps directement ; `npm run dev` permet de vérifier à l'oreille.
4. `br(...)` autour d'un mot force un retour à la ligne avant lui dans la version verticale.
