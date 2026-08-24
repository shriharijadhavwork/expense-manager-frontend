export type User = {
  id: string;
  name: string;
  email: string;
};

export type AuthResult = {
  user: User;
  token: string;
};

export type Expense = {
  id: string;
  userId: string;
  amount: number;
  category: string;
  note: string;
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateExpenseInput = {
  amount: number;
  category: string;
  note?: string;
  date: string;
};

export type UpdateExpenseInput = {
  amount?: number;
  category?: string;
  note?: string;
  date?: string;
};

export type SearchExpensesInput = {
  category?: string;
  from?: string;
  to?: string;
};

export type ApiErrorBody = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export type ApiSuccessBody<T> = {
  success: true;
  data: T;
};
