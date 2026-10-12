import type { CaseStudy } from "./types";

export const caseStudies: CaseStudy[] = [
  {
    slug: "choc-inflation-2021-2023",
    title: "Le retour de l'inflation (2021-2023)",
    period: "2021 – 2023",
    place: "Zone euro, États-Unis",
    domain: "economie",
    summary:
      "Après des années d'inflation faible, les prix ont fortement accéléré à la sortie de la pandémie puis avec la crise énergétique. Les banques centrales ont réagi par le resserrement monétaire le plus rapide depuis des décennies.",
    sections: [
      {
        heading: "Ce qui s'est passé",
        body: "La réouverture des économies en 2021 a provoqué un rebond rapide de la demande, alors que les chaînes d'approvisionnement étaient encore perturbées (pénurie de semi-conducteurs, conteneurs bloqués). L'invasion de l'Ukraine par la Russie en février 2022 a ensuite fait flamber les prix de l'énergie et des céréales. L'inflation a atteint 9,1 % sur un an aux États-Unis en juin 2022 et 10,6 % en zone euro en octobre 2022.",
      },
      {
        heading: "La réponse des banques centrales",
        body: "La Réserve fédérale a commencé à relever ses taux en mars 2022, jusqu'à une fourchette de 5,25 %-5,50 % en juillet 2023. La BCE a procédé à sa première hausse depuis 11 ans en juillet 2022 et porté son taux de dépôt à 4 % en septembre 2023. Les deux institutions ont aussi réduit la taille de leur bilan.",
      },
      {
        heading: "Les effets",
        body: "La hausse des taux a renchéri le crédit immobilier et ralenti l'investissement, sans provoquer la récession massive que beaucoup craignaient, notamment aux États-Unis. L'inflation a nettement reflué en 2023-2024, mais les prix sont restés durablement plus élevés qu'avant la crise : une désinflation ne signifie pas une baisse des prix.",
      },
    ],
    lessons: [
      "Les chocs d'offre (énergie, approvisionnement) peuvent déclencher une inflation forte même sans excès de crédit.",
      "Les banques centrales agissent avec retard sur une inflation déjà installée, d'où l'importance de la crédibilité.",
      "Désinflation (ralentissement de la hausse des prix) et déflation (baisse des prix) sont deux choses différentes.",
    ],
    concepts: ["inflation", "banque-centrale", "taux-interet"],
    chart: {
      title: "Inflation annuelle moyenne",
      unit: "%",
      source: "Eurostat (IPCH zone euro), BLS (IPC États-Unis)",
      series: [
        {
          label: "Zone euro",
          points: [
            { x: "2019", y: 1.2 },
            { x: "2020", y: 0.3 },
            { x: "2021", y: 2.6 },
            { x: "2022", y: 8.4 },
            { x: "2023", y: 5.4 },
            { x: "2024", y: 2.4 },
          ],
        },
        {
          label: "États-Unis",
          points: [
            { x: "2019", y: 1.8 },
            { x: "2020", y: 1.2 },
            { x: "2021", y: 4.7 },
            { x: "2022", y: 8.0 },
            { x: "2023", y: 4.1 },
            { x: "2024", y: 2.9 },
          ],
        },
      ],
    },
    sources: [
      { label: "Eurostat — Inflation (IPCH)", url: "https://ec.europa.eu/eurostat/web/hicp" },
      { label: "BLS — Consumer Price Index", url: "https://www.bls.gov/cpi/" },
      { label: "BCE — Décisions de politique monétaire", url: "https://www.ecb.europa.eu/press/govcdec/mopo/html/index.en.html" },
    ],
  },
  {
    slug: "crise-financiere-2008",
    title: "La crise financière de 2008",
    period: "2007 – 2009",
    place: "États-Unis, puis monde entier",
    domain: "finance",
    summary:
      "L'éclatement de la bulle immobilière américaine et des crédits « subprimes » a provoqué une crise bancaire mondiale et la plus grave récession depuis les années 1930.",
    sections: [
      {
        heading: "Les origines",
        body: "Au début des années 2000, des crédits immobiliers ont été massivement accordés à des ménages fragiles (subprimes), souvent à taux variables. Ces prêts étaient regroupés et revendus sous forme de produits financiers complexes (titrisation), dispersant le risque dans tout le système financier, avec un fort effet de levier.",
      },
      {
        heading: "L'emballement",
        body: "Quand les prix immobiliers ont commencé à baisser et les défauts à augmenter, la valeur de ces produits est devenue incertaine. Les banques ont cessé de se prêter entre elles. Le 15 septembre 2008, la banque d'investissement Lehman Brothers a fait faillite, déclenchant une panique mondiale.",
      },
      {
        heading: "La réponse",
        body: "Les États ont recapitalisé et garanti les banques (programme TARP de 700 milliards de dollars aux États-Unis). Les banques centrales ont abaissé leurs taux près de zéro — la Fed dès décembre 2008 — et lancé des achats massifs d'actifs. Les plans de relance budgétaire ont limité la chute, mais le chômage américain a dépassé 9 % en moyenne en 2009 et 2010.",
      },
      {
        heading: "L'héritage",
        body: "La crise a conduit à un renforcement de la régulation bancaire (accords de Bâle III, tests de résistance, loi Dodd-Frank) et a durablement changé la politique monétaire, avec des taux très bas et des bilans de banques centrales beaucoup plus larges pendant plus d'une décennie.",
      },
    ],
    lessons: [
      "L'endettement excessif et l'effet de levier transforment une baisse de prix en crise systémique.",
      "La complexité financière peut masquer les risques réels.",
      "Les crises financières entraînent des récessions longues et un chômage persistant.",
    ],
    concepts: ["cycle-economique", "banque-centrale", "marches-financiers"],
    chart: {
      title: "Taux de chômage aux États-Unis (moyenne annuelle)",
      unit: "%",
      source: "U.S. Bureau of Labor Statistics",
      series: [
        {
          label: "Chômage",
          points: [
            { x: "2006", y: 4.6 },
            { x: "2007", y: 4.6 },
            { x: "2008", y: 5.8 },
            { x: "2009", y: 9.3 },
            { x: "2010", y: 9.6 },
            { x: "2011", y: 8.9 },
            { x: "2012", y: 8.1 },
            { x: "2013", y: 7.4 },
          ],
        },
      ],
    },
    sources: [
      { label: "Federal Reserve History — The Great Recession", url: "https://www.federalreservehistory.org/essays/great-recession-of-200709" },
      { label: "BLS — Labor Force Statistics", url: "https://www.bls.gov/cps/" },
    ],
  },
  {
    slug: "bulle-internet",
    title: "La bulle Internet",
    period: "1995 – 2002",
    place: "États-Unis et marchés mondiaux",
    domain: "finance",
    summary:
      "L'enthousiasme pour les entreprises du web a porté les valorisations technologiques à des niveaux extrêmes, avant un effondrement de près de 80 % de l'indice Nasdaq.",
    sections: [
      {
        heading: "L'euphorie",
        body: "À la fin des années 1990, Internet promet de transformer l'économie. Les investisseurs se ruent sur les entreprises en « .com », souvent sans bénéfices ni modèle économique éprouvé. L'indice Nasdaq Composite atteint un sommet à 5 048 points le 10 mars 2000.",
      },
      {
        heading: "Le krach",
        body: "Les hausses de taux, les premiers résultats décevants et l'épuisement des financements ont retourné le marché. En octobre 2002, le Nasdaq avait perdu environ 78 % depuis son sommet. De nombreuses entreprises ont disparu.",
      },
      {
        heading: "Ce qui est resté",
        body: "La technologie, elle, était bien réelle : quelques entreprises survivantes sont devenues des géants mondiaux. La bulle illustre qu'une innovation peut être transformatrice tout en étant surévaluée par les marchés à un moment donné — une question souvent posée aujourd'hui à propos de l'intelligence artificielle.",
      },
    ],
    lessons: [
      "Une révolution technologique réelle n'empêche pas une bulle financière.",
      "Les valorisations finissent par se confronter aux bénéfices.",
      "La diversification protège contre l'effondrement d'un secteur.",
    ],
    concepts: ["marches-financiers", "diversification", "analyse-financiere"],
    chart: {
      title: "Nasdaq Composite (clôture de fin d'année)",
      unit: "points",
      source: "Nasdaq",
      series: [
        {
          label: "Nasdaq Composite",
          points: [
            { x: "1995", y: 1052 },
            { x: "1996", y: 1291 },
            { x: "1997", y: 1570 },
            { x: "1998", y: 2193 },
            { x: "1999", y: 4069 },
            { x: "2000", y: 2471 },
            { x: "2001", y: 1950 },
            { x: "2002", y: 1336 },
            { x: "2003", y: 2003 },
          ],
        },
      ],
    },
    sources: [
      { label: "Nasdaq — Historical data", url: "https://www.nasdaq.com/market-activity/index/comp/historical" },
    ],
  },
  {
    slug: "mpesa-kenya",
    title: "M-Pesa et l'inclusion financière au Kenya",
    period: "2007 – aujourd'hui",
    place: "Kenya, Afrique de l'Est",
    domain: "economie",
    summary:
      "Lancé en 2007, le service de paiement mobile M-Pesa a permis à des millions de Kényans sans compte bancaire d'envoyer, recevoir et épargner de l'argent avec un simple téléphone.",
    sections: [
      {
        heading: "Le principe",
        body: "Lancé par l'opérateur Safaricom en 2007, M-Pesa permet de déposer de l'argent liquide chez un agent (souvent une petite boutique), de l'envoyer par SMS à un autre utilisateur, qui peut le retirer chez un autre agent. Nul besoin d'agence bancaire ni de smartphone.",
      },
      {
        heading: "L'impact",
        body: "En quelques années, la part de la population ayant accès à un service financier formel a fortement progressé. Une étude publiée dans la revue Science en 2016 (Suri et Jack) a estimé que l'accès à M-Pesa avait permis à environ 2 % des ménages kényans de sortir de l'extrême pauvreté, en facilitant l'épargne et la réception de transferts familiaux.",
      },
      {
        heading: "Un modèle qui s'étend",
        body: "La monnaie mobile s'est diffusée dans de nombreux pays africains (Orange Money, MTN Mobile Money, Wave…). Elle soulève des enjeux de régulation : protection des consommateurs, concurrence entre opérateurs, interopérabilité et coût des transferts.",
      },
    ],
    lessons: [
      "L'innovation financière peut contourner l'absence d'infrastructures bancaires.",
      "Un modèle économique à faible coût unitaire peut atteindre des populations exclues.",
      "La confiance dans le réseau d'agents est aussi importante que la technologie.",
    ],
    concepts: ["monnaie", "modele-economique"],
    chart: {
      title: "Accès à des services financiers formels au Kenya (adultes)",
      unit: "%",
      source: "Enquêtes FinAccess (Banque centrale du Kenya, KNBS, FSD Kenya) — valeurs arrondies",
      series: [
        {
          label: "Inclusion financière formelle",
          points: [
            { x: "2006", y: 27 },
            { x: "2009", y: 41 },
            { x: "2016", y: 75 },
            { x: "2019", y: 83 },
            { x: "2021", y: 84 },
          ],
        },
      ],
    },
    sources: [
      { label: "Suri & Jack (2016), Science — The long-run poverty and gender impacts of mobile money", url: "https://www.science.org/doi/10.1126/science.aah5309" },
      { label: "FSD Kenya — FinAccess", url: "https://www.fsdkenya.org/" },
    ],
  },
  {
    slug: "hyperinflation-zimbabwe",
    title: "L'hyperinflation au Zimbabwe",
    period: "2007 – 2009",
    place: "Zimbabwe",
    domain: "economie",
    summary:
      "Le financement des dépenses publiques par la création monétaire, combiné à l'effondrement de la production, a conduit à l'une des pires hyperinflations de l'histoire.",
    sections: [
      {
        heading: "Les causes",
        body: "Au début des années 2000, la production agricole s'effondre après une réforme agraire désorganisée, tandis que l'État finance ses déficits en faisant tourner la planche à billets. Moins de biens, beaucoup plus de monnaie : les prix s'emballent.",
      },
      {
        heading: "L'emballement",
        body: "En juillet 2008, l'inflation officielle atteint 231 millions de pour cent sur un an. Les prix changent plusieurs fois par jour, et la banque centrale émet en janvier 2009 un billet de 100 000 milliards de dollars zimbabwéens.",
      },
      {
        heading: "La sortie",
        body: "En 2009, le pays autorise l'usage de devises étrangères (dollar américain, rand sud-africain). Les prix se stabilisent rapidement, mais l'économie a perdu sa monnaie nationale et l'épargne des ménages a été anéantie.",
      },
    ],
    lessons: [
      "Financer l'État par la création monétaire sans contrepartie productive détruit la monnaie.",
      "L'hyperinflation ruine les épargnants et désorganise toute l'économie.",
      "Rétablir la confiance passe souvent par un changement de régime monétaire.",
    ],
    concepts: ["inflation", "monnaie", "banque-centrale"],
    sources: [
      { label: "FMI — Zimbabwe", url: "https://www.imf.org/en/Countries/ZWE" },
    ],
  },
];

export const caseStudyBySlug = new Map(caseStudies.map((c) => [c.slug, c]));
