import { InsuranceType } from './types';

export const INSURANCE_BONUS_RATE: { [key in InsuranceType]: number } = {
  [InsuranceType.EsSalud]: 0.09,
  [InsuranceType.EPS]: 0.0675,
};

export const SEMESTER_MONTHS = 6;

export const MINIMUM_WAGE = 1025;
export const FAMILY_ALLOWANCE_RATE = 0.10;
export const FAMILY_ALLOWANCE_AMOUNT = MINIMUM_WAGE * FAMILY_ALLOWANCE_RATE;

export const UIT_2024 = 5150;

export const INCOME_TAX_BRACKETS = [
    { limit: 5 * UIT_2024, rate: 0.08 },
    { limit: 20 * UIT_2024, rate: 0.14 },
    { limit: 35 * UIT_2024, rate: 0.17 },
    { limit: 45 * UIT_2024, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
];
