const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando o seeding dos 5 novos projetos...');

  // 1. MODA
  await prisma.modaItem.deleteMany({});
  await prisma.modaItem.createMany({
    data: [
      { nome: 'Camiseta Básica de Algodão', categoria: 'Roupas', preco: 49.90, descricao: 'Camiseta 100% algodão, modelagem confortável e tecido respirável, ideal para o dia a dia.', imagem_url: 'https://public.blob.vercel-storage.com/moda-camiseta-123.jpg', tag: 'Básico' },
      { nome: 'Perfume Floral Elegance', categoria: 'Perfumes', preco: 299.00, descricao: 'Fragrância floral marcante com notas de jasmim e rosa, fixação prolongada por até 12 horas.', imagem_url: 'https://public.blob.vercel-storage.com/moda-perfume-456.jpg', tag: 'Lançamento' },
      { nome: 'Bolsa de Couro Transversal', categoria: 'Bolsas', preco: 159.90, descricao: 'Bolsa transversal em couro legítimo com alça ajustável e compartimentos internos organizadores.', imagem_url: 'https://public.blob.vercel-storage.com/moda-bolsa-789.jpg', tag: 'Premium' },
      { nome: 'Colar de Prata 925', categoria: 'Joias', preco: 120.00, descricao: 'Colar delicado em prata 925 com pingente minimalista, acompanha caixa para presente.', imagem_url: 'https://public.blob.vercel-storage.com/moda-colar-000.jpg', tag: 'Acessórios' },
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
  await prisma.hardwareItem.deleteMany({});
  await prisma.hardwareItem.createMany({
    data: [
      { titulo: 'NVIDIA GeForce RTX 4080 SUPER', tipo: 'Placa de Vídeo', fabricante: 'NVIDIA', especificacao_principal: '16GB GDDR6X', preco: 4500.00, imagem_url: 'https://public.blob.vercel-storage.com/hw-gpu.jpg' },
      { titulo: 'AMD Ryzen 7 7800X3D', tipo: 'Processador', fabricante: 'AMD', especificacao_principal: '8 Núcleos, 16 Threads, 4.5GHz', preco: 2100.00, imagem_url: 'https://public.blob.vercel-storage.com/hw-cpu.jpg' },
      { titulo: 'Corsair Vengeance DDR5 32GB', tipo: 'Memória RAM', fabricante: 'Corsair', especificacao_principal: '32GB (2x16GB) DDR5 6000MHz', preco: 950.00, imagem_url: 'https://public.blob.vercel-storage.com/hw-ram.jpg' },
      { titulo: 'ASUS ROG Strix X670E-E Gaming', tipo: 'Placa-Mãe', fabricante: 'ASUS', especificacao_principal: 'Chipset X670E, Wi-Fi 6E', preco: 1850.00, imagem_url: 'https://public.blob.vercel-storage.com/hw-mobo.jpg' },
    ]
  });

  // 6. ARTIGOS
  await prisma.artigo.deleteMany({});
  await prisma.artigo.createMany({
    data: [
      {
        titulo: 'JavaScript em 2026: o que mudou?',
        descricao: 'Um panorama completo das novidades do ecossistema JavaScript, cobrindo ES2026, frameworks em ascensão e as ferramentas que todo dev deveria conhecer este ano.',
        categoria: 'Tecnologia',
        tempo_leitura: 8,
        imagem: 'https://public.blob.vercel-storage.com/artigo-js-2026.jpg',
        data_publicacao: new Date('2026-03-10')
      },
      {
        titulo: 'Guia de nutrição para corredores de rua',
        descricao: 'Saiba como montar um plano alimentar eficiente para melhorar sua performance nas corridas, desde o café da manhã pré-treino até a refeição de recuperação.',
        categoria: 'Saúde',
        tempo_leitura: 6,
        imagem: 'https://public.blob.vercel-storage.com/artigo-nutricao.jpg',
        data_publicacao: new Date('2026-04-02')
      },
      {
        titulo: 'Como montar um home office produtivo com menos de R$ 2000',
        descricao: 'Dicas práticas de ergonomia, iluminação e organização para criar um espaço de trabalho em casa que aumenta o foco e reduz a fadiga no longo prazo.',
        categoria: 'Produtividade',
        tempo_leitura: 5,
        imagem: 'https://public.blob.vercel-storage.com/artigo-homeoffice.jpg',
        data_publicacao: new Date('2026-04-15')
      },
      {
        titulo: 'Destinos baratos na América do Sul para 2026',
        descricao: 'Exploramos 10 destinos imperdíveis no continente com ótimo custo-benefício, incluindo hospedagem, gastronomia local e principais atrações de cada cidade.',
        categoria: 'Viagens',
        tempo_leitura: 10,
        imagem: 'https://public.blob.vercel-storage.com/artigo-viagens.jpg',
        data_publicacao: new Date('2026-05-01')
      },
      {
        titulo: 'Introdução à inteligência artificial para não programadores',
        descricao: 'Entenda de forma simples e sem jargões técnicos o que é IA, como ela já impacta o seu dia a dia e quais habilidades são mais valorizadas no mercado de trabalho.',
        categoria: 'Educação',
        tempo_leitura: 7,
        imagem: 'https://public.blob.vercel-storage.com/artigo-ia.jpg',
        data_publicacao: new Date('2026-05-20')
      },
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
