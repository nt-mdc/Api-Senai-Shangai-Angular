// OpenAPI 3.0 specification — single source of truth para a documentação Swagger.
// Servida por swagger-ui-express em GET /api/docs (ver src/app.js).

const swaggerSpec = {
  openapi: '3.0.3',

  info: {
    title: 'API SENAI — Projetos Angular',
    version: '1.0.0',
    description: [
      'API REST que serve de back-end para os projetos da turma de Angular.',
      '',
      '## Como ler esta documentação',
      '- Endpoints públicos: aceitam requisições sem token.',
      '- Endpoints com o cadeado 🔒: exigem `Authorization: Bearer <token>` de um usuário **admin**.',
      '- Para obter um token, faça `POST /auth/login` com um admin válido.',
      '- Clique em **Authorize** (botão verde no topo) e cole o token para testar rotas protegidas.',
      '',
      '## Convenções',
      '- Datas seguem ISO 8601 (`2026-06-17T15:30:00.000Z`).',
      '- IDs podem ser numéricos (modelos antigos) ou UUID (modelos novos).',
      '- Endpoints que aceitam upload de imagem usam `multipart/form-data` com o campo `imagem`.'
    ].join('\n'),
    contact: { name: 'Equipe SENAI' }
  },

  servers: [
    { url: 'http://localhost:3000/api', description: 'Desenvolvimento local' },
    { url: 'https://api-angular.vercel.app/api', description: 'Produção (Vercel)' }
  ],

  tags: [
    { name: 'Auth', description: 'Login e criação de administradores' },
    { name: 'Admin', description: 'Endpoints administrativos (todos exigem token de admin)' },
    { name: 'Turism', description: 'Pontos turísticos' },
    { name: 'Pets', description: 'Amigo Fiel — adoção de pets' },
    { name: 'Courses', description: 'EduTech — catálogo de cursos' },
    { name: 'Properties', description: 'EasyHome — imobiliária' },
    { name: 'Dishes', description: "Chef's Menu — cardápio digital" },
    { name: 'Plans', description: 'Fitness Hub — planos' },
    { name: 'Modalities', description: 'Fitness Hub — modalidades' },
    { name: 'Events', description: 'Event-IT — eventos' },
    { name: 'Moda', description: 'Itens de moda' },
    { name: 'Streaming', description: 'Filmes e estatísticas de streaming' },
    { name: 'Receitas', description: 'Receitas culinárias' },
    { name: 'Projetos-Eventos', description: 'Eventos e dashboard (projeto novo)' },
    { name: 'Hardware', description: 'Itens de hardware' },
    { name: 'Artigos', description: 'Artigos / blog' },
    { name: 'Groups', description: 'Dentro do Jogo — grupos da Copa 2026' },
    { name: 'Teams', description: 'Dentro do Jogo — seleções da Copa 2026' },
    { name: 'Matches', description: 'Dentro do Jogo — partidas da Copa 2026' },
    { name: 'News', description: 'Dentro do Jogo — notícias da Copa 2026' }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT obtido em `POST /auth/login`. Formato: `Bearer <token>`.'
      }
    },

    schemas: {
      Error: {
        type: 'object',
        properties: { error: { type: 'string', example: 'Mensagem de erro' } }
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'admin@senai.com' },
          password: { type: 'string', format: 'password', example: 'senha123' }
        }
      },
      LoginResponse: {
        type: 'object',
        properties: {
          token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
          user: {
            type: 'object',
            properties: {
              id: { type: 'integer', example: 1 },
              name: { type: 'string', example: 'Admin SENAI' },
              email: { type: 'string', example: 'admin@senai.com' },
              role: { type: 'string', example: 'admin' }
            }
          }
        }
      },
      RegisterRequest: {
        type: 'object',
        required: ['name', 'email', 'password'],
        properties: {
          name: { type: 'string', example: 'Maria Admin' },
          email: { type: 'string', format: 'email', example: 'maria@senai.com' },
          password: { type: 'string', format: 'password', example: 'senha123' }
        }
      },

      TurismSpot: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Cristo Redentor' },
          description: { type: 'string', example: 'Monumento histórico.' },
          district: { type: 'string', example: 'Centro' },
          category: { type: 'string', example: 'Histórico' },
          latitude: { type: 'number', format: 'float', example: 30.85 },
          longitude: { type: 'number', format: 'float', example: 121.5 },
          requires_ticket: { type: 'boolean', example: false },
          created_by: { type: 'integer', example: 1 },
          images: {
            type: 'array',
            items: { type: 'object', properties: { id: { type: 'integer' }, file_url: { type: 'string' } } }
          }
        }
      },

      Pet: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', example: 'Rex' },
          species: { type: 'string', example: 'cachorro' },
          age: { type: 'integer', example: 3 },
          size: { type: 'string', example: 'medio' },
          description: { type: 'string', nullable: true },
          status: { type: 'string', example: 'disponivel' }
        }
      },

      Course: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          title: { type: 'string', example: 'Angular do zero' },
          instructor: { type: 'string', example: 'Prof. João' },
          category: { type: 'string', example: 'Frontend' },
          workload: { type: 'integer', example: 40 },
          price: { type: 'number', example: 199.9 },
          description: { type: 'string', nullable: true }
        }
      },

      Property: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          type: { type: 'string', example: 'apartamento' },
          address: { type: 'string', example: 'Rua A, 123' },
          area: { type: 'number', example: 65 },
          price: { type: 'number', example: 350000 },
          modality: { type: 'string', example: 'venda' },
          description: { type: 'string', nullable: true },
          status: { type: 'string', example: 'disponivel' }
        }
      },

      Dish: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', example: 'Lasanha à bolonhesa' },
          category: { type: 'string', example: 'Massas' },
          price: { type: 'number', example: 39.9 },
          description: { type: 'string', nullable: true },
          available: { type: 'boolean', example: true }
        }
      },

      Plan: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', example: 'Plano Mensal' },
          type: { type: 'string', example: 'mensal' },
          price: { type: 'number', example: 99.9 },
          weekly_frequency: { type: 'integer', example: 5 },
          description: { type: 'string' }
        }
      },

      Modality: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', example: 'Musculação' },
          description: { type: 'string' },
          level: { type: 'string', example: 'iniciante' },
          status: { type: 'string', example: 'ativa' }
        }
      },

      Event: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          name: { type: 'string', example: 'Workshop Angular' },
          category: { type: 'string', example: 'tecnologia' },
          date_time: { type: 'string', format: 'date-time' },
          location: { type: 'string', example: 'SENAI Auditório' },
          description: { type: 'string', nullable: true },
          max_capacity: { type: 'integer', example: 100 },
          registered_count: { type: 'integer', example: 0 }
        }
      },

      ModaItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string', example: 'Camiseta básica' },
          categoria: { type: 'string', example: 'roupas' },
          preco: { type: 'number', example: 49.9 },
          descricao: { type: 'string' },
          tag: { type: 'string', nullable: true, example: 'novidade' },
          imagem_url: { type: 'string', example: 'https://blob.vercel-storage.com/moda/...' }
        }
      },

      Movie: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          titulo: { type: 'string', example: 'Matrix' },
          genero: { type: 'string', example: 'ação' },
          ano_lancamento: { type: 'integer', example: 1999 },
          nota: { type: 'string', example: '9.5' },
          imagem_url: { type: 'string' }
        }
      },

      StreamingStats: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          mais_assistidos_semana: { type: 'array', items: { type: 'string' } },
          total_horas_assistidas: { type: 'string', example: '12345h' }
        }
      },

      Recipe: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          categoria: { type: 'string', example: 'sobremesa' },
          titulo: { type: 'string', example: 'Brigadeiro' },
          ingredientes_principais: { type: 'array', items: { type: 'string' } },
          tempo_preparo: { type: 'string', example: '20 minutos' },
          dificuldade: { type: 'string', example: 'fácil' },
          imagem_url: { type: 'string' }
        }
      },

      EventProject: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          nome: { type: 'string', example: 'Hackathon SENAI' },
          data: { type: 'string', example: '2026-08-15' },
          local: { type: 'string', example: 'SENAI Campus' },
          ingressos_restantes: { type: 'integer', example: 50 },
          imagem_url: { type: 'string' }
        }
      },

      EventDashboard: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          total_eventos: { type: 'integer', example: 25 },
          eventos_proximos: { type: 'integer', example: 4 },
          ingressos_disponiveis: { type: 'integer', example: 280 }
        }
      },

      HardwareItem: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          titulo: { type: 'string', example: 'Placa de vídeo RTX 4070' },
          tipo: { type: 'string', example: 'GPU' },
          fabricante: { type: 'string', example: 'NVIDIA' },
          especificacao_principal: { type: 'string', example: '12GB GDDR6X' },
          preco: { type: 'number', example: 4500 },
          imagem_url: { type: 'string' }
        }
      },

      HardwareVideo: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          url: { type: 'string', example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
          titulo: { type: 'string', example: 'Análise Completa RTX 4070' },
          descricao: { type: 'string', example: 'Uma análise aprofundada sobre o desempenho e consumo da nova RTX 4070.' }
        }
      },

      Artigo: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          titulo: { type: 'string', example: 'Introdução ao Angular' },
          descricao: { type: 'string' },
          categoria: { type: 'string', example: 'frontend' },
          tempo_leitura: { type: 'integer', example: 8 },
          imagem: { type: 'string', nullable: true },
          data_publicacao: { type: 'string', format: 'date-time' }
        }
      },

      Team: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          name: { type: 'string', example: 'Brasil' },
          country_code: { type: 'string', example: 'BRA' },
          group_id: { type: 'string', format: 'uuid', nullable: true },
          wins: { type: 'integer', example: 2 },
          losses: { type: 'integer', example: 0 },
          draws: { type: 'integer', example: 1 },
          points: { type: 'integer', example: 7 },
          goals_for: { type: 'integer', example: 6 },
          goals_against: { type: 'integer', example: 2 },
          goal_difference: { type: 'integer', example: 4, description: 'Calculado: goals_for - goals_against' },
          image_url: { type: 'string', nullable: true, example: 'https://blob.vercel-storage.com/teams/...' }
        }
      },

      Group: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Grupo A' },
          description: { type: 'string', nullable: true },
          image_url: { type: 'string', nullable: true },
          teams: { type: 'array', items: { $ref: '#/components/schemas/Team' } }
        }
      },

      Match: {
        type: 'object',
        properties: {
          id: { type: 'integer', example: 1 },
          home_team_id: { type: 'integer', example: 1 },
          away_team_id: { type: 'integer', example: 2 },
          home_score: { type: 'integer', nullable: true, example: 3 },
          away_score: { type: 'integer', nullable: true, example: 1 },
          match_date: { type: 'string', format: 'date-time' },
          stadium: { type: 'string', example: 'Estádio Azteca' },
          city: { type: 'string', example: 'Cidade do México' },
          stage: { type: 'string', enum: ['Fase de Grupos', 'Oitavas', 'Quartas', 'Semifinal', 'Final'] },
          status: { type: 'string', enum: ['Agendado', 'Em andamento', 'Encerrado'], example: 'Encerrado' },
          image_url: { type: 'string', nullable: true },
          home_team: { $ref: '#/components/schemas/Team' },
          away_team: { $ref: '#/components/schemas/Team' }
        }
      },

      News: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          title: { type: 'string', example: 'Brasil vence na estreia' },
          content: { type: 'string' },
          summary: { type: 'string', example: 'Seleção brasileira começa bem a Copa.' },
          author: { type: 'string', example: 'Redação Dentro do Jogo' },
          published_at: { type: 'string', format: 'date-time' },
          category: { type: 'string', enum: ['Resultados', 'Seleções', 'Jogadores', 'Curiosidades'] },
          image_url: { type: 'string', nullable: true }
        }
      },

      PaginationMeta: {
        type: 'object',
        properties: {
          page: { type: 'integer', example: 1 },
          per_page: { type: 'integer', example: 15 },
          total: { type: 'integer', example: 42 },
          total_pages: { type: 'integer', example: 3 }
        }
      }
    },

    responses: {
      Unauthorized: {
        description: 'Token não fornecido ou inválido',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      Forbidden: {
        description: 'Acesso restrito a administradores',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      NotFound: {
        description: 'Recurso não encontrado',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      BadRequest: {
        description: 'Dados inválidos ou faltando',
        content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } }
      },
      NoContent: { description: 'Operação realizada (sem corpo na resposta)' }
    },

    parameters: {
      IdIntPath: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'integer' },
        description: 'ID numérico do recurso'
      },
      IdUuidPath: {
        name: 'id',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
        description: 'ID (UUID) do recurso'
      }
    }
  },

  paths: {
    // ─── AUTH ──────────────────────────────────────────────────────────────
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login de admin',
        description: 'Autentica um administrador e retorna um JWT.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginRequest' } } }
        },
        responses: {
          200: {
            description: 'Login bem-sucedido',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' }
        }
      }
    },
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Cadastro de admin (público)',
        description: 'Cria um novo administrador. Em produção, esta rota deveria ser restrita.',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } }
        },
        responses: {
          201: { description: 'Admin criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginResponse' } } } },
          400: { $ref: '#/components/responses/BadRequest' }
        }
      }
    },

    // ─── ADMIN (criar outros admins logado) ────────────────────────────────
    '/admin/admin': {
      post: {
        tags: ['Admin'],
        summary: 'Criar outro admin (autenticado)',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterRequest' } } }
        },
        responses: {
          201: { description: 'Admin criado' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' }
        }
      }
    },

    // ─── TURISM ────────────────────────────────────────────────────────────
    '/turism': {
      get: {
        tags: ['Turism'],
        summary: 'Listar pontos turísticos',
        parameters: [
          { name: 'name', in: 'query', schema: { type: 'string' } },
          { name: 'category', in: 'query', schema: { type: 'string' } },
          { name: 'requires_ticket', in: 'query', schema: { type: 'boolean' } }
        ],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/TurismSpot' } } } } }
        }
      }
    },
    '/turism/{id}': {
      get: {
        tags: ['Turism'],
        summary: 'Detalhe de um ponto turístico',
        parameters: [{ $ref: '#/components/parameters/IdIntPath' }],
        responses: {
          200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/TurismSpot' } } } },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },
    '/admin/turism': {
      post: {
        tags: ['Admin', 'Turism'],
        summary: 'Criar ponto turístico',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'description', 'district', 'category', 'latitude', 'longitude', 'requires_ticket', 'images'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string', maxLength: 200 },
                  district: { type: 'string' },
                  category: { type: 'string' },
                  latitude: { type: 'number' },
                  longitude: { type: 'number' },
                  requires_ticket: { type: 'boolean' },
                  images: { type: 'array', items: { type: 'string', format: 'binary' }, description: '1 a 5 imagens (png/jpeg)' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/TurismSpot' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' }
        }
      }
    },
    '/admin/turism/{id}': {
      put: {
        tags: ['Admin', 'Turism'],
        summary: 'Atualizar ponto turístico',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdIntPath' }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  description: { type: 'string' }, category: { type: 'string' },
                  latitude: { type: 'number' }, longitude: { type: 'number' },
                  requires_ticket: { type: 'boolean' },
                  images: { type: 'array', items: { type: 'string', format: 'binary' } }
                }
              }
            }
          }
        },
        responses: {
          200: { description: 'Atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/TurismSpot' } } } },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      delete: {
        tags: ['Admin', 'Turism'],
        summary: 'Remover ponto turístico',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdIntPath' }],
        responses: {
          204: { $ref: '#/components/responses/NoContent' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },

    // ─── PETS ──────────────────────────────────────────────────────────────
    '/pets': {
      get: { tags: ['Pets'], summary: 'Listar pets', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Pet' } } } } } } }
    },
    '/pets/{id}': {
      get: { tags: ['Pets'], summary: 'Detalhe de pet', parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Pet' } } } }, 404: { $ref: '#/components/responses/NotFound' } } }
    },
    '/admin/pets': {
      post: {
        tags: ['Admin', 'Pets'], summary: 'Criar pet', security: [{ bearerAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Pet' } } } },
        responses: { 201: { description: 'Criado' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' } }
      }
    },
    '/admin/pets/{id}': {
      put: {
        tags: ['Admin', 'Pets'], summary: 'Atualizar pet', security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdIntPath' }],
        requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Pet' } } } },
        responses: { 200: { description: 'Atualizado' }, 404: { $ref: '#/components/responses/NotFound' } }
      },
      delete: {
        tags: ['Admin', 'Pets'], summary: 'Remover pet', security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdIntPath' }],
        responses: { 204: { $ref: '#/components/responses/NoContent' }, 404: { $ref: '#/components/responses/NotFound' } }
      }
    },

    // ─── COURSES ───────────────────────────────────────────────────────────
    '/courses': { get: { tags: ['Courses'], summary: 'Listar cursos', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Course' } } } } } } } },
    '/courses/{id}': { get: { tags: ['Courses'], summary: 'Detalhe de curso', parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Course' } } } }, 404: { $ref: '#/components/responses/NotFound' } } } },
    '/admin/courses': {
      post: { tags: ['Admin', 'Courses'], summary: 'Criar curso', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Course' } } } }, responses: { 201: { description: 'Criado' } } }
    },
    '/admin/courses/{id}': {
      put: { tags: ['Admin', 'Courses'], summary: 'Atualizar curso', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Course' } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Admin', 'Courses'], summary: 'Remover curso', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },

    // ─── PROPERTIES ────────────────────────────────────────────────────────
    '/properties': { get: { tags: ['Properties'], summary: 'Listar imóveis', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Property' } } } } } } } },
    '/properties/{id}': { get: { tags: ['Properties'], summary: 'Detalhe de imóvel', parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Property' } } } } } } },
    '/admin/properties': {
      post: { tags: ['Admin', 'Properties'], summary: 'Criar imóvel', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Property' } } } }, responses: { 201: { description: 'Criado' } } }
    },
    '/admin/properties/{id}': {
      put: { tags: ['Admin', 'Properties'], summary: 'Atualizar imóvel', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Property' } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Admin', 'Properties'], summary: 'Remover imóvel', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },

    // ─── DISHES ────────────────────────────────────────────────────────────
    '/dishes': { get: { tags: ['Dishes'], summary: 'Listar pratos', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Dish' } } } } } } } },
    '/dishes/{id}': { get: { tags: ['Dishes'], summary: 'Detalhe de prato', parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Dish' } } } } } } },
    '/admin/dishes': {
      post: { tags: ['Admin', 'Dishes'], summary: 'Criar prato', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Dish' } } } }, responses: { 201: { description: 'Criado' } } }
    },
    '/admin/dishes/{id}': {
      put: { tags: ['Admin', 'Dishes'], summary: 'Atualizar prato', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Dish' } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Admin', 'Dishes'], summary: 'Remover prato', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },
    '/admin/dishes/{id}/toggle': {
      patch: { tags: ['Admin', 'Dishes'], summary: 'Alternar disponibilidade do prato', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 200: { description: 'Atualizado' } } }
    },

    // ─── PLANS ─────────────────────────────────────────────────────────────
    '/plans': { get: { tags: ['Plans'], summary: 'Listar planos', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Plan' } } } } } } } },
    '/plans/{id}': { get: { tags: ['Plans'], summary: 'Detalhe de plano', parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Plan' } } } } } } },
    '/admin/plans': {
      post: { tags: ['Admin', 'Plans'], summary: 'Criar plano', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Plan' } } } }, responses: { 201: { description: 'Criado' } } }
    },
    '/admin/plans/{id}': {
      put: { tags: ['Admin', 'Plans'], summary: 'Atualizar plano', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Plan' } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Admin', 'Plans'], summary: 'Remover plano', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },

    // ─── MODALITIES ────────────────────────────────────────────────────────
    '/modalities': { get: { tags: ['Modalities'], summary: 'Listar modalidades', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Modality' } } } } } } } },
    '/modalities/{id}': { get: { tags: ['Modalities'], summary: 'Detalhe de modalidade', parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Modality' } } } } } } },
    '/admin/modalities': {
      post: { tags: ['Admin', 'Modalities'], summary: 'Criar modalidade', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Modality' } } } }, responses: { 201: { description: 'Criado' } } }
    },
    '/admin/modalities/{id}': {
      put: { tags: ['Admin', 'Modalities'], summary: 'Atualizar modalidade', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Modality' } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Admin', 'Modalities'], summary: 'Remover modalidade', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },

    // ─── EVENTS (Event-IT) ─────────────────────────────────────────────────
    '/events': { get: { tags: ['Events'], summary: 'Listar eventos', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Event' } } } } } } } },
    '/events/{id}': { get: { tags: ['Events'], summary: 'Detalhe de evento', parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Event' } } } } } } },
    '/admin/events': {
      post: { tags: ['Admin', 'Events'], summary: 'Criar evento', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Event' } } } }, responses: { 201: { description: 'Criado' } } }
    },
    '/admin/events/{id}': {
      put: { tags: ['Admin', 'Events'], summary: 'Atualizar evento', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/Event' } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Admin', 'Events'], summary: 'Remover evento', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },

    // ─── MODA ──────────────────────────────────────────────────────────────
    '/moda': {
      get: { tags: ['Moda'], summary: 'Listar itens de moda', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/ModaItem' } } } } } } },
      post: {
        tags: ['Moda'], summary: 'Criar item de moda', security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['nome', 'categoria', 'preco', 'descricao'],
                properties: {
                  nome: { type: 'string' }, categoria: { type: 'string' },
                  preco: { type: 'number' }, descricao: { type: 'string' },
                  tag: { type: 'string' },
                  imagem: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/ModaItem' } } } }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' } }
      }
    },
    '/moda/{id}': {
      get: { tags: ['Moda'], summary: 'Detalhe de item de moda', parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/ModaItem' } } } }, 404: { $ref: '#/components/responses/NotFound' } } },
      put: {
        tags: ['Moda'], summary: 'Atualizar item de moda', security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdUuidPath' }],
        requestBody: {
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' }, categoria: { type: 'string' },
                  preco: { type: 'number' }, descricao: { type: 'string' },
                  tag: { type: 'string' }, imagem: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: { 200: { description: 'Atualizado' }, 404: { $ref: '#/components/responses/NotFound' } }
      },
      delete: { tags: ['Moda'], summary: 'Remover item de moda', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' }, 404: { $ref: '#/components/responses/NotFound' } } }
    },

    // ─── STREAMING ─────────────────────────────────────────────────────────
    '/streaming/movies': {
      get: { tags: ['Streaming'], summary: 'Listar filmes', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Movie' } } } } } } },
      post: {
        tags: ['Streaming'], summary: 'Criar filme', security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  titulo: { type: 'string' }, genero: { type: 'string' },
                  ano_lancamento: { type: 'integer' }, nota: { type: 'string' },
                  imagem: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Criado' } }
      }
    },
    '/streaming/movies/{id}': {
      get: { tags: ['Streaming'], summary: 'Detalhe de filme', parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Movie' } } } } } },
      put: { tags: ['Streaming'], summary: 'Atualizar filme', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { titulo: { type: 'string' }, genero: { type: 'string' }, ano_lancamento: { type: 'integer' }, nota: { type: 'string' }, imagem: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Streaming'], summary: 'Remover filme', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },
    '/streaming/stats': {
      get: { tags: ['Streaming'], summary: 'Listar estatísticas', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/StreamingStats' } } } } } } },
      post: { tags: ['Streaming'], summary: 'Criar estatística', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/StreamingStats' } } } }, responses: { 201: { description: 'Criado' } } }
    },
    '/streaming/stats/{id}': {
      put: { tags: ['Streaming'], summary: 'Atualizar estatística', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/StreamingStats' } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Streaming'], summary: 'Remover estatística', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },

    // ─── RECEITAS ──────────────────────────────────────────────────────────
    '/receitas': {
      get: { tags: ['Receitas'], summary: 'Listar receitas', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Recipe' } } } } } } },
      post: {
        tags: ['Receitas'], summary: 'Criar receita', security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  categoria: { type: 'string' }, titulo: { type: 'string' },
                  ingredientes_principais: { type: 'string', description: 'JSON array como string. Ex: ["leite condensado", "chocolate"]' },
                  tempo_preparo: { type: 'string' }, dificuldade: { type: 'string' },
                  imagem: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Criado' } }
      }
    },
    '/receitas/{id}': {
      get: { tags: ['Receitas'], summary: 'Detalhe de receita', parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Recipe' } } } } } },
      put: { tags: ['Receitas'], summary: 'Atualizar receita', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { categoria: { type: 'string' }, titulo: { type: 'string' }, ingredientes_principais: { type: 'string' }, tempo_preparo: { type: 'string' }, dificuldade: { type: 'string' }, imagem: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Receitas'], summary: 'Remover receita', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },

    // ─── PROJETOS-EVENTOS ──────────────────────────────────────────────────
    '/projetos-eventos/events': {
      get: { tags: ['Projetos-Eventos'], summary: 'Listar eventos do projeto', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/EventProject' } } } } } } },
      post: {
        tags: ['Projetos-Eventos'], summary: 'Criar evento do projeto', security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                properties: {
                  nome: { type: 'string' }, data: { type: 'string', example: '2026-08-15' },
                  local: { type: 'string' }, ingressos_restantes: { type: 'integer' },
                  imagem: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Criado' } }
      }
    },
    '/projetos-eventos/events/{id}': {
      get: { tags: ['Projetos-Eventos'], summary: 'Detalhe de evento do projeto', parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/EventProject' } } } } } },
      put: { tags: ['Projetos-Eventos'], summary: 'Atualizar evento do projeto', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { nome: { type: 'string' }, data: { type: 'string' }, local: { type: 'string' }, ingressos_restantes: { type: 'integer' }, imagem: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Projetos-Eventos'], summary: 'Remover evento do projeto', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },
    '/projetos-eventos/dashboard': {
      get: { tags: ['Projetos-Eventos'], summary: 'Listar dashboards', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/EventDashboard' } } } } } } },
      post: { tags: ['Projetos-Eventos'], summary: 'Criar dashboard', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/EventDashboard' } } } }, responses: { 201: { description: 'Criado' } } }
    },
    '/projetos-eventos/dashboard/{id}': {
      put: { tags: ['Projetos-Eventos'], summary: 'Atualizar dashboard', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/EventDashboard' } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Projetos-Eventos'], summary: 'Remover dashboard', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },

    // ─── HARDWARE ──────────────────────────────────────────────────────────
    '/hardware': {
      get: { tags: ['Hardware'], summary: 'Listar itens de hardware', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/HardwareItem' } } } } } } },
      post: {
        tags: ['Hardware'], summary: 'Criar item de hardware', security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['titulo', 'tipo', 'fabricante', 'especificacao_principal', 'preco'],
                properties: {
                  titulo: { type: 'string' }, tipo: { type: 'string' },
                  fabricante: { type: 'string' }, especificacao_principal: { type: 'string' },
                  preco: { type: 'number' }, imagem: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Criado' } }
      }
    },
    '/hardware/{id}': {
      get: { tags: ['Hardware'], summary: 'Detalhe de item de hardware', parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/HardwareItem' } } } } } },
      put: { tags: ['Hardware'], summary: 'Atualizar item de hardware', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { titulo: { type: 'string' }, tipo: { type: 'string' }, fabricante: { type: 'string' }, especificacao_principal: { type: 'string' }, preco: { type: 'number' }, imagem: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Hardware'], summary: 'Remover item de hardware', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },
    '/hardware/videos': {
      get: {
        tags: ['Hardware'],
        summary: 'Listar vídeos de hardware',
        responses: {
          200: {
            description: 'OK',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/HardwareVideo' } } } }
          }
        }
      },
      post: {
        tags: ['Hardware'],
        summary: 'Criar vídeo de hardware',
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['url', 'titulo', 'descricao'],
                properties: {
                  url: { type: 'string', example: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
                  titulo: { type: 'string', example: 'Análise Completa RTX 4070' },
                  descricao: { type: 'string', example: 'Uma análise aprofundada sobre o desempenho e consumo da nova RTX 4070.' }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: 'Criado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HardwareVideo' } } }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' }
        }
      }
    },
    '/hardware/videos/{id}': {
      get: {
        tags: ['Hardware'],
        summary: 'Detalhe de vídeo de hardware',
        parameters: [{ $ref: '#/components/parameters/IdUuidPath' }],
        responses: {
          200: {
            description: 'OK',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HardwareVideo' } } },
          },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      put: {
        tags: ['Hardware'],
        summary: 'Atualizar vídeo de hardware',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdUuidPath' }],
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  url: { type: 'string' },
                  titulo: { type: 'string' },
                  descricao: { type: 'string' }
                }
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Atualizado',
            content: { 'application/json': { schema: { $ref: '#/components/schemas/HardwareVideo' } } }
          },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      },
      delete: {
        tags: ['Hardware'],
        summary: 'Remover vídeo de hardware',
        security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdUuidPath' }],
        responses: {
          204: { $ref: '#/components/responses/NoContent' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' },
          404: { $ref: '#/components/responses/NotFound' }
        }
      }
    },

    // ─── ARTIGOS ───────────────────────────────────────────────────────────
    '/artigos': {
      get: { tags: ['Artigos'], summary: 'Listar artigos', responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Artigo' } } } } } } },
      post: {
        tags: ['Artigos'], summary: 'Criar artigo', security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['titulo', 'descricao', 'categoria', 'tempo_leitura', 'data_publicacao'],
                properties: {
                  titulo: { type: 'string' }, descricao: { type: 'string' },
                  categoria: { type: 'string' }, tempo_leitura: { type: 'integer' },
                  data_publicacao: { type: 'string', format: 'date-time' },
                  imagem: { type: 'string', format: 'binary' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Criado' } }
      }
    },
    '/artigos/{id}': {
      get: { tags: ['Artigos'], summary: 'Detalhe de artigo', parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Artigo' } } } } } },
      put: { tags: ['Artigos'], summary: 'Atualizar artigo', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { titulo: { type: 'string' }, descricao: { type: 'string' }, categoria: { type: 'string' }, tempo_leitura: { type: 'integer' }, data_publicacao: { type: 'string', format: 'date-time' }, imagem: { type: 'string', format: 'binary' } } } } } }, responses: { 200: { description: 'Atualizado' } } },
      delete: { tags: ['Artigos'], summary: 'Remover artigo', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' } } }
    },

    // ─── GROUPS (Copa 2026) ────────────────────────────────────────────────
    '/groups': {
      get: {
        tags: ['Groups'],
        summary: 'Listar grupos (com suas seleções)',
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'per_page', in: 'query', schema: { type: 'integer', default: 15 } }
        ],
        responses: {
          200: {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    data: { type: 'array', items: { $ref: '#/components/schemas/Group' } },
                    meta: { $ref: '#/components/schemas/PaginationMeta' }
                  }
                }
              }
            }
          }
        }
      },
      post: {
        tags: ['Groups'], summary: 'Criar grupo', security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name'],
                properties: {
                  name: { type: 'string' },
                  description: { type: 'string' },
                  image: { type: 'string', format: 'binary', description: 'jpg/png/webp, máx 2MB' }
                }
              }
            }
          }
        },
        responses: {
          201: { description: 'Criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Group' } } } },
          400: { $ref: '#/components/responses/BadRequest' },
          401: { $ref: '#/components/responses/Unauthorized' },
          403: { $ref: '#/components/responses/Forbidden' }
        }
      }
    },
    '/groups/{id}': {
      get: { tags: ['Groups'], summary: 'Grupo por ID (com seleções)', parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Group' } } } }, 404: { $ref: '#/components/responses/NotFound' } } },
      put: {
        tags: ['Groups'], summary: 'Atualizar grupo', security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdUuidPath' }],
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Group' } } } }, 404: { $ref: '#/components/responses/NotFound' } }
      },
      patch: {
        tags: ['Groups'], summary: 'Atualizar grupo parcialmente', security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdUuidPath' }],
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Atualizado' }, 404: { $ref: '#/components/responses/NotFound' } }
      },
      delete: { tags: ['Groups'], summary: 'Remover grupo', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' }, 404: { $ref: '#/components/responses/NotFound' } } }
    },

    // ─── TEAMS (Copa 2026) ─────────────────────────────────────────────────
    '/teams': {
      get: {
        tags: ['Teams'],
        summary: 'Listar seleções',
        parameters: [
          { name: 'group_id', in: 'query', schema: { type: 'string', format: 'uuid' }, description: 'Filtrar por grupo' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'per_page', in: 'query', schema: { type: 'integer', default: 15 } }
        ],
        responses: {
          200: {
            description: 'OK',
            content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Team' } }, meta: { $ref: '#/components/schemas/PaginationMeta' } } } } }
          }
        }
      },
      post: {
        tags: ['Teams'], summary: 'Criar seleção', security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['name', 'country_code'],
                properties: {
                  name: { type: 'string' }, country_code: { type: 'string', example: 'BRA' },
                  group_id: { type: 'string', format: 'uuid' },
                  wins: { type: 'integer' }, losses: { type: 'integer' }, draws: { type: 'integer' },
                  points: { type: 'integer' }, goals_for: { type: 'integer' }, goals_against: { type: 'integer' },
                  image: { type: 'string', format: 'binary', description: 'jpg/png/webp, máx 2MB' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Team' } } } }, 400: { $ref: '#/components/responses/BadRequest' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' } }
      }
    },
    '/teams/{id}': {
      get: { tags: ['Teams'], summary: 'Seleção por ID', parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Team' } } } }, 404: { $ref: '#/components/responses/NotFound' } } },
      put: {
        tags: ['Teams'], summary: 'Atualizar seleção', security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdIntPath' }],
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, country_code: { type: 'string' }, group_id: { type: 'string' }, wins: { type: 'integer' }, losses: { type: 'integer' }, draws: { type: 'integer' }, points: { type: 'integer' }, goals_for: { type: 'integer' }, goals_against: { type: 'integer' }, image: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Team' } } } }, 404: { $ref: '#/components/responses/NotFound' } }
      },
      patch: {
        tags: ['Teams'], summary: 'Atualizar seleção parcialmente', security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdIntPath' }],
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { name: { type: 'string' }, country_code: { type: 'string' }, group_id: { type: 'string' }, wins: { type: 'integer' }, losses: { type: 'integer' }, draws: { type: 'integer' }, points: { type: 'integer' }, goals_for: { type: 'integer' }, goals_against: { type: 'integer' }, image: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Atualizado' }, 404: { $ref: '#/components/responses/NotFound' } }
      },
      delete: { tags: ['Teams'], summary: 'Remover seleção', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' }, 404: { $ref: '#/components/responses/NotFound' } } }
    },

    // ─── MATCHES (Copa 2026) ───────────────────────────────────────────────
    '/matches': {
      get: {
        tags: ['Matches'],
        summary: 'Listar partidas (com os dois times)',
        parameters: [
          { name: 'stage', in: 'query', schema: { type: 'string', enum: ['Fase de Grupos', 'Oitavas', 'Quartas', 'Semifinal', 'Final'] } },
          { name: 'status', in: 'query', schema: { type: 'string', enum: ['Agendado', 'Em andamento', 'Encerrado'] } },
          { name: 'team_id', in: 'query', schema: { type: 'integer' }, description: 'Partidas em que a seleção joga (casa ou fora)' },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'per_page', in: 'query', schema: { type: 'integer', default: 15 } }
        ],
        responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/Match' } }, meta: { $ref: '#/components/schemas/PaginationMeta' } } } } } } }
      },
      post: {
        tags: ['Matches'], summary: 'Criar partida', security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['home_team_id', 'away_team_id', 'match_date', 'stadium', 'city', 'stage'],
                properties: {
                  home_team_id: { type: 'integer' }, away_team_id: { type: 'integer' },
                  home_score: { type: 'integer' }, away_score: { type: 'integer' },
                  match_date: { type: 'string', format: 'date-time' },
                  stadium: { type: 'string' }, city: { type: 'string' },
                  stage: { type: 'string', enum: ['Fase de Grupos', 'Oitavas', 'Quartas', 'Semifinal', 'Final'] },
                  status: { type: 'string', enum: ['Agendado', 'Em andamento', 'Encerrado'] },
                  image: { type: 'string', format: 'binary', description: 'jpg/png/webp, máx 2MB' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Match' } } } }, 400: { $ref: '#/components/responses/BadRequest' }, 422: { description: 'stage/status inválido' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' } }
      }
    },
    '/matches/{id}': {
      get: { tags: ['Matches'], summary: 'Partida por ID (inclui home_team e away_team)', parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Match' } } } }, 404: { $ref: '#/components/responses/NotFound' } } },
      put: {
        tags: ['Matches'], summary: 'Atualizar partida (incl. placar)', security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdIntPath' }],
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { home_team_id: { type: 'integer' }, away_team_id: { type: 'integer' }, home_score: { type: 'integer' }, away_score: { type: 'integer' }, match_date: { type: 'string', format: 'date-time' }, stadium: { type: 'string' }, city: { type: 'string' }, stage: { type: 'string' }, status: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Match' } } } }, 404: { $ref: '#/components/responses/NotFound' } }
      },
      patch: {
        tags: ['Matches'], summary: 'Atualizar partida parcialmente', security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdIntPath' }],
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { home_score: { type: 'integer' }, away_score: { type: 'integer' }, status: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Atualizado' }, 404: { $ref: '#/components/responses/NotFound' } }
      },
      delete: { tags: ['Matches'], summary: 'Remover partida', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdIntPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' }, 404: { $ref: '#/components/responses/NotFound' } } }
    },

    // ─── NEWS (Copa 2026) ──────────────────────────────────────────────────
    '/news': {
      get: {
        tags: ['News'],
        summary: 'Listar notícias (paginadas)',
        parameters: [
          { name: 'category', in: 'query', schema: { type: 'string', enum: ['Resultados', 'Seleções', 'Jogadores', 'Curiosidades'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'per_page', in: 'query', schema: { type: 'integer', default: 15 } }
        ],
        responses: { 200: { description: 'OK', content: { 'application/json': { schema: { type: 'object', properties: { data: { type: 'array', items: { $ref: '#/components/schemas/News' } }, meta: { $ref: '#/components/schemas/PaginationMeta' } } } } } } }
      },
      post: {
        tags: ['News'], summary: 'Criar notícia', security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                type: 'object',
                required: ['title', 'content', 'summary', 'author', 'published_at', 'category'],
                properties: {
                  title: { type: 'string' }, content: { type: 'string' }, summary: { type: 'string' },
                  author: { type: 'string' }, published_at: { type: 'string', format: 'date-time' },
                  category: { type: 'string', enum: ['Resultados', 'Seleções', 'Jogadores', 'Curiosidades'] },
                  image: { type: 'string', format: 'binary', description: 'jpg/png/webp, máx 2MB' }
                }
              }
            }
          }
        },
        responses: { 201: { description: 'Criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/News' } } } }, 400: { $ref: '#/components/responses/BadRequest' }, 422: { description: 'category inválida' }, 401: { $ref: '#/components/responses/Unauthorized' }, 403: { $ref: '#/components/responses/Forbidden' } }
      }
    },
    '/news/{id}': {
      get: { tags: ['News'], summary: 'Notícia por ID', parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 200: { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/News' } } } }, 404: { $ref: '#/components/responses/NotFound' } } },
      put: {
        tags: ['News'], summary: 'Atualizar notícia', security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdUuidPath' }],
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' }, summary: { type: 'string' }, author: { type: 'string' }, published_at: { type: 'string', format: 'date-time' }, category: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Atualizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/News' } } } }, 404: { $ref: '#/components/responses/NotFound' } }
      },
      patch: {
        tags: ['News'], summary: 'Atualizar notícia parcialmente', security: [{ bearerAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/IdUuidPath' }],
        requestBody: { content: { 'multipart/form-data': { schema: { type: 'object', properties: { title: { type: 'string' }, content: { type: 'string' }, summary: { type: 'string' }, author: { type: 'string' }, published_at: { type: 'string', format: 'date-time' }, category: { type: 'string' }, image: { type: 'string', format: 'binary' } } } } } },
        responses: { 200: { description: 'Atualizado' }, 404: { $ref: '#/components/responses/NotFound' } }
      },
      delete: { tags: ['News'], summary: 'Remover notícia', security: [{ bearerAuth: [] }], parameters: [{ $ref: '#/components/parameters/IdUuidPath' }], responses: { 204: { $ref: '#/components/responses/NoContent' }, 404: { $ref: '#/components/responses/NotFound' } } }
    }
  }
};

// ─── Projetos novos (spec): Dentro do Jogo (reescrito) + 5 novos ─────────────
// Mescla schemas, tags e paths de swagger.newProjects.js. As definições novas
// usam camelCase e o envelope { data, message } / { data, meta }, sobrescrevendo
// as antigas da Copa (snake_case/uuid, prefixo /groups), agora removidas.
const newProjects = require('./swagger.newProjects');

for (const stalePath of ['/groups', '/groups/{id}', '/teams', '/teams/{id}', '/matches', '/matches/{id}', '/news', '/news/{id}']) {
  delete swaggerSpec.paths[stalePath];
}
swaggerSpec.tags = swaggerSpec.tags.filter((t) => !['Groups', 'Teams', 'Matches', 'News'].includes(t.name));

swaggerSpec.tags.push(...newProjects.tags);
Object.assign(swaggerSpec.components.schemas, newProjects.schemas);
Object.assign(swaggerSpec.paths, newProjects.paths);

module.exports = swaggerSpec;
