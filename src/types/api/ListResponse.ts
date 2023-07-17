import MovieType from './MovieType';

export default interface ListResponse {
  items: MovieType[];
  page: number;
  per_page: number;
  total_items: number;
  total_pages: number;
  sort: string;
  search: string | null;
}
