# Advanced Schema Patterns

Read this when you need patterns beyond basic normalized tables — multi-tenancy, audit logs,
polymorphism, versioning, or event sourcing.

## Table of Contents
1. Multi-tenancy patterns
2. Audit logging
3. Polymorphic associations
4. Versioning / history tables
5. Soft deletes with unique constraints
6. Hierarchical data
7. Event sourcing lite
8. Common SaaS table patterns
9. Useful PostgreSQL triggers

---

## 1. Multi-tenancy patterns

### Shared schema (recommended for most SaaS)
Every table has an `org_id` column. Row-level security enforces tenant isolation.

```sql
-- Always the first column in composite indexes
ALTER TABLE orders ADD COLUMN org_id UUID NOT NULL REFERENCES orgs(id);
CREATE INDEX idx_orders_org ON orders(org_id, created_at DESC);

-- Row-level security (enable per table)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON orders
  USING (org_id = current_setting('app.current_org_id')::UUID);
```

Set the tenant in your connection: `SET LOCAL app.current_org_id = '...'`

### Separate schema per tenant
Each tenant gets a Postgres schema (`CREATE SCHEMA tenant_xyz`). Harder to manage but
complete isolation. Only worth it for enterprise contracts with strict data isolation SLAs.

### Separate database per tenant
Maximum isolation. Use only when compliance mandates it (certain HIPAA/GDPR scenarios).
Very operationally expensive.

---

## 2. Audit logging

Two approaches:

### Lightweight: updated_by + trigger
```sql
ALTER TABLE users ADD COLUMN updated_by UUID REFERENCES users(id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Full audit trail: audit_log table
```sql
CREATE TABLE audit_log (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name TEXT NOT NULL,
  record_id  UUID NOT NULL,
  action     TEXT NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE')),
  old_data   JSONB,
  new_data   JSONB,
  actor_id   UUID REFERENCES users(id),
  ip_address INET,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_actor  ON audit_log(actor_id, created_at DESC);

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log(table_name, record_id, action, old_data, new_data)
  VALUES (
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    TG_OP,
    CASE WHEN TG_OP != 'INSERT' THEN row_to_json(OLD)::JSONB END,
    CASE WHEN TG_OP != 'DELETE' THEN row_to_json(NEW)::JSONB END
  );
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;
```

---

## 3. Polymorphic associations

A comment that can belong to a post OR a video.

### Preferred: separate FK per type (type-safe, indexable)
```sql
CREATE TABLE comments (
  id       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body     TEXT NOT NULL,
  -- exactly one of these will be non-null
  post_id  UUID REFERENCES posts(id)  ON DELETE CASCADE,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  CHECK (
    (post_id IS NOT NULL)::int + (video_id IS NOT NULL)::int = 1
  ),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_comments_post  ON comments(post_id)  WHERE post_id  IS NOT NULL;
CREATE INDEX idx_comments_video ON comments(video_id) WHERE video_id IS NOT NULL;
```

### Alternative: generic polymorphic (flexible but no FK enforcement)
```sql
CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  body        TEXT NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('post','video','product')),
  target_id   UUID NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_comments_target ON comments(target_type, target_id);
```

---

## 4. Versioning / history tables

For any entity where you need "what did this look like on date X?"

```sql
-- Main table (current state only)
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  price_cents BIGINT NOT NULL,
  version     INT NOT NULL DEFAULT 1,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- History table (append-only, one row per change)
CREATE TABLE products_history (
  history_id  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  UUID NOT NULL REFERENCES products(id),
  name        TEXT NOT NULL,
  price_cents BIGINT NOT NULL,
  version     INT NOT NULL,
  changed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  changed_by  UUID REFERENCES users(id)
);
CREATE INDEX idx_products_history ON products_history(product_id, version DESC);
```

Alternatively, use the `temporal_tables` PostgreSQL extension for automatic history tracking.

---

## 5. Soft deletes with unique constraints

The classic problem: you soft-delete a user, then they re-register with the same email.
A plain UNIQUE index blocks re-registration.

Solution: partial unique index
```sql
CREATE TABLE users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL,
  deleted_at TIMESTAMPTZ DEFAULT NULL
);

-- Only enforces uniqueness among non-deleted rows
CREATE UNIQUE INDEX idx_users_email_active ON users(email) WHERE deleted_at IS NULL;

-- Speed up "get all active users" queries  
CREATE INDEX idx_users_active ON users(id) WHERE deleted_at IS NULL;
```

---

## 6. Hierarchical data

### Adjacency list (simple, works to ~5 levels)
```sql
CREATE TABLE categories (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name      TEXT NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL
);
-- Recursive CTE to get full tree:
-- WITH RECURSIVE tree AS (
--   SELECT * FROM categories WHERE parent_id IS NULL
--   UNION ALL
--   SELECT c.* FROM categories c JOIN tree t ON c.parent_id = t.id
-- ) SELECT * FROM tree;
```

### ltree (fast, arbitrary depth)
```sql
CREATE EXTENSION IF NOT EXISTS ltree;
CREATE TABLE categories (
  id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  path ltree NOT NULL  -- e.g., 'electronics.phones.smartphones'
);
CREATE INDEX idx_categories_path ON categories USING GIST(path);
-- Find all descendants: WHERE path <@ 'electronics.phones'
-- Find all ancestors:   WHERE path @> 'electronics.phones.smartphones'
```

---

## 7. Event sourcing lite

Not full event sourcing, but an events table alongside the state table for audit + replay:

```sql
CREATE TABLE order_events (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id   UUID NOT NULL REFERENCES orders(id),
  event_type TEXT NOT NULL,  -- 'created', 'paid', 'shipped', 'cancelled'
  payload    JSONB NOT NULL DEFAULT '{}',
  actor_id   UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_order_events ON order_events(order_id, created_at ASC);
```

Current state lives in the `orders` table. Events table provides the full history.

---

## 8. Common SaaS table patterns

### Subscriptions / billing
```sql
CREATE TABLE subscriptions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id           UUID NOT NULL REFERENCES orgs(id),
  plan_id          UUID NOT NULL REFERENCES plans(id),
  status           TEXT NOT NULL CHECK (status IN ('trialing','active','past_due','cancelled')),
  current_period_start TIMESTAMPTZ NOT NULL,
  current_period_end   TIMESTAMPTZ NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  cancelled_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### Feature flags
```sql
CREATE TABLE feature_flags (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key        TEXT NOT NULL UNIQUE,
  enabled    BOOLEAN NOT NULL DEFAULT FALSE,
  rollout_pct INT NOT NULL DEFAULT 0 CHECK (rollout_pct BETWEEN 0 AND 100),
  org_overrides JSONB NOT NULL DEFAULT '{}'  -- {"org_id": true/false}
);
```

### Notifications
```sql
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id),
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT,
  action_url  TEXT,
  read_at     TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id, read_at NULLS FIRST, created_at DESC);
```

---

## 9. Useful PostgreSQL triggers

### Auto-update updated_at
```sql
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to each table:
CREATE TRIGGER trg_{table}_updated_at
  BEFORE UPDATE ON {table}
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
```

### Prevent hard deletes (enforce soft-delete)
```sql
CREATE OR REPLACE FUNCTION prevent_hard_delete()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'Hard deletes not allowed on %. Use soft delete (deleted_at).', TG_TABLE_NAME;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_{table}_no_delete
  BEFORE DELETE ON {table}
  FOR EACH ROW EXECUTE FUNCTION prevent_hard_delete();
```