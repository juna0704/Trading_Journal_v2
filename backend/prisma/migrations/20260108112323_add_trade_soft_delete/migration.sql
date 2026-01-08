-- AlterTable
ALTER TABLE "trades" ADD COLUMN     "deletedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "trades_deletedAt_idx" ON "trades"("deletedAt");
