'use client';
import { useEffect, useState, use } from 'react';

export default function Rastreio({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [pedido, setPedido] = useState<any>(null);

  useEffect(() => {
    const buscar = async () => {
      const res = await fetch('/api/pedidos', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_one', id: resolvedParams.id }) 
      });
      const data = await res.json();
      setPedido(data);
    };
    buscar();
    const int = setInterval(buscar, 5000);
    return () => clearInterval(int);
  }, [resolvedParams.id]);

  if (!pedido) return <div className="p-10 text-center text-gray-500">Buscando pedido...</div>;

  const etapas = ['Confirmado', 'Preparando Entrega', 'A Caminho', 'Entregue'];
  const atual = etapas.indexOf(pedido.status);

  return (
    <div className="min-h-screen bg-white p-6 font-sans text-slate-900">
      <div className="max-w-md mx-auto border rounded-3xl p-8 shadow-2xl shadow-blue-100">
        <h1 className="text-2xl font-black text-center text-blue-600 mb-8">Status da Entrega</h1>
        
        <div className="bg-gray-50 p-4 rounded-2xl mb-10">
          <p className="text-sm font-bold text-gray-400">CLIENTE</p>
          <p className="font-bold">{pedido.cliente}</p>
          <p className="text-sm font-bold text-gray-400 mt-3">PRODUTO</p>
          <p className="font-bold">{pedido.produto}</p>
        </div>

        <div className="space-y-8">
          {etapas.map((e, i) => (
            <div key={e} className="flex items-center gap-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${i <= atual ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-300'}`}>
                {i <= atual ? '✓' : i + 1}
              </div>
              <p className={`font-bold ${i === atual ? 'text-blue-600 text-lg' : i < atual ? 'text-gray-800' : 'text-gray-300'}`}>
                {e}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}