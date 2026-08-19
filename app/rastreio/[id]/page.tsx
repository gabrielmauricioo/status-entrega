'use client';
import { useEffect, useState, use } from 'react';

const statusEtapas = ['Confirmado', 'Preparando Entrega', 'A Caminho', 'Entregue'];

export default function Rastreio({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [pedido, setPedido] = useState<any>(null);

  useEffect(() => {
    const buscar = async () => {
      const res = await fetch('/api/pedidos', { method: 'POST', body: JSON.stringify({ action: 'get_one', id }) });
      const data = await res.json();
      setPedido(data);
    };
    buscar();
    const interval = setInterval(buscar, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (!pedido) return <div className="flex justify-center mt-20 text-gray-500 italic">Buscando seu pedido...</div>;

  const etapaAtual = statusEtapas.indexOf(pedido.status);

  return (
    <div className="min-h-screen bg-gray-50 p-4 text-gray-900">
      <div className="max-w-md mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden mt-8">
        <div className="bg-blue-600 p-8 text-white text-center">
          <h1 className="text-xl font-bold uppercase tracking-widest">Rastreio de Entrega</h1>
          <p className="mt-2 text-blue-100">Olá, {pedido.cliente}!</p>
        </div>

        <div className="p-8">
          <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase">Item</p>
            <p className="text-lg font-bold text-gray-800">📦 {pedido.produto}</p>
            <hr className="my-3" />
            <p className="text-xs font-bold text-gray-400 uppercase">Endereço</p>
            <p className="text-sm font-medium text-gray-700">{pedido.endereco}</p>
          </div>

          <div className="relative">
            {statusEtapas.map((s, i) => (
              <div key={s} className="flex items-center mb-10 last:mb-0 relative">
                {i < statusEtapas.length - 1 && (
                  <div className={`absolute left-4 top-8 w-0.5 h-10 ${i < etapaAtual ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
                <div className={`w-9 h-9 rounded-full flex items-center justify-center z-10 border-4 ${i <= etapaAtual ? 'bg-green-500 border-green-100' : 'bg-gray-100 border-white'}`}>
                  {i <= etapaAtual && <span className="text-white text-sm">✓</span>}
                </div>
                <div className="ml-4">
                  <p className={`font-bold ${i === etapaAtual ? 'text-blue-600 text-lg' : i < etapaAtual ? 'text-gray-800' : 'text-gray-300'}`}>{s}</p>
                  {i === etapaAtual && <p className="text-xs text-blue-400 animate-pulse font-bold uppercase">Acompanhe agora</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}