-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "missions" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "is_urgent" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "missions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creneaux" (
    "id" TEXT NOT NULL,
    "start_at" TIMESTAMP(3) NOT NULL,
    "end_at" TIMESTAMP(3) NOT NULL,
    "place_available" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "missionId" TEXT NOT NULL,

    CONSTRAINT "creneaux_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inscriptions" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" TEXT NOT NULL,
    "creneauId" TEXT NOT NULL,

    CONSTRAINT "inscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "creneaux_missionId_idx" ON "creneaux"("missionId");

-- CreateIndex
CREATE INDEX "inscriptions_userId_idx" ON "inscriptions"("userId");

-- CreateIndex
CREATE INDEX "inscriptions_creneauId_idx" ON "inscriptions"("creneauId");

-- CreateIndex
CREATE UNIQUE INDEX "inscriptions_userId_creneauId_key" ON "inscriptions"("userId", "creneauId");

-- AddForeignKey
ALTER TABLE "creneaux" ADD CONSTRAINT "creneaux_missionId_fkey" FOREIGN KEY ("missionId") REFERENCES "missions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inscriptions" ADD CONSTRAINT "inscriptions_creneauId_fkey" FOREIGN KEY ("creneauId") REFERENCES "creneaux"("id") ON DELETE CASCADE ON UPDATE CASCADE;
