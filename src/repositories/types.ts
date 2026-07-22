export type SortOrder = "asc" | "desc";

export type BaseListParams<SortOption extends string> = {
  page: number;
  perPage: number;
  order?: SortOrder;
  sort?: SortOption;
};
