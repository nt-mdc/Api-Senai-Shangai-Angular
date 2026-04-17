## Atividade 1 — Amigo Fiel: Portal de Adoção de Pets

Uma plataforma para organizar e divulgar pets disponíveis para adoção em uma ONG de proteção animal.

**Funcionalidades:**
- Tela de login com rota protegida: Acesso restrito para administradores da ONG.
- CRUD de pets: Gerenciar nome, espécie, idade, porte, descrição e status de adoção.
- Filtro por espécie ou porte: Facilitar a busca por um pet específico.
- Validação ao cadastrar: Impedir nome com menos de 3 caracteres ou campos obrigatórios vazios.
- Tela pública: Listagem dos pets disponíveis para adoção.

Para estruturar o Amigo Fiel no Angular, é ideal separar as responsabilidades em componentes claros, utilizando Reactive Forms para as validações e Route Guards para a proteção das rotas. Um componente reutilizável `PetCardComponent` deve ser criado para exibir os cards dos pets, recebendo os dados via `@Input()`. Quando necessário, utilize o operador `map` do RxJS para transformar os dados da API antes de renderizá-los na tela.

Abaixo, descrevemos os campos e o conteúdo sugerido para cada tela:

### 1. Tela de Login (Acesso Restrito)

Esta tela é o portão de entrada para os administradores da ONG. Deve ser simples e focar na captura de credenciais.

| Campo | Tipo de Input | Validações |
|---|---|---|
| E-mail | `email` | `Validators.required`, `Validators.email` |
| Senha | `password` | `Validators.required`, `Validators.minLength(6)` |

**Conteúdo Adicional:**
- Botão de "Entrar".
- Mensagens de erro dinâmicas (ex: "Usuário ou senha inválidos").

---

### 2. Tela Pública: Listagem de Pets

A vitrine do sistema. O objetivo aqui é apresentar os pets e estimular a adoção.

**Conteúdo da Tela:**
- **Barra de Busca:** Campo de texto para filtrar pelo nome do pet.
- **Filtros Rápidos:** Dropdown de Espécie (ex: Cachorro, Gato, Ave) e Porte (Pequeno, Médio, Grande).
- **Grid de Cards (`PetCardComponent`):** Cada card representando um pet com:
  - Nome, Espécie, Idade, Porte e uma breve descrição.
  - Badge de "Adotado" caso o pet já tenha sido adotado.
  - Botão "Quero Adotar": Abre um modal com informações de contato da ONG.

---

### 3. Tela de Gerenciamento (Dashboard Admin)

Exclusiva para administradores da ONG (protegida por `AuthGuard`). Uma visão tabular para controle rápido do cadastro de pets.

**Conteúdo da Tela:**
- Botão **"Cadastrar Pet"**: Direciona para o formulário de cadastro.
- **Tabela de Pets:**
  - Colunas: Nome, Espécie, Idade, Porte, Status.
  - Ações: Ícones para **Editar** (Lápis) e **Excluir** (Lixeira).
- **Status de Autenticação:** Botão de "Sair" (Logout).

---

### 4. Formulário de CRUD (Cadastro/Edição de Pets)

Onde as regras de validação são aplicadas via `FormGroup`.

| Campo | Tipo de Input | Conteúdo / Regra |
|---|---|---|
| Nome do Pet | `text` | `Validators.required`, `Validators.minLength(3)` |
| Espécie | `select` | Opções: Cachorro, Gato, Ave, Roedor, Outro |
| Idade | `number` | `Validators.required`, `Validators.min(0)` |
| Porte | `select` | Opções: Pequeno, Médio, Grande |
| Descrição | `textarea` | Informações sobre o comportamento e histórico do pet |
| Status | `select` | Opções: Disponível, Adotado |

**Lógica de Validação no Angular:**
Utilize `Validators.minLength(3)` no campo Nome para garantir que não sejam inseridos apelidos muito curtos ou inválidos. Crie também um Validator customizado para impedir que a idade seja um valor negativo, exibindo a mensagem de erro de forma reativa no template.

