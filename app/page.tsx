'use client';
import { useState, useEffect } from 'react';

export default function Painel() {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [form, setForm] = useState({ cliente: '', telefone: '', produto: '', endereco: '', horario: '' });

  const carregarPedidos = async () => {
    try {
      const res = await fetch('/api/pedidos', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_all' }) 
      });
      const data = await res.json();
      if (Array.isArray(data)) setPedidos(data);
    } catch (e) { console.error("Erro ao carregar", e); }
  };

  useEffect(() => { carregarPedidos(); }, []);

  const cadastrar = async (e: any) => {
    e.preventDefault();
    const idUnico = Math.random().toString(36).substring(2, 8);
    const novo = { ...form, id: idUnico, status: 'Confirmado' };
    
    const res = await fetch('/api/pedidos', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', pedido: novo }) 
    });

    if (res.ok) {
      setForm({ cliente: '', telefone: '', produto: '', endereco: '', horario: '' });
      carregarPedidos();
    }
  };

  const mudarStatus = async (id: string, status: string) => {
    await fetch('/api/pedidos', { 
      method: 'POST', 
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id, status }) 
    });
    carregarPedidos();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-slate-900 font-sans">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-black mb-8 text-blue-600">Móveis Entrega 🚚</h1>
        
        <form onSubmit={cadastrar} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 grid gap-4 mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input className="border p-3 rounded-xl bg-gray-50" placeholder="Nome do Cliente" value={form.cliente} onChange={e => setForm({...form, cliente: e.target.value})} required />
            <input className="border p-3 rounded-xl bg-gray-50" placeholder="WhatsApp (DDD+Número)" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} required />
            <input className="border p-3 rounded-xl bg-gray-50" placeholder="Produto" value={form.produto} onChange={e => setForm({...form, produto: e.target.value})} required />
            <input className="border p-3 rounded-xl bg-gray-50" placeholder="Endereço" value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})} required />
            <input className="border p-3 rounded-xl bg-gray-50" type="time" value={form.horario} onChange={e => setForm({...form, horario: e.target.value})} required />
          </div>
          <button className="bg-blue-600 text-white p-3 rounded-xl font-bold hover:bg-blue-700 transition">Cadastrar Entrega</button>
        </form>

        <div className="space-y-4">
          {pedidos.map((p) => (
            <div key={p.id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <p className="font-bold text-lg">{p.cliente} <span className="text-gray-400 font-normal text-sm">#{p.id}</span></p>
                <p className="text-gray-600">{p.produto} • {p.horario}</p>
                <select 
                  value={p.status} 
                  onChange={(e) => mudarStatus(p.id, e.target.value)}
                  className="mt-2 text-sm font-bold text-blue-600 bg-blue-50 p-1 rounded"
                >
                  <option value="Confirmado">Confirmado</option>
                  <option value="Preparando Entrega">Preparando</option>
                  <option value="A Caminho">A Caminho</option>
                  <option value="Entregue">Entregue</option>
                </select>
              </div>
              <button 
                onClick={() => {
                  const link = `${window.location.origin}/rastreio/${p.id}`;
                  window.open(`https://wa.me/55${p.telefone.replace(/\D/g, '')}?text=${encodeURIComponent("Acompanhe aqui: " + link)}`);
                }}
                className="bg-green-500 text-white px-4 py-2 rounded-xl font-bold text-sm"
              >
                Zap
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}