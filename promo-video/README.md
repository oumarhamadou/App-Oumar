# Vidéo promo — Oumar

Vidéo de présentation (style Apple / SaaS) réalisée avec [Remotion](https://www.remotion.dev), inspirée de la vidéo de référence « Looking for video editor? ».

La vidéo existe en russe et en français, chacune en deux formats :

| Composition | Langue | Format | Usage |
| --- | --- | --- | --- |
| `Oumar-RU` | russe | 1920 × 1080 (16:9) | Format de la vidéo de référence, YouTube, site |
| `Oumar-RU-Vertical` | russe | 1080 × 1920 (9:16) | Reels Instagram, TikTok, Stories |
| `Oumar-FR` | français | 1920 × 1080 (16:9) | |
| `Oumar-FR-Vertical` | français | 1080 × 1920 (9:16) | |

Durée : 26,5 s à 30 i/s. La vidéo contient uniquement les effets sonores : la musique de fond est à ajouter au montage.

## Déroulé

| Temps | Scène | Sons |
| --- | --- | --- |
| 0 – 3,5 s | **Accroche** : « Ищешь видеомонтажёра? » sur fond noir aurora, puis un orbe lumineux | whoosh, sub-drop, pop, riser |
| 3,4 s | L'orbe s'ouvre sur la scène suivante | **impact** |
| 3,5 – 10 s | **Présentation** : photo détourée qui dépasse du cercle, anneau dégradé, « Привет, я Oumar », badges, bouton | pop, shimmer, verre |
| 9,0 s | Le curseur clique sur « Смотреть мои работы », le bouton s'agrandit en plein écran | **clic**, whoosh |
| 10 – 20 s | **Portfolio** : tes 2 vidéos dans des fenêtres macOS, à leur format d'origine | whoosh |
| 20,3 s | **Appel à l'action** : « Закажи сейчас. » | **impact**, shimmer |
| 25,8 – 26,5 s | Fondu au noir | — |

Les instants en gras sont de bons points d'appui pour caler les temps forts de ta musique.

## Photo

Le dépôt étant public, ta photo n'y est pas enregistrée (`public/images/` est ignoré par git).
Pour rendre la vidéo depuis un nouveau clone, place ta photo détourée (PNG à fond transparent) dans `public/images/oumar-cutout.png`.

## Vidéos du portfolio

1. Renomme tes deux vidéos `reel-1.mp4` et `reel-2.mp4`.
2. Place-les dans `public/reels/` (non versionné, elles restent sur ta machine).
3. Relance le rendu (voir plus bas).

Le format de chaque vidéo (16:9, carré, vertical…) est détecté automatiquement et les fenêtres s'y adaptent. Le son des vidéos est coupé. Tant qu'un fichier est absent, sa fenêtre affiche un écran provisoire.

## Modifier les textes

Tous les textes sont dans `src/schema.ts` (`ruProps` pour le russe, `frProps` pour le français) :

- `experience` : vide par défaut. Mets par exemple `"+2 ans d'expérience"` pour afficher un badge à côté de ton @Instagram.
- `reel1Label`, `reel2Label` : titres des fenêtres du portfolio.
- `availability`, `role`, `hookLine1`, `hookLine2`, `ctaLine1`… : modifiables librement.

On peut aussi les modifier dans le panneau « Props » de Remotion Studio.

## Commandes

```bash
npm install
npm run dev                                                    # aperçu dans Remotion Studio
npx remotion render Oumar-RU out/oumar-promo-ru-16x9.mp4           # russe 16:9
npx remotion render Oumar-RU-Vertical out/oumar-promo-ru-9x16.mp4  # russe 9:16
npx remotion render Oumar-FR out/oumar-promo-fr-16x9.mp4           # français 16:9
```

## Structure

```
src/
  Promo.tsx          enchaînement des 4 scènes et des transitions
  Sound.tsx          placement des effets sonores (image, fichier, volume)
  schema.ts          textes (russe et français)
  timeline.ts        durée des scènes et des transitions
  theme.ts           palette et polices
  transitions.tsx    ouverture par l'orbe, fondu en profondeur
  scenes/            Hook, Intro, Reels, Cta
  components/        avatar, textes animés, badges, bouton, curseur
public/
  images/            photo détourée (non versionnée)
  sfx/               effets sonores
  fonts/             Inter et Inter Display (licence SIL OFL)
scripts/stills.mjs   export d'images fixes pour vérifier une scène
```

## Crédits

- Police : [Inter](https://rsms.me/inter/) par Rasmus Andersson, licence SIL Open Font License.
- Sons d'interface (`click`, `glass`, `select`) : [Kenney](https://kenney.nl), domaine public (CC0), voir `public/sfx/KENNEY-LICENSE.txt`.
- Autres sons (`whoosh-*`, `riser`, `impact`, `shimmer`, `pop*`, `sub-drop`) : synthétisés pour ce projet.
- Photo détourée localement avec [rembg](https://github.com/danielgatis/rembg).
