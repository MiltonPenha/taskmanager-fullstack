# Task Manager Fullstack

Aplicacao fullstack para gerenciamento de tarefas com cadastro, login, rotas protegidas por JWT e CRUD de tarefas por usuario.

## Tecnologias

- Frontend: Next.js, React, TypeScript e Tailwind CSS
- Backend: NestJS, TypeScript, Prisma ORM e JWT
- Banco de dados: PostgreSQL via Docker
- Autenticacao: bcrypt para hash de senha e Bearer token JWT
- Testes: Jest no backend

## Funcionalidades

- Cadastro e login de usuario
- Logout
- Protecao das telas internas
- Listagem de tarefas do usuario autenticado
- Criacao, edicao, exclusao e alteracao de status de tarefas
- Status `pending` e `done`
- Busca por titulo
- Filtro por status
- Feedback visual para acoes
- Layout responsivo para desktop e mobile

## Requisitos

- Node.js 20 ou superior
- Docker e Docker Compose
- npm

## Como rodar o projeto

Clone o repositorio e instale as dependencias:

```bash
git clone https://github.com/MiltonPenha/taskmanager-fullstack.git
cd taskmanager-fullstack
npm install
```

Suba o PostgreSQL:

```bash
docker compose up -d
```

Configure o backend:

```bash
cd backend
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run start:dev
```

Em outro terminal, configure e rode o frontend:

```bash
cd frontend
cp .env.example .env.local
npm run dev
```

Acesse:

- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- PostgreSQL: localhost:5432

## Acesso ao sistema

A aplicacao possui tela de cadastro. Crie um usuario em `/register` e use esse mesmo e-mail e senha para acessar o dashboard.

Exemplo para teste:

- Nome: Milton Penha
- E-mail: milton@example.com
- Senha: 123456

## Variaveis de ambiente

Backend (`backend/.env`):

```env
DATABASE_URL="postgresql://taskmanager:taskmanager@localhost:5432/taskmanager?schema=public"
JWT_SECRET="replace-with-a-secure-secret"
JWT_EXPIRES_IN="1d"
PORT=3001
FRONTEND_URL="http://localhost:3000"
```

Frontend (`frontend/.env.local`):

```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

## Scripts uteis

Na raiz do projeto:

```bash
npm run dev:backend
npm run dev:frontend
npm run build
npm run test
```

No backend:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:studio
npm run test
```

## Estrutura do projeto

```text
backend/
  prisma/
  src/
    auth/
    prisma/
    tasks/
frontend/
  app/
  components/
  services/
  types/
```

## Observacoes de implementacao

- O backend nunca retorna senhas nas respostas de autenticacao.
- Todas as rotas de tarefas usam o `userId` extraido do JWT.
- O usuario so visualiza, edita ou exclui tarefas criadas por ele.
- Os DTOs do NestJS validam entradas basicas antes de chegar aos services.
- O frontend concentra as chamadas HTTP em `frontend/services/api.ts`.

## Resposta sugerida para o e-mail de entrega

Ola,

Segue o projeto desenvolvido:

Repositorio: https://github.com/MiltonPenha/taskmanager-fullstack

Instrucoes de acesso:

1. Rodar `npm install` na raiz do projeto.
2. Rodar `docker compose up -d`.
3. No backend, copiar `.env.example` para `.env`, rodar `npm run prisma:generate`, `npm run prisma:migrate` e `npm run start:dev`.
4. No frontend, copiar `.env.example` para `.env.local` e rodar `npm run dev`.
5. Acessar `http://localhost:3000`.

Usuario e senha:

- A aplicacao possui cadastro. Pode ser criado um usuario na tela `/register`.
- Exemplo: `milton@example.com` / `123456`.

Tecnologias utilizadas: Next.js com TypeScript e Tailwind no frontend, NestJS com TypeScript no backend, PostgreSQL com Prisma ORM, bcrypt para criptografia de senha e JWT para autenticacao.