---

### Estrutura Técnica Sugerida

```
guards/         → auth.guard.ts
interceptors/   → auth.interceptor.ts
services/       → auth.service.ts, pet.service.ts
components/     → pet-card/, navbar/
pages/          → login/, pet-list/, admin/dashboard/, admin/pet-form/
```

**Comandos para criar os arquivos:**

```bash
# 1. Criar o projeto
npx ng new amigo-fiel --ssr --style=css --routing

# 2. Serviços
npx ng generate service services/auth
npx ng generate service services/pet

# 3. Functional Guard
npx ng generate guard guards/auth --type=canActivate

# 4. Componentes Standalone
npx ng generate component components/navbar
npx ng generate component components/pet-card
npx ng generate component pages/login
npx ng generate component pages/pet-list
npx ng generate component pages/admin/dashboard
npx ng generate component pages/admin/pet-form

# 5. Interceptor
npx ng generate interceptor interceptors/auth

# 6. Executar o projeto
npx ng serve
```

**API URL:** `apiUrl: ""`

---
---

## Atividade 2 — EduTech: Catálogo de Cursos Online

Uma plataforma para gerenciar a oferta de cursos e trilhas de aprendizado de uma escola digital.

**Funcionalidades:**
- Tela de login com rota protegida: Acesso restrito para instrutores e administradores.
- CRUD de cursos: Gerenciar título, instrutor, categoria, carga horária, descrição e preço.
- Filtro dinâmico em tempo real: Filtrar cursos por nome ou instrutor enquanto o usuário digita.
- Validação ao cadastrar: Impedir carga horária zero ou campos obrigatórios vazios.
- Tela pública: Listagem dos cursos disponíveis para matrícula.

Para estruturar o EduTech no Angular, é ideal separar as responsabilidades em componentes claros, utilizando Reactive Forms para as validações e Route Guards para a proteção das rotas. Para o filtro em tempo real, aplique o operador `debounceTime` do RxJS no campo de busca para evitar múltiplas requisições desnecessárias à API. Use a diretiva `*ngIf` para exibir mensagens de "Nenhum curso encontrado" quando o filtro não retornar resultados.

Abaixo, descrevemos os campos e o conteúdo sugerido para cada tela:

### 1. Tela de Login (Acesso Restrito)

Esta tela é o portão de entrada para instrutores e administradores. Deve ser simples e focar na captura de credenciais.

| Campo | Tipo de Input | Validações |
|---|---|---|
| E-mail | `email` | `Validators.required`, `Validators.email` |
| Senha | `password` | `Validators.required`, `Validators.minLength(6)` |

**Conteúdo Adicional:**
- Botão de "Entrar".
- Mensagens de erro dinâmicas (ex: "Usuário ou senha inválidos").

---

### 2. Tela Pública: Catálogo de Cursos

A vitrine do sistema. O objetivo aqui é apresentar os cursos e incentivar a matrícula.

**Conteúdo da Tela:**
- **Barra de Busca com Filtro em Tempo Real:** Campo de texto que filtra cursos por nome ou instrutor ao digitar, com `debounceTime(300ms)`.
- **Filtros Rápidos:** Dropdown de Categoria (ex: Programação, Design, Marketing, Negócios).
- **Grid de Cards:** Cada card representando um curso com:
  - Título, Instrutor, Categoria, Carga Horária e Preço.
  - Badge de "Novo" para cursos cadastrados nos últimos 30 dias.
  - Mensagem **"Nenhum curso encontrado"** exibida via `*ngIf` caso o filtro não retorne resultados.
  - Botão "Matricular-se": Redireciona para a confirmação de matrícula.

---

### 3. Tela de Gerenciamento (Dashboard Admin)

Exclusiva para administradores (protegida por `AuthGuard`). Uma visão tabular para controle rápido do catálogo de cursos.

