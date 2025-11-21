
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

const ResultItem: React.FC<{ label: string; value: string, isTotal?: boolean, isDeduction?: boolean, subText?: string }> = ({ label, value, isTotal = false, isDeduction = false, subText }) => (
    <div className={`flex flex-col py-2 ${isTotal ? 'pt-3 mt-2 border-t border-slate-200 dark:border-slate-600' : 'border-b border-slate-100 dark:border-slate-700/50 last:border-0'}`}>
        <div className="flex justify-between items-center">
            <span className={`text-sm ${isTotal ? 'font-bold text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
                {label}
            </span>
            <span className={`font-semibold text-right ${isTotal ? 'text-xl sm:text-2xl text-emerald-600 dark:text-emerald-400' : 'text-base'} ${isDeduction ? 'text-red-500 dark:text-red-400' : 'text-slate-800 dark:text-white'}`}>
                {value}
            </span>
        </div>
        {subText && <span className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subText}</span>}
    </div>
);

const DetailRow: React.FC<{ label: string; value: string; highlight?: boolean }> = ({ label, value, highlight }) => (
    <div className={`flex justify-between items-center py-1 text-sm ${highlight ? 'font-semibold text-slate-700 dark:text-slate-200' : 'text-slate-500 dark:text-slate-400'}`}>
        <span>{label}</span>
        <span>{value}</span>
    </div>
);


const ResultDisplay: React.FC<ResultDisplayProps> = ({ result }) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 sm:p-6 flex flex-col md:h-full">
      {result ? (
        <div className="animate-fade-in space-y-6">
            
            {/* Sección de Totales Principales */}
            <div>
                <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    Resumen de Pago
                </h2>
                <div className="bg-white dark:bg-slate-800/80 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
                    <ResultItem 
                        label="Gratificación Proporcional" 
                        value={formatCurrency(result.baseGratificacion)} 
                        subText={`Por ${result.monthsWorked} mes(es) trabajados${result.isSmallCompany ? ' (50% régimen pyme)' : ''}`}
                    />
                    <ResultItem 
                        label={`Bonificación Extraordinaria (${(result.insuranceRate * 100).toFixed(2)}%)`} 
                        value={formatCurrency(result.bonus)}
                        subText="Por aporte a Seguro de Salud"
                    />
                    
                    {result.incomeTax > 0 ? (
                        <>
                            <ResultItem label="Total Bruto" value={formatCurrency(result.grossTotalGratificacion)} />
                            <ResultItem label="Retención Renta 5ta (Est.)" value={`- ${formatCurrency(result.incomeTax)}`} isDeduction={true} />
                            <ResultItem label="Total Neto a Recibir" value={formatCurrency(result.netTotalGratificacion)} isTotal={true} />
                        </>
                    ) : (
                        <ResultItem label="Total a Recibir" value={formatCurrency(result.grossTotalGratificacion)} isTotal={true} />
                    )}
                </div>
            </div>

            {/* Sección de Desglose Detallado */}
            <div>
                 <h3 className="text-sm uppercase tracking-wide font-bold text-slate-500 dark:text-slate-400 mb-3 pl-1">
                    Detalle de la Base Computable
                </h3>
                <div className="bg-slate-100 dark:bg-slate-800/40 rounded-lg p-4 border border-slate-200 dark:border-slate-700/50 text-sm">
                    <p className="text-xs text-slate-500 dark:text-slate-500 mb-2 italic">
                        Suma de conceptos remunerativos usados para el cálculo:
                    </p>
                    <DetailRow label="Sueldo Básico" value={formatCurrency(result.salaryInput)} />
                    
                    {result.familyAllowanceVal > 0 && (
                        <DetailRow label="Asignación Familiar" value={formatCurrency(result.familyAllowanceVal)} />
                    )}
                    
                    {result.avgBonusesVal > 0 && (
                        <DetailRow label="Promedio Bonos/Comis." value={formatCurrency(result.avgBonusesVal)} />
                    )}
                    
                    {result.avgOvertimeVal > 0 && (
                        <DetailRow label="Promedio Horas Extras" value={formatCurrency(result.avgOvertimeVal)} />
                    )}
                    
                    <div className="my-2 border-t border-slate-300 dark:border-slate-600"></div>
                    
                    <DetailRow 
                        label="Total Remuneración Computable" 
                        value={formatCurrency(result.totalComputationBase)} 
                        highlight={true}
                    />
                </div>
            </div>

        </div>
      ) : (
        <div className="text-center text-slate-500 flex flex-col items-center justify-center py-8 h-full">
            <div className="bg-slate-100 dark:bg-slate-800/50 p-4 rounded-full mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 sm:h-12 sm:w-12 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
            </div>
          <h3 className="text-base sm:text-lg font-medium text-slate-700 dark:text-slate-200">Resultados detallados</h3>
          <p className="mt-2 text-sm max-w-xs mx-auto leading-relaxed">
            Ingresa tus datos y presiona "Calcular" para ver el desglose completo de tu gratificación, bonos y descuentos.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResultDisplay;
