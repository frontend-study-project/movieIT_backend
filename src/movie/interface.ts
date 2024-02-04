interface MovieRequest {
  page: number;
}

interface Movie {
  id: number;
  adult: boolean;
  backdropPath: string;
  overview: string;
  posterPath: string;
  releaseDate: string;
  title: string;
  like?: boolean;
}

interface MovieListResponse {
  page: number;
  totalPages: number;
  totalResults: number;
  results: Movie[];
}

interface MovieImagesResponse {
  posters: { file_path: string }[];
}