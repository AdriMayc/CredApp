import React from "react";

interface PainelResumoCreditoProps {
  dados: {
    creditoTotal?: number;
    creditoUsado?: number;
    limiteDisponivel?: number;
  };
}

export default function PainelResumoCredito({ dados }: PainelResumoCreditoProps) {
  const {
    creditoTotal = 20000,
    creditoUsado = 8500,
    limiteDisponivel = creditoTotal - creditoUsado,
  } = dados || {};

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="rounded-2xl shadow-md p-4 bg-white border border-gray-200">
        <p className="text-gray-500 text-sm">Crédito Total</p>
        <p className="text-2xl font-semibold text-black">R$ {creditoTotal.toLocaleString()}</p>
      </div>

      <div className="rounded-2xl shadow-md p-4 bg-white border border-gray-200">
        <p className="text-gray-500 text-sm">Crédito Usado</p>
        <p className="text-2xl font-semibold text-blue-600">R$ {creditoUsado.toLocaleString()}</p>
      </div>

      <div className="rounded-2xl shadow-md p-4 bg-white border border-gray-200">
        <p className="text-gray-500 text-sm">Limite Disponível</p>
        <p className="text-2xl font-semibold text-green-600">R$ {limiteDisponivel.toLocaleString()}</p>
      </div>
    </div>
  );
}

