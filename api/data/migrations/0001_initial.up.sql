-- Customer (linked to User)
CREATE TABLE customers
(
    id                     bigint PRIMARY KEY,
    qualifying_miles_total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    bonus_miles_total      NUMERIC(10, 2) NOT NULL DEFAULT 0,
    member_tier            TEXT           NOT NULL DEFAULT 'silver',
    auth0_user_id          TEXT UNIQUE    NOT NULL,
    email                  TEXT UNIQUE    NOT NULL,
    phone                  TEXT,
    first_name             TEXT           NOT NULL,
    last_name              TEXT           NOT NULL,
    created_at             TIMESTAMPTZ             DEFAULT NOW(),
    updated_at             TIMESTAMPTZ             DEFAULT NOW()
);

CREATE TABLE travel_distances
(
    id         bigint PRIMARY KEY,
    from_code  TEXT NOT NULL,
    to_code    TEXT NOT NULL,
    miles      INT  NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Accrual Request
CREATE TABLE accrual_requests
(
    id                      bigint PRIMARY KEY,
    customer_id             BIGINT         NOT NULL REFERENCES customers (id),
    status                  TEXT           NOT NULL,
    ticket_id               TEXT           NOT NULL,
    pnr                     TEXT           NOT NULL,
    carrier                 TEXT           NOT NULL,
    booking_class           TEXT           NOT NULL,
    from_code               TEXT           NOT NULL,
    to_code                 TEXT           NOT NULL,
    departure_date          TIMESTAMPTZ    NOT NULL,
    ticket_image_url        TEXT           NOT NULL,
    boarding_pass_image_url TEXT           NOT NULL,
    distance_miles          INT            NOT NULL,
    qualifying_accrual_rate NUMERIC(10, 2) NOT NULL,
    bonus_accrual_rate      NUMERIC(10, 2) NOT NULL,
    qualifying_miles        NUMERIC(10, 2) NOT NULL,
    bonus_miles             NUMERIC(10, 2) NOT NULL,
    reviewer_id             TEXT NULL,
    reviewed_at             TIMESTAMPTZ NULL,
    rejected_reason         TEXT NULL,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Miles Ledger
CREATE TABLE miles_ledgers
(
    id                      BIGINT PRIMARY KEY,
    customer_id             BIGINT NOT NULL REFERENCES customers (id),
    qualifying_miles_delta  INT         DEFAULT 0,
    bonus_miles_delta       INT         DEFAULT 0,
    kind                    TEXT NOT NULL DEFAULT 'accrual',
    earning_month           DATE NOT NULL DEFAULT CURRENT_DATE,
    expires_at              DATE,
    note                    TEXT,
    accrual_request_id      BIGINT REFERENCES accrual_requests (id),
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Create membership_histories table
CREATE TABLE membership_histories (
    id BIGINT PRIMARY KEY,
    customer_id BIGINT NOT NULL REFERENCES customers (id),
    old_tier TEXT NOT NULL,
    new_tier TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);