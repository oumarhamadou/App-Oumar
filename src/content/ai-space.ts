import type { AiNotion, AiTool, AiToolCategory, AiTrend } from "./types";

export const AI_TOOL_CATEGORIES: Record<AiToolCategory, { label: string; description: string }> = {
  assistants: {
    label: "Assistants généralistes",
    description: "Converser, expliquer, rédiger, analyser des documents.",
  },
  etudes: {
    label: "Études & recherche",
    description: "Comprendre des sources, réviser, trouver des références.",
  },
  travail: {
    label: "Travail & productivité",
    description: "Rédaction, réunions, traduction, organisation.",
  },
  creation: {
    label: "Création de contenu",
    description: "Images, vidéos, voix, présentations, design.",
  },
  entrepreneuriat: {
    label: "Entrepreneuriat",
    description: "Prototyper, communiquer, analyser son marché.",
  },
  automatisation: {
    label: "Automatisation",
    description: "Relier vos applications et automatiser des tâches.",
  },
  developpement: {
    label: "Développement",
    description: "Écrire, comprendre et tester du code.",
  },
};

export const AI_TOOL_CATEGORY_IDS = Object.keys(AI_TOOL_CATEGORIES) as AiToolCategory[];

/**
 * Curated catalogue. Pricing is indicative: offers change often,
 * so each card links to the official site.
 */
