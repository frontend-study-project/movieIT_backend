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
  certification?: string;
}

interface CertificationListResponse {
  results: {
    iso_3166_1: string,
    release_dates: [
      {
        certification: "",
      }
    ]
  }[]
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