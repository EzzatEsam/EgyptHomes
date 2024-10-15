export interface Result<T = undefined> {
  success: boolean;
  data?: T;
  errors?: string[];
}

export interface AspError {
  code: string;
  description: string;
}
