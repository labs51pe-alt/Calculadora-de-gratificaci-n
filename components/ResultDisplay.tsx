import React from 'react';
import { CalculationResult } from '../types';

interface ResultDisplayProps {
  result: CalculationResult | null;
}

const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
    }).format(value);
};

const ResultItem: React.FC<{ label: string; value: string, isTotal?: boolean }> = ({ label, value, isTotal = false }) => (
    <div className={`flex justify-between items-center py-4 ${isTotal ? '' : 'border-b border-slate-200 dark:border-slate-700'}`}>
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`font-semibold ${isTotal ? 'text-2xl text-emerald-500 dark:text-emerald-400' : 'text-lg text-slate-800 dark:text-white'}`}>{value}</span>
    </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-6 sm:p-8 flex flex-col justify-center min-h-[400px] md:min-h-full">
      {result ? (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-6">Resultado del Cálculo</h2>
            <div className="bg-white dark:bg-slate-800/50 rounded-lg p-6 border border-slate-200 dark:border-transparent">
                <ResultItem label="Gratificación Base" value={formatCurrency(result.baseGratificacion)} />
                {/* FIX: Corrected a syntax error in the value prop. */}
                <ResultItem label="Bonificación Extraordinaria" value={formatCurrency(result.bonus)} />
                <ResultItem label="Total a Recibir" value={formatCurrency(result.totalGratificacion)} isTotal={true} />
            </div>
        </div>
      ) : (
        <div className="text-center text-slate-500 flex flex-col items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-30 text-slate-400 dark:text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          <h3 className="text-xl font-semibold text-slate-600 dark:text-white">Tu resultado aparecerá aquí</h3>
          <p className="mt-1 max-w-xs mx-auto">
            Completa los datos en el formulario para calcular tu gratificación.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;