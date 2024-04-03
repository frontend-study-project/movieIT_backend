export interface SearchBookingSeatListRequest {
  movieId: number;
  theaterId: number;
  time: string;
}

export interface SearchSeatListRequest {
  movieId: number;
  theaterId: number;
  date: string;
}