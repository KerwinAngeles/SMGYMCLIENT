export interface CreatePlanRequest {
  name: string;
  price: number;
  duration: number;
  description: string;
  planFeatures: string[];
}

export interface EditPlanRequest {
  id: number;
  name: string;
  price: number;
  duration: number;
  description: string;
  planFeatures: string[];
}