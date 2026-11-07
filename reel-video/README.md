# Reel « Le montage, c'est comme un jeu »

Vidéo motion design (Remotion) inspirée de la référence *sandydesignstudio* :
texte cinétique, mots qui se transforment en icônes d'outils, roue 3D de services,
carrousel 3D de cartes, puis révélation du profil et appel à l'action.

- **Formats** : vertical 1080×1920 (9:16, Reels / Shorts) et horizontal 1920×1080 (16:9), 30 fps, 24 s.
- **Palette Apple** : bleu nuit avec grille, vert flou avec grille, blanc.
- **Effet « Différence »** (mode de fusion type Premiere Pro) sur les mots clés
  (« jeu », « jouer », « Oumar », le lien Telegram), sur la pastille de sélection
  de la roue et sur le bouton « Suivre ». La transition roue → cartes est une onde
  d'inversion (« Smart Invert ») qui garde la palette bleu/vert.
- **Pas de musique** : uniquement des effets sonores discrets (pops, ticks, whooshes,
  glitch, riser, impact, clic). Tout le montage est calé sur une grille **120 BPM**
  (1 temps = 15 images) : une musique à 120 BPM posée à 0 s tombe en rythme.

## Versions

| Composition | Format | Langue | Photo | Plateforme |
| --- | --- | --- | --- | --- |
| `Reel-RU-Instagram` | vertical | russe | `public/photos/avatar-instagram.jpg` | Instagram |
| `Reel-FR-Facebook` | vertical | français | `public/photos/avatar-facebook.jpg` | Facebook |
| `Horizontal-RU-Instagram` | horizontal | russe | `public/photos/avatar-instagram.jpg` | Instagram |
| `Horizontal-FR-Facebook` | horizontal | français | `public/photos/avatar-facebook.jpg` | Facebook |

En horizontal, la mise en page suit la référence : « jouer. » à gauche et la roue
de services à droite, puis la photo à gauche et le texte à droite à la fin.
Les effets sonores sont identiques dans les deux formats.

## Commandes

```console
npm i
npm run dev            # Remotion Studio (aperçu + timeline)

# Rendu final
npx remotion render Reel-RU-Instagram out/reel-ru-instagram.mp4 --crf=16
npx remotion render Reel-FR-Facebook  out/reel-fr-facebook.mp4  --crf=16
npx remotion render Horizontal-RU-Instagram out/reel-ru-instagram-horizontal.mp4 --crf=16
npx remotion render Horizontal-FR-Facebook  out/reel-fr-facebook-horizontal.mp4  --crf=16

# Piste des effets sonores seule (pour mixer avec ta musique dans Premiere)
npx remotion render Reel-FR-Facebook out/reel-fr-sfx-only.wav --codec=wav
```

## Modifier

- **Textes** (FR / RU) : `src/i18n.ts` (`hookWide` / `playWide` = découpage des lignes en horizontal)
- **Timings** (scènes, mots, effets) : `src/timings.ts` — le son suit automatiquement.
- **Volume des effets sonores** : `SFX_GAIN` dans `src/SoundDesign.tsx`
  (1.4 par défaut : environ −30 LUFS, crêtes à −13,5 dBFS).
- **Couleurs** : `COLORS` dans `src/theme.ts`
- **Fond (grille + halos)** : `src/components/Background.tsx`

## Structure

```
src/
  Root.tsx              compositions (4 versions + scènes individuelles)
  layout.ts             détection vertical / horizontal
  Reel.tsx              timeline principale
  scenes/               Hook, Play (roue de services), Cards (carrousel), Outro
  components/           fond, mots animés, icônes, cartes, transition d'inversion
  SoundDesign.tsx       placement des effets sonores
public/
  sfx/                  effets sonores (synthétisés + bibliothèque Remotion), normalisés à −6 dBFS
  photos/               photos de profil recadrées
  fonts/                Inter (variable, latin + cyrillique) embarquée
```

Remotion est gratuit pour les particuliers et les équipes jusqu'à 3 personnes
([licence](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md)).
