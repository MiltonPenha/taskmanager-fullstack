# Task Manager Fullstack

Aplicacao web fullstack para gerenciamento de tarefas com autenticacao de usuario, paginas protegidas e CRUD completo de tarefas.

## Tecnologias

- Frontend: Next.js, React, TypeScript e Tailwind CSS
- Backend: NestJS, TypeScript, JWT, bcrypt e class-validator
- Banco de dados: PostgreSQL no Supabase
- ORM: Prisma
- Testes: Jest
- Versionamento: Git e GitHub

## Estrutura

```txt
taskmanager-fullstack/
  backend/
  frontend/
  README.md
```

## Funcionalidades

- Cadastro e login de usuario
- Logout
- Protecao do dashboard por token JWT
- Listagem das tarefas do usuario autenticado
- Criacao, edicao, exclusao e alternancia de status da tarefa
- Filtro por status: todas, pendentes e concluidas
- Busca por titulo
- Feedback visual para carregamento, sucesso e erro
- Layout responsivo para desktop e mobile
- Testes unitarios para services principais do backend

## Banco de dados no Supabase

1. Crie um projeto no Supabase.
2. Acesse `Project Settings > Database`.
3. Copie a connection string PostgreSQL.
4. No backend, crie o arquivo `.env` com base em `backend/.env.example`.

Exemplo:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/postgres?schema=public"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="1d"
PORT=3001
FRONTEND_URL=http://localhost:3000
```

## Como rodar o backend

```bash
cd backend
npm install
cp .env.example .env
npx prisma generate
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

O backend roda em `http://localhost:3001`.

## Rotas principais do backend

Auth:

- `POST /auth/register`
- `POST /auth/login`

Tasks:

- `GET /tasks`
- `POST /tasks`
- `PATCH /tasks/:id`
- `DELETE /tasks/:id`
- `PATCH /tasks/:id/toggle`

Filtros:

```txt
GET /tasks?status=PENDING&search=estudar
```

## Como rodar o frontend

```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

O frontend roda em `http://localhost:3000`.

Variavel do frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Usuario de teste

Depois de rodar `npm run prisma:seed` no backend:

- Email: `test@example.com`
- Senha: `password123`

## Testes

```bash
cd backend
npm test
```

Os testes cobrem:

- Registro com senha criptografada
- Login com credenciais validas e invalidas
- Listagem de tarefas por usuario autenticado
- Criacao de tarefa vinculada ao usuario
- Bloqueio de edicao de tarefa de outro usuario
- Alternancia de status da tarefa

## Build

Backend:

```bash
cd backend
npm run build
```

Frontend:

```bash
cd frontend
npm run build
```

## Deploy

O projeto esta preparado para deploy separando backend e frontend.

Sugestao:

- Backend: Render, Railway ou Fly.io
- Frontend: Vercel
- Banco: Supabase PostgreSQL

Variaveis necessarias no backend em producao:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `FRONTEND_URL`

Variavel necessaria no frontend em producao:

- `NEXT_PUBLIC_API_URL`

Link de deploy: nao configurado neste ambiente.

## Como explicar a arquitetura

O backend foi separado em modulos `auth`, `users`, `tasks` e `prisma` para manter responsabilidades claras. O controller lida com HTTP, o service concentra regras de negocio e o Prisma centraliza o acesso ao banco.

A autenticacao usa JWT porque o frontend precisa enviar um token nas requisicoes protegidas. A senha e salva com hash bcrypt, nunca em texto puro.

As tarefas sempre sao consultadas usando `userId` do token autenticado. Isso garante que cada usuario liste, edite e exclua apenas as proprias tarefas.

No frontend, as chamadas HTTP ficam em `lib/api.ts`, os dados de autenticacao ficam em `lib/auth-storage.ts` e as telas usam esses helpers. Essa separacao facilita manutencao e explicacao em entrevista.
