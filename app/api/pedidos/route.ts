import { NextResponse } from 'next/server';
import { supabase } from '@/lib/superbase';

export async function POST(request: Request) {
  try {
    const { action, pedido, id, status } = await request.json();

    if (action === 'create') {
      const { error } = await supabase.from('pedidos').insert([pedido]);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'update') {
      const { error } = await supabase.from('pedidos').update({ status }).eq('id', id);
      if (error) throw error;
      return NextResponse.json({ success: true });
    }

    if (action === 'get_all') {
      const { data, error } = await supabase.from('pedidos').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return NextResponse.json(data);
    }

    if (action === 'get_one') {
      const { data, error } = await supabase.from('pedidos').select('*').eq('id', id).single();
      if (error) throw error;
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Ação inválida' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}