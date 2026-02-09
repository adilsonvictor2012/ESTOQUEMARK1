
export type UserRole = 'user' | 'creator';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

export interface Material {
  id: string;
  name: string;
  category: string;
  quantity: number;
  minStock: number;
  unit: string;
  prices: { [supplierId: string]: number };
}

export interface Client {
  id: string;
  name: string;
  nif: string;
  email: string;
  address: string;
}

export interface Supplier {
  id: string;
  name: string;
  contact: string;
  email: string;
}

export type MovementType = 'ENTRADA' | 'SAIDA' | 'DEVOLUCAO';

export interface Movement {
  id: string;
  type: MovementType;
  materialId: string;
  quantity: number;
  date: string;
  clientId?: string;
  supplierId?: string;
  location?: string;
  guideNumber: string;
}

export interface Guide {
  number: string;
  type: MovementType | 'TRANSPORTE';
  date: string;
  recipientName: string;
  recipientNif?: string;
  address: string;
  items: { materialName: string; quantity: number; unit: string }[];
}
