"use client";

import { useMemo, useState } from "react";
import { BarChartView, LineChartView, SERIES_COLORS, StackedAreaView } from "@/components/charts/charts";
import type { SimulatorId } from "@/content/types";
import { formatCompact, formatCurrency, formatNumber, formatPercent } from "@/lib/format";
import { bondDuration, bondPrice, breakEven, budgetSplit, compoundGrowth, doublingTime, loanSchedule, purchasingPower } from "@/lib/simulators";
import { NumberField, ResultTile, SimulatorLayout } from "./field";

const euro = (v: number) => formatCurrency(v);
const euroTick = (v: number) => `${formatCompact(v)} €`;

export function CompoundSimulator() {
  const [initial, setInitial] = useState(1000);
  const [monthly, setMonthly] = useState(100);
  const [rate, setRate] = useState(5);
  const [fees, setFees] = useState(0.5);
  const [years, setYears] = useState(25);
  const points = useMemo(() => compoundGrowth({ initial, monthly, annualRate: rate, years, annualFees: fees }), [initial, monthly, rate, years, fees]);
  const withoutFees = useMemo(() => compoundGrowth({ initial, monthly, annualRate: rate, years }), [initial, monthly, rate, years]);
  const last = points[points.length - 1];
  const feeCost = withoutFees[withoutFees.length - 1].value - last.value;
  const doubling = doublingTime(rate - fees);
  const data = points.map((p) => ({ annee: `${p.year} an${p.year > 1 ? "s" : ""}`, versements: Math.round(p.contributions), interets: Math.max(0, Math.round(p.interest)) }));

  return (
    <SimulatorLayout
      controls={
        <>
          <NumberField label="Capital de départ" value={initial} onChange={setInitial} min={0} max={100000} step={100} unit="€" />
          <NumberField label="Versement mensuel" value={monthly} onChange={setMonthly} min={0} max={3000} step={10} unit="€" />
          <NumberField label="Rendement annuel" value={rate} onChange={setRate} min={0} max={12} step={0.1} unit="%" hint="Hypothèse constante : les rendements réels varient d'une année à l'autre." />
          <NumberField label="Frais annuels" value={fees} onChange={setFees} min={0} max={3} step={0.1} unit="%" />
          <NumberField label="Durée" value={years} onChange={setYears} min={1} max={50} unit="ans" />
        </>
      }
      results={
        <>
          <ResultTile label="Capital final" value={euro(last.value)} emphasis />
          <ResultTile label="Total versé" value={euro(last.contributions)} />
          <ResultTile label="Intérêts gagnés" value={euro(Math.max(0, last.interest))} sub={`dont ${euro(feeCost)} perdus en frais`} />
        </>
      }
      insight={
        Number.isFinite(doubling.exact)
          ? `À ${formatPercent(rate - fees)} net par an, un capital double en ${formatNumber(doubling.exact, 1)} ans (règle de 72 : ${formatNumber(doubling.ruleOf72, 1)} ans). Les intérêts représentent ${formatPercent((Math.max(0, last.interest) / last.value) * 100, 0)} du capital final.`
          : "Sans rendement, votre capital n'augmente que de vos versements."
      }
      chart={
        <StackedAreaView
          data={data}
          xKey="annee"
          xLabel="Durée"
          series={[
            { key: "versements", label: "Sommes versées", color: SERIES_COLORS[0] },
            { key: "interets", label: "Intérêts cumulés", color: SERIES_COLORS[2] },
          ]}
          format={euro}
          tickFormat={euroTick}
          title="Évolution du capital"
          source="Calcul : capitalisation mensuelle, versements en fin de mois, rendement net de frais."
        />
      }
    />
  );
}

