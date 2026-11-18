# Montage premium – « You're not behind. You're just early. »

Montage Remotion de la vidéo podcast (1090×1080, 30 fps, 12,7 s : **format d'origine conservé**),
inspiré du style de la vidéo de référence : petits mots blancs qui apparaissent mot à mot,
mots-clés en serif doré italique, empilements de texte, sortie en flou.

**Vidéos finales :**
- **Version 1** (référence n°1, serif doré) : [`montage-final.mp4`](./montage-final.mp4) — composition `Montage`
- **Version 2** (référence n°2, grotesque épurée + jump cuts + flash lumineux) : [`montage-v2-final.mp4`](./montage-v2-final.mp4) — composition `MontageV2`
- **Version 3** (référence n°3, carte sur fond blanc + typo noire/rouge + flash chaud) : [`montage-v3-final.mp4`](./montage-v3-final.mp4) — composition `MontageV3`

## Ce qui a été fait

| Temps | Texte (parole) | Effet |
|---|---|---|
| 0:00 | You're **BEHIND** | Mot géant *derrière* la personne (détourage IA) + zoom-out d'ouverture, boom |
| 0:00 | because you're in a *rush.* | Mot doré qui arrive en vitesse avec traînée de flou de mouvement |
| 0:02 | and you're in a **RUSH** | Texte en mode **Différence** (effet Premiere) plein cadre, glitch + flash + RGB split |
| 0:03 | because you feel *behind,* | Serif doré (style référence) |
| 0:04 | and you feel **BEHIND** because… | Mot qui se répète en échos (la boucle), swell |
| 0:06 | you're in a *different* **SEASON** | Serif doré + mot géant derrière la personne |
| 0:07 | than the people you're **COMPARING** *yourself* to. | Barre blanche en mode **Différence** (vidéo inversée, mot en défonce) |
| 0:08–0:09 | — | Transition : push-in, désaturation, zoom blur + aberration chromatique, flash, light leak |
| 0:09 | You're **NOT** ~~*behind.*~~ | « behind » doré barré d'un trait doré |
| 0:11 | You're just *early.* | Titre final doré + light leak chaud |

- **Aucune musique.** Uniquement du sound design synchronisé : ticks sur les mots, whoosh, sub-boom,
  glitch, shimmer sur les mots dorés, riser + impact sur la transition.
  Mix sans saturation (true peak −0,5 dBFS, −16,8 LUFS ≈ niveau d'origine).
- Finition : étalonnage léger, grain film, vignette, mouvements de caméra (punch-in sur les mots forts).
- Le logo Instagram de la référence n'a pas été repris.

## Version 2 (`src/v2/`)

Même vidéo source et même format (1090×1080), style de la 2ᵉ référence :

- **Typo** : une seule grotesque serrée (Inter Tight, proche de Helvetica) en deux graisses —
  petits mots qui s'ajoutent un par un, mots-clés en extra-gras (pop ou montée avec flou vertical),
  mots fins qui passent du gris au blanc, révélation par balayage flou horizontal.
- **Rythme viral** : jump cuts avec recadrage à chaque phrase (serré / large / serré…), petit « snap » de zoom à chaque coupe,
  accroche serrée sur le visage dès la 1ʳᵉ image.
- **Mode Différence** : **RUSH**, **COMPARING**, **NOT**.
- **Mots derrière la personne** : **BEHIND**, **SEASON**.
- **Transition** : balayage lumineux prismatique (blanc + magenta + cyan) qui brûle au blanc sur la coupe vers le gros plan,
  puis frange colorée + aberration chromatique.
- **Son** : aucune musique ; effets **uniquement sur les transitions**, très bas
  (souffles discrets sur les coupes, whoosh/riser/shimmer légers sur le flash). Réglages dans `src/v2/SoundV2.tsx`.

## Version 3 (`src/v3/`)

Même vidéo source et même format (1090×1080), style de la 3ᵉ référence :

| Temps | Texte | Effet |
|---|---|---|
| 0:00 | You're **BEHIND** | Mot en capitales qui « se resserre » (lettres espacées → serrées) *derrière* la personne |
| 0:02 | and you're in a **RUSH** | Capitales qui se resserrent en mode **Différence** |
| 0:03 | because you feel **BEHIND,** | Capitales qui se resserrent (style « THINKING. » de la référence) |
| 0:04 | and you feel **behind** because | La vidéo **rétrécit en carte arrondie** sur fond blanc, flotte, puis **glitch** (blocs de pixels) |
| 0:06 | you're in a **different** *season.* than the people | **Intermède blanc** : typo noire, grand « SEASON » pâle en arrière-plan, « season. » qui grise |
| 0:07 | you're **comparing yourself** to. | Mots **rouges** qui clignotent (comme « and failed ») |
| 0:08–0:09 | — | Retour vidéo (coupe sèche) puis **flash chaud** rose/orange avec traînées de lumière vers le gros plan |
| 0:09 | You're **NOT** behind. | « NOT » en **Différence**, lettres qui se resserrent |
| 0:11 | You're just **early.** | Fin : la vidéo redevient une **carte** sur fond blanc, « early. » passe du blanc au noir |

- Jump cuts avec recadrage (serré / large) comme la référence. Logo Instagram non repris.
- **Son** : aucune musique ; petits effets **très bas** sur les animations de texte (ticks, pops, glitch) et
  sur les transitions (carte, glitch, flash). Réglages dans `src/v3/MontageV3.tsx` (`HITS`).

## Polices
Inter (texte), Inter Tight (mots lourds / différence), Instrument Serif (mots dorés) –
licence OFL, incluses dans `public/fonts`.

## Re-générer / modifier

```bash
npm i
npx remotion studio            # prévisualiser et modifier
npx remotion render src/index.ts Montage out/montage.mp4 --codec=h264 --crf=16
npx remotion render src/index.ts MontageV2 out/montage-v2.mp4 --codec=h264 --crf=16
npx remotion render src/index.ts MontageV3 out/montage-v3.mp4 --codec=h264 --crf=16
```

- Timing des mots : `src/lib/constants.ts` (frames à 30 fps)
- Textes et mise en page : `src/Montage.tsx`
- Sons : `src/components/SoundDesign.tsx` (sons générés par `scripts/make_sfx.py`)
- Détourage (mots derrière la personne) : `public/fg/*.webp`, générés avec RMBG-1.4 puis
  `scripts/make_cutouts.py` (voir l'en-tête du script)
- Les effets WebGL utilisent le rendu logiciel `swangle` (configuré dans `remotion.config.ts`).
