CREATE TABLE IF NOT EXISTS "users" (
    "id" BIGINT PRIMARY KEY,
    "idp_user_id" TEXT NOT NULL UNIQUE,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "phone" TEXT NULL UNIQUE,
    "address" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ DEFAULT NULL 
);

CREATE TABLE IF NOT EXISTS "customers" (
    PRIMARY KEY ("id"),
    "onboarded" BOOLEAN NOT NULL DEFAULT 'false',
    "tier" TEXT NOT NULL DEFAULT 'register',            -- register, silver, gold, titanium, platinum, million_miler
    "tier_valid_util" TIMESTAMPTZ NULL,                 -- Nullable for unexpired tier, e.g. silver, million_miler
    "qualifying_miles_total" INT NOT NULL DEFAULT 0,
    "bonus_miles_total" INT NOT NULL DEFAULT 0,
    "qualifying_segments_total" INT NOT NULL DEFAULT 0  -- qualifying miles in rolling 12 month
) INHERITS ("users");

CREATE TABLE IF NOT EXISTS "mileage_accrual_requests" (
    "id" BIGINT PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, cancelled
    "carrier" TEXT NOT NULL,
    "booking_class" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL, 
    "departure_date" TEXT NOT NULL,
    "tier" TEXT NOT NULL, 
    "distance_miles" INT NOT NULL DEFAULT 0,
    "accrual_rate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "qualifying_miles_earned" INT NOT NULL DEFAULT 0,
    "qualifying_segments_earned" INT NOT NULL DEFAULT 0,
    "bonus_miles_earned" INT NOT NULL DEFAULT 0,
    "reviewer_id" BIGINT NOT NULL,
    "reviewed_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "reject_reason" TEXT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (reviewer_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS "tier_history" (
    "id" BIGINT PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "old_tier" TEXT NOT NULL,
    "new_tier" TEXT NOT NULL,
    "effective_from" TIMESTAMPTZ NOT NULL,
    "effective_to" TIMESTAMPTZ NULL,                    -- Because some tier will not expire
    "reason" TEXT NOT NULL,                             --  upgrade, renew, downgrade
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS "miles_ledgers" (
    "id" BIGINT PRIMARY KEY,
    "user_id" BIGINT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'accrual_request', -- Can be accrual_request | adjustment
    "ref_id" BIGINT,                                   -- Reference to mileage_accrual_requests if source = accrual_request
    "qualifying_miles_delta" INT NOT NULL,
    "bonus_miles_delta" INT NOT NULL,
    "qualifying_segments_delta" INT NOT NULL,
    "routes_distance" INT NOT NULL,
    "accrual_rate" DOUBLE PRECISION NOT NULL,
    "tier_thresholds" JSONB NOT NULL DEFAULT '{}', -- tier ,...
    "notes" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS "city_distances" (
    "id" SERIAL PRIMARY KEY,
    "from_city_code" TEXT NOT NULL,
    "from_city_name" TEXT NOT NULL,
    "to_city_code" TEXT NOT NULL,
    "to_city_name" TEXT NOT NULL,
    "miles" INT NOT NULL,
    "created_at" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