export const aiTools: AiTool[] = [
  {
    id: "claude",
    name: "Claude",
    vendor: "Anthropic",
    url: "https://claude.ai",
    categories: ["assistants", "etudes", "travail", "developpement"],
    description:
      "Assistant conversationnel reconnu pour la qualité de ses rédactions, l'analyse de longs documents et la programmation.",
    useCases: ["Analyser un rapport PDF", "Rédiger et reformuler", "Expliquer un concept pas à pas", "Écrire du code"],
    pricing: "freemium",
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    vendor: "OpenAI",
    url: "https://chatgpt.com",
    categories: ["assistants", "etudes", "travail", "creation"],
    description:
      "Assistant très polyvalent : conversation, recherche web, analyse de fichiers, génération d'images et mode vocal.",
    useCases: ["Brainstormer des idées", "Résumer un article", "Créer une illustration", "Préparer un entretien"],
    pricing: "freemium",
  },
  {
    id: "gemini",
    name: "Gemini",
    vendor: "Google",
    url: "https://gemini.google.com",
    categories: ["assistants", "etudes", "travail"],
    description: "Assistant de Google, intégré à son écosystème (Gmail, Docs, Drive) et à la recherche web.",
    useCases: ["Synthétiser des courriels", "Rédiger dans Google Docs", "Rechercher sur le web"],
    pricing: "freemium",
  },
  {
    id: "le-chat",
    name: "Le Chat",
    vendor: "Mistral AI",
    url: "https://chat.mistral.ai",
    categories: ["assistants", "travail"],
    description: "Assistant de la startup française Mistral AI, qui publie aussi des modèles à poids ouverts.",
    useCases: ["Rédiger en français", "Analyser des documents", "Rechercher sur le web"],
    pricing: "freemium",
  },
  {
    id: "copilot",
    name: "Microsoft Copilot",
    vendor: "Microsoft",
    url: "https://copilot.microsoft.com",
    categories: ["assistants", "travail"],
    description: "Assistant intégré à Windows et à la suite Microsoft 365 (Word, Excel, Outlook, Teams).",
    useCases: ["Résumer une réunion Teams", "Analyser un tableau Excel", "Rédiger un courriel"],
    pricing: "freemium",
  },
  {
    id: "perplexity",
    name: "Perplexity",
    vendor: "Perplexity AI",
    url: "https://www.perplexity.ai",
    categories: ["etudes", "assistants"],
    description: "Moteur de réponse qui recherche sur le web et cite systématiquement ses sources.",
    useCases: ["Faire une recherche documentaire", "Vérifier un fait", "Suivre l'actualité d'un sujet"],
    pricing: "freemium",
    watchOut: "Ouvrez les sources citées : un résumé peut déformer un article.",
  },
  {
    id: "notebooklm",
    name: "NotebookLM",
    vendor: "Google",
    url: "https://notebooklm.google.com",
    categories: ["etudes", "travail"],
    description:
      "Carnet de recherche qui répond uniquement à partir des documents que vous lui fournissez, avec citations.",
    useCases: ["Réviser un cours", "Comparer plusieurs rapports", "Générer un résumé audio"],
    pricing: "freemium",
  },
  {
    id: "deepl",
    name: "DeepL",
    vendor: "DeepL",
    url: "https://www.deepl.com",
    categories: ["travail", "etudes"],
    description: "Traduction automatique de grande qualité et aide à la rédaction, très utilisée en Europe.",
    useCases: ["Traduire un rapport", "Améliorer un texte en anglais", "Traduire des documents entiers"],
    pricing: "freemium",
  },
  {
    id: "notion-ai",
    name: "Notion AI",
    vendor: "Notion",
    url: "https://www.notion.com/product/ai",
    categories: ["travail", "entrepreneuriat"],
    description: "IA intégrée à l'espace de travail Notion : rédaction, résumés, recherche dans vos notes.",
    useCases: ["Rédiger un cahier des charges", "Résumer des notes de réunion", "Organiser un projet"],
    pricing: "payant",
  },
  {
    id: "gamma",
    name: "Gamma",
    vendor: "Gamma",
    url: "https://gamma.app",
    categories: ["creation", "entrepreneuriat"],
    description: "Génère des présentations, documents et pages web à partir d'une simple description.",
    useCases: ["Créer un pitch deck", "Transformer des notes en présentation"],
    pricing: "freemium",
  },
  {
    id: "canva",
    name: "Canva (Magic Studio)",
    vendor: "Canva",
    url: "https://www.canva.com",
    categories: ["creation", "entrepreneuriat"],
    description: "Plateforme de design avec des fonctions d'IA pour créer visuels, publications et vidéos.",
    useCases: ["Créer un visuel pour les réseaux sociaux", "Concevoir un logo", "Monter une courte vidéo"],
    pricing: "freemium",
  },
  {
    id: "midjourney",
    name: "Midjourney",
    vendor: "Midjourney",
    url: "https://www.midjourney.com",
    categories: ["creation"],
    description: "Générateur d'images réputé pour sa qualité esthétique.",
    useCases: ["Illustrations", "Moodboards", "Concepts visuels"],
    pricing: "payant",
    watchOut: "Vérifiez les conditions d'usage commercial des images générées.",
  },
  {
    id: "elevenlabs",
    name: "ElevenLabs",
    vendor: "ElevenLabs",
    url: "https://elevenlabs.io",
    categories: ["creation"],
    description: "Synthèse vocale réaliste, doublage et voix multilingues.",
    useCases: ["Narration de vidéos", "Livres audio", "Doublage multilingue"],
    pricing: "freemium",
    watchOut: "N'utilisez jamais la voix d'une personne sans son consentement.",
  },
  {
    id: "runway",
    name: "Runway",
    vendor: "Runway",
    url: "https://runwayml.com",
    categories: ["creation"],
    description: "Génération et édition de vidéo par IA.",
    useCases: ["Créer des plans vidéo", "Retoucher une vidéo", "Prototyper une publicité"],
    pricing: "freemium",
  },
  {
    id: "zapier",
    name: "Zapier",
    vendor: "Zapier",
    url: "https://zapier.com",
    categories: ["automatisation", "entrepreneuriat"],
    description: "Relie des milliers d'applications et automatise des tâches, avec des étapes d'IA intégrées.",
    useCases: ["Classer automatiquement des courriels", "Envoyer les nouveaux prospects vers un tableur"],
    pricing: "freemium",
  },
  {
    id: "make",
    name: "Make",
    vendor: "Make",
    url: "https://www.make.com",
    categories: ["automatisation"],
    description: "Automatisation visuelle de processus complexes, avec modules d'IA.",
    useCases: ["Traiter des factures", "Synchroniser un CRM", "Publier sur plusieurs réseaux"],
    pricing: "freemium",
  },
  {
    id: "n8n",
    name: "n8n",
    vendor: "n8n",
    url: "https://n8n.io",
    categories: ["automatisation", "developpement"],
    description: "Plateforme d'automatisation open source, auto-hébergeable, adaptée aux agents IA.",
    useCases: ["Construire un agent qui répond aux clients", "Automatiser des rapports"],
    pricing: "freemium",
  },
  {
    id: "github-copilot",
    name: "GitHub Copilot",
    vendor: "GitHub",
    url: "https://github.com/features/copilot",
    categories: ["developpement"],
    description: "Assistant de programmation intégré aux éditeurs de code.",
    useCases: ["Compléter du code", "Expliquer un programme", "Écrire des tests"],
    pricing: "freemium",
  },
  {
    id: "claude-code",
    name: "Claude Code",
    vendor: "Anthropic",
    url: "https://www.claude.com/product/claude-code",
    categories: ["developpement", "automatisation"],
    description: "Agent de programmation qui comprend un projet entier et réalise des tâches de développement.",
    useCases: ["Créer une application", "Corriger des bugs", "Automatiser des tâches techniques"],
    pricing: "payant",
  },
  {
    id: "cursor",
    name: "Cursor",
    vendor: "Anysphere",
    url: "https://cursor.com",
    categories: ["developpement"],
    description: "Éditeur de code conçu autour de l'IA.",
    useCases: ["Modifier du code en langage naturel", "Naviguer dans un grand projet"],
    pricing: "freemium",
  },
];

