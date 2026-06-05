# Aggrandize Planner

Frontend em **Next.js 14** com **TypeScript**, construído como um case front-end com foco em experiência, clareza de produto e zero custo de infraestrutura. O app funciona com **dados mockados persistidos no navegador**, sem depender de API ou banco para rodar.

Este projeto foi desenvolvido com base no repositório **[LuisHBarros/orchestra-planner](https://github.com/LuisHBarros/orchestra-planner)**, reinterpretando a proposta original em uma nova implementação front-end com Next.js.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Zustand**
- **React Hook Form**
- **Zod**
- **lucide-react**
- componentes reutilizáveis em estilo **shadcn/ui**

## O que o projeto entrega

- landing page de produto com identidade visual da Aggrandize
- login com **magic link simulado**
- feedback visual ao copiar o link de acesso
- dashboard com busca, métricas e priorização de projetos
- detalhe do projeto com tarefas, equipe, atividade recente e updates
- persistência local com Zustand
- validação de formulários com Zod
- arquitetura preparada para trocar mocks por API real depois

## Rotas principais

| Rota | Descrição |
|------|-----------|
| `/` | Landing com proposta de valor e visão geral do produto |
| `/login` | Geração do link de acesso simulado |
| `/auth/verify?token=...` | Validação do token local e entrada no workspace |
| `/dashboard` | Visão executiva com busca, métricas e projetos priorizados |
| `/projects/[id]` | Gestão de tarefas, equipe, atividade recente e updates |

## Como executar

### Pré-requisitos

- Node.js 18+
- pnpm

### Instalação

```bash
pnpm install
```

### Desenvolvimento

```bash
pnpm dev
```

O app sobe em **http://localhost:3000**.

### Build de produção

```bash
pnpm build
pnpm start
```

## Estrutura

- `src/app/` - páginas, rotas e layout
- `src/components/` - componentes de interface e shell da aplicação
- `src/lib/mock-data.ts` - dados seed do workspace
- `src/lib/api.ts` - camada de serviços mockados
- `src/lib/store.ts` - estado global com Zustand
- `src/lib/utils.ts` - utilitários e formatadores

## Dados mockados

- o estado fica salvo localmente no navegador
- o botão **Reiniciar demo** restaura o workspace inicial
- o login é simulado e não envia e-mail real
- a camada de serviço está separada da UI para facilitar integração futura com backend

## Decisões do projeto

- **mock persistido** para eliminar custo, dependência externa e risco de indisponibilidade
- **Zustand** para demonstrar gerenciamento de estado simples e previsível
- **React Hook Form + Zod** para validação tipada e fluxo de formulário mais robusto
- **design system leve** com componentes reutilizáveis e consistentes com a marca

## Licença

MIT
