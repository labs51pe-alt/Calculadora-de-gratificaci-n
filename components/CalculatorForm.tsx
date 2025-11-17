import React, { useState } from 'react';
import { InsuranceType, FormData } from '../types';

interface CalculatorFormProps {
  onCalculate: (data: FormData) => void;
  onReset: () => void;
}

const ToggleSwitch: React.FC<{
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ id, label, checked, onChange }) => {
  return (
    <div className="flex items-center justify-between">
       <label htmlFor={id} className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label}
        </label>
      <button
        type="button"
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`${
          checked ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-700'
        } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800`}
      >
        <span
          aria-hidden="true"
          className={`${
            checked ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};

const InfoPanel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <div className="mt-2 p-3 bg-emerald-50 dark:bg-slate-700/50 border-l-4 border-emerald-400 dark:border-emerald-500 rounded-r-lg animate-fade-in">
        <p className="text-sm text-slate-600 dark:text-slate-300">
            {children}
        </p>
    </div>
);


const CalculatorForm: React.FC<CalculatorFormProps> = ({ onCalculate, onReset }) => {
  const [salary, setSalary] = useState<string>('');
  const [monthsWorked, setMonthsWorked] = useState<string>('6');
  const [insuranceType, setInsuranceType] = useState<InsuranceType>(InsuranceType.EsSalud);
  const [error, setError] = useState<string | null>(null);

  const [hasFamilyAllowance, setHasFamilyAllowance] = useState<boolean>(false);
  const [isSmallCompany, setIsSmallCompany] = useState<boolean>(false);
  const [hasBonuses, setHasBonuses] = useState<boolean>(false);
  const [bonusAmount, setBonusAmount] = useState<string>('');
  const [hasOvertime, setHasOvertime] = useState<boolean>(false);
  const [overtimeAmount, setOvertimeAmount] = useState<string>('');
  const [shouldCalculateTax, setShouldCalculateTax] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedSalary = parseFloat(salary);
    const parsedMonths = parseInt(monthsWorked, 10);
    const parsedBonusAmount = parseFloat(bonusAmount) || 0;
    const parsedOvertimeAmount = parseFloat(overtimeAmount) || 0;

    if (isNaN(parsedSalary) || parsedSalary <= 0) {
      setError('Por favor, ingrese un sueldo mensual válido.');
      return;
    }
     if (hasBonuses && (isNaN(parsedBonusAmount) || parsedBonusAmount <= 0)) {
        setError('Por favor, ingrese un monto de bonos válido.');
        return;
    }
    if (hasOvertime && (isNaN(parsedOvertimeAmount) || parsedOvertimeAmount <= 0)) {
        setError('Por favor, ingrese un monto de horas extras válido.');
        return;
    }
    setError(null);

    onCalculate({
      salary: parsedSalary,
      monthsWorked: parsedMonths,
      insuranceType,
      hasFamilyAllowance,
      isSmallCompany,
      hasBonuses,
      bonusAmount: parsedBonusAmount,
      hasOvertime,
      overtimeAmount: parsedOvertimeAmount,
      shouldCalculateTax,
    });
  };
  
  const handleReset = () => {
    setSalary('');
    setMonthsWorked('6');
    setInsuranceType(InsuranceType.EsSalud);
    setError(null);
    setHasFamilyAllowance(false);
    setIsSmallCompany(false);
    setHasBonuses(false);
    setBonusAmount('');
    setHasOvertime(false);
    setOvertimeAmount('');
    setShouldCalculateTax(false);
    onReset();
  };

  const handleNumericInputChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setter(value);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8 relative">
      <div className="space-y-6 pb-20 md:pb-0">
          <div>
            <label htmlFor="salary" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Sueldo Mensual Bruto (S/)
            </label>
            <input
                type="text"
                id="salary"
                inputMode="decimal"
                value={salary}
                onChange={handleNumericInputChange(setSalary)}
                placeholder="Ej: 2500"
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg py-2.5 px-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                required
            />
            {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
          </div>

          <div>
            <label htmlFor="months" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Meses Completos Trabajados (en el semestre)
            </label>
            <select
                id="months"
                value={monthsWorked}
                onChange={(e) => setMonthsWorked(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg py-2.5 px-4 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition appearance-none"
            >
                {[...Array(6).keys()].map(i => (
                    <option key={i + 1} value={i + 1} className="bg-white dark:bg-slate-800">{i + 1} mes{i > 0 ? 'es' : ''}</option>
                ))}
            </select>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700/50">
            <div>
              <ToggleSwitch 
                id="family-allowance" 
                label="¿Recibes Asignación Familiar?" 
                checked={hasFamilyAllowance} 
                onChange={setHasFamilyAllowance}
              />
              {hasFamilyAllowance && <InfoPanel>Se suma a tu sueldo base. Equivale al 10% del sueldo mínimo y se añade a la base de cálculo.</InfoPanel>}
            </div>
            <div>
              <ToggleSwitch 
                id="small-company" 
                label="¿Perteneces al régimen de pequeña empresa?" 
                checked={isSmallCompany} 
                onChange={setIsSmallCompany}
              />
               {isSmallCompany && <InfoPanel>Tu gratificación calculada se divide a la mitad. Aplica a empresas acreditadas en REMYPE.</InfoPanel>}
            </div>
            <div>
              <ToggleSwitch 
                id="bonuses" 
                label="¿Recibiste bonos o comisiones?" 
                checked={hasBonuses} 
                onChange={setHasBonuses}
              />
              {hasBonuses && <InfoPanel>El promedio de tus bonos en el semestre se suma a la base de cálculo. No incluyas bonos extraordinarios.</InfoPanel>}
            </div>
             <div>
              <ToggleSwitch 
                id="overtime" 
                label="¿Horas Extras en 3 o más meses del semestre?" 
                checked={hasOvertime} 
                onChange={setHasOvertime}
              />
              {hasOvertime && <InfoPanel>Si la respuesta es sí, activa esta opción e ingresa el monto total que recibiste por horas extras en los últimos 6 meses.</InfoPanel>}
            </div>
             <div>
              <ToggleSwitch 
                id="calculate-tax" 
                label="¿Estimar Imp. a la Renta (5ta Cat.)?" 
                checked={shouldCalculateTax} 
                onChange={setShouldCalculateTax}
              />
              {shouldCalculateTax && <InfoPanel>La gratificación está exonerada, pero la bonificación no. Este es un cálculo proyectado para estimar la retención sobre tu bonificación.</InfoPanel>}
            </div>
          </div>

          {hasBonuses && (
            <div className="animate-fade-in">
                <label htmlFor="bonusAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Monto total de bonos/comisiones (últimos 6 meses)
                </label>
                <input
                    type="text"
                    id="bonusAmount"
                    inputMode="decimal"
                    value={bonusAmount}
                    onChange={handleNumericInputChange(setBonusAmount)}
                    placeholder="Ej: 1200"
                    className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg py-2.5 px-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    required
                />
            </div>
          )}

          {hasOvertime && (
            <div className="animate-fade-in">
                <label htmlFor="overtimeAmount" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Monto total de Horas Extras (últimos 6 meses)
                </label>
                <input
                    type="text"
                    id="overtimeAmount"
                    inputMode="decimal"
                    value={overtimeAmount}
                    onChange={handleNumericInputChange(setOvertimeAmount)}
                    placeholder="Ej: 600"
                    className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-700 rounded-lg py-2.5 px-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    required
                />
            </div>
          )}
          
          <div>
            <span className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Tipo de Seguro de Salud</span>
            <div className="grid grid-cols-2 gap-4">
                <label className={`relative flex items-center justify-center p-4 rounded-lg cursor-pointer transition-all ${insuranceType === InsuranceType.EsSalud ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500' : 'bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'} border`}>
                    <input type="radio" name="insurance" value={InsuranceType.EsSalud} checked={insuranceType === InsuranceType.EsSalud} onChange={() => setInsuranceType(InsuranceType.EsSalud)} className="absolute opacity-0"/>
                    <span className="font-semibold text-slate-800 dark:text-white">EsSalud</span>
                </label>
                <label className={`relative flex items-center justify-center p-4 rounded-lg cursor-pointer transition-all ${insuranceType === InsuranceType.EPS ? 'bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500' : 'bg-slate-100 dark:bg-slate-900/50 border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'} border`}>
                    <input type="radio" name="insurance" value={InsuranceType.EPS} checked={insuranceType === InsuranceType.EPS} onChange={() => setInsuranceType(InsuranceType.EPS)} className="absolute opacity-0"/>
                    <span className="font-semibold text-slate-800 dark:text-white">EPS</span>
                </label>
            </div>
            {insuranceType === InsuranceType.EsSalud && (
                <InfoPanel>
                    Recibirás una bonificación extraordinaria del <strong>9%</strong> sobre tu gratificación, correspondiente al aporte a EsSalud que el empleador deja de hacer.
                </InfoPanel>
            )}
            {insuranceType === InsuranceType.EPS && (
                <InfoPanel>
                    Recibirás una bonificación extraordinaria del <strong>6.75%</strong> sobre tu gratificación. Este es el porcentaje que tu empleador aporta a EsSalud por ti.
                </InfoPanel>
            )}
          </div>
      </div>
      
      <div className="md:static fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-t border-slate-200 dark:border-slate-700/50 md:p-0 md:bg-transparent md:dark:bg-transparent md:backdrop-blur-none md:border-none">
          <div className="flex items-center gap-3 md:gap-4">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold py-3 px-4 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transition-colors duration-300"
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="flex-[2] w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold py-3 px-4 rounded-lg hover:opacity-90 focus:outline-none focus:ring-4 focus:ring-emerald-500/50 transition-all duration-300 transform md:hover:scale-105"
              >
                Calcular Gratificación
              </button>
          </div>
      </div>

    </form>
  );
};

export default CalculatorForm;