export const aiNotions: AiNotion[] = [
  {
    slug: "llm",
    title: "Grand modèle de langage (LLM)",
    definition: "Un modèle entraîné sur d'immenses volumes de texte pour prédire et générer du langage.",
    detail:
      "Les LLM sont la base des assistants conversationnels. Leur taille, la qualité des données et l'affinage par retours humains déterminent leurs capacités.",
  },
  {
    slug: "multimodal",
    title: "IA multimodale",
    definition: "Un modèle capable de traiter plusieurs types de données : texte, images, son, vidéo.",
    detail: "Exemple : photographier un graphique et demander d'en expliquer les tendances.",
  },
  {
    slug: "agent",
    title: "Agent IA",
    definition: "Un système qui planifie et enchaîne des actions (recherche, outils, applications) pour atteindre un objectif.",
    detail:
      "Les agents promettent d'automatiser des tâches entières, mais nécessitent supervision, limites claires et contrôles, car une erreur peut se propager d'une étape à l'autre.",
  },
  {
    slug: "rag",
    title: "RAG (génération augmentée par la recherche)",
    definition: "Technique qui fournit au modèle des documents pertinents avant qu'il réponde.",
    detail:
      "Utilisée par les entreprises pour qu'un assistant réponde à partir de leurs propres documents, avec des références, en limitant les inventions.",
  },
  {
    slug: "hallucination",
    title: "Hallucination",
    definition: "Une réponse fausse ou inventée, formulée de manière convaincante.",
    detail: "Elle est plus fréquente sur les faits précis, les chiffres et les références. La vérification reste indispensable.",
  },
  {
    slug: "prompt",
    title: "Prompt (instruction)",
    definition: "La consigne donnée au modèle. Sa clarté influence fortement la qualité du résultat.",
    detail: "Contexte, objectif, public visé, format attendu et exemples sont les ingrédients d'un bon prompt.",
  },
  {
    slug: "poids-ouverts",
    title: "Modèles à poids ouverts",
    definition: "Des modèles dont les paramètres sont publiés et peuvent être téléchargés et exécutés librement.",
    detail:
      "Ils permettent l'hébergement local et la personnalisation, avec des enjeux de souveraineté, de coût et de sécurité. Les modèles propriétaires restent accessibles via des services ou des API.",
  },
  {
    slug: "fine-tuning",
    title: "Affinage (fine-tuning)",
    definition: "Poursuivre l'entraînement d'un modèle existant sur des données spécifiques.",
    detail: "Utile pour un style, un format ou un domaine particulier ; souvent complémentaire du RAG.",
  },
  {
    slug: "tokens",
    title: "Tokens et fenêtre de contexte",
    definition: "Les modèles découpent le texte en unités (tokens) et ne lisent qu'un volume limité à la fois.",
    detail:
      "La fenêtre de contexte détermine la quantité de texte que le modèle peut prendre en compte. Les tarifs des API sont généralement calculés par token.",
  },
  {
    slug: "inference",
    title: "Entraînement et inférence",
    definition: "L'entraînement crée le modèle ; l'inférence est son utilisation pour produire une réponse.",
    detail:
      "L'entraînement des grands modèles exige d'énormes capacités de calcul ; l'inférence, répétée des milliards de fois, pèse sur les coûts et la consommation d'énergie.",
  },
];

