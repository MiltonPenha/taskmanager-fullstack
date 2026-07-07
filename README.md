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

Exemplo usando a connection string direta do Supabase:

```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.ewystfwehfuezwnaswkq.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.ewystfwehfuezwnaswkq.supabase.co:5432/postgres"
JWT_SECRET="your-super-secret-key"
JWT_EXPIRES_IN="1d"
PORT=3001
FRONTEND_URL=http://localhost:3000
```

Use a senha real do banco no lugar de `[YOUR-PASSWORD]`. Caso a senha tenha caracteres especiais, aplique percent-encode antes de colocar na URL.

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
