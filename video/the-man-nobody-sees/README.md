# « The man nobody sees » — montage vertical 9:16

Montage d'une voix off de 37 s (anglais, piano en fond) en reel de 39,6 s : images de stock 4K,
palettes (dégradé, grille, vif premium, style Apple) et illustrations UI SaaS animées, calées au mot
près sur la voix et sur les changements d'accords de la musique.

- Projet invideo : https://invideo.io/@oumars-workspace-44/prisme-montage-video-verticale
- Timeline finale : https://invideo.io/@oumars-workspace-44/prisme-montage-video-verticale/tree/main/seq-3.1
- Variante Adobe Stock (branche) : https://invideo.io/@oumars-workspace-44/prisme-montage-video-verticale/tree/version-adobe-stock/seq-3.1

## Analyse de la source

| Élément | Constat |
| --- | --- |
| Image | 1440×2560, 30 i/s, 37 s, **un gris uni sur les 1 110 images** : tout le contenu est dans l'audio |
| Voix | Monologue anglais, transcrit mot à mot (VideoDB) ; coupé en plein mot à la fin (« …the most in the. ») |
| Musique | Piano lent, un accord toutes les **1,98 s** (1.60, 3.58, 5.56 … 37.24), progression G → Am en fin de grille |

## Structure

| Piste | Contenu |
| --- | --- |
| V1 « Stock 4K » | 11 plans invideo (4K, 0,05 crédit) avec Ken Burns (`dynamic_zoom`), étalonnage par palette et transitions |
| V2 « Motion UI + sous-titres » | `render/index.html` rendu image par image en WebM VP9 **avec alpha** (1080×1920, 30 i/s) |
| A1 | Voix + musique coupées à 36,83 s, queue musicale (pont en sol puis résolution en la mineur), écho sur « most », −14 LUFS |

## Storyboard

| # | Temps (s) | Parole | Image | Motion UI / palette |
| --- | --- | --- | --- | --- |
| 1 | 0.00–3.40 | There's a version of a man / that nobody ever sees. | Homme à la fenêtre la nuit (photo 4K) → ombre derrière les stores | Carte profil « Him », sélecteur Everyone → Friends → **Nobody** sur « nobody » · nuit bleue |
| 2 | 3.40–8.15 | Not his friends, not his family, not even the person he loves. | — | Réglages iOS : 3 interrupteurs qui s'éteignent sur *friends* / *family* / *loves* · **grille** |
| 3 | 8.15–12.45 | It's the version of him that sits alone with his thoughts at night, | Homme au lit éclairé par son téléphone | Écran verrouillé 2:47 → 2:48 sur l'accord, notifications sur « night » |
| 4 | 12.45–14.15 | questioning everything. | — | Recherche tapée pendant « questioning », 5 questions sur « everything » · **dégradé vif premium** |
| 5 | 14.15–18.30 | His choices, his worth, his future. | — | Tableau de bord bento : Choices / Worth / Future, une carte par mot · grille + glow |
| 6 | 18.30–21.40 | That's the man who doesn't know if he's doing life right. | Homme éveillé, réveil 2:35 | Alerte iOS « Are you doing life right? », hésitation du doigt, secousse sur « right » |
| 7 | 21.40–23.20 | But in the morning, | Soleil à travers les stores (light leak à 21.40, sur l'accord) | Notification Alarme 7:00 · **style Apple clair** |
| 8–10 | 23.20–29.70 | he gets up, he smiles, he plays his role like nothing ever happened. | Réveil → sourire → réunion | Checklist « Morning routine » cochée sur *up* / *smiles* / *role* / *happened*, 4/4 + « Streak 1,284 days » |
| 11 | 29.70–32.40 | And that's what breaks my heart. | Pluie sur la vitre, désaturée | Cœur qui bat sur *that's* / *what* et se brise sur « breaks » |
| 12 | 32.40–34.55 | Because the strongest man you know | Homme musclé, duotone rose-violet | Typo géante mot par mot, « STRONGEST » en dégradé |
| 13 | 34.55–36.80 | might be the one struggling the most. | Gros plan, désaturé | Batterie 100 % → 3 % sur « struggling », alerte « Low Battery » |
| 14 | 36.80–39.60 | (queue musicale) | — | Carte de fin « Check on your strong friend. » + iMessage « Hey… how are you, really? » |

## Variante « Version Adobe Stock »

Six images Adobe Stock (collection gratuite, licenciées), recadrées en 2160×3840 :

| Image | Usage |
| --- | --- |
| AdobeStock_195692258 — homme aux baies vitrées la nuit | Scène 1a (0.00–1.60), recadrée sur l'homme |
| AdobeStock_335797584 — silhouette à la fenêtre | Scène 1b (1.60–3.40) |
| AdobeStock_218647467 — contemplation au lever du soleil | Scène 7 (21.40–23.20) |
| AdobeStock_679471153 — dégradé rose-violet-noir | Fond de la scène 2 |
| AdobeStock_841735316 — dégradé bleu-violet-rose-orange | Fond de la scène 4 |
| AdobeStock_788558151 — dégradé carmin-magenta | Fond de la scène 5 |

La couche motion de cette variante est rendue avec `ALT=1` (page ouverte avec `?alt=1`) : les scènes
2, 4 et 5 perdent leur fond opaque au profit d'un voile sombre, pour laisser voir les dégradés.

## Re-rendre la couche motion

```bash
export NODE_PATH=$(npm root -g)            # playwright global
mkdir -p frames
node scripts/stills.js render/index.html frames 2.6 17.9 33.95   # aperçus
N=1188; for i in 0 1 2 3; do node scripts/capture.js render/index.html frames 30 $((i*N/4)) $(((i+1)*N/4)) & done; wait
# variante Adobe Stock : préfixer les commandes node par ALT=1
ffmpeg -framerate 30 -i frames/f_%05d.png -c:v libvpx-vp9 -pix_fmt yuva420p -crf 22 -b:v 0 \
  -row-mt 1 -auto-alt-ref 0 motion_layer_alpha.webm
```

Les temps des mots et des accords sont dans `render/words.js` ; chaque scène est une fonction
`S*(t)` déterministe dans `render/index.html`. `scripts/audio.py` reconstruit la bande-son à partir
de l'audio source (non versionné).
