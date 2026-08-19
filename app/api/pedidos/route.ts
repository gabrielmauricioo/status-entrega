import { NextResponse } from 'next/server';

// Banco de dados temporário global para não sumir no "Hot Reload" do desenvolvimento
if (!(global as any).bancoDePedidos) {
  (global as any).bancoDePedidos = [];
}
const banco = (global as any).bancoDePedidos;

export async function GET() {
  return NextResponse.json({ status: "API FUNCIONANDO!", dados: banco });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, pedido, id, status } = body;

    if (action === 'create') {
      banco.push(pedido);
      return NextResponse.json({ success: true });
    } 
    
    if (action === 'update') {
      const index = banco.findIndex((p: any) => p.id === id);
      if (index !== -1) banco[index].status = status;
      return NextResponse.json({ success: true });
    }

    if (action === 'get_all') {
      return NextResponse.json(banco);
    }

    if (action === 'get_one') {
      const encontrado = banco.find((p: any) => p.id === id);
      return NextResponse.json(encontrado || null);
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}