
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

const ResultItem: React.FC<{ label: string; value: string, isTotal?: boolean, isDeduction?: boolean }> = ({ label, value, isTotal = false, isDeduction = false }) => (
    <div className={`flex justify-between items-center py-2 sm:py-3 ${isTotal ? 'pt-2 sm:pt-3' : 'border-b border-slate-200 dark:border-slate-700'}`}>
        <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`font-semibold text-right ${isTotal ? 'text-lg sm:text-2xl text-emerald-500 dark:text-emerald-400' : 'text-base sm:text-lg'} ${isDeduction ? 'text-red-500 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>{value}</span>
    </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-6 flex flex-col justify-center md:min-h-full">
      {result ? (
        <div className="animate-fade-in">
            <h2 className="text-lg sm:text-2xl font-bold text-center text-slate-800 dark:text-slate-200 mb-2 sm:mb-4">Resultado del Cálculo</h2>
            <div className="bg-white dark:bg-slate-800/50 rounded-lg p-3 sm:p-5 border border-slate-200 dark:border-transparent">
                <ResultItem label="Gratificación Base" value={formatCurrency(result.baseGratificacion)} />
                <ResultItem label="Bonificación Extraordinaria" value={formatCurrency(result.bonus)} />
                
                {result.incomeTax > 0 ? (
                    <>
                        <ResultItem label="Total Bruto" value={formatCurrency(result.grossTotalGratificacion)} />
                        <ResultItem label="Imp. a la Renta (5ta Cat.)" value={`- ${formatCurrency(result.incomeTax)}`} isDeduction={true} />
                        <ResultItem label="Total Neto a Recibir" value={formatCurrency(result.netTotalGratificacion)} isTotal={true} />
                    </>
                ) : (
                    <ResultItem label="Total a Recibir" value={formatCurrency(result.grossTotalGratificacion)} isTotal={true} />
                )}
            </div>
        </div>
      ) : (
        <div className="text-center text-slate-500 flex flex-col items-center justify-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-16 sm:w-16 mb-3 opacity-30 text-slate-400 dark:text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          <h3 className="text-base sm:text-xl font-semibold text-slate-600 dark:text-white">Tu resultado aparecerá aquí</h3>
          <p className="mt-1 max-w-xs mx-auto text-sm sm:text-base">
            Completa los datos en el formulario para calcular tu gratificación.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
