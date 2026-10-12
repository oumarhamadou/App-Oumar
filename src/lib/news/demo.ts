import type { NewsItem } from "./types";

/**
 * Editorial examples shown when live feeds are unreachable (offline
 * development, blocked network). Each item summarizes a real, dated public
 * event and links to the institution concerned. They are always flagged
 * `isDemo` and labelled as such in the interface.
 */
export const DEMO_NEWS: NewsItem[] = [
  {
    id: "demo-nobel-eco-2025",
    title: "Le prix Nobel d'économie 2025 récompense les travaux sur la croissance tirée par l'innovation",
    summary:
      "Joel Mokyr, Philippe Aghion et Peter Howitt ont été distingués pour avoir expliqué comment l'innovation entretient la croissance économique. Mokyr a étudié les conditions historiques du progrès technique ; Aghion et Howitt ont formalisé la « destruction créatrice », par laquelle de nouvelles entreprises et technologies remplacent les anciennes.",
    whyItMatters:
      "Ces travaux éclairent un débat très actuel : comment des technologies comme l'IA peuvent relancer la productivité, et pourquoi la concurrence, la recherche et la capacité d'adaptation des économies conditionnent ces gains.",
    keyPoints: [
      "La croissance durable repose sur l'innovation continue.",
      "La « destruction créatrice » remplace les entreprises et technologies dépassées.",
      "Les institutions et la concurrence favorisent ou freinent ce processus.",
    ],
    url: "https://www.nobelprize.org/prizes/economic-sciences/2025/summary/",
    source: { name: "Fondation Nobel", url: "https://www.nobelprize.org/" },
    publishedAt: "2025-10-13T11:45:00.000Z",
    topics: ["economie-mondiale", "innovation"],
    lang: "fr",
    relatedConcepts: ["croissance-pib", "modele-economique"],
    isDemo: true,
  },
  {
    id: "demo-or-4000",
    title: "L'once d'or franchit pour la première fois le seuil de 4 000 dollars",
    summary:
      "Le cours de l'or a dépassé 4 000 dollars l'once début octobre 2025, prolongeant une hausse spectaculaire entamée en 2024. Les achats des banques centrales, les incertitudes géopolitiques et commerciales et les anticipations de baisses de taux ont soutenu la demande pour ce placement refuge.",
    whyItMatters:
      "L'or est souvent recherché en période d'incertitude. Sa hausse traduit une demande de protection, mais il ne verse ni intérêts ni dividendes et peut connaître de fortes corrections.",
    keyPoints: [
      "Les banques centrales ont fortement accru leurs réserves d'or.",
      "La baisse attendue des taux réduit le coût d'opportunité de détenir de l'or.",
      "Un actif refuge reste un actif volatil.",
    ],
    url: "https://www.gold.org/goldhub/data/gold-prices",
    source: { name: "World Gold Council", url: "https://www.gold.org/" },
    publishedAt: "2025-10-08T15:00:00.000Z",
    topics: ["marches", "economie-mondiale"],
    lang: "fr",
    relatedConcepts: ["diversification", "taux-interet"],
    isDemo: true,
  },
  {
    id: "demo-fed-sept-2025",
    title: "La Réserve fédérale reprend ses baisses de taux",
    summary:
      "Le 17 septembre 2025, la Fed a abaissé sa fourchette de taux directeurs d'un quart de point, à 4,00 %-4,25 %, sa première baisse de l'année. L'institution a mis en avant le ralentissement des créations d'emplois, tout en notant que l'inflation restait supérieure à son objectif de 2 %.",
    whyItMatters:
      "Les taux de la Fed influencent le coût du crédit aux États-Unis, la valeur du dollar et les marchés du monde entier. Une détente monétaire peut soutenir l'activité, mais la Fed doit arbitrer entre emploi et inflation.",
    keyPoints: [
      "Baisse de 0,25 point, à 4,00 %-4,25 %.",
      "Le marché du travail montre des signes de ralentissement.",
      "L'inflation reste au-dessus de la cible de 2 %.",
    ],
    url: "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm",
    source: { name: "Federal Reserve", url: "https://www.federalreserve.gov/" },
    publishedAt: "2025-09-17T18:00:00.000Z",
    topics: ["politique-monetaire", "economie-mondiale"],
    lang: "fr",
    relatedConcepts: ["banque-centrale", "taux-interet", "inflation"],
    isDemo: true,
  },
  {
    id: "demo-mistral-asml",
    title: "Mistral AI lève 1,7 milliard d'euros, avec ASML comme principal investisseur",
    summary:
      "En septembre 2025, la startup française d'intelligence artificielle Mistral AI a annoncé une levée de fonds de 1,7 milliard d'euros menée par le néerlandais ASML, fabricant de machines de lithographie pour semi-conducteurs. L'opération valorise Mistral AI à environ 11,7 milliards d'euros.",
    whyItMatters:
      "C'est l'une des plus importantes levées de fonds de la tech européenne. Elle illustre la volonté de constituer des acteurs européens de l'IA et les liens croissants entre IA et industrie des semi-conducteurs.",
    keyPoints: [
      "Levée de 1,7 Md€, valorisation d'environ 11,7 Md€.",
      "ASML devient un actionnaire de référence.",
      "Enjeu de souveraineté technologique européenne.",
    ],
    url: "https://mistral.ai/news",
    source: { name: "Mistral AI", url: "https://mistral.ai/" },
    publishedAt: "2025-09-09T08:00:00.000Z",
    topics: ["startups", "ia", "entreprises"],
    lang: "fr",
    relatedConcepts: ["modele-economique", "analyse-financiere"],
    isDemo: true,
  },
  {
    id: "demo-genius-act",
    title: "Les États-Unis se dotent d'un cadre fédéral pour les stablecoins",
    summary:
      "Promulgué le 18 juillet 2025, le GENIUS Act établit des règles fédérales pour les émetteurs de stablecoins de paiement aux États-Unis : réserves composées d'actifs sûrs et liquides, obligations de transparence et supervision des émetteurs.",
    whyItMatters:
      "Les stablecoins servent de pont entre cryptoactifs et monnaie traditionnelle. Un cadre clair peut favoriser leur usage dans les paiements, mais soulève des questions sur la stabilité financière et la souveraineté monétaire des autres pays.",
    keyPoints: [
      "Réserves exigées en actifs sûrs et liquides.",
      "Supervision et transparence des émetteurs.",
      "Un pas vers l'intégration des stablecoins dans les paiements.",
    ],
    url: "https://www.congress.gov/",
    source: { name: "Congrès des États-Unis", url: "https://www.congress.gov/" },
    publishedAt: "2025-07-18T20:00:00.000Z",
    topics: ["crypto", "finance-perso"],
    lang: "fr",
    relatedConcepts: ["cryptoactifs", "monnaie"],
    isDemo: true,
  },
  {
    id: "demo-bce-juin-2025",
    title: "La BCE ramène son taux de dépôt à 2 %",
    summary:
      "Le 5 juin 2025, la Banque centrale européenne a abaissé ses taux directeurs de 0,25 point, portant le taux de la facilité de dépôt à 2 %. Il s'agissait de la huitième baisse depuis juin 2024, l'inflation en zone euro étant revenue près de l'objectif de 2 %.",
    whyItMatters:
      "La baisse des taux allège le coût du crédit pour les ménages et les entreprises, mais réduit aussi la rémunération de l'épargne. Elle signale que la BCE juge la lutte contre l'inflation largement réussie.",
    keyPoints: [
      "Taux de dépôt ramené à 2 %.",
      "Huitième baisse depuis juin 2024.",
      "Inflation proche de la cible de 2 %.",
    ],
    url: "https://www.ecb.europa.eu/press/govcdec/mopo/html/index.en.html",
    source: { name: "Banque centrale européenne", url: "https://www.ecb.europa.eu/" },
    publishedAt: "2025-06-05T12:15:00.000Z",
    topics: ["politique-monetaire", "finance-perso"],
    lang: "fr",
    relatedConcepts: ["banque-centrale", "taux-interet", "inflation"],
    isDemo: true,
  },
  {
    id: "demo-tarifs-avril-2025",
    title: "Washington annonce une hausse généralisée des droits de douane",
    summary:
      "Le 2 avril 2025, l'administration américaine a annoncé un droit de douane minimal de 10 % sur la plupart des importations, et des taux plus élevés pour de nombreux partenaires commerciaux. Après une forte chute des marchés, une partie des hausses a été suspendue pour 90 jours une semaine plus tard.",
    whyItMatters:
      "Les droits de douane renchérissent les importations, perturbent les chaînes d'approvisionnement et peuvent peser sur la croissance mondiale. L'incertitude sur la politique commerciale pèse aussi sur les décisions d'investissement.",
    keyPoints: [
      "Droit de douane de base de 10 % sur la plupart des importations.",
      "Forte volatilité des marchés financiers.",
      "Suspension partielle de 90 jours pour négocier.",
    ],
    url: "https://www.wto.org/",
    source: { name: "Organisation mondiale du commerce", url: "https://www.wto.org/" },
    publishedAt: "2025-04-02T20:00:00.000Z",
    topics: ["economie-mondiale", "marches"],
    lang: "fr",
    relatedConcepts: ["commerce-international", "taux-de-change"],
    isDemo: true,
  },
  {
    id: "demo-deepseek",
    title: "Le modèle chinois DeepSeek-R1 secoue les valeurs de l'IA",
    summary:
      "La publication fin janvier 2025 du modèle de raisonnement DeepSeek-R1, aux performances proches des meilleurs modèles pour un coût d'entraînement annoncé bien inférieur, a provoqué une chute brutale des valeurs technologiques le 27 janvier. Nvidia a perdu environ 17 % en une séance.",
    whyItMatters:
      "L'épisode a montré la sensibilité des marchés aux hypothèses sur le coût de l'IA : si des modèles performants deviennent moins chers à produire, la demande de puces et la rentabilité des investissements massifs pourraient être revues.",
    keyPoints: [
      "Un modèle performant publié avec ses poids ouverts.",
      "Forte baisse des valeurs liées aux semi-conducteurs.",
      "Débat sur le coût réel et l'efficacité de l'IA.",
    ],
    url: "https://github.com/deepseek-ai/DeepSeek-R1",
    source: { name: "DeepSeek (publication technique)", url: "https://github.com/deepseek-ai" },
    publishedAt: "2025-01-27T21:00:00.000Z",
    topics: ["ia", "marches", "innovation"],
    lang: "fr",
    relatedConcepts: ["marches-financiers", "diversification"],
    isDemo: true,
  },
  {
    id: "demo-mica-2024",
    title: "Le règlement européen MiCA s'applique désormais pleinement",
    summary:
      "Depuis le 30 décembre 2024, l'ensemble des prestataires de services sur cryptoactifs de l'Union européenne relève du règlement MiCA. Les règles applicables aux émetteurs de stablecoins étaient déjà en vigueur depuis le 30 juin 2024.",
    whyItMatters:
      "MiCA offre un cadre unique dans l'UE : agrément des plateformes, protection des clients, exigences sur les réserves des stablecoins. Il réduit certains risques, sans supprimer la volatilité des cryptoactifs.",
    keyPoints: [
      "Un agrément valable dans toute l'UE.",
      "Règles spécifiques pour les stablecoins.",
      "Meilleure protection des investisseurs.",
    ],
    url: "https://www.esma.europa.eu/esmas-activities/digital-finance-and-innovation/markets-crypto-assets-regulation-mica",
    source: { name: "ESMA", url: "https://www.esma.europa.eu/" },
    publishedAt: "2024-12-30T09:00:00.000Z",
    topics: ["crypto", "finance-perso"],
    lang: "fr",
    relatedConcepts: ["cryptoactifs"],
    isDemo: true,
  },
  {
    id: "demo-nobel-ia-2024",
    title: "Deux prix Nobel 2024 saluent les fondations de l'intelligence artificielle",
    summary:
      "Le prix Nobel de physique 2024 a récompensé John Hopfield et Geoffrey Hinton pour leurs découvertes fondatrices sur les réseaux de neurones artificiels. Le lendemain, le Nobel de chimie a distingué David Baker, ainsi que Demis Hassabis et John Jumper pour AlphaFold, qui prédit la structure des protéines.",
    whyItMatters:
      "Cette double reconnaissance montre que l'IA est devenue un outil scientifique majeur, capable d'accélérer la recherche, notamment en biologie et en médecine.",
    keyPoints: [
      "Physique : réseaux de neurones artificiels.",
      "Chimie : conception et prédiction de protéines.",
      "L'IA s'impose comme outil de découverte scientifique.",
    ],
    url: "https://www.nobelprize.org/all-nobel-prizes-2024/",
    source: { name: "Fondation Nobel", url: "https://www.nobelprize.org/" },
    publishedAt: "2024-10-09T10:00:00.000Z",
    topics: ["ia", "innovation"],
    lang: "fr",
    isDemo: true,
  },
  {
    id: "demo-nobel-eco-2024",
    title: "Nobel d'économie 2024 : les institutions, clé de la prospérité des nations",
    summary:
      "Daron Acemoglu, Simon Johnson et James Robinson ont reçu le prix pour leurs travaux sur la façon dont les institutions façonnent la prospérité. Leurs recherches montrent que les sociétés dotées d'institutions inclusives (État de droit, protection des droits) ont tendance à prospérer durablement.",
    whyItMatters:
      "Ces travaux aident à comprendre les écarts de richesse entre pays et le rôle de la gouvernance dans le développement économique.",
    keyPoints: [
      "Institutions inclusives et extractives.",
      "Explication des écarts de prospérité entre pays.",
      "Un éclairage majeur pour les politiques de développement.",
    ],
    url: "https://www.nobelprize.org/prizes/economic-sciences/2024/summary/",
    source: { name: "Fondation Nobel", url: "https://www.nobelprize.org/" },
    publishedAt: "2024-10-14T11:45:00.000Z",
    topics: ["economie-mondiale"],
    lang: "fr",
    relatedConcepts: ["croissance-pib"],
    isDemo: true,
  },
  {
    id: "demo-inflation-zone-euro-sept-2024",
    title: "L'inflation en zone euro repasse sous 2 % pour la première fois depuis 2021",
    summary:
      "Selon l'estimation rapide d'Eurostat publiée le 1er octobre 2024, l'inflation annuelle en zone euro est tombée à 1,8 % en septembre 2024, sous la cible de la BCE pour la première fois depuis mi-2021, principalement grâce à la baisse des prix de l'énergie.",
    whyItMatters:
      "Ce reflux a ouvert la voie à de nouvelles baisses de taux de la BCE. Attention : une inflation plus faible signifie que les prix augmentent moins vite, pas qu'ils baissent.",
    keyPoints: [
      "Inflation à 1,8 % sur un an en septembre 2024.",
      "Recul tiré par l'énergie.",
      "Les services restent plus inflationnistes.",
    ],
    url: "https://ec.europa.eu/eurostat/web/euro-indicators",
    source: { name: "Eurostat", url: "https://ec.europa.eu/eurostat" },
    publishedAt: "2024-10-01T09:00:00.000Z",
    topics: ["economie-mondiale", "politique-monetaire"],
    lang: "fr",
    relatedConcepts: ["inflation", "banque-centrale"],
    isDemo: true,
  },
  {
    id: "demo-ai-act",
    title: "L'AI Act, premier cadre juridique complet sur l'IA, entre en vigueur",
    summary:
      "Le règlement européen sur l'intelligence artificielle est entré en vigueur le 1er août 2024. Son application est progressive : les interdictions de certains usages (comme la notation sociale) s'appliquent depuis février 2025, les règles sur les modèles d'IA à usage général depuis août 2025.",
    whyItMatters:
      "L'AI Act classe les systèmes d'IA selon leur niveau de risque. Les entreprises qui développent ou utilisent l'IA en Europe doivent évaluer leurs systèmes, documenter leurs usages et garantir la transparence.",
    keyPoints: [
      "Approche fondée sur les niveaux de risque.",
      "Certains usages sont interdits.",
      "Application échelonnée jusqu'en 2026-2027.",
    ],
    url: "https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai",
    source: { name: "Commission européenne", url: "https://digital-strategy.ec.europa.eu/" },
    publishedAt: "2024-08-01T08:00:00.000Z",
    topics: ["ia", "innovation"],
    lang: "fr",
    isDemo: true,
  },
  {
    id: "demo-etf-bitcoin",
    title: "La SEC autorise les premiers ETF bitcoin au comptant aux États-Unis",
    summary:
      "Le 10 janvier 2024, l'autorité américaine des marchés financiers a approuvé la cotation de fonds négociés en bourse investis directement en bitcoin. Ces produits permettent d'exposer un portefeuille au bitcoin via un compte-titres classique.",
    whyItMatters:
      "L'accès facilité pour les investisseurs institutionnels et particuliers a marqué une étape dans l'intégration des cryptoactifs à la finance traditionnelle, sans réduire leur volatilité.",
    keyPoints: [
      "Exposition au bitcoin via un produit coté réglementé.",
      "Arrivée de grands gestionnaires d'actifs.",
      "Le risque de prix reste entier.",
    ],
    url: "https://www.sec.gov/",
    source: { name: "SEC", url: "https://www.sec.gov/" },
    publishedAt: "2024-01-10T22:00:00.000Z",
    topics: ["crypto", "marches"],
    lang: "fr",
    relatedConcepts: ["cryptoactifs", "marches-financiers"],
    isDemo: true,
  },
  {
    id: "demo-euro-numerique",
    title: "La BCE lance la phase de préparation de l'euro numérique",
    summary:
      "Le Conseil des gouverneurs de la BCE a décidé en octobre 2023 de passer à une phase de préparation de l'euro numérique à partir du 1er novembre 2023 : finalisation des règles, choix des prestataires et expérimentations. Son émission éventuelle dépend aussi de l'adoption d'un cadre législatif européen.",
    whyItMatters:
      "Un euro numérique serait une monnaie de banque centrale utilisable pour les paiements électroniques du quotidien, avec des enjeux de souveraineté, de confidentialité et de concurrence avec les solutions de paiement privées.",
    keyPoints: [
      "Phase de préparation ouverte en novembre 2023.",
      "Décision d'émission non encore prise.",
      "Un cadre législatif européen est nécessaire.",
    ],
    url: "https://www.ecb.europa.eu/euro/digital_euro/html/index.en.html",
    source: { name: "Banque centrale européenne", url: "https://www.ecb.europa.eu/" },
    publishedAt: "2023-10-18T14:00:00.000Z",
    topics: ["politique-monetaire", "crypto", "innovation"],
    lang: "fr",
    relatedConcepts: ["monnaie", "banque-centrale"],
    isDemo: true,
  },
  {
    id: "demo-zlecaf",
    title: "La Zone de libre-échange continentale africaine ouvre ses échanges",
    summary:
      "Les échanges commerciaux dans le cadre de la ZLECAf ont officiellement débuté le 1er janvier 2021. L'accord vise à réduire progressivement les droits de douane entre pays africains et à créer l'un des plus grands marchés du monde par le nombre de pays participants.",
    whyItMatters:
      "Le commerce entre pays africains reste faible comparé à d'autres régions. Sa progression pourrait favoriser l'industrialisation, la diversification des économies et la création d'emplois.",
    keyPoints: [
      "Démarrage des échanges le 1er janvier 2021.",
      "Réduction progressive des droits de douane.",
      "Enjeux d'infrastructures et d'harmonisation des règles.",
    ],
    url: "https://au-afcfta.org/",
    source: { name: "Secrétariat de la ZLECAf", url: "https://au-afcfta.org/" },
    publishedAt: "2021-01-01T08:00:00.000Z",
    topics: ["economie-mondiale", "entreprises"],
    lang: "fr",
    relatedConcepts: ["commerce-international"],
    isDemo: true,
  },
];
