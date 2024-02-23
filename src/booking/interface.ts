import { Booking } from "@prisma/client";

export type BookingSearchType = 'B' | 'E';

export type BookingSearchParam = {
  userId: number;
  type: BookingSearchType;
  date?: string;
}

export type BookingResponse = Booking & {
  poster?: string;
}

export type ReservationDto = {
  movieId: number;
  theaterId: number;
  auditoriumId: number;
  people: number;
  seat: string[];
  date: string;
  money: number;
}