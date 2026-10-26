# Vidéo promo — Oumar

Vidéo de présentation (style Apple / SaaS) réalisée avec [Remotion](https://www.remotion.dev), inspirée de la vidéo de référence « Looking for video editor? ».

Deux formats sont disponibles :

| Composition | Format | Usage |
| --- | --- | --- |
| `OumarPromo` | 1920 × 1080 (16:9) | Format de la vidéo de référence, YouTube, site |
| `OumarPromoVertical` | 1080 × 1920 (9:16) | Reels Instagram, TikTok, Stories |

Durée : 24,5 s à 30 i/s. La vidéo contient uniquement les effets sonores : la musique de fond est à ajouter au montage.

## Déroulé

| Temps | Scène | Sons |
| --- | --- | --- |
| 0 – 3,5 s | **Accroche** : « Tu cherches un monteur vidéo ? » sur fond noir aurora, puis un orbe lumineux | whoosh, sub-drop, pop, riser |
| 3,4 s | L'orbe s'ouvre sur la scène suivante | **impact** |
| 3,5 – 10 s | **Présentation** : photo détourée qui dépasse du cercle, anneau dégradé, « Bonjour, je suis Oumar », badges, bouton | pop, shimmer, verre |
| 9,0 s | Le curseur clique sur « Voir mes réalisations », le bouton s'agrandit en plein écran | **clic**, whoosh |
| 10 – 18 s | **Portfolio** : tes 2 derniers reels dans deux iPhone en 3D | whoosh, pop |
| 18,3 s | **Appel à l'action** : « Commande maintenant. » | **impact**, shimmer |
| 23,8 – 24,5 s | Fondu au noir | — |

Les instants en gras sont de bons points d'appui pour caler les temps forts de ta musique.

## Photo

Le dépôt étant public, ta photo n'y est pas enregistrée (`public/images/` est ignoré par git).
Pour rendre la vidéo depuis un nouveau clone, place ta photo détourée (PNG à fond transparent) dans `public/images/oumar-cutout.png`.

## Ajouter tes 2 reels Instagram

1. Télécharge tes deux derniers reels (sans le son, il est coupé de toute façon).
2. Renomme-les `reel-1.mp4` (le plus récent) et `reel-2.mp4`.
3. Place-les dans `public/reels/` (non versionné, ils restent sur ta machine).
4. Relance le rendu (voir plus bas).

Les fichiers sont détectés automatiquement. Tant qu'ils sont absents, les téléphones affichent un écran provisoire « REEL 01 / REEL 02 ».

## Modifier les textes

Tous les textes sont dans `src/schema.ts` (`defaultPromoProps`) :

- `experience` : vide par défaut. Mets par exemple `"+2 ans d'expérience"` pour afficher un badge à côté de ton @Instagram.
- `availability`, `role`, `hookLine1`, `hookLine2`, `ctaLine1`… : modifiables librement.

On peut aussi les modifier dans le panneau « Props » de Remotion Studio.

## Commandes

```bash
npm install
npm run dev                                                    # aperçu dans Remotion Studio
npx remotion render OumarPromo out/oumar-promo-16x9.mp4        # rendu 16:9
npx remotion render OumarPromoVertical out/oumar-promo-9x16.mp4  # rendu 9:16
```

## Structure

```
src/
  Promo.tsx          enchaînement des 4 scènes et des transitions
  Sound.tsx          placement des effets sonores (image, fichier, volume)
  schema.ts          textes et réglages
  theme.ts           palette et polices
  transitions.tsx    ouverture par l'orbe, fondu en profondeur
  scenes/            Hook, Intro, Reels, Cta
  components/        avatar, textes animés, badges, bouton, curseur, iPhone
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