**Conteúdo da Tela:**
- Botão **"Novo Curso"**: Direciona para o formulário de cadastro.
- **Tabela de Cursos:**
  - Colunas: Título, Instrutor, Categoria, Carga Horária, Preço, Status.
  - Ações: Ícones para **Editar** (Lápis) e **Excluir** (Lixeira).
- **Status de Autenticação:** Botão de "Sair" (Logout).

---

### 4. Formulário de CRUD (Cadastro/Edição de Cursos)

Onde as regras de validação são aplicadas via `FormGroup`.

| Campo | Tipo de Input | Conteúdo / Regra |
|---|---|---|
| Título do Curso | `text` | `Validators.required` |
| Instrutor | `text` | `Validators.required` |
| Categoria | `select` | Opções: Programação, Design, Marketing, Negócios, Outro |
| Carga Horária (h) | `number` | `Validators.required`, `Validators.min(1)` |
| Preço (R$) | `number` | `Validators.required`, `Validators.min(0)` |
| Descrição | `textarea` | Ementa, objetivos e público-alvo do curso |

**Lógica de Validação no Angular:**
Utilize o operador `debounceTime` do RxJS associado ao `valueChanges` do campo de busca na tela pública para controlar o ritmo das filtragens. No formulário de CRUD, aplique `Validators.min(1)` na Carga Horária para garantir que cursos com duração zero não sejam cadastrados.

---

### Estrutura Técnica Sugerida

```
guards/         → auth.guard.ts
interceptors/   → auth.interceptor.ts
services/       → auth.service.ts, course.service.ts
components/     → course-card/, navbar/
pages/          → login/, course-list/, admin/dashboard/, admin/course-form/
```

**Comandos para criar os arquivos:**

```bash
# 1. Criar o projeto
npx ng new edutech --ssr --style=css --routing

# 2. Serviços
npx ng generate service services/auth
npx ng generate service services/course

# 3. Functional Guard
npx ng generate guard guards/auth --type=canActivate

# 4. Componentes Standalone
npx ng generate component components/navbar
npx ng generate component components/course-card
npx ng generate component pages/login
npx ng generate component pages/course-list
npx ng generate component pages/admin/dashboard
npx ng generate component pages/admin/course-form

# 5. Interceptor
npx ng generate interceptor interceptors/auth

# 6. Executar o projeto
npx ng serve
```

**API URL:** `apiUrl: ""`

---
---

## Atividade 3 — EasyHome: Sistema de Imobiliária

Uma interface para listagem e gerenciamento de imóveis disponíveis para aluguel ou venda.

**Funcionalidades:**
- Tela de login com rota protegida: Acesso restrito para corretores e administradores.
- CRUD de imóveis: Gerenciar tipo, endereço, metragem, preço, descrição e modalidade (venda/aluguel).
- Filtro por tipo ou modalidade: Facilitar a busca por imóveis específicos.
- Validação ao cadastrar: Impedir preço ou metragem zerados e campos obrigatórios vazios.
- Tela pública: Listagem dos imóveis disponíveis para consulta.

Para estruturar o EasyHome no Angular, é ideal separar as responsabilidades em componentes claros, utilizando Reactive Forms para as validações e Route Guards para a proteção das rotas. Utilize o `CurrencyPipe` para formatar os preços automaticamente no padrão BRL (`R$`). Crie também um Pipe personalizado para exibir a metragem com o sufixo `m²`. Implemente um Interceptor para anexar o token JWT em todas as requisições enviadas à API.

Abaixo, descrevemos os campos e o conteúdo sugerido para cada tela:

### 1. Tela de Login (Acesso Restrito)

Esta tela é o portão de entrada para corretores e administradores. Deve ser simples e focar na captura de credenciais.

| Campo | Tipo de Input | Validações |
|---|---|---|
| E-mail | `email` | `Validators.required`, `Validators.email` |
| Senha | `password` | `Validators.required`, `Validators.minLength(6)` |

**Conteúdo Adicional:**
- Botão de "Entrar".
- Mensagens de erro dinâmicas (ex: "Usuário ou senha inválidos").

---

### 2. Tela Pública: Listagem de Imóveis

