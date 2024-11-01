export default interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  message: string;
  stack?: string;
}

export interface OkResponse {
  message: string;
  data: any[];
}

export interface ApiResponse<T> {
  message: string;
  data?: T | null;
  error?: any;
}

export interface PaginationMeta {
  currentPage: number;
  nextPage: number | null;
  previousPage: number | null;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedApiResponse<T> {
  message: string;
  data: T[];
  meta: PaginationMeta;
}

export interface ResponseGenerator<T> {
  created: (data: T, message?: string) => ApiResponse<T>;
  updated: (data: T, message?: string) => ApiResponse<T>;
  deleted: (message?: string) => ApiResponse<null>;
  fetched: (data: T, message?: string) => ApiResponse<T>;
  notFound: (message?: string) => ApiResponse<null>;
  alreadyExists: (message?: string) => ApiResponse<null>;
  invalidData: (error?: any, message?: string) => ApiResponse<null>;
  badRequest: (message?: string) => ApiResponse<null>;
  unauthorized: (message?: string) => ApiResponse<null>;
  forbidden: (message?: string) => ApiResponse<null>;
  validationError: (error: any, message?: string) => ApiResponse<null>;
  error: (error: any, message?: string) => ApiResponse<null>;
}