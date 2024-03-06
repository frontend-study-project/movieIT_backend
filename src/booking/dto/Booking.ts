export interface SearchBookingSeatListRequest {
  movieId: number;
  theaterId: number;
  time: number;
}

export interface SearchSeatListRequest {
  movieId: number;
  theaterId: number;
  date: string;
}