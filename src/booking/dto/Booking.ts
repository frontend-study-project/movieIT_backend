export interface SearchBookingSeatListRequest {
  movieId: number;
  theaterId: number;
  hour: number;
}

export interface SearchSeatListRequest {
  movieId: number;
  theaterId: number;
  date: string;
}