export function PurchasingPowerSimulator() {
  const [amount, setAmount] = useState(1000);
  const [inflation, setInflation] = useState(3);
  const [years, setYears] = useState(10);
  const points = useMemo(() => purchasingPower(amount, inflation, years), [amount, inflation, years]);
  const last = points[points.length - 1];
  const loss = amount - last.realValue;
  const data = points.map((p) => ({ annee: String(p.year), reel: Math.round(p.realValue), necessaire: Math.round(p.equivalentNominal) }));

  return (
    <SimulatorLayout
      controls={
        <>
          <NumberField label="Somme" value={amount} onChange={setAmount} min={10} max={100000} step={10} unit="€" />
          <NumberField label="Inflation annuelle" value={inflation} onChange={setInflation} min={0} max={20} step={0.1} unit="%" />
          <NumberField label="Durée" value={years} onChange={setYears} min={1} max={40} unit="ans" />
        </>
      }
      results={
        <>
          <ResultTile label={`Valeur réelle dans ${years} ans`} value={euro(last.realValue)} emphasis />
          <ResultTile label="Perte de pouvoir d'achat" value={formatPercent((loss / amount) * 100, 0)} sub={euro(loss)} />
          <ResultTile label="Somme nécessaire" value={euro(last.equivalentNominal)} sub="pour acheter la même chose qu'aujourd'hui" />
        </>
      }
      insight={`Avec ${formatPercent(inflation)} d'inflation par an, ${euro(amount)} gardés sans rémunération n'achèteront plus que l'équivalent de ${euro(last.realValue)} d'aujourd'hui dans ${years} ans.`}
      chart={
        <LineChartView
          data={data}
          xKey="annee"
          xLabel="Année"
          series={[
            { key: "reel", label: "Valeur réelle de la somme", color: SERIES_COLORS[0] },
            { key: "necessaire", label: "Somme nécessaire pour le même panier", color: SERIES_COLORS[1] },
          ]}
          format={euro}
          tickFormat={euroTick}
          title="L'érosion monétaire"
          source="Calcul : inflation constante, en euros d'aujourd'hui."
        />
      }
    />
  );
}

export function LoanSimulator() {
  const [principal, setPrincipal] = useState(200000);
  const [rate, setRate] = useState(3.5);
  const [years, setYears] = useState(20);
  const result = useMemo(() => loanSchedule(principal, rate, years), [principal, rate, years]);
  const data = result.yearly.map((y) => ({ annee: String(y.year), capital: Math.round(y.principalPaid), interets: Math.round(y.interestPaid) }));

  return (
    <SimulatorLayout
      controls={
        <>
          <NumberField label="Montant emprunté" value={principal} onChange={setPrincipal} min={1000} max={1000000} step={1000} unit="€" />
          <NumberField label="Taux annuel (hors assurance)" value={rate} onChange={setRate} min={0} max={12} step={0.05} unit="%" />
          <NumberField label="Durée" value={years} onChange={setYears} min={1} max={30} unit="ans" />
        </>
      }
      results={
        <>
          <ResultTile label="Mensualité" value={formatCurrency(result.monthlyPayment, "EUR", 2)} emphasis />
          <ResultTile label="Coût total des intérêts" value={euro(result.totalInterest)} />
          <ResultTile label="Total remboursé" value={euro(result.totalCost)} />
        </>
      }
      insight={`Les intérêts représentent ${formatPercent((result.totalInterest / principal) * 100, 0)} du montant emprunté. En début de prêt, la mensualité rembourse surtout des intérêts ; la part de capital augmente ensuite.`}
      chart={
        <BarChartView
          data={data}
          xKey="annee"
          xLabel="Année"
          series={[
            { key: "capital", label: "Capital remboursé", color: SERIES_COLORS[0] },
            { key: "interets", label: "Intérêts payés", color: SERIES_COLORS[1] },
          ]}
          stacked
          format={euro}
          tickFormat={euroTick}
          title="Répartition des remboursements par année"
          source="Prêt amortissable à taux fixe et mensualités constantes, hors assurance et frais."
        />
      }
    />
  );
}

