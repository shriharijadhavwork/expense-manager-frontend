import { apiRequest } from "@/lib/api/client";
import type {
  CreateExpenseInput,
  Expense,
  ExpenseCategoryOption,
  SearchExpensesInput,
  UpdateExpenseInput,
} from "@/types/api";

export const expensesApi = {
  list(): Promise<Expense[]> {
    return apiRequest<Expense[]>("/expenses");
  },

  listCategories(): Promise<ExpenseCategoryOption[]> {
    return apiRequest<ExpenseCategoryOption[]>("/expenses/categories");
  },

  search(input: SearchExpensesInput): Promise<Expense[]> {
    return apiRequest<Expense[]>("/expenses/search", {
      method: "POST",
      body: input,
    });
  },

  getById(id: string): Promise<Expense> {
    return apiRequest<Expense>(`/expenses/${id}`);
  },

  create(input: CreateExpenseInput): Promise<Expense> {
    return apiRequest<Expense>("/expenses", {
      method: "POST",
      body: input,
    });
  },

  update(id: string, input: UpdateExpenseInput): Promise<Expense> {
    return apiRequest<Expense>(`/expenses/${id}`, {
      method: "PATCH",
      body: input,
    });
  },

  remove(id: string): Promise<{ message: string }> {
    return apiRequest<{ message: string }>(`/expenses/${id}`, {
      method: "DELETE",
    });
  },
};
