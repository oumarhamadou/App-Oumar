/** Pure financial calculations behind the interactive simulators. */

export interface CompoundInput {
  initial: number;
  monthly: number;
  /** Annual return in percent, before fees. */
  annualRate: number;
  years: number;
  /** Annual fees in percent, deducted from the return. */
  annualFees?: number;
}

export interface CompoundPoint {
  year: number;
  contributions: number;
  value: number;
  interest: number;
}

/** Monthly compounding with end-of-month contributions. */
export function compoundGrowth({ initial, monthly, annualRate, years, annualFees = 0 }: CompoundInput): CompoundPoint[] {
  const monthlyRate = (annualRate - annualFees) / 100 / 12;
  const points: CompoundPoint[] = [{ year: 0, contributions: initial, value: initial, interest: 0 }];
  let value = initial;
  let contributions = initial;
  for (let month = 1; month <= Math.round(years * 12); month++) {
    value = value * (1 + monthlyRate) + monthly;
    contributions += monthly;
    if (month % 12 === 0) {
      points.push({ year: month / 12, contributions, value, interest: value - contributions });
    }
  }
  return points;
}

/** Years needed to double at a given annual rate (exact, and rule-of-72 estimate). */
export function doublingTime(annualRate: number): { exact: number; ruleOf72: number } {
  if (annualRate <= 0) return { exact: Infinity, ruleOf72: Infinity };
  return { exact: Math.log(2) / Math.log(1 + annualRate / 100), ruleOf72: 72 / annualRate };
}

export interface PurchasingPowerPoint {
  year: number;
  /** What the amount is worth in today's money. */
  realValue: number;
  /** What you'd need in the future to buy what the amount buys today. */
  equivalentNominal: number;
}

export function purchasingPower(amount: number, inflationRate: number, years: number): PurchasingPowerPoint[] {
  const factor = 1 + inflationRate / 100;
  return Array.from({ length: Math.round(years) + 1 }, (_, year) => ({
    year,
    realValue: amount / factor ** year,
    equivalentNominal: amount * factor ** year,
  }));
}

export interface LoanResult {
  monthlyPayment: number;
  totalInterest: number;
  totalCost: number;
  yearly: { year: number; principalPaid: number; interestPaid: number; balance: number }[];
}

/** Fixed-rate amortizing loan with constant monthly payments. */
export function loanSchedule(principal: number, annualRate: number, years: number): LoanResult {
  const n = Math.round(years * 12);
  const r = annualRate / 100 / 12;
  const monthlyPayment = r === 0 ? principal / n : (principal * r) / (1 - (1 + r) ** -n);
  let balance = principal;
  const yearly: LoanResult["yearly"] = [];
  let principalYear = 0;
  let interestYear = 0;
  for (let month = 1; month <= n; month++) {
    const interest = balance * r;
    const principalPart = monthlyPayment - interest;
    balance = Math.max(0, balance - principalPart);
    principalYear += principalPart;
    interestYear += interest;
    if (month % 12 === 0 || month === n) {
      yearly.push({ year: Math.ceil(month / 12), principalPaid: principalYear, interestPaid: interestYear, balance });
      principalYear = 0;
      interestYear = 0;
    }
  }
  const totalCost = monthlyPayment * n;
  return { monthlyPayment, totalInterest: totalCost - principal, totalCost, yearly };
}

export interface BudgetSplit {
  needs: number;
  wants: number;
  savings: number;
}

export function budgetSplit(income: number, ratios: BudgetSplit = { needs: 50, wants: 30, savings: 20 }): BudgetSplit {
  return {
    needs: (income * ratios.needs) / 100,
    wants: (income * ratios.wants) / 100,
    savings: (income * ratios.savings) / 100,
  };
}

/** Price of a bond with annual coupons, for a given market yield (percent). */
export function bondPrice(face: number, couponRate: number, years: number, marketRate: number): number {
  const coupon = (face * couponRate) / 100;
  const y = marketRate / 100;
  let price = 0;
  for (let t = 1; t <= years; t++) price += coupon / (1 + y) ** t;
  return price + face / (1 + y) ** years;
}

/** Macaulay duration (years) of an annual-coupon bond. */
export function bondDuration(face: number, couponRate: number, years: number, marketRate: number): number {
  const coupon = (face * couponRate) / 100;
  const y = marketRate / 100;
  const price = bondPrice(face, couponRate, years, marketRate);
  let weighted = 0;
  for (let t = 1; t <= years; t++) {
    const cashFlow = coupon + (t === years ? face : 0);
    weighted += (t * cashFlow) / (1 + y) ** t;
  }
  return weighted / price;
}

export interface BreakEvenResult {
  /** Units to sell to cover all costs (rounded up). */
  units: number;
  revenue: number;
  marginPerUnit: number;
  marginRate: number;
}

export function breakEven(fixedCosts: number, price: number, variableCost: number): BreakEvenResult | null {
  const marginPerUnit = price - variableCost;
  if (marginPerUnit <= 0 || price <= 0) return null;
  const units = Math.ceil(fixedCosts / marginPerUnit);
  return { units, revenue: units * price, marginPerUnit, marginRate: marginPerUnit / price };
}
