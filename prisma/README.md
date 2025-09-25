# Prisma Module

Concise Prisma setup with a local Postgres 17 container. The project will NOT work until a `.env` file with `DATABASE_URL` is present in this folder (same directory as `package.json`).

## TL;DR (Quick Start)
```bash
# 1. Start database
docker compose up -d

# 2. Create environment file (required!)
cp .env.example .env   # then adjust if needed

# 3. Generate client + run first migration (creates tables)
npm install
npm run db:generate
npm run db:migrate

# 4. Inspect data (optional)
npm run db:studio
```

## Environment File (MANDATORY)
Create a `.env` file in this directory before running any Prisma command.

Required variable:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/myapp"
```

Provided for convenience: `.env.example` – copy it:

```bash
cp .env.example .env
```

You may change `myapp` (database) or credentials if you also change them in `docker-compose.yaml`.

### DATABASE_URL Format
```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### Common Errors
| Symptom | Cause | Fix |
|---------|-------|-----|
| `Error: P1003` | DB or schema missing | Run `docker compose up -d` then `npm run db:migrate` |
| `getaddrinfo ENOTFOUND` | Wrong host | Use `localhost` (or container network name if inside another container) |
| `Authentication failed` | Wrong user/pass | Match values in `docker-compose.yaml` |
| `Missing env var: DATABASE_URL` | `.env` not loaded | Ensure file is named `.env` and in this directory |

## Scripts
| Script | Action |
|--------|--------|
| `npm run db:generate` | Generate Prisma Client into `generated/prisma` |
| `npm run db:migrate` | Create/apply migration (interactive dev) |
| `npm run db:studio` | Launch Prisma Studio UI |
| `npm run db:all` | Generate, migrate, then open Studio |

## Migrations
First migration is already created in `prisma/migrations/`. To create a new one after schema changes:
```bash
npx prisma migrate dev --name <change_name>
```

To reset (drops & recreates, destructive):
```bash
npx prisma migrate reset
```

## Project Structure
```
prisma/
	package.json
	docker-compose.yaml
	prisma/
		schema.prisma       # data model (User)
		migrations/         # migration history
	generated/prisma/     # Prisma Client output (do not edit)
	README.md
	.env (you create this)
	.env.example
```

## Editing the Data Model
1. Modify `prisma/schema.prisma` (e.g., add fields or models).  
2. Run `npm run db:migrate` (names the migration & applies it).  
3. Run `npm run db:generate` (or just `db:migrate`, which also triggers generate).  
4. Use `db:studio` to inspect.

## Node / Tool Versions
Prisma 6.x requires Node 18+. Use an active LTS (18 or 20). Docker must be running for local Postgres.

## Troubleshooting Quick Reference
| Issue | Command to Try |
|-------|----------------|
| DB container not running | `docker compose ps` then `docker compose up -d` |
| Need fresh client | `npm run db:generate` |
| Changed schema no new table | `npm run db:migrate` |
| Want clean slate | `npx prisma migrate reset` |

## Security Note
Never commit a real production `DATABASE_URL`. Keep `.env` out of version control (ensure `.gitignore` includes it). Use `.env.example` for placeholders only.

## License
ISC

