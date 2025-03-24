export interface Task {
    description: string;
    status: string;
    createdAt: number;
    isEditable: boolean;
    isUrgent: boolean;
    category: string;
    categories?: string[];
  }