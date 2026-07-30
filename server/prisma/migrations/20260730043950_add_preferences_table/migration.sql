-- CreateTable
CREATE TABLE "preferences" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "founder_id" UUID NOT NULL,
    "preferences_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "preferences_pkey" PRIMARY KEY ("id")
);
