CREATE TABLE IF NOT EXISTS "users" (
    "id" BIGINT PRIMARY KEY,
    "external_id" TEXT NOT NULL UNIQUE,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT NOT NULL UNIQUE,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ DEFAULT NULL 
);

CREATE TABLE IF NOT EXISTS "customers" (
    PRIMARY KEY ("id"),
    "referrer_code" TEXT NULL,
    "onboarded" BOOLEAN NOT NULL DEFAULT 'false'
) INHERITS ("users");