A vitrine do sistema. O objetivo aqui é apresentar os imóveis disponíveis para potenciais clientes.

**Conteúdo da Tela:**
- **Barra de Busca:** Campo de texto para filtrar pelo endereço ou bairro.
- **Filtros Rápidos:** Dropdown de Tipo (Casa, Apartamento, Terreno) e Modalidade (Venda, Aluguel).
- **Grid de Cards:** Cada card representando um imóvel com:
  - Tipo, Endereço, Metragem (formatada com Pipe `m²`) e Preço (formatado com `CurrencyPipe` em BRL).
  - Badge de "Vendido" ou "Alugado" caso o imóvel não esteja mais disponível.
  - Botão "Ver Detalhes": Exibe um modal ou redireciona para a página do imóvel.

---

### 3. Tela de Gerenciamento (Dashboard Admin)

Exclusiva para corretores e administradores (protegida por `AuthGuard`). Uma visão tabular para controle rápido do portfólio de imóveis.

**Conteúdo da Tela:**
- Botão **"Novo Imóvel"**: Direciona para o formulário de cadastro.
- **Tabela de Imóveis:**
  - Colunas: Tipo, Endereço, Metragem, Preço, Modalidade, Status.
  - Ações: Ícones para **Editar** (Lápis) e **Excluir** (Lixeira).
- **Status de Autenticação:** Botão de "Sair" (Logout).

---

### 4. Formulário de CRUD (Cadastro/Edição de Imóveis)

Onde as regras de validação são aplicadas via `FormGroup`.

| Campo | Tipo de Input | Conteúdo / Regra |
|---|---|---|
| Tipo de Imóvel | `select` | Opções: Casa, Apartamento, Terreno |
| Endereço | `text` | `Validators.required` |
| Metragem (m²) | `number` | `Validators.required`, `Validators.min(1)` |
| Preço (R$) | `number` | `Validators.required`, `Validators.min(0)` |
| Modalidade | `select` | Opções: Venda, Aluguel |
| Descrição | `textarea` | Características, diferenciais e observações do imóvel |

**Lógica de Validação no Angular:**
Crie um Pipe personalizado chamado `MetragemPipe` que receba um número e retorne uma string formatada com o sufixo `m²` (ex: `75 m²`). No template da tela pública, aplique o `CurrencyPipe` com a localidade `pt-BR` e o código `BRL` para exibir os preços corretamente (ex: `R$ 350.000,00`).

---

### Estrutura Técnica Sugerida

```
guards/         → auth.guard.ts
interceptors/   → auth.interceptor.ts
pipes/          → metragem.pipe.ts
services/       → auth.service.ts, property.service.ts
components/     → property-card/, navbar/
pages/          → login/, property-list/, admin/dashboard/, admin/property-form/
```

**Comandos para criar os arquivos:**

```bash
# 1. Criar o projeto
npx ng new easy-home --ssr --style=css --routing

# 2. Serviços
npx ng generate service services/auth
npx ng generate service services/property

# 3. Functional Guard
npx ng generate guard guards/auth --type=canActivate

# 4. Componentes Standalone
npx ng generate component components/navbar
npx ng generate component components/property-card
npx ng generate component pages/login
npx ng generate component pages/property-list
npx ng generate component pages/admin/dashboard
npx ng generate component pages/admin/property-form

# 5. Pipe Personalizado
npx ng generate pipe pipes/metragem

# 6. Interceptor
npx ng generate interceptor interceptors/auth

# 7. Executar o projeto
npx ng serve
```

**API URL:** `apiUrl: ""`

---
---

## Atividade 4 — Chef's Menu: Cardápio Digital Interno

Um sistema para restaurantes gerenciarem pratos, categorias e preços em tempo real.

**Funcionalidades:**
- Tela de login com rota protegida: Acesso restrito para administradores do restaurante.
- CRUD de pratos: Gerenciar nome, categoria, descrição, preço e disponibilidade.
- Alternância de disponibilidade: Marcar/desmarcar um prato como "Indisponível" via toggle.
- Validação ao cadastrar: Impedir preço zerado ou campos obrigatórios vazios.
- Tela pública: Cardápio digital otimizado para visualização mobile.

