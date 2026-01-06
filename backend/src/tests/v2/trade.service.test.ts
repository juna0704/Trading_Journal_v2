import { tradeService } from "../../services/trade.service";
import { TradeSide } from "../../generated/prisma";
import prisma from "../../config/database";

let userId: string;

beforeAll(async () => {
  const user = await prisma.user.create({
    data: {
      email: "trade@test.com",
      password: "hashed",
      isActive: true,
      isEmailVerified: true,
    },
  });

  userId = user.id;
});

describe("TradeService", () => {
  test("should create an open LONG trade", async () => {
    const trade = await tradeService.createTrade(userId, {
      symbol: "BTCUSDT",
      side: TradeSide.LONG,
      entryPrice: 50000,
      quantity: 0.1,
      leverage: 10,
      entryTimestamp: new Date().toISOString(),
    });

    expect(trade.symbol).toBe("BTCUSDT");
    expect(trade.side).toBe(TradeSide.LONG);
    expect(trade.status).toBe("OPEN");
  });
});
