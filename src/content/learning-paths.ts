import type { LearningPath } from "./types";

export const learningPaths: LearningPath[] = [
  {
    slug: "bases-economie",
    title: "Les bases de l'économie",
    domain: "economie",
    level: "debutant",
    topics: ["economie-mondiale", "politique-monetaire"],
    description:
      "Comprendre les grands mécanismes qui font l'actualité économique : offre et demande, croissance, inflation et rôle des banques centrales.",
    outcomes: [
      "Expliquer comment se forment les prix",
      "Lire un chiffre de croissance ou d'inflation",
      "Comprendre pourquoi les banques centrales changent leurs taux",
    ],
    lessons: [
      {
        slug: "rarete-et-choix",
        title: "Rareté, choix et marché",
        minutes: 6,
        summary: "Pourquoi l'économie existe, et comment l'offre et la demande fixent les prix.",
        body: `## Tout part de la rareté

Nos besoins sont presque illimités, mais nos ressources (temps, argent, matières premières) sont limitées. L'économie étudie **comment nous faisons des choix** face à cette rareté.

Chaque choix a un **coût d'opportunité** : ce à quoi on renonce. Une heure passée à étudier, c'est une heure qui n'est pas consacrée à travailler ou à se reposer.

## L'offre et la demande

Sur un marché, deux forces se rencontrent :

- **La demande** : la quantité que les acheteurs veulent acquérir. Elle diminue en général quand le prix monte.
- **L'offre** : la quantité que les vendeurs proposent. Elle augmente en général quand le prix monte.

Le prix d'équilibre est celui où les deux quantités se rejoignent. Si une sécheresse réduit la récolte de cacao, l'offre baisse et le prix monte ; si une mode fait exploser la demande de chocolat, le prix monte aussi.

## Les limites du marché

Les marchés ne résolvent pas tout : pollution (externalités), biens publics (éclairage, défense), situations de monopole, inégalités. C'est là qu'interviennent l'État et la régulation.`,
        takeaways: [
          "L'économie étudie les choix face à des ressources rares.",
          "Le prix d'équilibre égalise l'offre et la demande.",
          "Les défaillances de marché justifient l'intervention publique.",
        ],
        exercise:
          "Choisissez un produit dont le prix a beaucoup varié récemment (carburant, café, smartphone…). Identifiez si la variation vient plutôt de l'offre ou de la demande, et expliquez pourquoi en trois phrases.",
        quiz: [
          {
            id: "l1-1",
            question: "Si la demande d'un produit augmente alors que l'offre reste stable, le prix :",
            options: ["Baisse", "Augmente", "Reste identique", "Devient nul"],
            answer: 1,
            explanation: "Plus d'acheteurs pour la même quantité disponible : le prix d'équilibre monte.",
          },
          {
            id: "l1-2",
            question: "Le coût d'opportunité d'un choix, c'est :",
            options: [
              "Le prix payé en caisse",
              "La meilleure alternative à laquelle on renonce",
              "Les impôts sur la consommation",
              "Le coût de fabrication",
            ],
            answer: 1,
            explanation: "Choisir, c'est renoncer : le coût d'opportunité mesure ce sacrifice.",
          },
          {
            id: "l1-3",
            question: "La pollution d'une usine qui affecte les riverains est un exemple de :",
            options: ["Bien public", "Externalité négative", "Monopole", "Inflation"],
            answer: 1,
            explanation: "L'usine impose un coût à des tiers sans le payer : c'est une externalité négative.",
          },
        ],
        concepts: ["croissance-pib"],
      },
      {
        slug: "pib-croissance",
        title: "Le PIB et la croissance",
        minutes: 7,
        summary: "Ce que mesure le PIB, ce qu'il ne mesure pas, et pourquoi la croissance compte.",
        body: `## Mesurer la production

Le **PIB** additionne la valeur de tous les biens et services produits dans un pays sur une période. On peut le calculer par la production (valeurs ajoutées), par les dépenses (consommation, investissement, dépenses publiques, exportations nettes) ou par les revenus.

## Croissance réelle

Quand on annonce « la croissance est de 1,5 % », il s'agit du PIB **réel**, corrigé de la hausse des prix. Sinon, une simple inflation donnerait l'illusion d'une économie plus riche.

## Pourquoi la croissance compte

À long terme, la croissance du PIB par habitant détermine l'amélioration du niveau de vie : un pays dont le PIB par habitant croît de 2 % par an double son niveau de vie en environ 35 ans.

## Ce que le PIB ne dit pas

Le PIB ignore la répartition des richesses, le travail non rémunéré, la qualité de l'environnement et le bien-être. D'autres indicateurs le complètent : indice de développement humain (IDH), taux de pauvreté, empreinte carbone.`,
        takeaways: [
          "Le PIB mesure la valeur de la production d'un pays.",
          "La croissance est mesurée en volume, hors inflation.",
          "Le PIB n'est pas un indicateur de bien-être.",
        ],
        exercise:
          "Sur le tableau de bord, comparez la croissance de deux pays sur plusieurs années. Notez une année où l'un d'eux était en récession et cherchez-en la cause dans l'actualité de l'époque.",
        quiz: [
          {
            id: "l2-1",
            question: "Une croissance de 2 % par an du PIB par habitant double le niveau de vie en environ :",
            options: ["10 ans", "20 ans", "35 ans", "70 ans"],
            answer: 2,
            explanation: "Règle de 70 (ou 72) : 70 ÷ 2 = 35 ans.",
          },
          {
            id: "l2-2",
            question: "Laquelle de ces activités n'est PAS comptée dans le PIB ?",
            options: ["Un repas au restaurant", "La cuisine faite à la maison pour sa famille", "Une coupe chez le coiffeur", "Un cours particulier payé"],
            answer: 1,
            explanation: "Le travail domestique non rémunéré n'est pas comptabilisé dans le PIB.",
          },
          {
            id: "l2-3",
            question: "Le PIB réel est :",
            options: ["Le PIB corrigé de l'inflation", "Le PIB par habitant", "Le PIB hors État", "Le PIB prévu"],
            answer: 0,
            explanation: "Il mesure l'évolution des volumes produits, à prix constants.",
          },
        ],
        concepts: ["croissance-pib", "cycle-economique"],
      },
      {
        slug: "inflation-expliquee",
        title: "L'inflation expliquée",
        minutes: 7,
        summary: "Comment on mesure la hausse des prix, d'où elle vient et qui elle pénalise.",
        body: `## Un panier de référence

Les instituts statistiques suivent chaque mois le prix d'un **panier** de biens et services représentatif de la consommation des ménages. L'inflation est la variation de son prix sur un an.

## D'où vient l'inflation ?

- **Trop de demande** par rapport à ce que l'économie peut produire.
- **Des coûts qui montent** : énergie, matières premières, salaires.
- **Des anticipations** : si tout le monde s'attend à des hausses, elles se produisent.

## Gagnants et perdants

L'inflation **pénalise** ceux dont les revenus ne suivent pas (salaires non revalorisés, pensions fixes) et ceux qui détiennent de l'argent non rémunéré. Elle **avantage** les emprunteurs à taux fixe, dont la dette pèse moins lourd en termes réels.

## Pourquoi viser 2 % et pas 0 % ?

Une légère inflation laisse une marge de sécurité contre la **déflation** (baisse générale des prix), plus difficile à combattre : les consommateurs reportent leurs achats en attendant des prix plus bas, ce qui freine l'activité. Elle donne aussi de la marge aux banques centrales pour baisser les taux réels en cas de crise.`,
        takeaways: [
          "L'inflation mesure la hausse du prix d'un panier représentatif.",
          "Elle peut venir de la demande, des coûts ou des anticipations.",
          "Les banques centrales visent environ 2 % pour éviter la déflation.",
        ],
        exercise:
          "Utilisez le simulateur « Pouvoir d'achat » : combien vaudront 1 000 € dans 10 ans avec 2 % d'inflation ? Et avec 5 % ? Notez l'écart.",
        quiz: [
          {
            id: "l3-1",
            question: "Qui est plutôt avantagé par une inflation imprévue ?",
            options: ["Un épargnant sur compte courant", "Un emprunteur à taux fixe", "Un retraité à pension fixe", "Un prêteur à taux fixe"],
            answer: 1,
            explanation: "La valeur réelle de sa dette diminue, alors que ses revenus nominaux peuvent augmenter.",
          },
          {
            id: "l3-2",
            question: "Pourquoi la déflation est-elle redoutée ?",
            options: [
              "Elle augmente les salaires",
              "Elle pousse à reporter les achats et alourdit les dettes réelles",
              "Elle fait baisser le chômage",
              "Elle est facile à combattre",
            ],
            answer: 1,
            explanation: "Baisse des prix attendue = achats reportés, activité ralentie, dettes plus lourdes en termes réels.",
          },
          {
            id: "l3-3",
            question: "L'inflation se mesure à partir :",
            options: ["Du prix de l'or", "D'un panier de biens et services", "Du cours de la bourse", "Du taux de chômage"],
            answer: 1,
            explanation: "L'indice des prix suit un panier représentatif de la consommation des ménages.",
          },
        ],
        concepts: ["inflation"],
      },
      {
        slug: "banques-centrales",
        title: "Le rôle des banques centrales",
        minutes: 8,
        summary: "Taux directeurs, achats d'actifs et communication : comment les banques centrales pilotent l'économie.",
        body: `## La banque des banques

La banque centrale émet la monnaie, prête aux banques commerciales et veille à la stabilité financière. Sa mission première est en général la **stabilité des prix**.

## Le taux directeur

C'est son outil principal. Quand elle le **relève**, les banques empruntent plus cher et répercutent la hausse sur leurs clients : moins de crédits, moins de dépenses, moins de pression sur les prix. Quand elle le **baisse**, elle encourage le crédit et soutient l'activité.

## Les autres outils

- **Achats d'obligations** (assouplissement quantitatif) pour faire baisser les taux longs.
- **Communication** : annoncer ses intentions influence dès aujourd'hui les taux de marché.
- **Prêteur en dernier ressort** : fournir des liquidités pour éviter les paniques bancaires.

## Des effets décalés

Une décision de taux met en général **un à deux ans** à produire l'essentiel de ses effets sur l'inflation. Les banquiers centraux doivent donc agir en fonction de leurs prévisions, pas seulement des chiffres du mois.`,
        takeaways: [
          "La banque centrale vise d'abord la stabilité des prix.",
          "Son taux directeur influence tous les taux de l'économie.",
          "Ses décisions agissent avec un long décalage.",
        ],
        exercise:
          "Demandez à l'assistant IA d'expliquer la dernière décision de taux de la BCE ou de la Fed au niveau « Débutant », puis au niveau « Avancé ». Comparez les deux explications.",
        quiz: [
          {
            id: "l4-1",
            question: "Pour lutter contre une inflation trop élevée, une banque centrale :",
            options: ["Baisse ses taux", "Relève ses taux", "Achète plus d'obligations", "Supprime la monnaie"],
            answer: 1,
            explanation: "Relever les taux freine le crédit et la demande, donc la hausse des prix.",
          },
          {
            id: "l4-2",
            question: "En combien de temps une décision de taux produit-elle l'essentiel de ses effets ?",
            options: ["Le jour même", "Une semaine", "Un à deux ans", "Dix ans"],
            answer: 2,
            explanation: "La transmission passe par le crédit, l'investissement et les prix : elle prend du temps.",
          },
          {
            id: "l4-3",
            question: "La « forward guidance » désigne :",
            options: [
              "Une prévision météo",
              "La communication sur l'orientation future de la politique monétaire",
              "Un prêt aux États",
              "Un indice boursier",
            ],
            answer: 1,
            explanation: "En annonçant ses intentions, la banque centrale influence les anticipations et les taux de marché.",
          },
        ],
        concepts: ["banque-centrale", "taux-interet"],
      },
    ],
  },
  {
    slug: "investir-fondamentaux",
    title: "Investir : les fondamentaux",
    domain: "finance",
    level: "debutant",
    topics: ["finance-perso", "marches"],
    description:
      "Construire des bases solides avant d'investir : budget, intérêts composés, grandes classes d'actifs, risque et biais comportementaux.",
    outcomes: [
      "Organiser son budget et son épargne de précaution",
      "Comprendre la différence entre actions, obligations et fonds",
      "Construire une stratégie diversifiée adaptée à son horizon",
    ],
    lessons: [
      {
        slug: "epargner-avant-investir",
        title: "Épargner avant d'investir",
        minutes: 6,
        summary: "Budget, épargne de précaution et dettes : les fondations indispensables.",
        body: `## Connaître ses flux

Avant d'investir, il faut savoir combien on peut mettre de côté chaque mois. Listez vos revenus et vos dépenses réelles sur deux ou trois mois : beaucoup de personnes découvrent des abonnements oubliés ou des dépenses sous-estimées.

## L'épargne de précaution

C'est un matelas de sécurité de **3 à 6 mois de dépenses**, placé sur un support disponible immédiatement et sans risque de perte. Il évite de devoir vendre un placement au pire moment en cas d'imprévu (perte d'emploi, réparation, santé).

## Rembourser les dettes chères

Un crédit renouvelable à 15 % ou un découvert coûtent plus que ce qu'un placement rapporte en moyenne. Les rembourser, c'est obtenir un « rendement » garanti égal à leur taux.

## Se payer en premier

Programmez un virement automatique vers votre épargne **le jour où vous êtes payé**, plutôt que d'épargner ce qui reste en fin de mois. L'automatisation est l'un des leviers les plus efficaces contre la procrastination.`,
        takeaways: [
          "Commencez par connaître vos dépenses réelles.",
          "Constituez 3 à 6 mois de dépenses en épargne de précaution.",
          "Remboursez les dettes coûteuses avant d'investir.",
        ],
        exercise:
          "Utilisez le simulateur de budget avec vos revenus réels. Quel montant pouvez-vous épargner chaque mois ? En combien de mois atteindrez-vous 3 mois de dépenses ?",
        quiz: [
          {
            id: "i1-1",
            question: "L'épargne de précaution doit être placée :",
            options: ["En actions", "Sur un support disponible et sans risque", "En cryptoactifs", "Dans l'immobilier"],
            answer: 1,
            explanation: "Elle doit être accessible immédiatement et ne pas risquer de baisser au moment où l'on en a besoin.",
          },
          {
            id: "i1-2",
            question: "« Se payer en premier » signifie :",
            options: [
              "Dépenser d'abord pour soi",
              "Épargner automatiquement dès réception du salaire",
              "Rembourser ses amis",
              "Demander une augmentation",
            ],
            answer: 1,
            explanation: "On épargne avant de dépenser, plutôt que d'épargner le reste éventuel.",
          },
          {
            id: "i1-3",
            question: "Vous avez un crédit à 18 % et 1 000 € disponibles. Le plus rentable en général :",
            options: ["Investir en bourse", "Rembourser le crédit", "Garder en liquide", "Acheter des cryptoactifs"],
            answer: 1,
            explanation: "Rembourser économise 18 % par an de façon certaine, ce qu'aucun placement ne garantit.",
          },
        ],
        concepts: ["budget-personnel"],
      },
      {
        slug: "temps-et-interets-composes",
        title: "Le temps et les intérêts composés",
        minutes: 6,
        summary: "Pourquoi commencer tôt compte plus que le montant investi.",
        body: `## L'effet boule de neige

Avec les intérêts composés, vos gains produisent eux-mêmes des gains. La croissance est lente au début, puis s'accélère : c'est une courbe exponentielle.

## La règle de 72

Divisez 72 par le taux de rendement annuel pour estimer le temps de doublement : 72 ÷ 6 = 12 ans. À 3 %, il faut 24 ans.

## Commencer tôt

Deux personnes placent 100 € par mois à 5 %. La première commence à 25 ans, la seconde à 35 ans. À 65 ans, la première a environ **152 000 €**, la seconde environ **83 000 €**. Dix ans d'avance, soit 12 000 € de versements en plus, rapportent près de 70 000 € supplémentaires.

## Les ennemis de l'effet composé

- **Les frais** : 1,5 % de frais annuels en plus peuvent réduire le capital final d'un quart à un tiers sur 30 ans.
- **L'inflation** : raisonnez en rendement réel.
- **Les retraits prématurés** : ils interrompent la boule de neige.`,
        takeaways: [
          "Les intérêts composés font croître l'épargne de façon exponentielle.",
          "Le temps est le premier levier : commencer tôt compte énormément.",
          "Les frais et l'inflation érodent l'effet composé.",
        ],
        exercise:
          "Dans le simulateur d'intérêts composés, comparez 30 ans de placement avec 0,2 % puis 2 % de frais annuels (en diminuant le taux d'autant). Quelle est la différence de capital final ?",
        quiz: [
          {
            id: "i2-1",
            question: "À 4 % par an, un capital double en environ :",
            options: ["4 ans", "12 ans", "18 ans", "40 ans"],
            answer: 2,
            explanation: "72 ÷ 4 = 18 ans.",
          },
          {
            id: "i2-2",
            question: "Pourquoi des frais de 2 % par an ont-ils un impact si fort à long terme ?",
            options: [
              "Ils sont prélevés une seule fois",
              "Ils se composent aussi, sur un capital qui grossit",
              "Ils sont remboursés",
              "Ils n'ont pas d'impact",
            ],
            answer: 1,
            explanation: "Chaque année, les frais réduisent la base qui génère les rendements futurs.",
          },
          {
            id: "i2-3",
            question: "La courbe de croissance d'un capital à intérêts composés est :",
            options: ["Linéaire", "Exponentielle", "Constante", "Décroissante"],
            answer: 1,
            explanation: "Elle s'accélère avec le temps.",
          },
        ],
        concepts: ["interets-composes"],
      },
      {
        slug: "classes-actifs",
        title: "Actions, obligations et fonds",
        minutes: 8,
        summary: "Les grandes familles de placements, leurs rendements et leurs risques.",
        body: `## Les actions

Une action est une part d'entreprise. Son rendement vient des **dividendes** et de la **plus-value**. Sur longue période, les actions ont historiquement offert les rendements les plus élevés des grandes classes d'actifs, mais avec des baisses pouvant dépasser 30 à 50 % lors des krachs.

## Les obligations

Une obligation est un prêt à un État ou une entreprise. Plus stable que les actions, elle verse des coupons. Son prix baisse quand les taux montent.

## Les placements monétaires

Livrets, comptes à terme, fonds monétaires : peu de risque, rendement proche des taux courts, souvent à peine supérieur à l'inflation.

## Les fonds et ETF

Un fonds regroupe l'argent de nombreux investisseurs pour acheter un portefeuille diversifié. Les **ETF indiciels** répliquent un indice (par exemple un indice mondial de plusieurs milliers d'entreprises) avec des frais faibles. Ils offrent une diversification immédiate.

## Le couple rendement-risque

Aucun placement n'offre à la fois rendement élevé, sécurité totale et disponibilité immédiate. Méfiez-vous de toute offre qui promet les trois.`,
        takeaways: [
          "Actions : rendement espéré élevé, forte volatilité.",
          "Obligations : plus stables, sensibles aux taux.",
          "Les ETF indiciels offrent une diversification à faible coût.",
        ],
        exercise:
          "Cherchez la fiche d'un ETF indiciel mondial (document d'informations clés). Notez le nombre d'entreprises détenues, les frais courants et la répartition par pays.",
        quiz: [
          {
            id: "i3-1",
            question: "Quelle classe d'actifs a historiquement offert les meilleurs rendements à long terme, avec la plus forte volatilité ?",
            options: ["Les livrets", "Les obligations d'État", "Les actions", "Les liquidités"],
            answer: 2,
            explanation: "Les actions rémunèrent la prise de risque sur longue période.",
          },
          {
            id: "i3-2",
            question: "Un ETF indiciel permet :",
            options: [
              "De battre le marché à coup sûr",
              "D'acheter un indice entier en une opération, à faible coût",
              "De garantir le capital",
              "D'éviter tout risque",
            ],
            answer: 1,
            explanation: "Il réplique un indice et offre une diversification immédiate, sans garantie de capital.",
          },
          {
            id: "i3-3",
            question: "Un placement promet 15 % par an garantis sans risque. Il faut :",
            options: ["Investir immédiatement", "S'en méfier fortement", "Emprunter pour investir plus", "Le recommander à ses proches"],
            answer: 1,
            explanation: "Rendement élevé et absence de risque sont incompatibles : c'est le signe classique d'une arnaque.",
          },
        ],
        concepts: ["marches-financiers", "obligations"],
      },
      {
        slug: "risque-et-biais",
        title: "Risque, diversification et biais",
        minutes: 8,
        summary: "Construire un portefeuille robuste et éviter les erreurs de comportement les plus coûteuses.",
        body: `## Diversifier

Répartir ses placements entre entreprises, secteurs, pays et classes d'actifs réduit le risque spécifique. Un fonds indiciel mondial est un moyen simple d'y parvenir.

## Choisir son allocation

La part d'actions dépend de votre **horizon** (dans combien de temps aurez-vous besoin de l'argent ?) et de votre **tolérance aux pertes** (pourriez-vous voir votre portefeuille baisser de 30 % sans vendre ?).

## Les biais qui coûtent cher

- **L'aversion aux pertes** : une perte fait environ deux fois plus mal qu'un gain équivalent fait plaisir, ce qui pousse à vendre au mauvais moment.
- **Le mimétisme** : acheter ce qui a déjà beaucoup monté parce que tout le monde en parle.
- **L'excès de confiance** : croire que l'on peut prévoir le marché.
- **Le biais de récence** : extrapoler les dernières années.

## Des règles simples

Investir régulièrement (versements programmés), rééquilibrer une fois par an, et ne pas consulter son portefeuille trop souvent sont des protections efficaces contre ses propres réactions.`,
        takeaways: [
          "La diversification réduit le risque spécifique.",
          "L'allocation dépend de l'horizon et de la tolérance aux pertes.",
          "Des règles automatiques protègent contre les biais.",
        ],
        exercise:
          "Écrivez votre « plan d'investissement » en cinq lignes : objectif, horizon, montant mensuel, allocation cible, et ce que vous ferez si le marché baisse de 30 %.",
        quiz: [
          {
            id: "i4-1",
            question: "L'aversion aux pertes pousse souvent à :",
            options: [
              "Acheter davantage lors des baisses",
              "Vendre dans la panique après une baisse",
              "Ignorer les frais",
              "Diversifier davantage",
            ],
            answer: 1,
            explanation: "La douleur de la perte incite à vendre, souvent au plus mauvais moment.",
          },
          {
            id: "i4-2",
            question: "Investir une somme fixe chaque mois permet notamment :",
            options: [
              "De garantir un gain",
              "De lisser le prix d'achat et de limiter l'impact émotionnel",
              "D'éviter tout risque",
              "De battre le marché",
            ],
            answer: 1,
            explanation: "On achète plus de parts quand les prix sont bas, et on évite de chercher le « bon moment ».",
          },
          {
            id: "i4-3",
            question: "Un horizon de placement long permet en général :",
            options: [
              "De prendre plus de risque sur les actions",
              "De ne jamais subir de pertes",
              "D'éviter la diversification",
              "De supprimer les frais",
            ],
            answer: 0,
            explanation: "Le temps permet de traverser les baisses temporaires, sans pour autant supprimer le risque.",
          },
        ],
        concepts: ["diversification"],
      },
    ],
  },
  {
    slug: "ia-pour-tous",
    title: "L'IA pour tous",
    domain: "ia",
    level: "debutant",
    topics: ["ia", "innovation"],
    description:
      "Comprendre ce qu'est l'intelligence artificielle, l'utiliser efficacement et en connaître les limites, sans aucune connaissance technique.",
    outcomes: [
      "Expliquer simplement le fonctionnement d'un modèle de langage",
      "Rédiger des instructions efficaces pour un assistant IA",
      "Identifier les risques : erreurs, biais, confidentialité",
    ],
    lessons: [
      {
        slug: "comprendre-ia",
        title: "Comprendre l'IA en 7 minutes",
        minutes: 7,
        summary: "Apprentissage automatique, modèles de langage et IA générative expliqués simplement.",
        body: `## Des règles aux exemples

Les programmes classiques suivent des règles écrites par des humains. L'**apprentissage automatique** (machine learning) inverse la logique : on montre à un modèle de très nombreux exemples, et il apprend lui-même des régularités.

## Les modèles de langage

Les assistants comme Claude, ChatGPT, Gemini ou Le Chat reposent sur des **grands modèles de langage** (LLM). Entraînés sur d'immenses quantités de textes, ils ont appris à prédire la suite la plus plausible d'un texte. Cette capacité, poussée à grande échelle et affinée par des retours humains, leur permet de répondre à des questions, résumer, traduire, rédiger ou programmer.

## IA générative et multimodale

On parle d'**IA générative** quand le modèle crée du contenu : texte, image, son, vidéo, code. Les modèles **multimodaux** comprennent plusieurs types d'entrées à la fois, par exemple une photo et une question.

## Ce que l'IA n'est pas

Un modèle de langage ne « sait » pas les choses comme une base de données : il peut produire des réponses fausses mais convaincantes (« hallucinations »). Il n'a ni intentions ni conscience. C'est un outil puissant, à utiliser avec méthode et esprit critique.`,
        takeaways: [
          "L'apprentissage automatique apprend à partir d'exemples.",
          "Les LLM génèrent du texte en prédisant la suite la plus plausible.",
          "Ils peuvent se tromper avec assurance : vérifiez les informations importantes.",
        ],
        exercise:
          "Posez la même question factuelle à l'assistant de la plateforme en activant puis en désactivant la recherche de sources. Comparez la précision et les références fournies.",
        quiz: [
          {
            id: "ia1-1",
            question: "Un grand modèle de langage (LLM) fonctionne principalement en :",
            options: [
              "Consultant une encyclopédie interne vérifiée",
              "Prédisant la suite la plus plausible d'un texte",
              "Copiant des réponses humaines en direct",
              "Suivant des règles écrites à la main",
            ],
            answer: 1,
            explanation: "Il a appris des régularités statistiques du langage à partir de très nombreux textes.",
          },
          {
            id: "ia1-2",
            question: "Qu'est-ce qu'une « hallucination » d'IA ?",
            options: [
              "Une image générée",
              "Une réponse fausse présentée de manière convaincante",
              "Un bug d'affichage",
              "Une IA consciente",
            ],
            answer: 1,
            explanation: "Le modèle peut inventer des faits, des chiffres ou des références qui semblent crédibles.",
          },
          {
            id: "ia1-3",
            question: "Un modèle « multimodal » peut :",
            options: [
              "Fonctionner sans électricité",
              "Traiter plusieurs types de données (texte, images, son…)",
              "Parler plusieurs langues uniquement",
              "Se passer d'entraînement",
            ],
            answer: 1,
            explanation: "La multimodalité désigne la capacité à comprendre ou produire plusieurs types de contenus.",
          },
        ],
        concepts: [],
      },
      {
        slug: "bien-utiliser-assistant",
        title: "Bien utiliser un assistant IA",
        minutes: 7,
        summary: "Les techniques simples qui transforment la qualité des réponses.",
        body: `## Donner du contexte

Un assistant ne connaît ni votre situation ni votre objectif. Précisez **qui vous êtes**, **ce que vous cherchez à faire** et **pour qui** : « Je suis étudiant en première année d'économie, explique-moi la courbe de Phillips avec un exemple récent, en 200 mots. »

## Être précis sur le résultat attendu

Format (liste, tableau, plan), longueur, ton, niveau de détail. Fournissez un exemple de ce que vous attendez si possible.

## Travailler par étapes

Pour une tâche complexe, découpez : d'abord un plan, puis chaque partie. Demandez à l'assistant de **poser des questions** s'il lui manque des informations.

## Itérer

La première réponse est un brouillon. Demandez de reformuler, de simplifier, d'ajouter des contre-arguments, ou de vérifier un point précis.

## Exiger des sources

Pour les faits et les chiffres, demandez des références et **ouvrez-les**. Un assistant connecté à la recherche web cite ses sources, mais il peut mal les interpréter : la vérification reste votre responsabilité.`,
        takeaways: [
          "Précisez contexte, objectif, public et format.",
          "Découpez les tâches complexes et itérez.",
          "Demandez des sources et vérifiez-les.",
        ],
        exercise:
          "Rédigez une demande « pauvre » (une ligne) puis une demande « riche » (contexte, objectif, format) sur le même sujet. Soumettez les deux à l'assistant et comparez.",
        quiz: [
          {
            id: "ia2-1",
            question: "Quelle instruction donnera probablement la meilleure réponse ?",
            options: [
              "« Parle-moi d'inflation »",
              "« Explique l'inflation à un lycéen en 150 mots, avec un exemple sur le prix du pain »",
              "« Inflation ? »",
              "« Dis tout sur l'économie »",
            ],
            answer: 1,
            explanation: "Public, longueur et exemple attendu guident précisément le modèle.",
          },
          {
            id: "ia2-2",
            question: "Face à un chiffre cité par l'IA, la bonne pratique est :",
            options: ["Le croire", "Le vérifier dans une source fiable", "L'ignorer", "Le partager immédiatement"],
            answer: 1,
            explanation: "Les modèles peuvent se tromper : vérifiez toute information importante.",
          },
          {
            id: "ia2-3",
            question: "Pour une tâche complexe, il est conseillé de :",
            options: [
              "Tout demander en une seule phrase courte",
              "Découper le travail en étapes",
              "Éviter de donner du contexte",
              "Changer d'outil à chaque question",
            ],
            answer: 1,
            explanation: "Le travail par étapes améliore la qualité et facilite le contrôle.",
          },
        ],
        concepts: [],
      },
      {
        slug: "limites-risques",
        title: "Limites, risques et éthique",
        minutes: 7,
        summary: "Erreurs, biais, confidentialité, droits d'auteur : utiliser l'IA de manière responsable.",
        body: `## Les erreurs

Les modèles peuvent inventer des faits, mal calculer ou mal citer une source. Plus l'enjeu est important (santé, droit, finance), plus la vérification humaine est indispensable.

## Les biais

Les modèles apprennent de données produites par des humains, avec leurs stéréotypes. Ils peuvent les reproduire, par exemple dans un tri de CV ou une description de métier.

## La confidentialité

Ne partagez pas d'informations sensibles (données personnelles de tiers, secrets professionnels, mots de passe) avec un service dont vous ne connaissez pas la politique d'utilisation des données. Vérifiez les paramètres et les conditions, notamment en contexte professionnel.

## La propriété intellectuelle et l'intégrité

Le statut des contenus générés et des données d'entraînement fait l'objet de débats juridiques. Dans un cadre scolaire ou professionnel, respectez les règles en vigueur et soyez transparent sur l'usage de l'IA.

## La régulation

L'Union européenne a adopté l'**AI Act**, entré en vigueur le 1er août 2024 avec une application progressive. Il classe les systèmes selon leur niveau de risque et interdit certains usages, comme la notation sociale des personnes.`,
        takeaways: [
          "Vérifiez systématiquement les informations à fort enjeu.",
          "Les modèles peuvent reproduire des biais.",
          "Protégez les données sensibles et respectez les règles d'usage.",
        ],
        exercise:
          "Relisez la politique de confidentialité d'un assistant IA que vous utilisez. Les conversations servent-elles à entraîner les modèles ? Peut-on le désactiver ?",
        quiz: [
          {
            id: "ia3-1",
            question: "Quelle information ne faut-il PAS partager avec un assistant IA grand public sans précaution ?",
            options: [
              "Une question sur l'inflation",
              "Les données médicales d'un collègue",
              "Une demande de plan de dissertation",
              "Une recette de cuisine",
            ],
            answer: 1,
            explanation: "Les données personnelles de tiers sont sensibles et protégées.",
          },
          {
            id: "ia3-2",
            question: "L'AI Act européen repose sur :",
            options: [
              "L'interdiction de toute IA",
              "Une approche fondée sur les niveaux de risque",
              "La libre utilisation sans règle",
              "Un impôt sur l'IA",
            ],
            answer: 1,
            explanation: "Les obligations varient selon le niveau de risque du système, certains usages étant interdits.",
          },
          {
            id: "ia3-3",
            question: "D'où viennent les biais des modèles d'IA ?",
            options: [
              "De leur volonté propre",
              "Principalement des données sur lesquelles ils ont été entraînés",
              "De l'électricité utilisée",
              "Du clavier de l'utilisateur",
            ],
            answer: 1,
            explanation: "Les modèles reflètent les régularités, y compris les stéréotypes, présentes dans leurs données.",
          },
        ],
        concepts: [],
      },
      {
        slug: "ia-au-travail",
        title: "L'IA au travail et dans l'entreprise",
        minutes: 8,
        summary: "Cas d'usage concrets, automatisation et impact économique de l'IA.",
        body: `## Des usages concrets

- **Rédaction et synthèse** : courriels, comptes rendus, résumés de documents longs.
- **Analyse** : explorer un tableau de données, rédiger des formules, repérer des tendances.
- **Service client** : réponses aux questions fréquentes, tri des demandes.
- **Programmation** : génération et revue de code, assistants de développement.
- **Création** : visuels, présentations, vidéos, voix.

## Automatiser des processus

Les outils d'automatisation (Zapier, Make, n8n…) permettent de relier une IA à vos applications : classer automatiquement des factures, préparer une réponse à chaque nouveau formulaire, résumer les avis clients chaque semaine. Les **agents** vont plus loin en enchaînant eux-mêmes plusieurs actions pour atteindre un objectif.

## L'impact économique

Plusieurs études ont mesuré des gains de productivité significatifs sur des tâches précises (support client, rédaction, programmation), souvent plus marqués pour les profils moins expérimentés. L'effet macroéconomique global reste débattu : il dépendra de la vitesse de diffusion, de la réorganisation du travail et de la formation.

## Commencer petit

Identifiez une tâche répétitive, chronophage et à faible risque. Testez, mesurez le temps gagné et la qualité, puis élargissez.`,
        takeaways: [
          "L'IA est utile pour rédiger, synthétiser, analyser et programmer.",
          "L'automatisation relie l'IA à vos outils existants.",
          "Commencez par une tâche répétitive à faible risque et mesurez.",
        ],
        exercise:
          "Listez trois tâches répétitives de votre semaine. Pour chacune, notez le temps passé et un outil de l'espace IA qui pourrait aider. Testez-en un pendant une semaine.",
        quiz: [
          {
            id: "ia4-1",
            question: "Un « agent » IA se distingue d'un simple assistant parce qu'il :",
            options: [
              "Est plus rapide à répondre",
              "Peut enchaîner plusieurs actions pour atteindre un objectif",
              "Ne commet jamais d'erreur",
              "Fonctionne sans données",
            ],
            answer: 1,
            explanation: "Un agent planifie et exécute des étapes, en utilisant des outils (recherche, applications…).",
          },
          {
            id: "ia4-2",
            question: "Par quelle tâche est-il conseillé de commencer à utiliser l'IA au travail ?",
            options: [
              "Une décision stratégique à fort enjeu",
              "Une tâche répétitive à faible risque",
              "La paie de l'entreprise",
              "Un contrat juridique sans relecture",
            ],
            answer: 1,
            explanation: "On teste et mesure d'abord là où les erreurs sont peu coûteuses et faciles à détecter.",
          },
          {
            id: "ia4-3",
            question: "Selon plusieurs études, les gains de productivité de l'IA sont souvent :",
            options: [
              "Nuls pour tout le monde",
              "Plus marqués pour les profils moins expérimentés sur certaines tâches",
              "Réservés aux dirigeants",
              "Identiques dans tous les métiers",
            ],
            answer: 1,
            explanation: "Sur des tâches comme le support client, l'IA a davantage aidé les nouveaux employés.",
          },
        ],
        concepts: ["modele-economique"],
      },
    ],
  },
  {
    slug: "entreprendre-analyser",
    title: "Entreprendre et analyser une entreprise",
    domain: "finance",
    level: "intermediaire",
    topics: ["startups", "entreprises"],
    description:
      "Du modèle économique aux états financiers : les outils pour lancer un projet, piloter sa trésorerie et le financer.",
    outcomes: [
      "Décrire un modèle économique et calculer un seuil de rentabilité",
      "Lire un compte de résultat et un bilan",
      "Choisir un mode de financement adapté à son projet",
    ],
    lessons: [
      {
        slug: "modele-economique",
        title: "Construire son modèle économique",
        minutes: 8,
        summary: "Proposition de valeur, revenus, coûts et seuil de rentabilité.",
        body: `## La proposition de valeur

Quel problème résolvez-vous, pour qui, et pourquoi votre solution est-elle meilleure que les alternatives ? Une bonne proposition de valeur se teste auprès de clients réels avant de construire le produit complet.

## Les sources de revenus

Vente, abonnement, commission, freemium, publicité, licence… Le choix influence la trésorerie : un abonnement donne de la visibilité, une vente ponctuelle oblige à reconquérir sans cesse.

## Coûts fixes et variables

- **Coûts fixes** : ils ne dépendent pas du volume (loyer, salaires, logiciels).
- **Coûts variables** : ils augmentent avec chaque vente (matières, commissions, livraison).

## Le seuil de rentabilité

Seuil (en unités) = coûts fixes ÷ marge par unité. Si vos coûts fixes sont de 8 000 € par mois et que chaque vente rapporte 40 € de marge, il faut 200 ventes mensuelles pour être à l'équilibre.

## Valider avant d'investir

Construisez un **produit minimum viable**, mesurez l'intérêt réel (prévente, liste d'attente, taux de conversion) et ajustez. Les chiffres réels valent mieux que les meilleures hypothèses.`,
        takeaways: [
          "La proposition de valeur se valide auprès de clients réels.",
          "Distinguez coûts fixes et variables.",
          "Seuil de rentabilité = coûts fixes ÷ marge unitaire.",
        ],
        exercise:
          "Utilisez le simulateur de seuil de rentabilité pour un projet qui vous intéresse. Que se passe-t-il si vous augmentez le prix de 10 % ? Si les coûts fixes doublent ?",
        quiz: [
          {
            id: "e1-1",
            question: "Le loyer d'un local commercial est un coût :",
            options: ["Variable", "Fixe", "Exceptionnel", "Financier"],
            answer: 1,
            explanation: "Il ne dépend pas du volume des ventes.",
          },
          {
            id: "e1-2",
            question: "Coûts fixes de 12 000 €, marge unitaire de 30 €. Seuil de rentabilité :",
            options: ["40 unités", "400 unités", "4 000 unités", "360 000 unités"],
            answer: 1,
            explanation: "12 000 ÷ 30 = 400 unités.",
          },
          {
            id: "e1-3",
            question: "Un produit minimum viable sert à :",
            options: [
              "Lancer la version définitive",
              "Tester l'intérêt des clients avec un minimum d'investissement",
              "Réduire les impôts",
              "Recruter des salariés",
            ],
            answer: 1,
            explanation: "Il permet d'apprendre vite et à moindre coût avant d'investir davantage.",
          },
        ],
        concepts: ["modele-economique"],
      },
      {
        slug: "lire-etats-financiers",
        title: "Lire un compte de résultat et un bilan",
        minutes: 9,
        summary: "Les documents comptables essentiels et les ratios à connaître.",
        body: `## Le compte de résultat : le film de l'année

Il part du **chiffre d'affaires**, retire les achats et charges externes, les salaires, les amortissements, puis les charges financières et l'impôt, pour aboutir au **résultat net**.

Indicateurs clés : marge brute, excédent brut d'exploitation (EBE, proche de l'EBITDA), résultat d'exploitation.

## Le bilan : la photo à une date

- **Actif** : ce que l'entreprise possède (immobilisations, stocks, créances clients, trésorerie).
- **Passif** : comment c'est financé (capitaux propres, dettes financières, dettes fournisseurs).

L'actif est toujours égal au passif.

## Quelques ratios

- **Marge nette** = résultat net ÷ chiffre d'affaires.
- **Rentabilité des capitaux propres (ROE)** = résultat net ÷ capitaux propres.
- **Endettement** = dettes financières nettes ÷ capitaux propres, ou ÷ EBE.

## Comparer et contextualiser

Un ratio se lit dans la durée et face aux concurrents du même secteur : une marge de 3 % est faible pour un éditeur de logiciels, mais normale pour un distributeur alimentaire.`,
        takeaways: [
          "Le compte de résultat raconte l'année, le bilan photographie une date.",
          "Actif = passif, toujours.",
          "Les ratios se comparent dans le temps et au sein d'un secteur.",
        ],
        exercise:
          "Téléchargez le rapport annuel d'une entreprise cotée que vous connaissez. Calculez sa marge nette et son ROE sur les deux dernières années, puis demandez à l'assistant de vous aider à interpréter l'évolution.",
        quiz: [
          {
            id: "e2-1",
            question: "Au bilan, la trésorerie figure :",
            options: ["Au passif", "À l'actif", "Dans le compte de résultat uniquement", "Nulle part"],
            answer: 1,
            explanation: "La trésorerie est un élément possédé par l'entreprise : elle est à l'actif.",
          },
          {
            id: "e2-2",
            question: "Résultat net de 50 000 €, chiffre d'affaires de 1 000 000 €. La marge nette est de :",
            options: ["0,5 %", "5 %", "20 %", "50 %"],
            answer: 1,
            explanation: "50 000 ÷ 1 000 000 = 5 %.",
          },
          {
            id: "e2-3",
            question: "Pourquoi comparer les ratios au sein d'un même secteur ?",
            options: [
              "Parce que c'est obligatoire",
              "Parce que les niveaux normaux de marge varient fortement d'un secteur à l'autre",
              "Parce que les ratios sont identiques partout",
              "Pour payer moins d'impôts",
            ],
            answer: 1,
            explanation: "Distribution, logiciel, industrie : les structures de coûts sont très différentes.",
          },
        ],
        concepts: ["analyse-financiere"],
      },
      {
        slug: "tresorerie-bfr",
        title: "Trésorerie et besoin en fonds de roulement",
        minutes: 7,
        summary: "Pourquoi tant d'entreprises rentables manquent de cash, et comment l'éviter.",
        body: `## Le décalage des flux

Une entreprise achète, produit, stocke, vend… et n'est payée que plus tard. Ce décalage entre décaissements et encaissements crée un **besoin en fonds de roulement (BFR)**.

BFR ≈ stocks + créances clients − dettes fournisseurs.

## La croissance consomme du cash

Plus l'activité croît, plus le BFR augmente : il faut financer davantage de stocks et de créances. Une croissance rapide peut ainsi mettre en difficulté une entreprise pourtant rentable.

## Les leviers

- **Réduire les délais clients** : facturer vite, relancer, proposer des acomptes.
- **Négocier les délais fournisseurs** dans le respect des règles légales.
- **Optimiser les stocks** : produire à la demande, réduire les références.
- **Financements court terme** : affacturage, découvert autorisé, crédit de trésorerie.

## Le plan de trésorerie

Un tableau mois par mois des encaissements et décaissements prévus est l'outil de pilotage numéro un d'une jeune entreprise. Il permet d'anticiper les tensions plutôt que de les subir.`,
        takeaways: [
          "Le BFR naît du décalage entre paiements et encaissements.",
          "La croissance augmente le besoin de trésorerie.",
          "Le plan de trésorerie mensuel est l'outil de pilotage essentiel.",
        ],
        exercise:
          "Construisez un plan de trésorerie sur 6 mois pour un projet simple (tableur) : encaissements, décaissements, solde cumulé. Repérez le mois le plus tendu.",
        quiz: [
          {
            id: "e3-1",
            question: "Le BFR augmente lorsque :",
            options: [
              "Les clients paient plus vite",
              "Les stocks et les créances clients augmentent",
              "Les fournisseurs accordent plus de délais",
              "L'entreprise vend moins",
            ],
            answer: 1,
            explanation: "Plus de stocks et de créances immobilisent davantage de trésorerie.",
          },
          {
            id: "e3-2",
            question: "Pourquoi une croissance rapide peut-elle poser problème ?",
            options: [
              "Elle réduit toujours la rentabilité",
              "Elle accroît le besoin de financement du BFR",
              "Elle est interdite",
              "Elle diminue les ventes",
            ],
            answer: 1,
            explanation: "Il faut avancer plus de stocks et attendre plus de paiements clients.",
          },
          {
            id: "e3-3",
            question: "L'affacturage consiste à :",
            options: [
              "Céder ses factures clients à un organisme qui avance les fonds",
              "Émettre des actions",
              "Augmenter ses prix",
              "Réduire les salaires",
            ],
            answer: 0,
            explanation: "Le factor avance le montant des factures, moyennant une commission.",
          },
        ],
        concepts: ["analyse-financiere"],
      },
      {
        slug: "financer-projet",
        title: "Financer son projet",
        minutes: 8,
        summary: "Autofinancement, prêt bancaire, investisseurs, subventions : choisir la bonne source.",
        body: `## L'autofinancement (bootstrapping)

Démarrer avec ses propres ressources et les premières ventes. Avantage : on garde le contrôle. Limite : la croissance est plus lente.

## Le prêt bancaire et le microcrédit

Adapté aux projets aux flux prévisibles (commerce, artisanat, services). La banque examine la capacité de remboursement et demande souvent un apport et des garanties. Le **microcrédit** et les prêts d'honneur aident les porteurs de projets qui n'ont pas accès au crédit classique.

## Les investisseurs en capital

- **Business angels** : particuliers qui investissent tôt et apportent leur réseau.
- **Capital-risque (venture capital)** : fonds qui financent des startups à fort potentiel de croissance, en échange d'une part du capital. Ils visent des rendements très élevés sur quelques succès, ce qui ne convient qu'à certains projets.

## Les autres sources

Subventions et concours, financement participatif (crowdfunding), aides publiques à l'innovation, programmes d'incubation.

## Le bon choix

Il dépend du besoin (montant, durée), du potentiel de croissance et de votre volonté de partager le contrôle. Une dette doit être remboursée ; une entrée au capital se paie en dilution.`,
        takeaways: [
          "L'autofinancement préserve le contrôle mais limite la vitesse.",
          "La dette convient aux flux prévisibles.",
          "Le capital-risque vise des projets à très forte croissance, en échange de capital.",
        ],
        exercise:
          "Pour un projet d'entreprise réel ou imaginaire, comparez deux modes de financement possibles : montant obtenu, coût, contrôle conservé, risques. Concluez en cinq lignes.",
        quiz: [
          {
            id: "e4-1",
            question: "En échange de leur financement, les fonds de capital-risque obtiennent :",
            options: ["Des intérêts fixes", "Une part du capital", "Rien", "Une subvention publique"],
            answer: 1,
            explanation: "Ils deviennent actionnaires et visent une plus-value lors d'une revente future.",
          },
          {
            id: "e4-2",
            question: "La dilution désigne :",
            options: [
              "La baisse du chiffre d'affaires",
              "La réduction de la part de capital des fondateurs après l'entrée d'investisseurs",
              "Un impôt",
              "Un retard de paiement",
            ],
            answer: 1,
            explanation: "De nouvelles actions sont émises : la part de chaque associé existant diminue.",
          },
          {
            id: "e4-3",
            question: "Un commerce de proximité aux flux prévisibles se finance le plus souvent par :",
            options: ["Capital-risque", "Prêt bancaire et apport personnel", "Introduction en bourse", "Cryptoactifs"],
            answer: 1,
            explanation: "La dette bancaire est adaptée aux activités dont les revenus sont prévisibles.",
          },
        ],
        concepts: ["modele-economique", "analyse-financiere"],
      },
    ],
  },
];

export const pathBySlug = new Map(learningPaths.map((p) => [p.slug, p]));

export function lessonKey(pathSlug: string, lessonSlug: string): string {
  return `${pathSlug}/${lessonSlug}`;
}

export function getLesson(pathSlug: string, lessonSlug: string) {
  const path = pathBySlug.get(pathSlug);
  if (!path) return undefined;
  const index = path.lessons.findIndex((l) => l.slug === lessonSlug);
  if (index === -1) return undefined;
  return { path, lesson: path.lessons[index], index };
}

export const totalLessons = learningPaths.reduce((n, p) => n + p.lessons.length, 0);
