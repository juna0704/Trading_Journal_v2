/*
  Warnings:

  - You are about to drop the column `type` on the `trades` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `trades` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,8)`.
  - You are about to alter the column `entryPrice` on the `trades` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,8)`.
  - You are about to alter the column `exitPrice` on the `trades` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,8)`.
  - The `status` column on the `trades` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to alter the column `profitLoss` on the `trades` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(18,8)`.
  - Added the required column `side` to the `trades` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TradeStatus" AS ENUM ('OPEN', 'CLOSED');

-- CreateEnum
CREATE TYPE "TradeSide" AS ENUM ('LONG', 'SHORT');

-- AlterTable
ALTER TABLE "trades" DROP COLUMN "type",
ADD COLUMN     "fees" DECIMAL(18,8) NOT NULL DEFAULT 0,
ADD COLUMN     "pnlPercentage" DECIMAL(10,4),
ADD COLUMN     "side" "TradeSide" NOT NULL,
ADD COLUMN     "stopLoss" DECIMAL(18,8),
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "takeProfit" DECIMAL(18,8),
ALTER COLUMN "quantity" SET DATA TYPE DECIMAL(18,8),
ALTER COLUMN "entryPrice" SET DATA TYPE DECIMAL(18,8),
ALTER COLUMN "exitPrice" SET DATA TYPE DECIMAL(18,8),
DROP COLUMN "status",
ADD COLUMN     "status" "TradeStatus" NOT NULL DEFAULT 'OPEN',
ALTER COLUMN "profitLoss" SET DATA TYPE DECIMAL(18,8);

-- CreateIndex
CREATE INDEX "trades_status_idx" ON "trades"("status");
