export default interface MessageResponse {
  message: string;
}

export interface ErrorResponse {
  message: string;
  stack?: string;
}