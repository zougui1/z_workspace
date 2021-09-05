export interface HttpServerResponse<TData = unknown, TMetadata extends Record<string, any> = any> {
  data: TData;
  metadata?: TMetadata;
}
