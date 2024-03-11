import { Booking } from "@prisma/client";

export type BookingSearchType = 'B' | 'E';

export type BookingSearchParam = {
  userId: number;
  type: BookingSearchType;
  date?: string;
}

export type BookingResponse = Booking & {
  poster?: string;
  movie?: string;
  theater?: string;
}

export type ReservationDto = {
  movieId: number;
  theaterId: number;
  auditorium: string;
  people: number;
  seat: string[];
  date: string;
  money: number;
}

export type ReservationResponse = Booking & {
  title: string;
  reserveDate: string;
  theater: string;
}