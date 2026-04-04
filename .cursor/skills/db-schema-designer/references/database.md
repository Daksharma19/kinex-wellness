# Database Reference Guide

Read this file when the project has non-standard requirements that the main SKILL.md decision
tree doesn't fully cover, or when the user asks "why not X?" and you need detailed trade-off info.

## Table of Contents
1. PostgreSQL — when it wins and when it doesn't
2. MongoDB — document store trade-offs
3. Redis — caching patterns
4. MySQL / MariaDB — when to choose over Postgres
5. CockroachDB / PlanetScale — distributed SQL
6. ClickHouse — OLAP workloads
7. TimescaleDB — time-series
8. Elasticsearch — search-first apps
9. Neo4j — graph databases
10. Firestore / Supabase — real-time sync
11. SQLite — embedded / edge

---

## 1. PostgreSQL

**Wins when:**
- Relational data with complex JOINs
- ACID compliance required (finance, healthcare, e-commerce)
- Full-text search needed without a separate service
- JSONB semi-structured data alongside relational
- Geospatial queries (PostGIS extension)
- You want one database that does everything reasonably well

**Doesn't win when:**
- Pure key-value caching → use Redis
- Sub-10ms p99 writes at >100k TPS → consider ClickHouse or Cassandra
- Offline-first mobile → SQLite
- Graph traversal >3 hops is the core feature → Neo4j

**Critical extensions to recommend:**
- `pgcrypto` — UUID generation, encryption
- `pg_trgm` — trigram similarity search (fuzzy matching)
- `pg_stat_statements` — query performance monitoring (always enable)
- `PostGIS` — if geospatial queries are needed
- `pg_partman` — automated partition management
- `timescaledb` — if time-series queries dominate

**Connection limits:** Default max_connections=100. Each connection ~5MB RAM. For apps with
many concurrent users, PgBouncer in transaction mode is non-negotiable. Recommended pool sizes:
- Transaction pooling: 20-50 server connections per app server
- Session pooling: only for long-running background workers

---

## 2. MongoDB

**Wins when:**
- Schema varies heavily per document (CMS, product catalogs with very different attribute sets)
- Hierarchical/nested data that would require many JOINs to reassemble
- Team is already on Node.js and comfortable with document model
- Prototyping fast and schema is genuinely unknown

**Doesn't win when:**
- Data is highly relational (many-to-many, complex JOINs) — Mongo handles this poorly
- ACID transactions across documents are required — Postgres is more battle-tested
- Team needs ad-hoc SQL queries — Mongo's query language has a steeper learning curve
- Reporting/analytics — SQL wins

**Trade-off to call out:** MongoDB's flexible schema is both its superpower and its biggest
footgun. Without schema validation, production collections accumulate inconsistent documents.
Always enforce a JSON Schema validator at the collection level.

---

## 3. Redis

**Never use as the primary database.** Use as:

**Cache layer:**
```
Key pattern:  cache:{entity}:{id}
Example:      cache:user:550e8400
TTL:          300-3600 seconds depending on staleness tolerance
Eviction:     allkeys-lru
```

**Session store:**
```
Key pattern:  session:{session_token}
TTL:          Match auth token expiry
```

**Rate limiting:**
```
Key pattern:  ratelimit:{user_id}:{endpoint}:{window}
Structure:    INCR + EXPIRE (sliding window)
```

**Job queues:** Use Redis Streams or BullMQ (Node.js) for background job queues.

**Pub/Sub:** Real-time notifications, live dashboards. Not durable — if the subscriber is
offline when a message is published, it misses it. Use Redis Streams for durable delivery.

---

## 4. MySQL / MariaDB

Choose over PostgreSQL only when:
- Existing team has deep MySQL expertise and switching costs are real
- Using Vitess/PlanetScale for horizontal sharding (MySQL-compatible)
- WordPress or other MySQL-only tools are in the stack

MySQL limitations to know:
- No partial indexes (PostgreSQL wins here)
- `TEXT` columns can't have indexes (must use prefix indexes)
- Full-text search is weaker than PostgreSQL's `tsvector`
- JSON support is inferior to PostgreSQL's JSONB

---

## 5. CockroachDB / PlanetScale

