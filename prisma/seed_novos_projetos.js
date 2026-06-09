const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding dos 5 novos projetos...');

  // 1. MODA
  await prisma.modaItem.createMany({
    data: [
      { nome: 'Camiseta Básica de Algodão', categoria: 'Roupas', preco: 49.90, imagem_url: 'https://public.blob.vercel-storage.com/moda-camiseta-123.jpg', tag: 'Básico' },
      { nome: 'Perfume Floral Elegance', categoria: 'Perfumes', preco: 299.00, imagem_url: 'https://public.blob.vercel-storage.com/moda-perfume-456.jpg', tag: 'Lançamento' },
      { nome: 'Bolsa de Couro Transversal', categoria: 'Bolsas', preco: 159.90, imagem_url: 'https://public.blob.vercel-storage.com/moda-bolsa-789.jpg', tag: 'Premium' },
      { nome: 'Colar de Prata 925', categoria: 'Joias', preco: 120.00, imagem_url: 'https://public.blob.vercel-storage.com/moda-colar-000.jpg', tag: 'Acessórios' },
    ]
  });

  // 2. STREAMING
  await prisma.movie.createMany({
    data: [
      { titulo: 'A Origem do Futuro', genero: 'Ficção Científica', ano_lancamento: 2024, nota: '8.5', imagem_url: 'https://public.blob.vercel-storage.com/stream-movie-1.jpg' },
      { titulo: 'Rindo à Toa', genero: 'Comédia', ano_lancamento: 2023, nota: '7.2', imagem_url: 'https://public.blob.vercel-storage.com/stream-movie-2.jpg' },
      { titulo: 'O Mistério da Meia-Noite', genero: 'Suspense', ano_lancamento: 2025, nota: '9.0', imagem_url: 'https://public.blob.vercel-storage.com/stream-movie-3.jpg' },
      { titulo: 'Amor nas Montanhas', genero: 'Romance', ano_lancamento: 2022, nota: '6.8', imagem_url: 'https://public.blob.vercel-storage.com/stream-movie-4.jpg' },
    ]
  });

  await prisma.streamingStats.create({
    data: {
      mais_assistidos_semana: ['A Origem do Futuro', 'O Mistério da Meia-Noite', 'Interestelar', 'Duna'],
      total_horas_assistidas: '15,400'
    }
  });

  // 3. RECEITAS
  await prisma.recipe.createMany({
    data: [
      { categoria: 'Massas', titulo: 'Macarrão à Carbonara', ingredientes_principais: ['Macarrão', 'Ovos', 'Pancetta', 'Queijo Pecorino', 'Pimenta-do-reino'], tempo_preparo: '25 min', dificuldade: 'Médio', imagem_url: 'https://public.blob.vercel-storage.com/recipe-1.jpg' },
      { categoria: 'Sobremesas', titulo: 'Pudim de Leite Condensado', ingredientes_principais: ['Leite Condensado', 'Leite', 'Ovos', 'Açúcar'], tempo_preparo: '1h 30 min', dificuldade: 'Fácil', imagem_url: 'https://public.blob.vercel-storage.com/recipe-2.jpg' },
      { categoria: 'Carnes', titulo: 'Bife Ancho com Batatas', ingredientes_principais: ['Bife Ancho', 'Batatas', 'Manteiga', 'Alho', 'Alecrim'], tempo_preparo: '40 min', dificuldade: 'Fácil', imagem_url: 'https://public.blob.vercel-storage.com/recipe-3.jpg' },
      { categoria: 'Vegano', titulo: 'Risoto de Cogumelos', ingredientes_principais: ['Arroz Arbóreo', 'Cogumelos Paris', 'Caldo de Legumes', 'Cebola', 'Azeite'], tempo_preparo: '45 min', dificuldade: 'Difícil', imagem_url: 'https://public.blob.vercel-storage.com/recipe-4.jpg' },
    ]
  });

  // 4. EVENTOS
  await prisma.eventProject.createMany({
    data: [
      { nome: 'Tech Summit 2026', data: '2026-10-15', local: 'Centro de Convenções', ingressos_restantes: 150, imagem_url: 'https://public.blob.vercel-storage.com/event-1.jpg' },
      { nome: 'Festival de Música Eletrônica', data: '2026-11-20', local: 'Arena Open Air', ingressos_restantes: 500, imagem_url: 'https://public.blob.vercel-storage.com/event-2.jpg' },
      { nome: 'Workshop de Marketing Digital', data: '2026-09-05', local: 'Auditório Sebrae', ingressos_restantes: 30, imagem_url: 'https://public.blob.vercel-storage.com/event-3.jpg' },
      { nome: 'Feira Gastronômica', data: '2026-12-10', local: 'Parque da Cidade', ingressos_restantes: 1000, imagem_url: 'https://public.blob.vercel-storage.com/event-4.jpg' },
    ]
  });

  await prisma.eventDashboard.create({
    data: {
      total_eventos: 15,
      eventos_proximos: 4,
      ingressos_disponiveis: 1680
    }
  });

  // 5. HARDWARE
  await prisma.hardwareItem.createMany({
    data: [
      { tipo: 'Placa de Vídeo', fabricante: 'NVIDIA', especificacao_principal: '16GB GDDR6X', preco: 4500.00, imagem_url: 'https://public.blob.vercel-storage.com/hw-gpu.jpg' },
      { tipo: 'Processador', fabricante: 'AMD', especificacao_principal: '8 Núcleos, 16 Threads, 4.5GHz', preco: 2100.00, imagem_url: 'https://public.blob.vercel-storage.com/hw-cpu.jpg' },
      { tipo: 'Memória RAM', fabricante: 'Corsair', especificacao_principal: '32GB (2x16GB) DDR5 6000MHz', preco: 950.00, imagem_url: 'https://public.blob.vercel-storage.com/hw-ram.jpg' },
      { tipo: 'Placa-Mãe', fabricante: 'ASUS', especificacao_principal: 'Chipset X670E, Wi-Fi 6E', preco: 1850.00, imagem_url: 'https://public.blob.vercel-storage.com/hw-mobo.jpg' },
    ]
  });

  console.log('Seeding concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
