# Montage typographique — « يا ربِّ إن عظُمت ذنوبي كثرةً »

Projet [Remotion](https://www.remotion.dev) qui remonte la voix de la vidéo
source (un homme récitant le poème de repentir attribué à Abû Nuwâs) en
vidéo typographique, dans le style de la vidéo de référence : texte arabe
tapé lettre par lettre au rythme de la voix, palette bordeaux / crème /
rose poudré, encadré « surligneur », pastille, volets de transition, icône
Instagram animée et carte de fin.

## Commandes

```bash
npm install
npm run dev      # Remotion Studio : aperçu interactif
npm run render   # rendu final → out/montage-abou-nouwas.mp4 (1920×1080, 30 i/s)
npm run lint     # ESLint + TypeScript
```

## Le script

Une scène par vers, deux lignes par scène, comme la référence (5 scènes
de texte + carte de fin, environ 34 s).

| Scène | Fond | Entrée | Texte (style) | Voix |
| --- | --- | --- | --- | --- |
| Vers 1 | bordeaux | fondu | **يا ربِّ إنْ عظُمتْ ذنوبي كثرةً** (titre) · فلقدْ علمتُ بأنَّ عفوَكَ أعظمُ (sous-titre tapé) | 0,0 – 5,7 s |
| Vers 2 | crème | rideau vers le bas | — إنْ كانَ لا يرجوكَ إلّا محسنٌ (tapé) · — فبمَنْ يلوذُ ويستجيرُ المجرمُ؟ (roqaa) | 6,8 – 12,0 s |
| Vers 3 | bordeaux | volets | "أدعوكَ ربِّ كما أمرتَ تضرُّعًا" (encadré) · — فإذا رددتَ يدي فمَنْ ذا يرحمُ؟ (flou → net) | 13,7 – 20,2 s |
| Vers 4 | crème | rideau flou | ما لي إليكَ وسيلةٌ (pastille) · — إلّا الرَّجا (roqaa) | 21,5 – 23,9 s |
| Final | rose poudré | montée | **وجميلُ عفوِكَ** (titre) · ثمَّ إنّي مسلمُ · signature أبو نواس | 25,2 – 28,5 s |
| Fin | anthracite | coupe franche | icône Instagram qui s'illumine | — |

Traduction :

1. Seigneur, si mes péchés sont devenus immenses par leur nombre, je sais
   pourtant que Ton pardon est plus immense encore.
2. Si seul l'homme de bien peut T'implorer, auprès de qui le pécheur
   trouvera-t-il refuge et protection ?
3. Je T'invoque, Seigneur, avec humilité, comme Tu l'as ordonné ; si Tu
   repousses ma main, qui donc me fera miséricorde ?
4. Je n'ai d'autre moyen vers Toi que l'espérance, la beauté de Ton
   pardon, et puis je suis musulman.

## Modifier le montage

- **Texte, styles, fonds, transitions** : `src/script/script.ts`. Chaque
  ligne a un style (`title`, `subtitle`, `type`, `typeStrong`, `box`,
  `pill`, `blur`, `credit`) décrit dans `src/script/types.ts`.
- **Synchronisation** : `src/data/captions.json` contient la transcription
  horodatée mot par mot (Whisper, corrigée à la main et recalée sur les
  pauses du signal). Les mots du script y sont associés automatiquement,
  voyelles et variantes d'alif ignorées (`src/script/align.ts`) ; une scène
  démarre 380 ms avant son premier mot pour finir sa transition à temps.
- **Couleurs et polices** : `src/theme.ts`. Les polices Amiri et Aref Ruqaa
  (licence OFL) sont embarquées dans `public/fonts/`.

## Audio

- `public/voice.m4a` : voix extraite de la vidéo source, filtrée (passe-haut
  80 Hz, légère compression) et normalisée à −15 LUFS, crête −1,5 dBTP.
- `public/sfx/` : souffle de transition et impact de fin, synthétisés avec
  FFmpeg (aucun échantillon tiers).
