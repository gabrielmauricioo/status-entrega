'use client';

import { useState, useEffect } from 'react';

// Interface para definir o que um Pedido tem
interface Pedido {
  id: string;
  cliente: string;
  telefone: string;
  produto: string;
  endereco: string;
  horario: string;
  status: string;
}

export default function PainelAdmin() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [carregando, setCarregando] = useState(false);
  const [form, setForm] = useState({
    cliente: '',
    telefone: '',
    produto: '',
    endereco: '',
    horario: ''
  });

  // 1. Carregar os pedidos toda vez que abrir a página
  useEffect(() => {
    carregarPedidos();
  }, []);

  const carregarPedidos = async () => {
    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_all' })
      });
      
      // Verifica se a resposta é JSON antes de ler
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await res.json();
        if (Array.isArray(data)) setPedidos(data);
      } else {
        console.error("A API não retornou JSON. Verifique a rota /api/pedidos");
      }
    } catch (error) {
      console.error("Erro na conexão:", error);
    }
  };

  // 2. Função para Criar um Novo Pedido
  const adicionarPedido = async (e: React.FormEvent) => {
    e.preventDefault();
    setCarregando(true);

    // Gera um ID curto aleatório (ex: "x4k2p9")
    const idUnico = Math.random().toString(36).substring(2, 8);
    const novoPedido: Pedido = { 
      ...form, 
      id: idUnico, 
      status: 'Confirmado' 
    };

    try {
      const res = await fetch('/api/pedidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', pedido: novoPedido })
      });

      if (res.ok) {
        setForm({ cliente: '', telefone: '', produto: '', endereco: '', horario: '' });
        await carregarPedidos(); // Atualiza a lista na tela
      } else {
        alert("Erro ao salvar o pedido na API.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  };

  // 3. Atualizar Status (quando mudar o Select)
  const atualizarStatus = async (id: string, novoStatus: string) => {
    await fetch('/api/pedidos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update', id, status: novoStatus })
    });
    carregarPedidos();
  };

  // 4. Abrir WhatsApp com o link de rastreio
  const enviarWhatsApp = (pedido: Pedido) => {
    const linkRastreio = `${window.location.origin}/rastreio/${pedido.id}`;
    const mensagem = `Olá ${pedido.cliente}! Passando para confirmar seu pedido de *${pedido.produto}*.\n\n🚚 Acompanhe o status da sua entrega em tempo real aqui:\n${linkRastreio}`;
    
    // Limpa o telefone para ter só números
    const telLimpo = pedido.telefone.replace(/\D/g, '');
    const url = `https://wa.me/55${telLimpo}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8 text-gray-900">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6">
        <header className="flex justify-between items-center mb-8 border-b pb-4">
          <h1 className="text-2xl font-bold text-blue-600">📦 Sistema de Entregas</h1>
          <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">
            {pedidos.length} Pedidos Ativos
          </span>
        </header>

        {/* Formulário de Cadastro */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold mb-4">Cadastrar Nova Entrega</h2>
          <form onSubmit={adicionarPedido} className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl border border-gray-200">
            <input 
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Nome do Cliente" 
              value={form.cliente} 
              onChange={e => setForm({...form, cliente: e.target.value})} 
              required 
            />
            <input 
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="WhatsApp (ex: 45999999999)" 
              value={form.telefone} 
              onChange={e => setForm({...form, telefone: e.target.value})} 
              required 
            />
            <input 
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Produto (ex: Sofá 3 lugares)" 
              value={form.produto} 
              onChange={e => setForm({...form, produto: e.target.value})} 
              required 
            />
            <input 
              className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
              placeholder="Endereço de Entrega" 
              value={form.endereco} 
              onChange={e => setForm({...form, endereco: e.target.value})} 
              required 
            />
            <div className="flex flex-col">
              <label className="text-xs text-gray-500 ml-1 mb-1">Horário Previsto</label>
              <input 
                className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" 
                type="time" 
                value={form.horario} 
                onChange={e => setForm({...form, horario: e.target.value})} 
                required 
              />
            </div>
            <button 
              type="submit" 
              disabled={carregando}
              className={`md:mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all ${carregando ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {carregando ? 'Salvando...' : 'Criar Pedido e Gerar Rastreio'}
            </button>
          </form>
        </section>

        {/* Lista de Pedidos */}
        <section>
          <h2 className="text-lg font-semibold mb-4 italic text-gray-600">Entregas em Andamento</h2>
          <div className="space-y-4">
            {pedidos.length === 0 && (
              <div className="text-center py-12 border-2 border-dashed rounded-xl text-gray-400">
                Nenhum pedido cadastrado no momento.
              </div>
            )}
            
            {[...pedidos].reverse().map(pedido => (
              <div key={pedido.id} className="border border-gray-200 p-5 rounded-xl hover:shadow-md transition-shadow bg-white flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono bg-gray-200 px-2 py-0.5 rounded text-gray-600">#{pedido.id}</span>
                    <h3 className="font-bold text-lg">{pedido.cliente}</h3>
                  </div>
                  <p className="text-gray-700 font-medium">📦 {pedido.produto}</p>
                  <p className="text-sm text-gray-500">📍 {pedido.endereco} • 🕒 {pedido.horario}</p>
                </div>

                <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full md:w-auto">
                  <button 
                    onClick={() => enviarWhatsApp(pedido)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 text-sm"
                  >
                    <span>📱 Enviar Link</span>
                  </button>
                  
                  <select 
                    value={pedido.status} 
                    onChange={(e) => atualizarStatus(pedido.id, e.target.value)}
                    className={`p-2 border rounded-lg text-sm font-bold outline-none ${
                      pedido.status === 'Entregue' ? 'bg-green-50 text-green-700 border-green-200' : 
                      pedido.status === 'A Caminho' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-50'
                    }`}
                  >
                    <option value="Confirmado">Confirmado</option>
                    <option value="Preparando Entrega">Preparando</option>
                    <option value="A Caminho">A Caminho</option>
                    <option value="Entregue">Entregue</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}