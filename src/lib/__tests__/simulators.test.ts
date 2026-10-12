import { describe, expect, it } from "vitest";
import { bondDuration, bondPrice, breakEven, budgetSplit, compoundGrowth, doublingTime, loanSchedule, purchasingPower } from "@/lib/simulators";

describe("compoundGrowth", () => {
  it("matches the closed-form future value of monthly contributions", () => {
    const points = compoundGrowth({ initial: 0, monthly: 100, annualRate: 5, years: 40 });
    const last = points[points.length - 1];
    const r = 0.05 / 12;
    const expected = (100 * ((1 + r) ** 480 - 1)) / r;
    expect(last.value).toBeCloseTo(expected, 6);
    expect(last.value).toBeGreaterThan(152_000);
    expect(last.value).toBeLessThan(153_000);
    expect(last.contributions).toBe(48_000);
    expect(points).toHaveLength(41);
  });

  it("subtracts annual fees from the return", () => {
    const gross = compoundGrowth({ initial: 10_000, monthly: 0, annualRate: 6, years: 30 }).at(-1)!.value;
    const net = compoundGrowth({ initial: 10_000, monthly: 0, annualRate: 6, years: 30, annualFees: 2 }).at(-1)!.value;
    expect(net).toBeLessThan(gross * 0.6);
  });

  it("keeps the capital flat at a zero rate", () => {
    expect(compoundGrowth({ initial: 500, monthly: 50, annualRate: 0, years: 2 }).at(-1)!.value).toBe(1700);
  });
});

describe("doublingTime", () => {
  it("is close to the rule of 72", () => {
    const { exact, ruleOf72 } = doublingTime(8);
    expect(ruleOf72).toBe(9);
    expect(exact).toBeCloseTo(9.006, 2);
  });
  it("is infinite without return", () => {
    expect(doublingTime(0).exact).toBe(Infinity);
  });
});

describe("purchasingPower", () => {
  it("erodes 1 000 € to about 863 € after 5 years at 3 %", () => {
    expect(purchasingPower(1000, 3, 5).at(-1)!.realValue).toBeCloseTo(862.61, 1);
  });
});

describe("loanSchedule", () => {
  it("computes the monthly payment of a 200 000 € loan at 4 % over 20 years", () => {
    const loan = loanSchedule(200_000, 4, 20);
    expect(loan.monthlyPayment).toBeCloseTo(1211.96, 1);
    expect(loan.totalInterest).toBeCloseTo(90_870, -1);
    expect(loan.yearly).toHaveLength(20);
    expect(loan.yearly.at(-1)!.balance).toBeCloseTo(0, 4);
    const principalPaid = loan.yearly.reduce((s, y) => s + y.principalPaid, 0);
    expect(principalPaid).toBeCloseTo(200_000, 4);
  });

  it("handles a zero rate", () => {
    expect(loanSchedule(12_000, 0, 1).monthlyPayment).toBe(1000);
  });
});

describe("bondPrice", () => {
  it("is at par when the coupon equals the market rate", () => {
    expect(bondPrice(1000, 3, 10, 3)).toBeCloseTo(1000, 6);
  });
  it("falls when rates rise", () => {
    expect(bondPrice(1000, 2, 10, 4)).toBeCloseTo(837.78, 1);
  });
  it("has a duration equal to maturity for a zero-coupon bond", () => {
    expect(bondDuration(1000, 0, 7, 3)).toBeCloseTo(7, 6);
  });
});

describe("breakEven", () => {
  it("divides fixed costs by the unit margin", () => {
    expect(breakEven(6000, 4, 1)).toMatchObject({ units: 2000, revenue: 8000, marginPerUnit: 3 });
  });
  it("is unreachable when the price does not cover variable costs", () => {
    expect(breakEven(1000, 5, 5)).toBeNull();
  });
});

describe("budgetSplit", () => {
  it("applies the 50/30/20 rule", () => {
    expect(budgetSplit(2000)).toEqual({ needs: 1000, wants: 600, savings: 400 });
  });
});
