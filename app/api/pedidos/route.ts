import { NextResponse } from 'next/server';

// Simulação de banco de dados global
const globalAny: any = global;
if (!globalAny.bancoDePedidos) {
  globalAny.bancoDePedidos = [];
}

// Método GET: Se você acessar o link da API no navegador, verá isso. 
// Ajuda a confirmar que o 404 sumiu.
export async function GET() {
  return NextResponse.json({ 
    status: "API Online na Vercel", 
    total_pedidos: globalAny.bancoDePedidos.length 
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, pedido, id, status } = body;

    // Criar pedido
    if (action === 'create') {
      globalAny.bancoDePedidos.push(pedido);
      return NextResponse.json({ success: true });
    } 
    
    // Atualizar status
    if (action === 'update') {
      globalAny.bancoDePedidos = globalAny.bancoDePedidos.map((p: any) => 
        p.id === id ? { ...p, status } : p
      );
      return NextResponse.json({ success: true });
    }

    // Buscar todos (Painel)
    if (action === 'get_all') {
      return NextResponse.json(globalAny.bancoDePedidos);
    }

    // Buscar um (Rastreio)
    if (action === 'get_one') {
      const encontrado = globalAny.bancoDePedidos.find((p: any) => p.id === id);
      return NextResponse.json(encontrado || null);
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}