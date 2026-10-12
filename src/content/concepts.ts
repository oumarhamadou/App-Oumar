import type { Concept } from "./types";

export const concepts: Concept[] = [
  {
    slug: "inflation",
    title: "Inflation",
    domain: "economie",
    topics: ["economie-mondiale", "politique-monetaire", "finance-perso"],
    tagline: "La hausse générale et durable des prix, qui réduit ce que l'on peut acheter avec la même somme d'argent.",
    explanations: {
      debutant: `Imaginez qu'avec 10 € vous achetiez 5 baguettes l'an dernier, et seulement 4 aujourd'hui. Votre billet n'a pas changé, mais il **achète moins** : c'est l'inflation.

On la mesure avec un **indice des prix** : les statisticiens suivent le prix d'un « panier » de produits que les ménages achètent souvent (alimentation, loyer, énergie, transport…). Si ce panier coûte 2 % plus cher qu'il y a un an, l'inflation est de 2 %.

Une petite inflation, stable, est considérée comme normale. Une inflation forte est un problème : les salaires et l'épargne perdent de la valeur si elles n'augmentent pas au même rythme.`,
      intermediaire: `L'inflation a plusieurs causes possibles, souvent combinées :

- **Inflation par la demande** : les ménages et entreprises veulent acheter plus que ce que l'économie peut produire, les prix montent.
- **Inflation par les coûts** : le prix des matières premières, de l'énergie ou des salaires augmente et les entreprises le répercutent.
- **Anticipations** : si chacun s'attend à une hausse des prix, les salaires et les prix sont renégociés à la hausse, ce qui entretient le mouvement.

Les banques centrales visent en général une inflation proche de **2 % à moyen terme** (c'est le cas de la BCE et de la Réserve fédérale américaine). Pour freiner une inflation trop élevée, elles relèvent leurs taux directeurs, ce qui renchérit le crédit et modère la demande.

Distinguez l'**inflation globale** (tous les prix) de l'**inflation sous-jacente** (hors éléments volatils comme l'énergie et l'alimentation), qui renseigne mieux sur la tendance de fond.`,
      avance: `L'inflation se lit à travers plusieurs indicateurs : l'IPC (indice des prix à la consommation), l'IPCH harmonisé en zone euro, le déflateur du PIB ou le déflateur de la consommation (PCE) suivi par la Fed. Chacun a son périmètre et ses pondérations.

Côté théorie, la **courbe de Phillips** relie inflation et chômage, mais la relation est instable et dépend des anticipations. L'approche monétariste (« l'inflation est toujours et partout un phénomène monétaire », Friedman) insiste sur la croissance de la masse monétaire ; les approches néo-keynésiennes mettent l'accent sur l'écart de production et la crédibilité de la banque centrale pour **ancrer les anticipations**.

L'épisode 2021-2023 a montré l'importance des **chocs d'offre** (chaînes d'approvisionnement, énergie) combinés à une demande soutenue. Les effets de second tour (boucle prix-salaires) sont le risque principal surveillé par les banquiers centraux. Enfin, l'inflation a des effets redistributifs : elle allège la dette réelle des emprunteurs à taux fixe et pénalise les créanciers et les détenteurs de liquidités.`,
    },
    example: {
      title: "Votre épargne face à l'inflation",
      body: "Vous laissez 1 000 € sur un compte non rémunéré pendant 5 ans avec une inflation de 3 % par an. En euros d'aujourd'hui, votre épargne ne vaut plus qu'environ 863 € : vous avez perdu près de 14 % de pouvoir d'achat sans avoir rien dépensé.",
    },
    keyPoints: [
      "L'inflation mesure la hausse moyenne des prix d'un panier de biens et services.",
      "Elle réduit le pouvoir d'achat de la monnaie et de l'épargne non rémunérée.",
      "Les grandes banques centrales visent environ 2 % à moyen terme.",
      "Elle peut venir de la demande, des coûts ou des anticipations.",
    ],
    simulator: "pouvoir-achat",
    caseStudy: "choc-inflation-2021-2023",
    related: ["banque-centrale", "taux-interet", "monnaie"],
    quiz: [
      {
        id: "inflation-1",
        question: "Si l'inflation est de 5 % et votre salaire augmente de 3 %, que se passe-t-il ?",
        options: [
          "Votre pouvoir d'achat augmente",
          "Votre pouvoir d'achat baisse",
          "Rien ne change",
          "Votre épargne augmente automatiquement",
        ],
        answer: 1,
        explanation: "Vos revenus progressent moins vite que les prix : vous pouvez acheter un peu moins qu'avant. On parle de baisse du salaire réel.",
      },
      {
        id: "inflation-2",
        question: "Quel outil une banque centrale utilise-t-elle d'abord pour freiner une inflation trop forte ?",
        options: ["Baisser les impôts", "Relever ses taux directeurs", "Imprimer plus de billets", "Fixer les prix"],
        answer: 1,
        explanation: "En relevant ses taux, la banque centrale rend le crédit plus cher, ce qui modère la demande et, à terme, la hausse des prix.",
      },
      {
        id: "inflation-3",
        question: "Que désigne l'inflation « sous-jacente » ?",
        options: [
          "L'inflation des produits de luxe",
          "L'inflation hors éléments volatils comme l'énergie et l'alimentation",
          "L'inflation prévue pour l'an prochain",
          "L'inflation dans les pays émergents",
        ],
        answer: 1,
        explanation: "En retirant les prix les plus volatils, on observe mieux la tendance de fond de l'inflation.",
      },
    ],
    sources: [
      { label: "INSEE — Indice des prix à la consommation", url: "https://www.insee.fr/fr/statistiques/serie/001759970" },
      { label: "BCE — Qu'est-ce que l'inflation ?", url: "https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_inflation.fr.html" },
    ],
  },
  {
    slug: "taux-interet",
    title: "Taux d'intérêt",
    domain: "finance",
    topics: ["politique-monetaire", "finance-perso", "marches"],
    tagline: "Le prix de l'argent dans le temps : ce que coûte un emprunt ou ce que rapporte un placement.",
    explanations: {
      debutant: `Quand vous empruntez de l'argent, vous le remboursez **plus** une somme supplémentaire : les intérêts. Le taux d'intérêt exprime ce coût en pourcentage, généralement par an.

À l'inverse, quand vous placez votre argent (livret, compte à terme), c'est vous qui êtes payé : la banque vous verse des intérêts.

Un taux de 4 % sur un emprunt de 1 000 € signifie environ 40 € d'intérêts par an. Plus le taux est élevé, plus emprunter coûte cher… et plus épargner rapporte.`,
      intermediaire: `Le niveau des taux dépend de plusieurs éléments :

- **Le taux directeur** de la banque centrale, qui sert de référence à tout le système bancaire.
- **La durée** : un prêt sur 20 ans comporte plus d'incertitude qu'un prêt sur 1 an, et coûte souvent plus cher.
- **Le risque de l'emprunteur** : un emprunteur jugé fragile paie une prime de risque plus élevée.
- **L'inflation anticipée** : les prêteurs veulent être protégés contre la perte de valeur de la monnaie.

Il faut distinguer le **taux nominal** (affiché) du **taux réel** (taux nominal moins l'inflation). Un livret à 3 % avec 2 % d'inflation rapporte environ 1 % en réel.

Pour un crédit, regardez le **TAEG** (taux annuel effectif global) : il inclut les frais et l'assurance, et permet de comparer les offres.`,
      avance: `La **courbe des taux** représente les rendements des emprunts d'État selon leur maturité. Normalement croissante, elle peut s'**inverser** (taux courts supérieurs aux taux longs) lorsque les marchés anticipent des baisses de taux futures, un signal historiquement associé à des ralentissements économiques aux États-Unis — sans être une règle infaillible.

La relation de **Fisher** relie taux nominal, taux réel et inflation anticipée : i ≈ r + π^e. Le concept de **taux neutre** (r*) désigne le taux réel qui ne stimule ni ne freine l'économie ; il n'est pas observable et ses estimations varient fortement.

La transmission de la politique monétaire passe par plusieurs canaux : coût du crédit, prix des actifs (effet richesse), taux de change et anticipations. Les taux influencent aussi la **valorisation** de tous les actifs, puisqu'ils servent à actualiser les flux futurs : une hausse des taux réduit mécaniquement la valeur actuelle des flux lointains (actions de croissance, obligations longues).`,
    },
    example: {
      title: "Un même prêt, deux taux",
      body: "Pour 200 000 € empruntés sur 20 ans, passer d'un taux de 1,5 % à 4 % fait monter la mensualité d'environ 965 € à 1 212 €. Le coût total des intérêts passe d'environ 31 600 € à 90 900 €.",
    },
    keyPoints: [
      "Le taux d'intérêt est le prix de l'argent emprunté ou placé.",
      "Taux réel ≈ taux nominal − inflation.",
      "Le TAEG permet de comparer le vrai coût des crédits.",
      "Les taux des banques centrales influencent tous les autres taux.",
    ],
    simulator: "credit",
    related: ["banque-centrale", "obligations", "inflation", "interets-composes"],
    quiz: [
      {
        id: "taux-1",
        question: "Un livret rapporte 3 % et l'inflation est de 4 %. Votre rendement réel est :",
        options: ["+7 %", "+3 %", "−1 % environ", "0 %"],
        answer: 2,
        explanation: "Taux réel ≈ 3 % − 4 % = −1 % : votre épargne grossit en euros, mais perd du pouvoir d'achat.",
      },
      {
        id: "taux-2",
        question: "Quel indicateur utiliser pour comparer deux offres de crédit ?",
        options: ["Le taux nominal seul", "Le TAEG", "Le taux directeur", "Le taux d'usure"],
        answer: 1,
        explanation: "Le TAEG intègre les intérêts, les frais de dossier et les assurances obligatoires.",
      },
      {
        id: "taux-3",
        question: "Que signifie une courbe des taux « inversée » ?",
        options: [
          "Les taux longs sont supérieurs aux taux courts",
          "Les taux courts sont supérieurs aux taux longs",
          "Les taux sont négatifs",
          "La banque centrale a baissé ses taux",
        ],
        answer: 1,
        explanation: "Une inversion traduit souvent l'anticipation de baisses de taux futures, liées à un ralentissement économique attendu.",
      },
    ],
    sources: [
      { label: "Banque de France — Les taux d'intérêt", url: "https://abc-economie.banque-france.fr/" },
      { label: "Federal Reserve — Monetary policy", url: "https://www.federalreserve.gov/monetarypolicy.htm" },
    ],
  },
  {
    slug: "banque-centrale",
    title: "Banque centrale",
    domain: "economie",
    topics: ["politique-monetaire", "economie-mondiale"],
    tagline: "L'institution qui émet la monnaie, veille à la stabilité des prix et sert de « banque des banques ».",
    explanations: {
      debutant: `La banque centrale est la banque des banques. Elle **émet les billets**, prête de l'argent aux banques commerciales et surveille la santé du système financier.

Sa mission principale est en général de garder des **prix stables**, c'est-à-dire une inflation faible et prévisible. Pour cela, elle fixe un taux directeur : quand il monte, emprunter devient plus cher pour tout le monde ; quand il baisse, le crédit est encouragé.

Exemples : la **BCE** pour la zone euro, la **Réserve fédérale (Fed)** aux États-Unis, la **BCEAO** pour l'Union économique et monétaire ouest-africaine et la **BEAC** pour l'Afrique centrale.`,
      intermediaire: `Les mandats diffèrent : la BCE a pour objectif prioritaire la stabilité des prix ; la Fed a un **double mandat** (stabilité des prix et plein emploi).

Ses principaux outils :

- **Les taux directeurs** : ils fixent le coût auquel les banques se refinancent ou placent leurs liquidités auprès de la banque centrale.
- **Les achats d'actifs** (« assouplissement quantitatif ») : la banque centrale achète des obligations pour faire baisser les taux longs.
- **La communication** (« forward guidance ») : annoncer l'orientation future de la politique pour guider les anticipations.
- **Le prêteur en dernier ressort** : fournir des liquidités en cas de crise pour éviter les paniques bancaires.

L'**indépendance** des banques centrales vis-à-vis du pouvoir politique vise à renforcer leur crédibilité dans la lutte contre l'inflation.`,
      avance: `La mise en œuvre de la politique monétaire repose sur un **corridor de taux** (facilité de dépôt, opérations principales de refinancement, facilité de prêt marginal à la BCE). Avec l'abondance de liquidités issue des achats d'actifs, la BCE pilote désormais surtout via le **taux de la facilité de dépôt** (« système plancher »).

Les débats actuels portent sur : la taille optimale du bilan après les programmes d'achats (resserrement quantitatif), la **règle de Taylor** comme repère (et ses limites), l'interaction avec la politique budgétaire (dominance budgétaire), les effets distributifs des achats d'actifs, et l'émergence des **monnaies numériques de banque centrale** (projet d'euro numérique).

Dans les unions monétaires africaines (UEMOA, CEMAC), l'arrimage du franc CFA à l'euro contraint la politique monétaire : la BCEAO et la BEAC doivent préserver la parité et le niveau de réserves de change, ce qui limite leur autonomie de taux.`,
    },
    example: {
      title: "La transmission d'une hausse de taux",
      body: "Quand la banque centrale relève son taux directeur, les banques empruntent plus cher et répercutent la hausse sur les crédits immobiliers et aux entreprises. Les projets financés à crédit ralentissent, la demande se modère, et la pression sur les prix diminue avec un décalage de plusieurs trimestres.",
    },
    keyPoints: [
      "Elle émet la monnaie et veille à la stabilité des prix.",
      "Son outil principal : les taux directeurs.",
      "Elle peut aussi acheter des actifs et guider les anticipations.",
      "Ses décisions agissent avec un délai de plusieurs trimestres.",
    ],
    caseStudy: "crise-financiere-2008",
    related: ["inflation", "taux-interet", "monnaie"],
    quiz: [
      {
        id: "bc-1",
        question: "Quel est le mandat de la Réserve fédérale américaine ?",
        options: [
          "Uniquement la stabilité des prix",
          "La stabilité des prix et le plein emploi",
          "Équilibrer le budget de l'État",
          "Fixer le taux de change du dollar",
        ],
        answer: 1,
        explanation: "La Fed a un double mandat : stabilité des prix et emploi maximal.",
      },
      {
        id: "bc-2",
        question: "Qu'est-ce que l'assouplissement quantitatif ?",
        options: [
          "Une baisse des impôts",
          "Des achats massifs d'obligations par la banque centrale",
          "Une hausse des réserves obligatoires",
          "Un contrôle des prix",
        ],
        answer: 1,
        explanation: "En achetant des obligations, la banque centrale fait baisser les taux longs et injecte des liquidités.",
      },
      {
        id: "bc-3",
        question: "Pourquoi l'indépendance des banques centrales est-elle recherchée ?",
        options: [
          "Pour qu'elles financent directement l'État",
          "Pour renforcer leur crédibilité face à l'inflation",
          "Pour qu'elles fixent les salaires",
          "Pour éviter de publier leurs décisions",
        ],
        answer: 1,
        explanation: "Une banque centrale indépendante est moins exposée à la tentation de stimuler l'économie à court terme au prix d'une inflation future.",
      },
    ],
    sources: [
      { label: "Banque centrale européenne", url: "https://www.ecb.europa.eu/" },
      { label: "BCEAO", url: "https://www.bceao.int/" },
      { label: "BEAC", url: "https://www.beac.int/" },
    ],
  },
  {
    slug: "croissance-pib",
    title: "Croissance et PIB",
    domain: "economie",
    topics: ["economie-mondiale"],
    tagline: "Le PIB mesure la richesse produite dans un pays ; la croissance, c'est sa progression d'une période à l'autre.",
    explanations: {
      debutant: `Le **produit intérieur brut (PIB)** additionne la valeur de tout ce qui est produit dans un pays pendant une période : biens (voitures, nourriture) et services (soins, transport, conseils).

Quand le PIB augmente d'une année sur l'autre, on parle de **croissance économique**. Elle signifie en général plus d'activité, plus d'emplois et plus de revenus à partager.

Pour comparer le niveau de vie entre pays, on utilise souvent le **PIB par habitant** : la richesse produite divisée par le nombre d'habitants.`,
      intermediaire: `Le PIB se calcule de trois façons qui doivent coïncider :

- **Production** : somme des valeurs ajoutées.
- **Dépenses** : consommation + investissement + dépenses publiques + exportations − importations.
- **Revenus** : salaires + profits + impôts sur la production.

On distingue le PIB **nominal** (en prix courants) du PIB **réel** (corrigé de l'inflation). La croissance s'exprime toujours en volume, c'est-à-dire en réel.

Une **récession** est souvent définie, de façon simplifiée, comme deux trimestres consécutifs de baisse du PIB. Aux États-Unis, c'est un comité d'économistes (NBER) qui date officiellement les récessions à partir de plusieurs indicateurs.`,
      avance: `À long terme, la croissance dépend de l'accumulation de **capital**, du **travail** et surtout de la **productivité globale des facteurs** (progrès technique, organisation, institutions), comme le formalise le modèle de Solow.

Les théories de la croissance endogène (Romer, Lucas) expliquent comment l'innovation, le capital humain et les effets d'apprentissage peuvent entretenir la croissance. La diffusion de l'IA ravive ce débat : peut-elle relancer des gains de productivité restés faibles dans les économies avancées depuis le milieu des années 2000 ?

Le PIB a des limites bien connues : il ignore le travail domestique, la répartition des revenus, l'épuisement des ressources naturelles et le bien-être. D'où des indicateurs complémentaires : indice de développement humain (IDH), PIB vert, indicateurs de bien-être de l'OCDE. Enfin, les comparaisons internationales se font en **parité de pouvoir d'achat (PPA)** pour neutraliser les différences de prix entre pays.`,
    },
    example: {
      title: "Lire un chiffre de croissance",
      body: "Si le PIB d'un pays passe de 1 000 à 1 030 milliards en un an alors que les prix ont augmenté de 2 %, la croissance nominale est de 3 % mais la croissance réelle n'est que d'environ 1 %. C'est ce dernier chiffre qui est publié comme « taux de croissance ».",
    },
    keyPoints: [
      "Le PIB mesure la valeur de la production d'un pays.",
      "La croissance s'exprime en volume (corrigée de l'inflation).",
      "Le PIB par habitant sert à comparer les niveaux de vie.",
      "Le PIB ne mesure ni le bien-être ni les inégalités.",
    ],
    related: ["cycle-economique", "inflation", "commerce-international"],
    quiz: [
      {
        id: "pib-1",
        question: "Laquelle de ces dépenses ne fait PAS partie du calcul du PIB par les dépenses ?",
        options: ["La consommation des ménages", "L'investissement des entreprises", "Les importations, qui sont ajoutées", "Les dépenses publiques"],
        answer: 2,
        explanation: "Les importations sont soustraites : elles correspondent à une production réalisée à l'étranger.",
      },
      {
        id: "pib-2",
        question: "Pourquoi utilise-t-on le PIB réel plutôt que nominal pour mesurer la croissance ?",
        options: [
          "Il est plus facile à calculer",
          "Il retire l'effet de la hausse des prix",
          "Il inclut l'économie informelle",
          "Il est publié plus tôt",
        ],
        answer: 1,
        explanation: "Le PIB réel mesure l'évolution des quantités produites, sans l'effet de l'inflation.",
      },
      {
        id: "pib-3",
        question: "Qu'est-ce que la parité de pouvoir d'achat (PPA) ?",
        options: [
          "Un taux de change officiel",
          "Une méthode pour comparer les richesses en tenant compte des différences de prix entre pays",
          "Le salaire minimum international",
          "Un indice boursier",
        ],
        answer: 1,
        explanation: "La PPA corrige les écarts de niveau de prix : un même revenu n'achète pas la même chose partout.",
      },
    ],
    sources: [
      { label: "Banque mondiale — Données", url: "https://data.worldbank.org/" },
      { label: "INSEE — Comptes nationaux", url: "https://www.insee.fr/fr/statistiques?theme=73" },
    ],
  },
  {
    slug: "cycle-economique",
    title: "Cycle économique et récession",
    domain: "economie",
    topics: ["economie-mondiale", "marches"],
    tagline: "L'activité économique alterne phases d'expansion et de ralentissement ; une récession est une contraction marquée et durable.",
    explanations: {
      debutant: `L'économie ne progresse pas en ligne droite. Elle traverse des **phases** : l'expansion (l'activité accélère, l'emploi progresse), le pic, le ralentissement, parfois la **récession** (l'activité recule), puis la reprise.

Pendant une récession, les entreprises vendent moins, embauchent moins, et le chômage augmente. Les États et les banques centrales interviennent alors pour soutenir l'activité.`,
      intermediaire: `Les économistes suivent des **indicateurs avancés** pour anticiper les retournements : enquêtes de confiance des entreprises (indices PMI), commandes industrielles, permis de construire, courbe des taux.

Pour amortir un ralentissement, deux leviers :

- **La politique monétaire** : baisse des taux, achats d'actifs.
- **La politique budgétaire** : hausse des dépenses publiques ou baisse d'impôts, au prix d'un déficit temporaire.

Les **stabilisateurs automatiques** jouent aussi : en récession, les recettes fiscales baissent et les allocations chômage augmentent, ce qui soutient les revenus sans décision nouvelle.`,
      avance: `Les causes des cycles font débat : chocs de demande (approche keynésienne), chocs de productivité (théorie des cycles réels), cycles du crédit et de l'endettement (Minsky, Fisher), ou chocs financiers. La crise de 2008 a remis au premier plan le rôle du **cycle financier**, plus long que le cycle des affaires.

Les **récessions de bilan** (après l'éclatement d'une bulle d'endettement) sont plus longues : les agents privilégient le désendettement même à taux très bas, ce qui réduit l'efficacité de la politique monétaire et renforce le rôle du budget.

Pour l'investisseur, la rotation sectorielle selon les phases du cycle (valeurs cycliques en reprise, défensives en fin de cycle) est une heuristique répandue, mais le timing des retournements reste très difficile à prévoir.`,
    },
    example: {
      title: "Le chômage, indicateur retardé",
      body: "Lors d'une récession, le chômage continue souvent d'augmenter plusieurs mois après le point bas de l'activité : les entreprises attendent d'être sûres de la reprise avant de réembaucher. C'est pourquoi on le qualifie d'indicateur « retardé ».",
    },
    keyPoints: [
      "L'économie alterne expansion, pic, ralentissement et reprise.",
      "Les indicateurs avancés aident à anticiper les retournements.",
      "Politiques monétaire et budgétaire peuvent amortir les récessions.",
      "Les crises financières entraînent souvent des récessions plus longues.",
    ],
    caseStudy: "crise-financiere-2008",
    related: ["croissance-pib", "banque-centrale", "marches-financiers"],
    quiz: [
      {
        id: "cycle-1",
        question: "Lequel de ces indicateurs est considéré comme « avancé » ?",
        options: ["Le taux de chômage", "Les enquêtes de confiance des entreprises (PMI)", "Le PIB de l'an dernier", "Le déficit public"],
        answer: 1,
        explanation: "Les enquêtes auprès des directeurs d'achat reflètent les intentions et commandes à venir.",
      },
      {
        id: "cycle-2",
        question: "Que sont les stabilisateurs automatiques ?",
        options: [
          "Des robots industriels",
          "Des mécanismes budgétaires qui soutiennent les revenus sans décision nouvelle",
          "Des règles boursières qui stoppent les cotations",
          "Des taux de change fixes",
        ],
        answer: 1,
        explanation: "Baisse des impôts perçus et hausse des allocations en récession : ils amortissent le choc automatiquement.",
      },
    ],
    sources: [
      { label: "NBER — Business Cycle Dating", url: "https://www.nber.org/research/business-cycle-dating" },
      { label: "OCDE — Perspectives économiques", url: "https://www.oecd.org/fr/" },
    ],
  },
  {
    slug: "marches-financiers",
    title: "Marchés financiers",
    domain: "finance",
    topics: ["marches", "entreprises"],
    tagline: "Les lieux où s'échangent actions, obligations, devises et autres actifs, et où se rencontrent épargnants et emprunteurs.",
    explanations: {
      debutant: `Les marchés financiers mettent en relation ceux qui ont de l'argent à placer (épargnants, investisseurs) et ceux qui en ont besoin (entreprises, États).

- Une **action** est une part de propriété d'une entreprise. Si l'entreprise prospère, l'action peut prendre de la valeur et verser des dividendes.
- Une **obligation** est un prêt accordé à une entreprise ou à un État, qui verse des intérêts puis rembourse le capital.

Les prix évoluent selon l'offre et la demande, qui reflètent les attentes des investisseurs sur l'avenir.`,
      intermediaire: `On distingue le **marché primaire** (émission de nouveaux titres : introduction en bourse, émission d'obligations) et le **marché secondaire** (échange de titres déjà émis, comme à la Bourse de Paris).

Les **indices boursiers** résument l'évolution d'un ensemble d'actions : CAC 40 (France), S&P 500 (États-Unis), Euro Stoxx 50 (zone euro), BRVM Composite (Afrique de l'Ouest).

Un principe central : **rendement et risque vont de pair**. Les actions ont historiquement offert des rendements plus élevés que les obligations sur longue période, au prix de fortes variations à court terme. Les **fonds indiciels (ETF)** permettent d'acheter tout un indice en une seule opération, avec des frais réduits.`,
      avance: `L'**hypothèse d'efficience des marchés** (Fama) soutient que les prix intègrent rapidement l'information disponible, rendant difficile de battre le marché durablement après frais — ce que confirment les études comparant gestion active et indicielle. La **finance comportementale** (Kahneman, Thaler, Shiller) documente pourtant des anomalies : excès de confiance, mimétisme, aversion aux pertes, bulles.

La valorisation d'une action repose sur l'actualisation des flux futurs (modèle de Gordon, DCF) ; des ratios comme le **PER** (cours / bénéfice par action) donnent un repère rapide mais dépendent du niveau des taux et de la croissance attendue.

Les marchés jouent aussi un rôle macroéconomique : allocation du capital, signal sur les anticipations (taux, inflation implicite), mais aussi canal de transmission des crises (effets de levier, ventes forcées, contagion).`,
    },
    example: {
      title: "Action ou obligation ?",
      body: "Une entreprise qui veut financer une usine peut émettre des actions (elle partage la propriété et les profits futurs) ou des obligations (elle s'endette et s'engage à payer des intérêts fixes). Le choix dépend du coût de chaque option et de la volonté des dirigeants de garder le contrôle.",
    },
    keyPoints: [
      "Action = part de propriété ; obligation = prêt.",
      "Marché primaire (émission) et secondaire (échanges).",
      "Plus de rendement espéré implique plus de risque.",
      "Les ETF répliquent un indice à faible coût.",
    ],
    caseStudy: "bulle-internet",
    related: ["obligations", "diversification", "taux-interet"],
    quiz: [
      {
        id: "marches-1",
        question: "Acheter une action, c'est :",
        options: ["Prêter de l'argent à une entreprise", "Devenir copropriétaire d'une entreprise", "Ouvrir un compte bancaire", "Acheter une devise"],
        answer: 1,
        explanation: "L'action est un titre de propriété qui donne droit à une part des bénéfices et, souvent, à un droit de vote.",
      },
      {
        id: "marches-2",
        question: "Qu'est-ce qu'un ETF ?",
        options: [
          "Un compte d'épargne réglementé",
          "Un fonds coté qui réplique un indice",
          "Une cryptomonnaie",
          "Un emprunt d'État",
        ],
        answer: 1,
        explanation: "Un ETF (exchange-traded fund) suit la performance d'un indice et s'échange en bourse comme une action.",
      },
      {
        id: "marches-3",
        question: "Une introduction en bourse a lieu sur :",
        options: ["Le marché secondaire", "Le marché primaire", "Le marché des changes", "Le marché interbancaire"],
        answer: 1,
        explanation: "Le marché primaire est celui de l'émission de nouveaux titres.",
      },
    ],
    sources: [
      { label: "AMF — Comprendre les produits financiers", url: "https://www.amf-france.org/fr/espace-epargnants" },
      { label: "Investor.gov (SEC)", url: "https://www.investor.gov/" },
    ],
  },
  {
    slug: "obligations",
    title: "Obligations",
    domain: "finance",
    topics: ["marches", "politique-monetaire"],
    tagline: "Un titre de dette : l'émetteur emprunte, verse des intérêts (coupons) et rembourse à l'échéance.",
    explanations: {
      debutant: `Acheter une obligation, c'est **prêter de l'argent** à un État ou à une entreprise. En échange, vous recevez des intérêts réguliers (le **coupon**) et, à la fin (l'**échéance**), vous récupérez la somme prêtée.

Les obligations d'États solides sont considérées comme des placements plutôt sûrs. Celles d'entreprises fragiles rapportent davantage, car le risque qu'elles ne remboursent pas est plus élevé.`,
      intermediaire: `Le prix d'une obligation varie **à l'inverse des taux d'intérêt**. Si vous détenez une obligation à 2 % et que les nouvelles obligations rapportent 4 %, la vôtre devient moins attractive : son prix baisse sur le marché.

Quelques notions :

- **Rendement actuariel** : le rendement réel obtenu si l'on achète au prix du marché et conserve jusqu'à l'échéance.
- **Notation** : les agences (S&P, Moody's, Fitch) notent la solidité des émetteurs ; « investment grade » vs « high yield ».
- **Spread** : l'écart de rendement par rapport à un emprunt d'État de référence, qui mesure la prime de risque.`,
      avance: `La sensibilité du prix aux taux se mesure par la **duration** (durée de vie moyenne pondérée des flux) : une duration de 7 signifie qu'une hausse de 1 point des taux fait baisser le prix d'environ 7 %. La **convexité** affine cette approximation pour les fortes variations.

La courbe des taux souveraine sert de socle à la valorisation de presque tous les actifs. Les **obligations indexées sur l'inflation** (OATi, TIPS) permettent de déduire l'inflation anticipée par le marché (point mort d'inflation).

L'année 2022 a rappelé que les obligations ne sont pas sans risque : la remontée rapide des taux a provoqué de fortes pertes sur les obligations longues, et contribué aux difficultés de certaines banques régionales américaines en 2023, dont les portefeuilles obligataires avaient perdu de la valeur.`,
    },
    example: {
      title: "Quand les taux montent",
      body: "Une obligation à 10 ans de 1 000 € avec un coupon de 2 % vaut environ 1 000 € quand les taux du marché sont à 2 %. Si les taux passent à 4 %, son prix tombe autour de 838 € : un acheteur exige le même rendement que les nouvelles émissions.",
    },
    keyPoints: [
      "Une obligation est un prêt rémunéré par des coupons.",
      "Son prix baisse quand les taux montent, et inversement.",
      "La duration mesure la sensibilité aux taux.",
      "La notation et le spread reflètent le risque de l'émetteur.",
    ],
    simulator: "prix-obligation",
    related: ["taux-interet", "marches-financiers", "diversification"],
    quiz: [
      {
        id: "oblig-1",
        question: "Si les taux du marché augmentent, le prix des obligations existantes :",
        options: ["Augmente", "Baisse", "Ne change pas", "Devient nul"],
        answer: 1,
        explanation: "Les nouvelles obligations rapportant plus, les anciennes doivent baisser de prix pour offrir un rendement comparable.",
      },
      {
        id: "oblig-2",
        question: "Qu'est-ce que le coupon d'une obligation ?",
        options: ["Une réduction commerciale", "L'intérêt versé périodiquement", "Le prix d'achat", "La date d'échéance"],
        answer: 1,
        explanation: "Le coupon est l'intérêt payé à intervalles réguliers par l'émetteur.",
      },
      {
        id: "oblig-3",
        question: "Une obligation de duration 5 perd environ combien si les taux montent d'un point ?",
        options: ["1 %", "5 %", "10 %", "50 %"],
        answer: 1,
        explanation: "Variation de prix ≈ − duration × variation de taux = −5 × 1 % = −5 %.",
      },
    ],
    sources: [
      { label: "AMF — Les obligations", url: "https://www.amf-france.org/fr/espace-epargnants" },
      { label: "Agence France Trésor", url: "https://www.aft.gouv.fr/" },
    ],
  },
  {
    slug: "interets-composes",
    title: "Intérêts composés",
    domain: "finance",
    topics: ["finance-perso"],
    tagline: "Les intérêts produisent eux-mêmes des intérêts : la croissance de l'épargne s'accélère avec le temps.",
    explanations: {
      debutant: `Avec les intérêts **simples**, vous gagnez chaque année des intérêts sur votre seul capital de départ. Avec les intérêts **composés**, les intérêts gagnés sont réinvestis et rapportent à leur tour.

Exemple : 1 000 € à 5 %. Après un an : 1 050 €. La deuxième année, vous gagnez 5 % sur 1 050 € (soit 52,50 €), et ainsi de suite. Au bout de 30 ans, vous avez environ 4 322 €, contre 2 500 € avec des intérêts simples.

Le secret : **le temps**. Commencer tôt, même avec de petites sommes, fait une grande différence.`,
      intermediaire: `La formule : **Capital final = Capital initial × (1 + taux)^années**.

La **règle de 72** donne une estimation rapide : divisez 72 par le taux annuel pour obtenir le nombre d'années nécessaires pour doubler votre capital. À 6 %, il faut environ 12 ans ; à 9 %, environ 8 ans.

Les intérêts composés jouent aussi **contre vous** : sur une dette de carte de crédit à taux élevé, les intérêts impayés s'ajoutent au capital et la dette grossit vite. De même, des **frais de gestion** annuels de 2 % au lieu de 0,2 % réduisent fortement le capital final sur 30 ans.`,
      avance: `Avec des versements réguliers, la valeur future d'une rente s'écrit : VF = V × [((1 + r)^n − 1) / r]. Combinée à un capital initial, elle permet de planifier un objectif (retraite, études).

Raisonnez toujours en **termes réels** (après inflation) et **après frais et impôts** : un rendement nominal de 7 % avec 2 % d'inflation et 1 % de frais donne environ 4 % réels, ce qui change radicalement la projection à 30 ans.

Attention aussi au **risque de séquence** : avec des rendements volatils, l'ordre des bonnes et mauvaises années compte lorsque l'on fait des versements ou des retraits. Les projections à rendement constant sont donc des illustrations, pas des promesses.`,
    },
    example: {
      title: "Commencer à 25 ou à 35 ans",
      body: "En plaçant 100 € par mois à 5 % par an, on obtient environ 152 000 € à 65 ans en commençant à 25 ans, contre environ 83 000 € en commençant à 35 ans. Dix ans d'avance représentent seulement 12 000 € de versements en plus, mais près de 70 000 € de capital supplémentaire.",
    },
    keyPoints: [
      "Les intérêts réinvestis produisent à leur tour des intérêts.",
      "Règle de 72 : 72 ÷ taux ≈ années pour doubler.",
      "Le temps est le principal levier.",
      "Les frais et l'inflation réduisent fortement l'effet composé.",
    ],
    simulator: "interets-composes",
    related: ["taux-interet", "diversification", "budget-personnel"],
    quiz: [
      {
        id: "compose-1",
        question: "Selon la règle de 72, combien d'années faut-il pour doubler un capital placé à 8 % ?",
        options: ["6 ans", "9 ans", "12 ans", "18 ans"],
        answer: 1,
        explanation: "72 ÷ 8 = 9 ans environ.",
      },
      {
        id: "compose-2",
        question: "Quel facteur a le plus d'influence sur l'effet des intérêts composés ?",
        options: ["La durée de placement", "La couleur de la carte bancaire", "Le jour de la semaine", "Le nombre de comptes ouverts"],
        answer: 0,
        explanation: "L'effet composé est exponentiel : chaque année supplémentaire a plus d'impact que la précédente.",
      },
      {
        id: "compose-3",
        question: "Des frais annuels de 2 % sur un placement à long terme :",
        options: [
          "N'ont aucun effet notable",
          "Réduisent fortement le capital final, car ils se composent aussi",
          "Augmentent le rendement",
          "Sont remboursés à l'échéance",
        ],
        answer: 1,
        explanation: "Les frais sont prélevés chaque année sur un capital croissant : leur effet cumulé est considérable.",
      },
    ],
    sources: [
      { label: "Investor.gov — Compound interest calculator", url: "https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator" },
      { label: "Mes questions d'argent (Banque de France)", url: "https://www.mesquestionsdargent.fr/" },
    ],
  },
  {
    slug: "budget-personnel",
    title: "Budget personnel",
    domain: "finance",
    topics: ["finance-perso"],
    tagline: "Planifier ses revenus et dépenses pour vivre sereinement, épargner et atteindre ses objectifs.",
    explanations: {
      debutant: `Faire un budget, c'est **savoir où va votre argent**. Notez vos revenus du mois, puis vos dépenses : logement, alimentation, transport, loisirs…

Une méthode simple, la règle **50/30/20** :

- **50 %** pour les besoins essentiels (loyer, courses, factures),
- **30 %** pour les envies (sorties, vêtements, abonnements),
- **20 %** pour l'épargne et le remboursement de dettes.

Ce n'est pas une règle absolue : adaptez les proportions à votre situation, l'important est d'épargner régulièrement.`,
      intermediaire: `Trois étapes pour un budget solide :

1. **Constituer une épargne de précaution** : l'équivalent de 3 à 6 mois de dépenses, placée sur un support disponible immédiatement.
2. **Rembourser les dettes coûteuses** (crédit renouvelable, découvert) avant d'investir : aucun placement ne rapporte durablement autant qu'un crédit à 15 % ne coûte.
3. **Automatiser l'épargne** : programmer un virement le jour de la paie (« se payer en premier »).

Suivez aussi votre **taux d'épargne** (épargne / revenus) et votre **taux d'endettement** (mensualités / revenus) : en France, les banques retiennent généralement un plafond de 35 % pour un crédit immobilier.`,
      avance: `Au-delà de la règle 50/30/20, on peut piloter un budget par **objectifs** (« budget base zéro » : chaque euro reçoit une affectation) et par **horizons** : court terme (liquidités), moyen terme (projets à 2-8 ans, supports peu risqués), long terme (retraite, supports plus dynamiques).

L'économie comportementale éclaire les difficultés d'épargne : préférence pour le présent, comptabilité mentale, inertie. D'où l'efficacité des mécanismes par défaut (épargne salariale automatique, arrondis) mis en avant par Thaler et Sunstein.

Enfin, un budget s'inscrit dans un **patrimoine** : assurance (protéger ses revenus), fiscalité des enveloppes d'épargne et diversification entre immobilier, actifs financiers et liquidités.`,
    },
    example: {
      title: "Le budget de Fatou",
      body: "Fatou gagne 2 000 € nets par mois. Avec la règle 50/30/20 : 1 000 € pour le logement, l'alimentation et les transports ; 600 € pour ses loisirs ; 400 € épargnés. En 12 mois, elle constitue 4 800 € d'épargne de précaution, soit 3 mois de ses dépenses (1 600 € par mois).",
    },
    keyPoints: [
      "Commencez par suivre vos dépenses réelles.",
      "Règle 50/30/20 : besoins, envies, épargne.",
      "Épargne de précaution : 3 à 6 mois de dépenses.",
      "Automatisez l'épargne et remboursez d'abord les dettes chères.",
    ],
    simulator: "budget",
    related: ["interets-composes", "taux-interet", "diversification"],
    quiz: [
      {
        id: "budget-1",
        question: "Dans la règle 50/30/20, à quoi correspondent les 20 % ?",
        options: ["Aux loisirs", "À l'épargne et au remboursement de dettes", "Au loyer", "Aux impôts"],
        answer: 1,
        explanation: "20 % des revenus sont consacrés à l'épargne et au désendettement.",
      },
      {
        id: "budget-2",
        question: "Quelle priorité avant d'investir en bourse ?",
        options: [
          "Acheter une voiture neuve",
          "Constituer une épargne de précaution et rembourser les dettes coûteuses",
          "Ouvrir plusieurs cartes de crédit",
          "Emprunter pour investir",
        ],
        answer: 1,
        explanation: "L'épargne de précaution évite de devoir vendre au mauvais moment, et rembourser une dette chère est un « rendement » garanti.",
      },
    ],
    sources: [
      { label: "Mes questions d'argent (Banque de France)", url: "https://www.mesquestionsdargent.fr/" },
      { label: "CFPB — Budgeting", url: "https://www.consumerfinance.gov/consumer-tools/" },
    ],
  },
  {
    slug: "diversification",
    title: "Risque et diversification",
    domain: "finance",
    topics: ["finance-perso", "marches"],
    tagline: "Répartir ses placements pour ne pas dépendre d'un seul actif : « ne pas mettre tous ses œufs dans le même panier ».",
    explanations: {
      debutant: `Si vous placez tout votre argent dans une seule entreprise et qu'elle fait faillite, vous perdez tout. En répartissant votre argent entre **plusieurs placements**, les mauvaises surprises des uns sont compensées par les bonnes surprises des autres.

On peut diversifier entre :

- plusieurs **entreprises** et **secteurs**,
- plusieurs **pays**,
- plusieurs **types de placements** (actions, obligations, épargne sans risque, immobilier),
- plusieurs **moments** d'investissement (investir un peu chaque mois).`,
      intermediaire: `Le risque d'un placement se mesure souvent par sa **volatilité** (ampleur des variations). Un principe clé : un portefeuille peut être **moins risqué que chacun de ses éléments**, à condition que ceux-ci ne bougent pas tous dans le même sens (corrélation imparfaite).

Il existe deux types de risque :

- **Le risque spécifique** (propre à une entreprise) : il se réduit par la diversification.
- **Le risque de marché** (récession, crise) : il touche tout le monde et ne disparaît pas.

L'**allocation d'actifs** (la part d'actions, d'obligations, de liquidités) dépend de votre horizon et de votre tolérance aux pertes. Elle explique une grande partie de la performance à long terme.`,
      avance: `La **théorie moderne du portefeuille** (Markowitz, 1952) formalise l'arbitrage rendement/risque : pour un niveau de risque donné, il existe une combinaison d'actifs maximisant le rendement espéré (frontière efficiente). Le **MEDAF** (Sharpe) relie le rendement attendu d'un actif à son bêta, sa sensibilité au marché.

Limites : les corrélations augmentent souvent en période de crise (la diversification protège moins quand on en a le plus besoin), les rendements ne suivent pas une loi normale (queues épaisses) et les estimations de rendements espérés sont très incertaines.

En pratique, des approches robustes comme le portefeuille indiciel mondial à faibles frais, le **rééquilibrage** périodique et l'investissement programmé limitent les erreurs de comportement (vendre après une baisse, acheter après une hausse).`,
    },
    example: {
      title: "Un portefeuille, deux comportements",
      body: "Un portefeuille 100 % actions peut perdre 30 à 50 % lors d'un krach. Un portefeuille 60 % actions / 40 % obligations a en général subi des baisses nettement moins fortes, au prix d'un rendement espéré plus faible. Le bon choix dépend de votre capacité à traverser une baisse sans vendre.",
    },
    keyPoints: [
      "La diversification réduit le risque spécifique, pas le risque de marché.",
      "L'allocation d'actifs dépend de l'horizon et de la tolérance au risque.",
      "Les corrélations peuvent augmenter pendant les crises.",
      "Rééquilibrer régulièrement aide à garder le cap.",
    ],
    related: ["marches-financiers", "obligations", "interets-composes"],
    quiz: [
      {
        id: "diversif-1",
        question: "Quel risque la diversification permet-elle de réduire ?",
        options: ["Le risque de marché", "Le risque spécifique à une entreprise", "Le risque d'inflation", "Tous les risques"],
        answer: 1,
        explanation: "Détenir de nombreuses entreprises dilue l'impact d'une défaillance individuelle, mais pas celui d'une crise générale.",
      },
      {
        id: "diversif-2",
        question: "Qu'est-ce que le rééquilibrage d'un portefeuille ?",
        options: [
          "Vendre tout après une baisse",
          "Revenir périodiquement à la répartition cible",
          "Acheter uniquement des actions",
          "Changer de banque",
        ],
        answer: 1,
        explanation: "Il consiste à vendre un peu de ce qui a monté et racheter ce qui a baissé pour retrouver l'allocation choisie.",
      },
    ],
    sources: [
      { label: "AMF — Diversifier ses placements", url: "https://www.amf-france.org/fr/espace-epargnants" },
      { label: "Investor.gov — Asset allocation", url: "https://www.investor.gov/introduction-investing/getting-started/asset-allocation" },
    ],
  },
  {
    slug: "analyse-financiere",
    title: "Analyse financière",
    domain: "finance",
    topics: ["entreprises", "marches", "startups"],
    tagline: "Lire les états financiers d'une entreprise pour juger de sa rentabilité, de sa solidité et de sa capacité à générer de la trésorerie.",
    explanations: {
      debutant: `Une entreprise publie trois documents principaux :

- **Le compte de résultat** : ce qu'elle a vendu (chiffre d'affaires), ce que ça lui a coûté, et ce qu'il reste (le résultat ou bénéfice).
- **Le bilan** : une photo de ce qu'elle possède (actifs : machines, stocks, trésorerie) et de ce qu'elle doit (dettes), à une date donnée.
- **Le tableau des flux de trésorerie** : l'argent réellement entré et sorti.

Une entreprise peut être rentable sur le papier et pourtant manquer de trésorerie : c'est pourquoi on regarde les trois.`,
      intermediaire: `Quelques ratios essentiels :

- **Marge brute** et **marge opérationnelle** : quelle part du chiffre d'affaires reste après les coûts ?
- **EBITDA** (ou EBE) : un indicateur de la performance opérationnelle avant amortissements, intérêts et impôts.
- **Endettement net / EBITDA** : combien d'années de résultat opérationnel faudrait-il pour rembourser la dette ?
- **ROE** (rentabilité des capitaux propres) : bénéfice net / capitaux propres.
- **Free cash flow** : la trésorerie disponible après investissements, celle qui peut rembourser la dette ou rémunérer les actionnaires.

Un ratio isolé dit peu de chose : comparez-le dans le temps et avec des entreprises du même secteur.`,
      avance: `L'analyse approfondie décompose la rentabilité avec la **formule de DuPont** : ROE = marge nette × rotation des actifs × levier financier. Elle révèle si la performance vient de l'efficacité opérationnelle ou de l'endettement.

La **qualité des résultats** est cruciale : écart persistant entre bénéfice et flux de trésorerie, variations du besoin en fonds de roulement, capitalisation agressive de dépenses, éléments non récurrents. Les normes comptables (IFRS, US GAAP) laissent des marges d'appréciation (provisions, dépréciations, reconnaissance du chiffre d'affaires).

Pour la valorisation, on combine **DCF** (actualisation des free cash flows au coût moyen pondéré du capital) et **multiples** (VE/EBITDA, PER) d'entreprises comparables, en restant conscient de la forte sensibilité aux hypothèses de croissance et de taux d'actualisation.`,
    },
    example: {
      title: "Rentable mais à court de cash",
      body: "Une PME vend pour 1 M€ avec 10 % de marge, mais ses clients paient à 90 jours alors qu'elle paie ses fournisseurs à 30 jours. Si elle croît vite, elle doit financer un décalage de trésorerie croissant : bénéficiaire sur le papier, elle peut se retrouver en difficulté de paiement.",
    },
    keyPoints: [
      "Compte de résultat, bilan et flux de trésorerie se complètent.",
      "Comparez les ratios dans le temps et avec le secteur.",
      "La trésorerie compte autant que la rentabilité.",
      "Vérifiez la qualité des résultats, pas seulement leur niveau.",
    ],
    related: ["modele-economique", "marches-financiers"],
    quiz: [
      {
        id: "analyse-1",
        question: "Quel document donne une « photo » de ce que l'entreprise possède et doit à une date donnée ?",
        options: ["Le compte de résultat", "Le bilan", "Le tableau des flux de trésorerie", "Le rapport RSE"],
        answer: 1,
        explanation: "Le bilan présente actifs et passifs à une date précise.",
      },
      {
        id: "analyse-2",
        question: "Une entreprise rentable peut-elle faire faillite ?",
        options: [
          "Non, jamais",
          "Oui, si elle manque de trésorerie pour payer ses échéances",
          "Seulement si elle n'a pas de dettes",
          "Seulement si elle est cotée",
        ],
        answer: 1,
        explanation: "La faillite survient quand on ne peut plus payer ses dettes exigibles, même avec des bénéfices comptables.",
      },
      {
        id: "analyse-3",
        question: "Que mesure le ratio dette nette / EBITDA ?",
        options: [
          "La croissance du chiffre d'affaires",
          "La capacité de l'entreprise à rembourser sa dette avec son résultat opérationnel",
          "La rentabilité pour l'actionnaire",
          "La part de marché",
        ],
        answer: 1,
        explanation: "Il indique combien d'années de résultat opérationnel seraient nécessaires pour rembourser la dette nette.",
      },
    ],
    sources: [
      { label: "IFRS Foundation", url: "https://www.ifrs.org/" },
      { label: "Bpifrance Création — Fiches pratiques", url: "https://bpifrance-creation.fr/" },
    ],
  },
  {
    slug: "modele-economique",
    title: "Modèle économique",
    domain: "economie",
    topics: ["startups", "entreprises"],
    tagline: "La façon dont une entreprise crée de la valeur pour ses clients et en capte une partie pour être rentable.",
    explanations: {
      debutant: `Le modèle économique répond à trois questions : **à qui** je vends, **quoi** (quel problème je résous), et **comment je gagne de l'argent**.

Quelques modèles courants :

- **Vente directe** d'un produit ou service,
- **Abonnement** (un paiement régulier : logiciels, streaming),
- **Freemium** (gratuit de base, payant pour les fonctions avancées),
- **Commission** (une plateforme prend un pourcentage de chaque transaction),
- **Publicité** (le service est gratuit, les annonceurs paient).`,
      intermediaire: `Le **Business Model Canvas** résume un modèle en neuf blocs : segments de clients, proposition de valeur, canaux, relation client, sources de revenus, ressources clés, activités clés, partenaires clés, structure de coûts.

Deux calculs indispensables :

- **Le seuil de rentabilité** : le chiffre d'affaires à partir duquel les ventes couvrent tous les coûts (fixes + variables). Il se calcule ainsi : coûts fixes ÷ taux de marge sur coûts variables.
- **L'économie unitaire** : ce que rapporte chaque client (valeur vie client, LTV) comparé à ce qu'il coûte à acquérir (CAC). Un ratio LTV/CAC supérieur à 3 est souvent cité comme repère pour les modèles par abonnement.`,
      avance: `Les modèles de plateforme reposent sur les **effets de réseau** : la valeur pour chaque utilisateur augmente avec le nombre d'utilisateurs (marchés bifaces). Ils favorisent les dynamiques « winner takes most » et posent des questions de concurrence et de régulation.

L'IA générative modifie les structures de coûts : le **coût marginal** d'un service logiciel n'est plus quasi nul lorsqu'il repose sur de l'inférence de modèles, ce qui impose de suivre la marge brute par requête et de choisir des tarifs adaptés (à l'usage, par siège, au résultat).

Pour tester un modèle, privilégiez l'expérimentation : produit minimum viable, mesure de la rétention par cohortes, élasticité-prix, et itérations rapides (« lean startup »).`,
    },
    example: {
      title: "Le seuil de rentabilité d'un café",
      body: "Un café a 6 000 € de coûts fixes mensuels (loyer, salaires). Chaque boisson se vend 4 € et coûte 1 € en ingrédients, soit 3 € de marge. Il doit vendre 2 000 boissons par mois, environ 67 par jour, pour couvrir ses coûts. Au-delà, il gagne de l'argent.",
    },
    keyPoints: [
      "Un modèle économique explique comment l'entreprise gagne de l'argent.",
      "Le seuil de rentabilité indique le volume minimal de ventes.",
      "Comparez la valeur d'un client (LTV) à son coût d'acquisition (CAC).",
      "Testez et ajustez le modèle à partir de données réelles.",
    ],
    simulator: "seuil-rentabilite",
    caseStudy: "mpesa-kenya",
    related: ["analyse-financiere", "marches-financiers"],
    quiz: [
      {
        id: "bm-1",
        question: "Un service gratuit avec des options payantes suit un modèle :",
        options: ["Publicitaire", "Freemium", "De commission", "De franchise"],
        answer: 1,
        explanation: "Le freemium attire avec une offre gratuite et monétise une partie des utilisateurs.",
      },
      {
        id: "bm-2",
        question: "Coûts fixes de 10 000 €, marge de 5 € par produit vendu. Le seuil de rentabilité est de :",
        options: ["500 produits", "2 000 produits", "5 000 produits", "50 000 produits"],
        answer: 1,
        explanation: "10 000 € ÷ 5 € = 2 000 produits.",
      },
      {
        id: "bm-3",
        question: "Que compare le ratio LTV/CAC ?",
        options: [
          "Le chiffre d'affaires et les impôts",
          "La valeur d'un client sur sa durée de vie et son coût d'acquisition",
          "Les actifs et les dettes",
          "Le prix et la quantité",
        ],
        answer: 1,
        explanation: "Il indique si acquérir des clients est rentable sur la durée.",
      },
    ],
    sources: [
      { label: "Bpifrance Création", url: "https://bpifrance-creation.fr/" },
      { label: "Strategyzer — Business Model Canvas", url: "https://www.strategyzer.com/library/the-business-model-canvas" },
    ],
  },
  {
    slug: "taux-de-change",
    title: "Taux de change",
    domain: "finance",
    topics: ["marches", "economie-mondiale"],
    tagline: "Le prix d'une monnaie exprimé dans une autre, qui influence commerce, tourisme et investissements internationaux.",
    explanations: {
      debutant: `Le taux de change indique combien vaut une monnaie dans une autre. Si 1 € = 1,10 $, il faut 1,10 dollar pour obtenir un euro.

Quand l'euro **s'apprécie** (il vaut plus de dollars), les produits américains deviennent moins chers pour les Européens, mais les produits européens deviennent plus chers pour les Américains. Quand l'euro **se déprécie**, c'est l'inverse : les exportations européennes sont favorisées.`,
      intermediaire: `Il existe différents **régimes de change** :

- **Change flottant** : le prix est fixé par l'offre et la demande (euro, dollar, yen).
- **Change fixe** : la monnaie est arrimée à une autre. Le franc CFA (XOF et XAF) est arrimé à l'euro à une parité fixe : 1 € = 655,957 FCFA.
- **Régimes intermédiaires** : flottement géré, bandes de fluctuation.

Les taux de change sont influencés par les écarts de taux d'intérêt entre pays, l'inflation, la balance commerciale, la confiance des investisseurs et les décisions des banques centrales.`,
      avance: `À long terme, la **parité de pouvoir d'achat** suggère que les taux de change tendent à égaliser le prix des biens entre pays, mais les écarts peuvent persister longtemps. À court terme, la **parité des taux d'intérêt** et les flux de capitaux dominent : un pays qui relève ses taux attire des capitaux et voit souvent sa monnaie s'apprécier.

Le « **triangle d'incompatibilité** » (Mundell) énonce qu'un pays ne peut avoir simultanément un change fixe, une libre circulation des capitaux et une politique monétaire autonome : il doit renoncer à l'un des trois.

Pour les entreprises exposées, la couverture du risque de change (contrats à terme, options) est un enjeu de gestion. Pour les économies émergentes endettées en dollars, une forte appréciation du dollar alourdit le service de la dette.`,
    },
    example: {
      title: "Un voyage et une facture",
      body: "Une entreprise française achète une machine à 110 000 $. Si 1 € = 1,10 $, elle paie 100 000 €. Si l'euro baisse à 1 € = 1,00 $, la même machine lui coûte 110 000 € : 10 % de plus sans que le prix en dollars ait changé.",
    },
    keyPoints: [
      "Le taux de change est le prix d'une monnaie dans une autre.",
      "Une monnaie faible favorise les exportations et renchérit les importations.",
      "Le franc CFA est arrimé à l'euro (1 € = 655,957 FCFA).",
      "Écarts de taux d'intérêt et flux de capitaux pèsent à court terme.",
    ],
    related: ["commerce-international", "banque-centrale", "inflation"],
    quiz: [
      {
        id: "change-1",
        question: "Si l'euro se déprécie face au dollar, les exportations européennes vers les États-Unis :",
        options: ["Deviennent plus chères", "Deviennent moins chères pour les acheteurs américains", "Sont interdites", "Ne changent pas"],
        answer: 1,
        explanation: "Avec un euro plus faible, un même prix en euros correspond à moins de dollars.",
      },
      {
        id: "change-2",
        question: "Quelle est la parité fixe du franc CFA avec l'euro ?",
        options: ["1 € = 100 FCFA", "1 € = 500 FCFA", "1 € = 655,957 FCFA", "Elle flotte librement"],
        answer: 2,
        explanation: "La parité est fixe : 1 € = 655,957 francs CFA, pour le XOF comme pour le XAF.",
      },
      {
        id: "change-3",
        question: "Selon le triangle d'incompatibilité, un pays à change fixe et capitaux libres renonce à :",
        options: ["Son commerce extérieur", "Une politique monétaire autonome", "Sa monnaie", "Ses exportations"],
        answer: 1,
        explanation: "Pour maintenir la parité avec des capitaux libres, il doit aligner sa politique monétaire sur celle de la monnaie d'ancrage.",
      },
    ],
    sources: [
      { label: "BCE — Taux de change de référence", url: "https://www.ecb.europa.eu/stats/policy_and_exchange_rates/euro_reference_exchange_rates/html/index.en.html" },
      { label: "BCEAO", url: "https://www.bceao.int/" },
    ],
  },
  {
    slug: "commerce-international",
    title: "Commerce international",
    domain: "economie",
    topics: ["economie-mondiale", "entreprises"],
    tagline: "Les échanges de biens et services entre pays, guidés par la spécialisation, les coûts et les politiques commerciales.",
    explanations: {
      debutant: `Les pays échangent parce qu'ils ne produisent pas tous la même chose aussi bien : un pays riche en pétrole en exporte, un autre exporte des voitures ou des services informatiques.

La **balance commerciale** compare exportations et importations. Si un pays exporte plus qu'il n'importe, il a un **excédent** ; sinon, un **déficit**.

Les **droits de douane** sont des taxes sur les produits importés. Ils protègent certains producteurs locaux mais renchérissent les produits pour les consommateurs.`,
      intermediaire: `La théorie de l'**avantage comparatif** (Ricardo) montre que deux pays gagnent à échanger même si l'un est meilleur dans tout : chacun a intérêt à se spécialiser là où il est *relativement* le plus efficace.

Les échanges actuels passent largement par des **chaînes de valeur mondiales** : un smartphone est conçu dans un pays, ses composants fabriqués dans plusieurs autres, puis assemblé ailleurs. Cela réduit les coûts mais expose aux ruptures d'approvisionnement, comme pendant la pandémie de Covid-19.

Des institutions encadrent ces échanges : l'**OMC** au niveau mondial, et des accords régionaux comme le marché unique européen ou la **Zone de libre-échange continentale africaine (ZLECAf)**.`,
      avance: `Les nouvelles théories du commerce (Krugman) intègrent économies d'échelle et différenciation des produits ; la « nouvelle nouvelle » théorie (Melitz) montre que seules les entreprises les plus productives exportent, ce qui augmente la productivité moyenne après ouverture.

Les gains de l'échange sont réels mais **inégalement répartis** : l'ouverture à la concurrence de pays à bas coûts a pesé sur l'emploi industriel de certaines régions (« choc chinois » étudié par Autor, Dorn et Hanson), alimentant le retour du protectionnisme.

La période récente est marquée par la **fragmentation** : hausses de droits de douane entre grandes économies, politiques industrielles (subventions aux semi-conducteurs, à la transition énergétique), contrôles des exportations technologiques et stratégies de « friend-shoring ».`,
    },
    example: {
      title: "Qui paie les droits de douane ?",
      body: "Un droit de douane de 25 % sur un produit importé à 100 € porte son coût à 125 € pour l'importateur. Selon la concurrence, l'importateur peut absorber une partie de la hausse ou la répercuter sur le consommateur final. Plusieurs études sur les droits de douane américains de 2018-2019 ont conclu qu'ils avaient été largement payés par les acheteurs américains.",
    },
    keyPoints: [
      "La spécialisation selon l'avantage comparatif crée des gains d'échange.",
      "La balance commerciale compare exportations et importations.",
      "Les chaînes de valeur mondiales rendent les économies interdépendantes.",
      "Les gains du commerce sont réels mais inégalement répartis.",
    ],
    related: ["taux-de-change", "croissance-pib"],
    quiz: [
      {
        id: "commerce-1",
        question: "Selon l'avantage comparatif, un pays devrait se spécialiser dans :",
        options: [
          "Tout ce qu'il produit",
          "Ce qu'il produit relativement le plus efficacement",
          "Uniquement les matières premières",
          "Les produits les plus chers",
        ],
        answer: 1,
        explanation: "La spécialisation se fait selon l'efficacité relative, pas absolue.",
      },
      {
        id: "commerce-2",
        question: "Que signifie ZLECAf ?",
        options: [
          "Zone de libre-échange continentale africaine",
          "Zone libre d'échanges commerciaux en Afrique francophone",
          "Une monnaie africaine",
          "Une banque de développement",
        ],
        answer: 0,
        explanation: "La ZLECAf vise à créer un vaste marché commun à l'échelle du continent africain.",
      },
    ],
    sources: [
      { label: "Organisation mondiale du commerce", url: "https://www.wto.org/" },
      { label: "Secrétariat de la ZLECAf", url: "https://au-afcfta.org/" },
    ],
  },
  {
    slug: "monnaie",
    title: "Monnaie et création monétaire",
    domain: "economie",
    topics: ["politique-monetaire", "crypto"],
    tagline: "La monnaie sert à échanger, compter et épargner ; elle est créée en grande partie par les banques lorsqu'elles accordent des crédits.",
    explanations: {
      debutant: `La monnaie a trois fonctions :

- **Intermédiaire des échanges** : on l'accepte en paiement.
- **Unité de compte** : elle permet de comparer les prix.
- **Réserve de valeur** : on peut la garder pour plus tard.

Aujourd'hui, la plus grande partie de la monnaie n'existe pas en billets, mais sous forme de **soldes sur des comptes bancaires**. Le paiement par carte ou par mobile déplace de la monnaie d'un compte à un autre.`,
      intermediaire: `Contrairement à une idée répandue, les banques ne prêtent pas seulement l'épargne qu'elles ont reçue : **en accordant un crédit, elles créent de la monnaie**. Quand une banque vous prête 10 000 €, elle crédite votre compte de 10 000 € nouveaux. Lorsque le prêt est remboursé, cette monnaie disparaît.

Cette création est encadrée : par les taux de la banque centrale (qui influencent la demande de crédit), par les règles prudentielles (exigences de fonds propres) et par la solvabilité des emprunteurs.

La banque centrale émet, elle, la **monnaie centrale** : billets et réserves des banques sur leurs comptes à la banque centrale.`,
      avance: `La masse monétaire se mesure par agrégats (M1, M2, M3) de liquidité décroissante. La vision du « multiplicateur monétaire » mécanique est aujourd'hui considérée comme trompeuse : la Banque d'Angleterre l'a explicitement nuancé en 2014, soulignant que les crédits font les dépôts et non l'inverse.

Les innovations récentes interrogent la nature de la monnaie : **monnaie mobile** (M-Pesa, Orange Money), **cryptoactifs** sans émetteur central, **stablecoins** adossés à des actifs, et **monnaies numériques de banque centrale** (MNBC) comme l'euro numérique en préparation ou l'e-naira nigérian.

La confiance reste le fondement de toute monnaie : confiance dans l'émetteur, dans la stabilité de sa valeur et dans le système de paiement qui la fait circuler.`,
    },
    example: {
      title: "Le crédit qui crée des dépôts",
      body: "Une banque accorde 20 000 € de prêt à une artisane pour acheter un véhicule. Le compte de l'artisane est crédité, elle paie le garagiste, dont le compte augmente de 20 000 €. Aucun autre client n'a vu son épargne diminuer : de la monnaie nouvelle circule désormais dans l'économie.",
    },
    keyPoints: [
      "La monnaie sert à échanger, compter et épargner.",
      "L'essentiel de la monnaie est scripturale (sur des comptes).",
      "Les banques créent de la monnaie en accordant des crédits.",
      "La confiance est le fondement de toute monnaie.",
    ],
    caseStudy: "mpesa-kenya",
    related: ["banque-centrale", "inflation", "cryptoactifs"],
    quiz: [
      {
        id: "monnaie-1",
        question: "Laquelle n'est PAS une fonction de la monnaie ?",
        options: ["Intermédiaire des échanges", "Unité de compte", "Réserve de valeur", "Garantie de profit"],
        answer: 3,
        explanation: "La monnaie ne garantit aucun profit ; ses trois fonctions sont l'échange, la mesure et la réserve de valeur.",
      },
      {
        id: "monnaie-2",
        question: "Quand une banque accorde un crédit :",
        options: [
          "Elle prête uniquement l'épargne d'autres clients",
          "Elle crée de la monnaie nouvelle",
          "Elle imprime des billets",
          "Elle détruit de la monnaie",
        ],
        answer: 1,
        explanation: "Le crédit crédite le compte de l'emprunteur : c'est une création monétaire, détruite au remboursement.",
      },
    ],
    sources: [
      { label: "Bank of England — Money creation in the modern economy (2014)", url: "https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy" },
      { label: "Banque de France — La monnaie", url: "https://www.banque-france.fr/" },
    ],
  },
  {
    slug: "cryptoactifs",
    title: "Cryptoactifs",
    domain: "finance",
    topics: ["crypto", "innovation"],
    tagline: "Des actifs numériques fondés sur la cryptographie et des registres partagés (blockchains), sans autorité centrale d'émission.",
    explanations: {
      debutant: `Le **bitcoin**, créé en 2009, est le premier cryptoactif. Les transactions sont enregistrées dans une **blockchain** : un registre public, partagé entre des milliers d'ordinateurs, qu'aucune banque ne contrôle.

Les cryptoactifs sont **très volatils** : leur prix peut varier de plusieurs dizaines de pour cent en quelques semaines. Ils ne sont pas garantis par un État et peuvent être perdus (oubli des clés d'accès, piratage, plateforme défaillante).

Règle de prudence : n'y consacrer que des sommes dont on peut supporter la perte totale, et se méfier des promesses de gains rapides.`,
      intermediaire: `On distingue plusieurs familles :

- **Bitcoin** : offre limitée à 21 millions d'unités, souvent présenté comme une « réserve de valeur » numérique.
- **Plateformes de contrats intelligents** (Ethereum…) : des programmes exécutés automatiquement sur la blockchain, base de la finance décentralisée (DeFi).
- **Stablecoins** : des jetons adossés à une monnaie (souvent le dollar), utilisés pour les échanges et les paiements.

La régulation se structure : en Europe, le règlement **MiCA** encadre les émetteurs et prestataires de services sur cryptoactifs ; aux États-Unis, la SEC a autorisé en janvier 2024 des fonds cotés (ETF) investis directement en bitcoin.`,
      avance: `Les débats économiques portent sur la valeur fondamentale (absence de flux de trésorerie pour le bitcoin, contrairement aux actions ou obligations), la consommation énergétique de la preuve de travail, et l'utilité réelle au-delà de la spéculation (transferts transfrontaliers, programmabilité, inclusion financière).

Les **stablecoins** soulèvent des enjeux macro-financiers : qualité des réserves, risque de ruée en cas de perte de confiance (comme l'effondrement de TerraUSD en mai 2022, un stablecoin algorithmique), et effets sur la souveraineté monétaire des pays dont la monnaie est faible.

Les faillites de plateformes centralisées (FTX en novembre 2022) ont rappelé les risques de contrepartie et l'importance de la séparation des actifs des clients — l'un des objectifs centraux des cadres réglementaires récents.`,
    },
    example: {
      title: "Une volatilité hors norme",
      body: "Le bitcoin a connu plusieurs baisses de plus de 70 % depuis son sommet précédent, notamment en 2018 et en 2022, avant de remonter. Un investisseur qui achète au mauvais moment peut attendre des années avant de retrouver sa mise, sans aucune garantie.",
    },
    keyPoints: [
      "Les cryptoactifs reposent sur des registres partagés (blockchains).",
      "Ils sont très volatils et non garantis.",
      "Les stablecoins sont adossés à des monnaies officielles.",
      "La régulation se renforce (MiCA en Europe).",
    ],
    related: ["monnaie", "diversification", "marches-financiers"],
    quiz: [
      {
        id: "crypto-1",
        question: "Qu'est-ce qu'une blockchain ?",
        options: [
          "Une banque en ligne",
          "Un registre partagé et sécurisé par cryptographie",
          "Une monnaie émise par la BCE",
          "Un type d'obligation",
        ],
        answer: 1,
        explanation: "La blockchain est un registre distribué où les transactions sont enregistrées de façon difficilement falsifiable.",
      },
      {
        id: "crypto-2",
        question: "Quel règlement encadre les cryptoactifs dans l'Union européenne ?",
        options: ["RGPD", "MiCA", "Bâle III", "AI Act"],
        answer: 1,
        explanation: "MiCA (Markets in Crypto-Assets) encadre émetteurs et prestataires de services sur cryptoactifs.",
      },
    ],
    sources: [
      { label: "AMF — Cryptoactifs", url: "https://www.amf-france.org/fr/espace-epargnants" },
      { label: "BRI — Rapports sur les cryptoactifs", url: "https://www.bis.org/" },
    ],
  },
];

export const conceptBySlug = new Map(concepts.map((c) => [c.slug, c]));

export function getConcept(slug: string): Concept | undefined {
  return conceptBySlug.get(slug);
}