Para estruturar o Chef's Menu no Angular, é ideal separar as responsabilidades em componentes claros, utilizando Reactive Forms para as validações e Route Guards para a proteção das rotas. Utilize a diretiva `[ngClass]` ou `[ngStyle]` para alterar a aparência visual (cor ou opacidade) dos pratos marcados como indisponíveis na tela pública. Explore o Angular Material para componentes de UI como Modais de confirmação de exclusão e o componente `MatSlideToggle` para o botão de alternância. Garanta que as rotas públicas e privadas estejam bem definidas no arquivo `app-routing.module.ts`.

Abaixo, descrevemos os campos e o conteúdo sugerido para cada tela:

### 1. Tela de Login (Acesso Restrito)

Esta tela é o portão de entrada para os administradores do restaurante. Deve ser simples e focar na captura de credenciais.

| Campo | Tipo de Input | Validações |
|---|---|---|
| E-mail | `email` | `Validators.required`, `Validators.email` |
| Senha | `password` | `Validators.required`, `Validators.minLength(6)` |

**Conteúdo Adicional:**
- Botão de "Entrar".
- Mensagens de erro dinâmicas (ex: "Usuário ou senha inválidos").

---

### 2. Tela Pública: Cardápio Digital

A vitrine do sistema, otimizada para visualização mobile. O objetivo é apresentar o cardápio aos clientes do restaurante.

**Conteúdo da Tela:**
- **Abas de Categoria:** Navegação horizontal por categorias (ex: Entradas, Pratos Principais, Sobremesas, Bebidas).
- **Grid de Cards:** Cada card representando um prato com:
  - Nome, Categoria, Descrição e Preço.
  - Pratos indisponíveis exibidos com opacidade reduzida e badge "Indisponível", aplicados via `[ngClass]`.
  - Sem botão de ação (cardápio apenas para consulta).

---

### 3. Tela de Gerenciamento (Dashboard Admin)

Exclusiva para administradores (protegida por `AuthGuard`). Uma visão tabular para controle rápido do cardápio.

**Conteúdo da Tela:**
- Botão **"Novo Prato"**: Direciona para o formulário de cadastro.
- **Tabela de Pratos:**
  - Colunas: Nome, Categoria, Preço, Disponível.
  - Ações: **Toggle** (MatSlideToggle) para alternar disponibilidade, ícones para **Editar** (Lápis) e **Excluir** (Lixeira com Modal de confirmação via Angular Material).
- **Status de Autenticação:** Botão de "Sair" (Logout).

---

### 4. Formulário de CRUD (Cadastro/Edição de Pratos)

Onde as regras de validação são aplicadas via `FormGroup`.

| Campo | Tipo de Input | Conteúdo / Regra |
|---|---|---|
| Nome do Prato | `text` | `Validators.required` |
| Categoria | `select` | Opções: Entrada, Prato Principal, Sobremesa, Bebida |
| Preço (R$) | `number` | `Validators.required`, `Validators.min(0.01)` |
| Descrição | `textarea` | Ingredientes e informações adicionais do prato |
| Disponível | `toggle` (MatSlideToggle) | Valor booleano; padrão `true` ao cadastrar |

**Lógica de Validação no Angular:**
Utilize `[ngClass]="{'indisponivel': !prato.disponivel}"` no template da tela pública para aplicar automaticamente a classe CSS de opacidade reduzida aos pratos desativados. No CRUD, a ação de alternar o toggle deve chamar um método no `MenuService` que atualiza o campo `disponivel` do prato via `PATCH` na API, refletindo a mudança imediatamente na tela pública.

---

### Estrutura Técnica Sugerida

```
guards/         → auth.guard.ts
interceptors/   → auth.interceptor.ts
services/       → auth.service.ts, menu.service.ts
components/     → dish-card/, navbar/
pages/          → login/, menu-public/, admin/dashboard/, admin/dish-form/
```