export function BudgetSimulator() {
  const [income, setIncome] = useState(2000);
  const [needs, setNeeds] = useState(50);
  const [wants, setWants] = useState(30);
  const savingsPct = Math.max(0, 100 - needs - wants);
  const split = budgetSplit(income, { needs, wants, savings: savingsPct });
  const segments = [
    { key: "needs", label: "Besoins essentiels", value: split.needs, pct: needs, color: SERIES_COLORS[0] },
    { key: "wants", label: "Envies", value: split.wants, pct: wants, color: SERIES_COLORS[1] },
    { key: "savings", label: "Épargne & dettes", value: split.savings, pct: savingsPct, color: SERIES_COLORS[2] },
  ];
  const months = split.needs + split.wants > 0 ? (3 * (split.needs + split.wants)) / Math.max(split.savings, 1) : 0;
  const data = Array.from({ length: 12 }, (_, i) => ({ mois: `M${i + 1}`, epargne: Math.round(split.savings * (i + 1)) }));

  return (
    <SimulatorLayout
      controls={
        <>
          <NumberField label="Revenus nets mensuels" value={income} onChange={setIncome} min={100} max={20000} step={50} unit="€" />
          <NumberField label="Part des besoins" value={needs} onChange={(v) => setNeeds(Math.min(v, 100 - wants))} min={0} max={100} unit="%" />
          <NumberField label="Part des envies" value={wants} onChange={(v) => setWants(Math.min(v, 100 - needs))} min={0} max={100} unit="%" hint={`Épargne : ${savingsPct} % (le reste)`} />
        </>
      }
      results={
        <>
          {segments.map((s) => (
            <ResultTile key={s.key} label={`${s.label} · ${s.pct} %`} value={euro(s.value)} emphasis={s.key === "savings"} />
          ))}
        </>
      }
      insight={
        split.savings > 0
          ? `En épargnant ${euro(split.savings)} par mois, vous constituez une épargne de précaution de 3 mois de dépenses en ${formatNumber(Math.ceil(months))} mois.`
          : "Sans épargne mensuelle, aucun matelas de sécurité ne se constitue : essayez de dégager ne serait-ce que 5 % de vos revenus."
      }
      chart={
        <div>
          <div className="mb-5" aria-hidden>
            <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full">
              {segments.filter((s) => s.pct > 0).map((s) => (
                <div key={s.key} style={{ width: `${s.pct}%`, background: s.color }} />
              ))}
            </div>
            <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-2">
              {segments.map((s) => (
                <li key={s.key} className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-[3px]" style={{ background: s.color }} />
                  {s.label} ({s.pct} %)
                </li>
              ))}
            </ul>
          </div>
          <BarChartView
            data={data}
            xKey="mois"
            xLabel="Mois"
            series={[{ key: "epargne", label: "Épargne cumulée", color: SERIES_COLORS[2] }]}
            format={euro}
            tickFormat={euroTick}
            title="Épargne cumulée sur 12 mois"
            height={200}
          />
        </div>
      }
    />
  );
}

export function BondSimulator() {
  const [coupon, setCoupon] = useState(3);
  const [years, setYears] = useState(10);
  const [market, setMarket] = useState(4);
  const face = 1000;
  const price = bondPrice(face, coupon, years, market);
  const duration = bondDuration(face, coupon, years, market);
  const data = useMemo(
    () =>
      Array.from({ length: 21 }, (_, i) => {
        const r = i * 0.5;
        return { taux: `${formatNumber(r, 1)} %`, prix: Math.round(bondPrice(face, coupon, years, r) * 100) / 100 };
      }),
    [coupon, years],
  );

  return (
    <SimulatorLayout
      controls={
        <>
          <NumberField label="Coupon annuel" value={coupon} onChange={setCoupon} min={0} max={10} step={0.25} unit="%" hint="Pour une obligation de 1 000 € de valeur nominale." />
          <NumberField label="Maturité restante" value={years} onChange={setYears} min={1} max={30} unit="ans" />
          <NumberField label="Taux du marché" value={market} onChange={setMarket} min={0} max={10} step={0.25} unit="%" />
        </>
      }
      results={
        <>
          <ResultTile label="Prix de l'obligation" value={formatCurrency(price, "EUR", 2)} emphasis sub={price >= face ? "au-dessus du pair" : "sous le pair"} />
          <ResultTile label="Duration" value={`${formatNumber(duration, 1)} ans`} />
          <ResultTile label="Si les taux montent d'1 point" value={formatPercent(((bondPrice(face, coupon, years, market + 1) - price) / price) * 100, 1, true)} sub="variation du prix" />
        </>
      }
      insight={`Quand le taux du marché (${formatPercent(market, 2)}) dépasse le coupon (${formatPercent(coupon, 2)}), l'obligation se négocie sous 1 000 € pour offrir le même rendement que les nouvelles émissions. Plus la maturité est longue, plus le prix est sensible aux taux.`}
      chart={
        <LineChartView
          data={data}
          xKey="taux"
          xLabel="Taux du marché"
          series={[{ key: "prix", label: "Prix de l'obligation", color: SERIES_COLORS[0] }]}
          format={(v) => formatCurrency(v, "EUR", 0)}
          tickFormat={euroTick}
          title="Prix selon le taux du marché"
          source="Coupons annuels, remboursement à 1 000 € à l'échéance."
        />
      }
    />
  );
}

