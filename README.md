# Aggrandize Planner – Frontend (Next.js)

Frontend em **Next.js 14** (App Router) para o **Aggrandize Planner**, conectado à API FastAPI do backend.

## Pré-requisitos

- Node.js 18+
- Backend Aggrandize Planner rodando (por exemplo em `http://localhost:8000`)

## Instalação

```bash
pnpm install
```

## Configuração

Copie o arquivo de exemplo e ajuste a URL da API:

```bash
cp .env.example .env.local
```

Em `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Executar

```bash
# Desenvolvimento
pnpm dev

# Build
pnpm build

# Produção
pnpm start
```

O frontend sobe em **http://localhost:3000**.

## Estrutura

- `src/app/` – páginas e layout (App Router)
- `src/lib/api.ts` – cliente HTTP e tipos para a API do backend
- Autenticação via **Magic Link** (token JWT no `localStorage` após verificação)

## Páginas

| Rota | Descrição |
|------|-----------|
| `/` | Landing |
| `/login` | Login com Magic Link (e-mail) |
| `/auth/verify?token=...` | Verificação do link (após clicar no e-mail) |
| `/dashboard` | Lista de projetos |
| `/projects/[id]` | Detalhes do projeto (tarefas e membros) |

## Integração com o backend

A API está documentada em:

- **Swagger UI**: `http://localhost:8000/docs`
- **Regras de negócio**: `business_rules.md` no repositório do backend

Endpoints usados pelo frontend (conforme README do frontend original):

- **Auth**: `POST /auth/magic-link`, `POST /auth/verify`
- **Projetos**: `GET/POST /projects`, `GET /projects/{id}`
- **Tarefas**: criar, selecionar, completar, abandonar, relatório
- **Membros**: listar, remover, sair do projeto
- **Convites**: criar, aceitar
- **Papéis**: criar role

Se os paths ou payloads do backend forem diferentes, ajuste `src/lib/api.ts` de acordo com o Swagger (`/docs`).

## CORS

Se der erro de CORS ao chamar a API, configure o backend para aceitar a origem do frontend (ex.: `http://localhost:3000`).

## Licença

MIT