**Comandos para criar os arquivos:**

```bash
# 1. Criar o projeto
npx ng new chefs-menu --ssr --style=css --routing

# 2. Adicionar Angular Material
npx ng add @angular/material

# 3. Serviços
npx ng generate service services/auth
npx ng generate service services/menu

# 4. Functional Guard
npx ng generate guard guards/auth --type=canActivate

# 5. Componentes Standalone
npx ng generate component components/navbar
npx ng generate component components/dish-card
npx ng generate component pages/login
npx ng generate component pages/menu-public
npx ng generate component pages/admin/dashboard
npx ng generate component pages/admin/dish-form

# 6. Interceptor
npx ng generate interceptor interceptors/auth

# 7. Executar o projeto
npx ng serve
```

**API URL:** `apiUrl: ""`


# Fitness Hub: Gestão de Planos e Treinos

Um sistema interno para academias ou estúdios de personal trainer gerenciarem seus planos de assinatura e a lista de modalidades oferecidas.

**Funcionalidades:**
- Tela de login com rota protegida: Acesso restrito para recepcionistas e gestores.
- CRUD de Planos e Modalidades: Gerenciar nome, descrição, preço e frequência semanal.
- Filtro por nome ou faixa de preço: Facilitar a busca por planos e modalidades específicos.
- Validação ao cadastrar: Impedir preço zerado e descrição abaixo do tamanho mínimo.
- Tela pública: Vitrine visual dos planos e modalidades disponíveis para novos clientes.

Para estruturar o Fitness Hub no Angular, é ideal separar as responsabilidades em componentes claros, utilizando Reactive Forms para as validações e Route Guards para a proteção das rotas. Crie um componente reutilizável `PlanCardComponent` para exibir os cards dos planos na tela pública, recebendo os dados via `@Input()`. Utilize o `CurrencyPipe` para formatar os preços no padrão BRL (`R$`) e o operador `debounceTime` do RxJS para controlar a busca por faixa de preço sem disparar requisições excessivas.

Abaixo, descrevemos os campos e o conteúdo sugerido para cada tela:

## 1. Tela de Login (Acesso Restrito)

Esta tela é o portão de entrada para recepcionistas e gestores. Deve ser simples e focar na captura de credenciais.

| Campo | Tipo de Input | Validações |
|---|---|---|
| E-mail | `email` | `Validators.required`, `Validators.email` |
| Senha | `password` | `Validators.required`, `Validators.minLength(6)` |

**Conteúdo Adicional:**
- Botão de "Entrar".
- Mensagens de erro dinâmicas (ex: "Usuário ou senha inválidos").

---

## 2. Tela Pública: Vitrine de Planos e Modalidades

A vitrine do sistema. O objetivo aqui é apresentar os planos e modalidades para atrair novos clientes.

**Conteúdo da Tela:**
- **Barra de Busca:** Campo de texto para filtrar por nome da modalidade, com `debounceTime(300ms)` via RxJS.
- **Filtro por Faixa de Preço:** Dois campos numéricos (De / Até) para delimitar o intervalo de preço dos planos.
- **Seção de Planos (`PlanCardComponent`):** Grid de cards com os planos de assinatura disponíveis, exibindo:
  - Nome do Plano, Preço formatado com `CurrencyPipe` (BRL), Descrição e Frequência Semanal.
  - Badge de destaque para o plano "VIP".
  - Botão "Quero me Matricular": Abre um modal ou exibe o contato da academia.
- **Seção de Modalidades:** Lista ou grid visual com as modalidades oferecidas (ex: Crossfit, Yoga, Musculação), exibindo nome e descrição de cada uma.

---

## 3. Tela de Gerenciamento (Dashboard Admin)

Exclusiva para recepcionistas e gestores (protegida por `AuthGuard`). Uma visão tabular para controle rápido dos planos e modalidades cadastradas.

