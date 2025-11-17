export enum InsuranceType {
  EsSalud = 'EsSalud',
  EPS = 'EPS',
}

export interface FormData {
  salary: number;
  monthsWorked: number;
  insuranceType: InsuranceType;
  hasFamilyAllowance: boolean;
  isSmallCompany: boolean;
  hasBonuses: boolean;
  bonusAmount: number;
}

export interface CalculationResult {
  baseGratificacion: number;
  bonus: number;
  totalGratificacion: number;
}
