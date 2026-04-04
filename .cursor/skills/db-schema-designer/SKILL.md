---
name: db-schema-designer
description: >
  Designs production-grade, scalable, lightning-fast database schemas from any project description,
  wireframe, spec document, or conversation. Use this skill whenever the user asks about database
  design, schema creation, ERD generation, table structure, data modeling, or wants to know
  "what database should I use". Also trigger for questions like "how should I store X", "what's
  the best schema for Y", "design my database", "create SQL for my project", "what indexes do I
  need", or any time a new feature, project, or app is described and persistence/storage is implied.
  Produces: DB recommendation with justification, complete normalized schema, full SQL DDL,
  ERD diagram, index strategy, and scaling roadmap — all in one pass.
---

# Database Schema Designer

You are a senior database architect. When this skill triggers, your job is to deliver a
production-ready schema that is correct today and won't need to be thrown away at scale.

Read `references/databases.md` before choosing a database if the project has unusual requirements
(event sourcing, graph traversal, heavy geospatial, real-time sync). For standard web/mobile apps,
the decision logic below is sufficient.

---

## Phase 1 — Extract requirements

Before writing a single table, extract these from the user's project description, files, or
wireframes:

**Entities** — What "nouns" does the app manage? (users, orders, products, posts…)  
**Relationships** — How do entities connect? (one-to-many, many-to-many, self-referential)  
**Access patterns** — What are the most common reads and writes? ("find all orders by user",
"search products by keyword", "latest 20 messages in a thread")  
**Scale signals** — Any mention of user counts, data volume, geographic distribution, or
real-time requirements?  
**Constraints** — Financial data? Healthcare/PII? Multi-tenancy? Soft deletes required?

If the user gives you a screenshot, wireframe, or document, extract entities from every visible
noun (form fields, list items, navigation tabs, sidebar items) — these almost always map to tables.

If critical information is missing and cannot be inferred, ask **one** focused question before
proceeding. Don't ask a list of questions — make your best inference and note your assumptions.

---

## Phase 2 — Choose the database

Apply this decision tree and **explain your reasoning** to the user:

```
Primary question: Is this OLTP (app reads/writes) or OLAP (analytics/reporting)?

OLTP path:
├── Highly relational data with complex joins?          → PostgreSQL (default winner)
├── Simple key-value or session storage?                → Redis (as cache layer)
├── Massive write throughput, flexible schema needed?   → MongoDB (document store)
├── Mobile-first with offline sync?                     → SQLite + sync layer
└── Multi-region, global consistency required?          → CockroachDB or PlanetScale

OLAP path:
├── <100GB, internal analytics?                         → PostgreSQL + pg_analytics
└── >100GB, complex aggregations?                       → ClickHouse or BigQuery

Special cases (read references/databases.md):
├── Graph traversal is core to the app?                 → Neo4j / Amazon Neptune
├── Real-time collaborative / sync?                     → Supabase / Firestore
├── Time-series data dominant?                          → TimescaleDB
└── Search is the primary feature?                      → Elasticsearch + PostgreSQL
```

**For most web/mobile apps, PostgreSQL is the correct answer.** It handles relational data,
full-text search, JSON documents, geospatial queries, and time-series well enough to avoid
introducing a second database. Only recommend a different database when PostgreSQL genuinely
cannot handle the use case, not just because another tool is fashionable.

Always recommend a **caching layer** (Redis) separately if the app will have >1k concurrent
users or has hot read paths (e.g., product catalog, user profile).

---

## Phase 3 — Design the schema

### Normalization rules

Start at **3NF (Third Normal Form)** by default:
- Every non-key column depends on the primary key, the whole key, and nothing but the key
- No repeating groups — arrays of values always become a join table
- Derived values (totals, counts, age) are NOT stored unless performance demands it

**When to intentionally denormalize:**
- Read-to-write ratio is >100:1 on that data
- The join would cross a partition boundary at scale
- It's a reporting/analytics table (OLAP) not a transactional one (OLTP)

Always document deliberate denormalization with a `-- DENORMALIZED: reason` comment in the DDL.

### Column design rules

**Primary keys:** Always use `UUID` (or `ULID` for sortable IDs). Never use auto-increment integers
as PKs for anything user-facing — they leak row counts and are not portable across shards.

```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
```

**Timestamps:** Every table gets these two:
```sql
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
```
Add a trigger or application-level hook to update `updated_at` on every write.

**Soft deletes:** If data must be recoverable or audited, add:
```sql
deleted_at TIMESTAMPTZ DEFAULT NULL
```
Then all queries filter `WHERE deleted_at IS NULL`. Add a partial index on this.

**Enums:** Use PostgreSQL `ENUM` types or a `CHECK` constraint for small, stable value sets
(status, role, type). Use a lookup table for value sets that admins need to change at runtime.

**Monetary values:** NEVER use `FLOAT` or `DECIMAL` for money. Use `BIGINT` (store cents/pence)
or `NUMERIC(19,4)` for currencies that have sub-cent precision.

**Nullable columns:** Make columns NOT NULL by default. Only allow NULL when "no value" is a
genuinely meaningful state distinct from empty string or zero.

### Relationship patterns

**One-to-many** (user → posts): FK on the child table.
```sql
user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE
```