**Conteúdo da Tela:**
- Botões **"Novo Plano"** e **"Nova Modalidade"**: Direcionam para seus respectivos formulários de cadastro.
- **Tabela de Planos:**
  - Colunas: Nome, Preço, Frequência Semanal, Status.
  - Ações: Ícones para **Editar** (Lápis) e **Excluir** (Lixeira).
- **Tabela de Modalidades:**
  - Colunas: Nome, Descrição, Status.
  - Ações: Ícones para **Editar** (Lápis) e **Excluir** (Lixeira).
- **Status de Autenticação:** Botão de "Sair" (Logout).

---

## 4. Formulário de CRUD (Cadastro/Edição de Planos)

Onde as regras de validação dos planos são aplicadas via `FormGroup`.

| Campo | Tipo de Input | Conteúdo / Regra |
|---|---|---|
| Nome do Plano | `text` | `Validators.required` |
| Tipo | `select` | Opções: Mensal, Semestral, Anual, VIP |
| Preço (R$) | `number` | `Validators.required`, `Validators.min(0.01)` |
| Frequência Semanal | `number` | `Validators.required`, `Validators.min(1)`, `Validators.max(7)` |
| Descrição | `textarea` | `Validators.required`, `Validators.minLength(20)` |

## 5. Formulário de CRUD (Cadastro/Edição de Modalidades)

Onde as regras de validação das modalidades são aplicadas via `FormGroup`.

| Campo | Tipo de Input | Conteúdo / Regra |
|---|---|---|
| Nome da Modalidade | `text` | `Validators.required` |
| Descrição | `textarea` | `Validators.required`, `Validators.minLength(20)` |
| Nível | `select` | Opções: Iniciante, Intermediário, Avançado, Todos os Níveis |
| Status | `select` | Opções: Ativa, Inativa |

**Lógica de Validação no Angular:**
Utilize `Validators.min(0.01)` no campo Preço para garantir que nenhum plano seja cadastrado gratuitamente por engano. Aplique `Validators.minLength(20)` no campo Descrição tanto em Planos quanto em Modalidades, exibindo a mensagem de erro de forma reativa no template (ex: "A descrição deve ter pelo menos 20 caracteres"). Para o filtro de faixa de preço, use um `FormGroup` separado com os campos `precoMin` e `precoMax`, e combine-os com o operador `combineLatest` do RxJS para atualizar a listagem sempre que um dos dois valores mudar.

---

## Estrutura Técnica Sugerida

```
guards/         → auth.guard.ts
interceptors/   → auth.interceptor.ts
services/       → auth.service.ts, plan.service.ts, modality.service.ts
components/     → plan-card/, navbar/
pages/          → login/, public-showcase/, admin/dashboard/, admin/plan-form/, admin/modality-form/
```

**Comandos para criar os arquivos:**

```bash
# 1. Criar o projeto
npx ng new fitness-hub --ssr --style=css --routing

# 2. Serviços
npx ng generate service services/auth
npx ng generate service services/plan
npx ng generate service services/modality

# 3. Functional Guard
npx ng generate guard guards/auth --type=canActivate

# 4. Componentes Standalone
npx ng generate component components/navbar
npx ng generate component components/plan-card
npx ng generate component pages/login
npx ng generate component pages/public-showcase
npx ng generate component pages/admin/dashboard
npx ng generate component pages/admin/plan-form
npx ng generate component pages/admin/modality-form

# 5. Interceptor
npx ng generate interceptor interceptors/auth

# 6. Executar o projeto
npx ng serve
```

**API URL:** `apiUrl: ""`


## Event-it
Uma plataforma para organizar workshops, palestras e conferências acadêmicas ou corporativas.
Funcionalidades: 
Tela de login com rota protegida: Acesso restrito para organizadores. 
CRUD de eventos: Gerenciar nome, data, local, descrição e limite de vagas. 
Filtro por categoria ou data: Facilitar a busca por eventos específicos. 
Validação ao cadastrar: Impedir datas retroativas ou campos vazios. 
Tela pública: Listagem dos eventos disponíveis para inscrição.
Para estruturar o Event-IT no Angular, é ideal separar as responsabilidades em componentes claros, utilizando Reactive Forms para as validações e Route Guards para a proteção das rotas.
Abaixo, descrevo os campos e o conteúdo sugerido para cada tela:

