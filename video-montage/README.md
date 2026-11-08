# Montage vidéo (Remotion)

Montage de la vidéo « The magic you are looking for is in the work you're avoiding », dans le style de la vidéo de référence :
sous-titres empilés mot par mot (grotesk serré blanc + mots-clés en serif italique doré), mots en mode de fusion
**Différence** (comme dans Premiere Pro), textes placés **derrière** le sujet, zooms rapides et petits effets sonores discrets.
Pas de musique de fond (à ajouter séparément).

- Format : 1920×1440 (4:3, comme la référence), 25 i/s, 7,84 s
- Composition : `Montage`

## Structure

| Fichier | Rôle |
| --- | --- |
| `src/edit/script.ts` | Tout le montage : mots + timings, positions, mots en arrière-plan, caméra (zooms), effets sonores |
| `src/edit/Captions.tsx` | Styles et animation des sous-titres empilés |
| `src/edit/BehindSubject.tsx` | Textes derrière le sujet (guillemet, « magic », mur « AVOIDING ») |
| `src/edit/Montage.tsx` | Calques : plan → textes arrière → découpe du sujet → vignette → sous-titres → grain |
| `public/source.mp4` | Vidéo source recadrée (bande noire du bas retirée), 25 i/s |
| `public/cutout.webm` | Sujet détouré image par image (VP9 avec alpha) pour passer devant les textes |
| `public/sfx/*.wav` | Effets sonores synthétisés (libres de droits) |
| `public/fonts/*.woff2` | Inter Tight + Instrument Serif Italic (Google Fonts, licence OFL) |

Pour modifier un texte, un timing ou le volume d'un effet sonore, il suffit d'éditer `src/edit/script.ts`.
Le mot « Fuck » est affiché « F*ck » à l'écran (l'audio n'est pas modifié) pour ne pas limiter la portée sur IG/TikTok.

## Commandes

```bash
npm i
npm run dev                                  # Remotion Studio (aperçu)
npx remotion render Montage out/montage.mp4  # rendu final
npx remotion render Montage out/montage-sans-sfx.mp4 --props='{"cutout":true,"sfx":false}'
```
