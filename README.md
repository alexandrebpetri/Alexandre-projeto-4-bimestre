# Projeto: Alexandre - Projeto 3º Bimestre

Resumo do repositório de um sistema simples para gerenciamento de jogos, desenvolvedores, categorias e biblioteca de usuários. Backend em Node.js/Express com PostgreSQL; frontend composto por páginas estáticas em HTML/CSS/JS.

**Visão geral**
- **Backend:** código em `backend/` (API REST, acesso a banco Postgres).
- **Frontend:** arquivos estáticos em `frontend/` e páginas administrativas em `admin/`.
- **Banco de dados:** esquemas e criação em `data/tables.sql`.

**Tecnologias**
- Node.js
- Express
- PostgreSQL
- JavaScript (frontend)

**Pré-requisitos**
- Node.js (>= 14)
- npm
- PostgreSQL

**Instalação e execução (Windows / PowerShell)**

1) Instalar dependências do backend

```powershell
cd backend
npm install
```

2) Preparar o banco de dados

- Crie um banco PostgreSQL (ex: `alexandre_db`).
- Rode o script de criação de tabelas:

```powershell
# usando um banco já criado
psql -d alexandre_db -f ..\data\tables.sql

# ou usando uma connection string na variável de ambiente (exemplo):
$env:DATABASE_URL = "postgresql://usuario:senha@localhost:5432/alexandre_db"
psql "$env:DATABASE_URL" -f ..\data\tables.sql
```

3) Variáveis de ambiente

- O backend usa `dotenv`. As variáveis principais:
  - `DATABASE_URL` : connection string do Postgres (ex: `postgresql://user:pass@host:port/db`)
  - `JWT_SECRET` : segredo para tokens JWT (há um valor padrão interno, mas recomenda-se configurar)
  - `PORT` : porta para o servidor (opcional, padrão usado pelo código)

Coloque as variáveis em um arquivo `.env` dentro de `backend/`, por exemplo:

```text
DATABASE_URL=postgresql://user:pass@localhost:5432/alexandre_db
JWT_SECRET=uma_senha_segura
PORT=3000
```

4) Rodar o backend

```powershell
# a partir da pasta backend
npm run start    # executa node server/server.js
# ou, para desenvolvimento com mudanças automáticas (se tiver nodemon instalado globalmente):
npm run dev
```

5) Frontend

- As páginas públicas estão em `frontend/` e a página pública principal `index.html` está na raiz do projeto.
- Para testar localmente você pode abrir `index.html` no navegador ou servir a pasta `frontend` com um servidor estático. Exemplo usando `http-server` via npx:

```powershell
# a partir da raiz do repositório
npx http-server .\frontend -p 8080
# abra http://localhost:8080
```

6) Seeds e utilitários

- Há um script de seed/auxiliar `backend/seed_add_library.js`. Execute com:

```powershell
cd backend
node seed_add_library.js
```

- Scripts presentes em `backend/package.json`:
  - `start` : `node server/server.js`
  - `dev` : `nodemon server.js` (se nodemon estiver configurado)
  - `fix-sequences` : `node scripts/fix_sequences.js` (ajuste de sequences no Postgres)

**Estrutura do repositório (resumo)**
- `backend/` : API, controllers, rotas, configuração do DB
  - `backend/server/server.js` : ponto de entrada do servidor
  - `backend/config/db.js` : configuração da conexão com Postgres
  - `backend/controllers/` : controllers REST
  - `backend/routes/` : arquivos de rotas
- `frontend/` : páginas públicas (HTML/CSS/JS)
- `admin/` : páginas administrativas (HTML/CSS/JS)
- `data/tables.sql` : scripts SQL para criação/ajustes de tabelas e sequences

**Boas práticas e dicas**
- Use um `.env` para variáveis sensíveis; não comite esse arquivo.
- Para desenvolvimento local, prefira usar `npm run dev` com `nodemon` para reload automático.
- Se houver problemas com sequences/IDs no Postgres, rode `npm run fix-sequences` no `backend/`.

**Contato / Autor**
- Repositório por `alexandrebpetri`.
