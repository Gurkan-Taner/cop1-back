-- EXTENSION UUID (PostgreSQL)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================
-- USERS
-- =========================
CREATE TABLE users (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	number VARCHAR(50) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	first_name VARCHAR(255) NOT NULL,
	email VARCHAR(255) NOT NULL UNIQUE,
	password TEXT NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- MISSIONS
-- =========================
CREATE TABLE missions (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	description TEXT NOT NULL,
	title TEXT NOT NULL,
	status VARCHAR(50) NOT NULL,
	location VARCHAR(255) NOT NULL,
	type VARCHAR(50) NOT NULL,
	date DATE NOT NULL,
	is_urgent BOOLEAN DEFAULT FALSE,
	address VARCHAR(255) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================
-- CRENEAUX
-- =========================
CREATE TABLE creneaux (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	start_at TIMESTAMP NOT NULL,
	end_at TIMESTAMP NOT NULL,
	mission_id UUID NOT NULL,
	place_available INTEGER NOT NULL CHECK (place_available > 0),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY (mission_id) REFERENCES missions(id) ON DELETE CASCADE
);

-- =========================
-- INSCRIPTIONS (pivot)
-- =========================
CREATE TABLE inscriptions (
	id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL,
	creneau_id UUID NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

	FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
	FOREIGN KEY (creneau_id) REFERENCES creneaux(id) ON DELETE CASCADE,

	UNIQUE (user_id, creneau_id)
);

CREATE INDEX idx_creneaux_mission ON creneaux(mission_id);
CREATE INDEX idx_inscriptions_user ON inscriptions(user_id);
CREATE INDEX idx_inscriptions_creneau ON inscriptions(creneau_id);