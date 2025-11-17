import { InsuranceType } from './types';

export const INSURANCE_BONUS_RATE: { [key in InsuranceType]: number } = {
  [InsuranceType.EsSalud]: 0.09,
  [InsuranceType.EPS]: 0.0675,
};

export const SEMESTER_MONTHS = 6;

export const MINIMUM_WAGE = 1025;
export const FAMILY_ALLOWANCE_RATE = 0.10;
export const FAMILY_ALLOWANCE_AMOUNT = MINIMUM_WAGE * FAMILY_ALLOWANCE_RATE;