export const aiTrends: AiTrend[] = [
  {
    id: "agents",
    title: "Des assistants aux agents",
    summary:
      "Les IA ne se contentent plus de répondre : elles naviguent, utilisent des logiciels, écrivent et exécutent du code pour accomplir des tâches en plusieurs étapes.",
    whyItMatters:
      "C'est le passage d'un outil d'aide à un outil d'exécution, avec un potentiel d'automatisation important et de nouveaux besoins de contrôle.",
    signals: ["Agents de programmation", "Navigation web automatisée", "Intégration aux outils d'entreprise"],
  },
  {
    id: "couts",
    title: "Baisse rapide du coût d'usage",
    summary:
      "Le prix pour obtenir un niveau de performance donné a fortement baissé, grâce à des modèles plus efficaces et à du matériel spécialisé.",
    whyItMatters:
      "Des usages auparavant trop chers deviennent rentables, ce qui accélère la diffusion dans les PME et les pays émergents.",
    signals: ["Petits modèles performants", "Modèles à poids ouverts", "Concurrence entre fournisseurs"],
  },
  {
    id: "infrastructures",
    title: "La course aux infrastructures",
    summary:
      "Les grandes entreprises technologiques investissent des sommes considérables dans les centres de données, les puces et l'énergie.",
    whyItMatters:
      "Ces investissements pèsent sur la croissance, les marchés financiers et la demande d'électricité ; leur rentabilité future fait débat.",
    signals: ["Demande de semi-conducteurs", "Projets de centres de données", "Besoins énergétiques"],
  },
  {
    id: "regulation",
    title: "La régulation se met en place",
    summary:
      "L'AI Act européen s'applique progressivement depuis 2024 ; d'autres pays élaborent leurs propres cadres.",
    whyItMatters:
      "Les entreprises doivent évaluer les risques de leurs systèmes, documenter leurs usages et garantir la transparence.",
    signals: ["Obligations de transparence", "Usages interdits", "Normes et codes de conduite"],
  },
  {
    id: "emploi",
    title: "IA et transformation du travail",
    summary:
      "L'IA modifie davantage les tâches que les métiers entiers : rédaction, analyse, support client et programmation sont en première ligne.",
    whyItMatters:
      "Les gains de productivité sont réels sur certaines tâches ; la formation et la réorganisation du travail détermineront qui en profite.",
    signals: ["Gains mesurés en support client", "Assistants de code généralisés", "Besoins de formation"],
  },
  {
    id: "multimodal",
    title: "Voix, image et vidéo",
    summary:
      "Les modèles comprennent et génèrent désormais images, voix et vidéos, ce qui ouvre de nouveaux usages éducatifs et créatifs.",
    whyItMatters:
      "Des interfaces plus naturelles (parler, montrer) élargissent l'accès, mais compliquent la détection des contenus falsifiés.",
    signals: ["Assistants vocaux en temps réel", "Vidéo générative", "Marquage des contenus générés"],
  },
];

export const aiGoodPractices = [
  {
    title: "Vérifier",
    body: "Contrôlez les faits, chiffres et références importants dans une source fiable avant de les utiliser.",
  },
  {
    title: "Protéger",
    body: "Ne partagez pas de données personnelles, confidentielles ou de mots de passe sans connaître la politique du service.",
  },
  {
    title: "Contextualiser",
    body: "Donnez objectif, public, format et exemples : la qualité des réponses en dépend largement.",
  },
  {
    title: "Rester transparent",
    body: "Indiquez l'usage de l'IA quand c'est attendu (école, travail, publication) et respectez les règles applicables.",
  },
];