**Many-to-many** (posts ↔ tags): Always use a named junction table, never an array column.
```sql
CREATE TABLE post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id  UUID NOT NULL REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

**Self-referential** (categories, org charts, threaded comments): Add a nullable `parent_id` FK
pointing back to the same table. Use `ltree` extension in PostgreSQL for deep hierarchies.

**Polymorphic associations** (a comment can belong to a post OR a video): Use separate FKs per
type (preferred) or a `target_type` + `target_id` pattern with a partial index per type.

---

## Phase 4 — Index strategy

Indexes are the #1 lever for query performance. Apply these rules:

### Always create
```sql
-- Every FK column that will be used in JOINs or WHERE clauses
CREATE INDEX idx_{table}_{col} ON {table}({col});

-- Columns used in ORDER BY with pagination
CREATE INDEX idx_{table}_created_at ON {table}(created_at DESC);

-- Composite: most-selective column first, then ordering column
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
```

### Conditionally create

**Soft deletes** — partial index so live-row queries skip deleted rows entirely:
```sql
CREATE INDEX idx_{table}_active ON {table}(id) WHERE deleted_at IS NULL;
```

**Full-text search** — GIN index for PostgreSQL full-text:
```sql
CREATE INDEX idx_{table}_search ON {table} USING GIN(to_tsvector('english', col));
```

**JSONB queries** — GIN index if you query inside JSONB columns:
```sql
CREATE INDEX idx_{table}_meta ON {table} USING GIN(metadata jsonb_path_ops);
```

**Unique constraints** — use `CREATE UNIQUE INDEX` not just `UNIQUE` on the column, so you
can add `WHERE` clauses (partial unique indexes):
```sql
CREATE UNIQUE INDEX idx_users_email_active ON users(email) WHERE deleted_at IS NULL;
```

### Index anti-patterns to avoid
- Do NOT index every column — each index adds write overhead
- Do NOT index low-cardinality columns alone (boolean, small enums) — use composite indexes
- Do NOT use multi-column indexes with more than 3-4 columns

---

## Phase 5 — Scalability provisions

Even if the app starts small, bake these in from day one so you never have to migrate off them:

### Row-level multi-tenancy
If this is a SaaS app, add `org_id UUID NOT NULL` to every tenant-scoped table and include it
as the first column in every composite index. This enables both logical isolation and eventual
physical sharding by tenant.

### Partitioning hints
For tables that will exceed ~50M rows, note which column to partition on:
- Time-series / event data → `PARTITION BY RANGE (created_at)` (monthly partitions)
- Multi-tenant data → `PARTITION BY LIST (org_id)`
- Geographic data → `PARTITION BY LIST (region)`

Include a comment in the DDL but don't implement partitioning in the initial schema unless the
user confirms they need it now.

### Connection pooling note
Always remind the user to use PgBouncer or a managed pooler (Supabase Pooler, RDS Proxy) in
front of PostgreSQL. PostgreSQL's max connections is a hard ceiling and each connection uses ~5MB
of memory.

### Read replicas
Call out which tables/queries are the best candidates for read replicas:
- Heavy reporting queries
- Search/listing endpoints with high QPS
- Analytics aggregations

---

## Phase 6 — Deliverables

Produce all four outputs in sequence:

### 1. Database recommendation
One paragraph: chosen database, why it wins for this project, and what the main trade-offs are.
If recommending a second database (e.g., Redis cache), explain the split clearly.

### 2. ERD diagram
Render an interactive ERD using mermaid.js inside an HTML artifact. Follow the ERD rendering
pattern from the visualizer read_me (diagram module). Show all tables, columns with types,
primary/foreign keys, and cardinality.

Use the mermaid `erDiagram` syntax. Group related tables visually when possible. Every FK
relationship must appear as a line with correct crow's-foot notation.

### 3. Full SQL DDL
Write complete, executable SQL for the chosen database. Structure it in this order:

```sql
-- ============================================================
-- EXTENSIONS (if PostgreSQL)
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";    -- trigram search
-- add others as needed

-- ============================================================
-- ENUM TYPES
-- ============================================================
-- (define all custom types before tables)

-- ============================================================
-- TABLES
-- (ordered so FKs reference already-created tables)
-- ============================================================

-- ============================================================
-- INDEXES
-- ============================================================

-- ============================================================
-- TRIGGERS
-- (updated_at auto-update, audit logs, etc.)
-- ============================================================
```

Every table must include a brief comment explaining its purpose:
```sql
-- Stores authenticated users (patients, admins, staff)
CREATE TABLE users ( ... );
```

### 4. Performance & scaling cheatsheet
A concise bullet list of:
- The 3-5 most critical indexes and why
- Which queries will be fast vs. which will need caching
- Partitioning recommendation (when to add it)
- Suggested Redis caching keys for hot paths
- Connection pooling recommendation

---

## Output format

Always present in this order:
1. **Database choice** — conversational paragraph with rationale
2. **ERD** — rendered diagram (mermaid in HTML artifact)
3. **SQL DDL** — code artifact with full schema
4. **Cheatsheet** — brief performance notes

Never skip the SQL DDL. Never skip the ERD. The user needs both to actually implement this.

If the project is large (>15 tables), split the ERD into two diagrams: one showing the core
domain (users, core entities, primary relationships) and one showing supporting tables (content,
config, audit). Explain the split.

---

## Quality checklist

Before finalizing, verify:
- [ ] Every table has `id`, `created_at`, `updated_at`
- [ ] No `FLOAT` for money
- [ ] No array columns for multi-value relationships (use junction tables)
- [ ] Every FK has an index
- [ ] Soft-delete tables have a partial unique index on the natural key
- [ ] Enum values are documented in comments
- [ ] Multi-tenant tables have `org_id` if this is SaaS
- [ ] Connection pooling note included
- [ ] At least one full-text search index if the app has search