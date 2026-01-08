export interface StrategyResponse {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStrategyRequest {
  name: string;
}

export interface UpdateStrategyRequest {
  name?: string;
}
