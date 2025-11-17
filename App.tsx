
import React, { useState, useEffect, useRef } from 'react';
import { CalculationResult, FormData } from './types';
import { INSURANCE_BONUS_RATE, SEMESTER_MONTHS, FAMILY_ALLOWANCE_AMOUNT, UIT_2024, INCOME_TAX_BRACKETS } from './constants';
import CalculatorForm from './components/CalculatorForm';
import ResultDisplay from './components/ResultDisplay';
import ThemeToggle from './components/ThemeToggle';

const App: React.FC = () => {
  const [result, setResult] = useState<CalculationResult | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Esta lógica DEBE coincidir con el script en línea en index.html para evitar errores de hidratación.
    if (typeof window !== 'undefined') {
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          return 'dark';
        }
    }
    return 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const handleCalculate = (data: FormData) => {
    if (!data.salary || !data.monthsWorked) {
      setResult(null);
      return;
    }

    let calculationBase = data.salary;
    if (data.hasFamilyAllowance) {
      calculationBase += FAMILY_ALLOWANCE_AMOUNT;
    }
    if (data.hasBonuses) {
      calculationBase += data.bonusAmount / SEMESTER_MONTHS;
    }
    if (data.hasOvertime) {
      calculationBase += data.overtimeAmount / SEMESTER_MONTHS;
    }

    let baseGratificacion = (calculationBase / SEMESTER_MONTHS) * data.monthsWorked;

    if (data.isSmallCompany) {
      baseGratificacion = baseGratificacion / 2;
    }

    const bonusRate = INSURANCE_BONUS_RATE[data.insuranceType];
    const bonus = baseGratificacion * bonusRate;

    const grossTotalGratificacion = baseGratificacion + bonus;
    let incomeTax = 0;
    let netTotalGratificacion = grossTotalGratificacion;

    if (data.shouldCalculateTax) {
        const proyectadoAnual = calculationBase * 14; // 12 sueldos + 2 gratificaciones
        const baseImponible = Math.max(0, proyectadoAnual - (7 * UIT_2024));

        let impuestoAnualProyectado = 0;
        let remainingIncome = baseImponible;
        let previousLimit = 0;

        for (const bracket of INCOME_TAX_BRACKETS) {
            if (remainingIncome <= 0) break;
            const bracketRange = bracket.limit - previousLimit;
            const taxableInBracket = Math.min(remainingIncome, bracketRange);
            impuestoAnualProyectado += taxableInBracket * bracket.rate;
            remainingIncome -= taxableInBracket;
            previousLimit = bracket.limit;
        }
        
        if (proyectadoAnual > 0) {
            const tasaEfectiva = impuestoAnualProyectado / proyectadoAnual;
            incomeTax = bonus * tasaEfectiva;
        }
        
        netTotalGratificacion = grossTotalGratificacion - incomeTax;
    }

    setResult({
      baseGratificacion: parseFloat(baseGratificacion.toFixed(2)),
      bonus: parseFloat(bonus.toFixed(2)),
      grossTotalGratificacion: parseFloat(grossTotalGratificacion.toFixed(2)),
      incomeTax: parseFloat(incomeTax.toFixed(2)),
      netTotalGratificacion: parseFloat(netTotalGratificacion.toFixed(2)),
    });
    
    setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleReset = () => {
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gradient-to-br dark:from-slate-900 dark:to-gray-900 text-slate-800 dark:text-white p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-start transition-colors duration-300">
      <main className="w-full max-w-4xl relative pt-6 pb-32 md:pb-6">
        <div className="absolute top-0 right-0 z-10">
            <ThemeToggle theme={theme} onToggle={handleToggleTheme} />
        </div>

        <header className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500">
            Calculadora de Gratificación
          </h1>
          <p className="mt-2 text-base sm:text-lg text-slate-600 dark:text-slate-400">
            Estima tu gratificación en Perú de forma rápida y sencilla.
          </p>
        </header>

        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 shadow-xl dark:shadow-2xl dark:shadow-black/20">
            <div className="absolute top-0 left-0 -translate-x-1/3 -translate-y-1/3 w-2/3 h-2/3 rounded-full bg-gradient-to-tr from-emerald-500/10 to-cyan-500/10 dark:from-emerald-500/20 dark:to-cyan-500/20 blur-3xl"></div>
            <div className="relative grid md:grid-cols-2">
                <CalculatorForm onCalculate={handleCalculate} onReset={handleReset} />
                <div ref={resultRef} className="md:border-l border-slate-200 dark:border-slate-700/50">
                    <ResultDisplay result={result} />
                </div>
            </div>
        </div>

        <footer className="text-center mt-8 text-slate-600 dark:text-slate-500 text-sm">
          <p>
            <strong>Nota:</strong> Esta es una calculadora referencial. El monto puede variar por otros factores como el régimen de la empresa.
          </p>
          <p className="mt-2">
            Hecho con ❤️ por MagoPe
          </p>
        </footer>
      </main>
    </div>
  );
};

export default App;