export function BreakEvenSimulator() {
  const [fixed, setFixed] = useState(6000);
  const [price, setPrice] = useState(4);
  const [variable, setVariable] = useState(1);
  const result = breakEven(fixed, price, variable);
  const maxUnits = result ? Math.max(10, Math.ceil(result.units * 2)) : 1000;
  const data = Array.from({ length: 11 }, (_, i) => {
    const units = Math.round((maxUnits / 10) * i);
    return { unites: formatNumber(units), recettes: Math.round(units * price), couts: Math.round(fixed + units * variable) };
  });

  return (
    <SimulatorLayout
      controls={
        <>
          <NumberField label="Coûts fixes mensuels" value={fixed} onChange={setFixed} min={0} max={200000} step={100} unit="€" hint="Loyer, salaires, abonnements…" />
          <NumberField label="Prix de vente unitaire" value={price} onChange={setPrice} min={0.5} max={5000} step={0.5} unit="€" />
          <NumberField label="Coût variable unitaire" value={variable} onChange={setVariable} min={0} max={5000} step={0.5} unit="€" hint="Matières, commissions, livraison…" />
        </>
      }
      results={
        result ? (
          <>
            <ResultTile label="Seuil de rentabilité" value={`${formatNumber(result.units)} ventes`} emphasis sub="par mois" />
            <ResultTile label="Chiffre d'affaires au seuil" value={euro(result.revenue)} />
            <ResultTile label="Marge par vente" value={formatCurrency(result.marginPerUnit, "EUR", 2)} sub={`taux de marge : ${formatPercent(result.marginRate * 100, 0)}`} />
          </>
        ) : (
          <div className="sm:col-span-3">
            <ResultTile label="Seuil de rentabilité" value="Inatteignable" sub="Le prix doit dépasser le coût variable unitaire." emphasis />
          </div>
        )
      }
      insight={
        result
          ? `Il faut vendre ${formatNumber(result.units)} unités par mois (environ ${formatNumber(Math.ceil(result.units / 30))} par jour) pour couvrir tous les coûts. Chaque vente au-delà rapporte ${formatCurrency(result.marginPerUnit, "EUR", 2)}.`
          : undefined
      }
      chart={
        <LineChartView
          data={data}
          xKey="unites"
          xLabel="Ventes"
          series={[
            { key: "recettes", label: "Chiffre d'affaires", color: SERIES_COLORS[2] },
            { key: "couts", label: "Coûts totaux", color: SERIES_COLORS[1] },
          ]}
          format={euro}
          tickFormat={euroTick}
          title="Recettes et coûts selon le volume"
          source="Le seuil est atteint au croisement des deux courbes."
        />
      }
    />
  );
}

const COMPONENTS: Record<SimulatorId, () => React.ReactElement> = {
  "interets-composes": CompoundSimulator,
  "pouvoir-achat": PurchasingPowerSimulator,
  credit: LoanSimulator,
  budget: BudgetSimulator,
  "prix-obligation": BondSimulator,
  "seuil-rentabilite": BreakEvenSimulator,
};

export function Simulator({ id }: { id: SimulatorId }) {
  const Component = COMPONENTS[id];
  return <Component />;
}
