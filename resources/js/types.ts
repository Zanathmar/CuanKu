export interface Expense {
  id: number;
  title: string;
  amount: number;
  created_at: string;
}

export interface FlashMessages {
  success?: string;
}

export interface PageProps {
  expenses: Expense[];
  flash: FlashMessages;
}