**Use when:** Multi-region deployment is a hard requirement from day one and data must remain
consistent across regions (not just eventually consistent).

**CockroachDB:** PostgreSQL-compatible wire protocol. Strong consistency, distributed
transactions. Higher latency than single-node Postgres (network round-trips for consensus).
Good for: financial transactions, global SaaS.

**PlanetScale:** MySQL-compatible. Excellent developer experience. Horizontal sharding via
Vitess. Non-blocking schema changes (huge win for zero-downtime deploys). No foreign key
enforcement — enforced at application layer instead.

---

## 6. ClickHouse

**Use when:**
- Analytics/reporting on >1B rows
- Time-series aggregations (IoT, metrics, logs)
- Read-heavy OLAP workload with complex GROUP BY / window functions
- Write once, read many pattern

**Key ClickHouse patterns:**
- Use MergeTree engine for most tables
- Use ReplacingMergeTree when you need deduplication
- Denormalize aggressively — JOINs are slow, pre-aggregated tables are fast
- Partition by date (toYYYYMM(timestamp)) for time-series data
- NOT for transactional writes — updates/deletes are expensive

---

## 7. TimescaleDB

**Use when:** Time-series is the dominant workload but you want PostgreSQL compatibility.
TimescaleDB is a PostgreSQL extension that adds automatic time-based partitioning
(hypertables), continuous aggregates, and data retention policies.

Best for: IoT sensor data, application metrics, financial tick data, server monitoring.

```sql
CREATE TABLE sensor_readings (
  time       TIMESTAMPTZ NOT NULL,
  device_id  UUID NOT NULL,
  value      DOUBLE PRECISION,
  metadata   JSONB
);
SELECT create_hypertable('sensor_readings', 'time', chunk_time_interval => INTERVAL '1 day');
CREATE INDEX ON sensor_readings(device_id, time DESC);
```

---

## 8. Elasticsearch

**Use when:** Search is the primary feature, not a secondary lookup:
- Faceted search with many filter combinations
- Fuzzy/typo-tolerant full-text search at scale
- Log aggregation and analysis (ELK stack)
- Relevance scoring is important (e-commerce product search)

**Important:** Elasticsearch is NOT a primary database. Always pair with PostgreSQL as the
source of truth. Sync to ES via CDC (Change Data Capture) using Debezium or a queue.

For most apps, PostgreSQL's `tsvector` + `pg_trgm` handles search well enough up to
~10M documents without needing Elasticsearch.

---

## 9. Neo4j / Graph Databases

**Use when:** Relationships between entities are the core of the product:
- Social networks (mutual friends, degrees of separation)
- Recommendation engines (users → products → categories → other users)
- Fraud detection (connected entity graphs)
- Knowledge graphs
- Network/dependency graphs

The signal to use a graph database: if your query says "find all X that are connected to Y
through Z by at most N hops", and N > 2, PostgreSQL with recursive CTEs starts to struggle.

**For lighter graph needs:** PostgreSQL with `ltree` (hierarchies) or recursive CTEs handles
up to 3-4 levels of traversal efficiently.

---

## 10. Firestore / Supabase Realtime

**Firestore (Firebase):** Choose when:
- Mobile-first with offline sync is non-negotiable
- Real-time collaborative features (live cursors, shared documents)
- Team doesn't want to manage infrastructure
- Google ecosystem

**Supabase:** Choose when:
- You want PostgreSQL + real-time subscriptions
- Open-source / self-hostable matters
- Row-level security for multi-tenant is important

Both impose a document/collection data model. Complex relational queries are harder.
Vendor lock-in is a real concern for Firestore.

---

## 11. SQLite

**Use when:**
- Mobile app (iOS/Android) — SQLite is the native choice
- Desktop app (Electron, Tauri)
- Edge computing (Cloudflare D1, Turso)
- Single-user local-first application
- Test environments

**SQLite limits to know:**
- Single-writer at a time (WAL mode allows concurrent reads)
- No network access — must be local to the application
- Max database size ~281TB in practice, ~140TB safely
- No `RIGHT OUTER JOIN` or `FULL OUTER JOIN` (older versions)

**Turso** = libSQL (SQLite-compatible) with network access and branching. Good for
edge deployments where you want SQLite semantics with remote access.