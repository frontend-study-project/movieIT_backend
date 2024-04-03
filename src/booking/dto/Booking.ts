export interface SearchBookingSeatListRequest {
  movieId: number;
  theaterId: number;
  datetime: string;
}

export interface SearchSeatListRequest {
  movieId: number;
  theaterId: number;
  date: string;
}