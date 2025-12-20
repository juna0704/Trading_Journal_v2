-- CreateTable
CREATE TABLE "password_reset_attempts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "ipAddress" TEXT NOT NULL,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "password_reset_attempts_userId_createdAt_idx" ON "password_reset_attempts"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "password_reset_attempts" ADD CONSTRAINT "password_reset_attempts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
