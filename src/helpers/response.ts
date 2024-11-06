import { SQL, SQLWrapper, eq, sql } from "drizzle-orm";
import { ApiResponse, PaginatedApiResponse, PaginationOptions, PaginationMeta, ResponseGenerator } from "../interfaces/response.interface";
import { db } from "../db";
import { Response } from "express";

// Utility functions
const capitalize = (str: string): string => 
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const formatMessage = (resource: string, action: string, custom?: string): string => 
  custom || `${resource} ${action}`;

// Add new interface for response handler
interface ResponseHandler {
  status: number;
  message: string;
  data?: any;
  error?: any;
}

// Add new global response handler
export const handleResponse = (res: Response, { status, message, data, error }: ResponseHandler) => {
  return res.status(status).json({
    message,
    data: data || null,
    ...(error && { error: process.env.NODE_ENV === 'development' ? error : '' })
  });
};

// Response helpers
export const successResponse = <T>(
  data: T,
  message: string = "Success"
): ApiResponse<T> => ({
  message,
  data,
});

export const errorResponse = (
  message: string = "Error",
  error?: any
): ApiResponse<null> => ({
  message,
  error,
});

// Dynamic response generator
export const createResponses = (resourceName: string): ResponseGenerator<any> => {
  const resource = capitalize(resourceName);

  return {
    created: (data, message) => ({
      status: 201,
      data,
      message: formatMessage(resource, "created successfully", message)
    }),
    
    updated: (data, message) => ({
      status: 200,
      data,
      message: formatMessage(resource, "updated successfully", message)
    }),
    
    deleted: (message) => ({
      status: 200,
      message: formatMessage(resource, "deleted successfully", message)
    }),
    
    fetched: (data, message) => ({
      status: 200,
      data,
      message: formatMessage(resource, "fetched successfully", message)
    }),
    
    notFound: (message) => ({
      status: 404,
      message: formatMessage(resource, "not found", message)
    }),
    
    alreadyExists: (message) => ({
      status: 409,
      message: formatMessage(resource, "already exists", message)
    }),
    
    invalidData: (error, message) => ({
      status: 400,
      message: formatMessage(resource.toLowerCase(), "Invalid data", message),
      error
    }),
    
    badRequest: (message = "Bad request") => ({
      status: 400,
      message
    }),
    
    unauthorized: (message = "Unauthorized access") => ({
      status: 401,
      message
    }),
    
    forbidden: (message = "Forbidden access") => ({
      status: 403,
      message
    }),
    
    validationError: (error, message) => ({
      status: 400,
      message: message || "Validation error",
      error
    }),
    
    error: (error, message) => ({
      status: 500,
      message: message || "Internal server error",
      error
    }),
  };
};

// Pagination helpers
const calculatePaginationMeta = (
  totalItems: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.ceil(totalItems / limit);
  return {
    currentPage: page,
    nextPage: page < totalPages ? page + 1 : null,
    previousPage: page > 1 ? page - 1 : null,
    pageSize: limit,
    totalItems,
    totalPages,
  };
};

const validatePaginationParams = (page: number, limit: number): void => {
  if (page < 1) throw new Error("Page number must be greater than 0");
  if (limit < 1) throw new Error("Limit must be greater than 0");
};

const getCount = async (
  table: any,
  where?: SQL | SQLWrapper
): Promise<number> => {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(table)
    .where(where ? eq(where, true) : undefined)
    .execute();
  
  return Number(result[0]?.count || 0);
};

export async function paginate<T>(
  query: any,
  table: any,
  options: PaginationOptions = { page: 1, limit: 10 },
  where?: SQL | SQLWrapper,
  orderBy: Record<string, "asc" | "desc"> = { created_at: "desc" }
): Promise<PaginatedApiResponse<T>> {
  try {
    const { page, limit } = options;
    validatePaginationParams(page, limit);

    const skip = (page - 1) * limit;
    const totalItems = await getCount(table, where);

    const data = await query
      .limit(limit)
      .offset(skip)
      .where(where || undefined)
      .orderBy(orderBy)
      .execute();

    return {
      message: "Data fetched successfully",
      data,
      meta: calculatePaginationMeta(totalItems, page, limit),
    };
  } catch (error) {
    throw new Error(
      `Pagination error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`
    );
  }
}