1. Tela de Login (Acesso Restrito)
Esta tela é o portão de entrada para os organizadores. Deve ser simples e focar na captura de credenciais.
Campo, Tipo de Input e Validações: o campo de E-mail utiliza input do tipo email e possui as validações Validators.required e Validators.email. Já o campo de Senha utiliza input do tipo password, com as validações Validators.required e Validators.minLength(6).
Conteúdo Adicional:
Botão de "Entrar".
Mensagens de erro dinâmicas (ex: "Usuário ou senha inválidos").

2. Tela Pública: Listagem de Eventos
A vitrine do sistema. O objetivo aqui é a inscrição.
Conteúdo da Tela:
Barra de Busca: Campo de texto para filtrar pelo nome do evento.
Filtros Rápidos: Dropdown de Categoria (ex: Workshop, Palestra, Congresso).
Grid de Cards: Cada card representando um evento com:
Título, Data/Hora, Local e uma breve descrição.
Badge de "Vagas Esgotadas" caso o limite tenha sido atingido.
Botão de Inscrição: Abre um modal ou redireciona para confirmação de dados do participante.

3. Tela de Gerenciamento (Dashboard Admin)
Exclusiva para organizadores (protegida por AuthGuard). Uma visão tabular para controle rápido.
Conteúdo da Tela:
Botão "Novo Evento": Direciona para o formulário de cadastro.
Tabela de Eventos:
Colunas: Nome, Data, Vagas Ocupadas/Totais, Status.
Ações: Ícones para Editar (Lápis) e Excluir (Lixeira).
Status de Autenticação: Botão de "Sair" (Logout).

4. Formulário de CRUD (Cadastro/Edição de Eventos)
Onde as regras de negócio de validação são aplicadas via FormGroup.
Campo, Tipo de Input e Conteúdo/Regra: o campo Nome do Evento utiliza input do tipo text e possui a validação Validators.required. O campo Categoria utiliza um select com opções como Workshop, Palestra, Conferência, entre outras. O campo Data e Hora utiliza input do tipo datetime-local e conta com uma validação customizada para impedir datas retroativas. Já o campo Local utiliza input do tipo text, permitindo informar um endereço físico ou um link para evento online. O campo Descrição utiliza um textarea para detalhar o que será abordado no evento. Por fim, o campo Limite de Vagas utiliza input do tipo number, com as validações Validators.required e Validators.min(1).

Lógica de Validação no Angular:
Utilize um Validator customizado para comparar a new Date() com o valor inserido no campo de data, garantindo que o evento não seja criado no passado.

Estrutura Técnica Sugerida:
Para manter o projeto organizado, considere a seguinte estrutura de pastas:
guards/: auth.guard.ts para verificar se o token de acesso existe antes de entrar nas rotas de CRUD.
interceptors/: Para anexar o token JWT automaticamente em cada requisição ao backend.
services/: EventService para chamadas de API e AuthService para login/logout.
components/: Componentes reutilizáveis como botões, inputs estilizados e o Card de evento.
Comandos para criar os arquivos:
# 1. Criar o projeto com SSR (Server-Side Rendering) e sem Módulos
npx ng new event-it --ssr --style=css --routing

# 2. Serviços (Singleton por padrão)
npx ng generate service services/auth
npx ng generate service services/event

# 3. Functional Guard (A nova regra: Guards agora são funções, não classes)
npx ng generate guard guards/auth --type=canActivate

# 4. Componentes Standalone (Páginas e UI)
npx ng generate component components/navbar
npx ng generate component pages/login
npx ng generate component pages/event-list
npx ng generate component pages/admin/dashboard
npx ng generate component pages/admin/event-form

# 5. Interceptor Funcional (Para tokens JWT)
npx ng generate interceptor interceptors/auth

#6. Executar o projeto
npx ng serve