/*
  Warnings:

  - You are about to drop the column `entryDate` on the `trades` table. All the data in the column will be lost.
  - You are about to drop the column `exitDate` on the `trades` table. All the data in the column will be lost.
  - You are about to drop the column `profitLoss` on the `trades` table. All the data in the column will be lost.
  - Added the required column `entryTimestamp` to the `trades` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "trades" DROP COLUMN "entryDate",
DROP COLUMN "exitDate",
DROP COLUMN "profitLoss",
ADD COLUMN     "entryTimestamp" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "exitTimestamp" TIMESTAMP(3),
ADD COLUMN     "leverage" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "pnlNet" DECIMAL(20,8),
ADD COLUMN     "strategyId" TEXT,
ADD COLUMN     "tradeScore" INTEGER;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "kycStatus" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Strategy" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Strategy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NewsInsight" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "sentimentScore" DECIMAL(3,2) NOT NULL,
    "sourceUrl" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Strategy_userId_idx" ON "Strategy"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Strategy_name_userId_key" ON "Strategy"("name", "userId");

-- CreateIndex
CREATE INDEX "NewsInsight_symbol_idx" ON "NewsInsight"("symbol");

-- CreateIndex
CREATE INDEX "NewsInsight_publishedAt_idx" ON "NewsInsight"("publishedAt");

-- AddForeignKey
ALTER TABLE "trades" ADD CONSTRAINT "trades_strategyId_fkey" FOREIGN KEY ("strategyId") REFERENCES "Strategy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Strategy" ADD CONSTRAINT "Strategy_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
