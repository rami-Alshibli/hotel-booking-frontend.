export type RoomType = "Single" | "Double" | "Suite";
export type RoomCategory = "Standard" | "VIP";

export interface Room {
  _id: string;
  roomNumber: number;
  pricePerNight: number;
  roomType: RoomType;
  roomCategory: RoomCategory;
  createdAt?: string;
  updatedAt?: string;
}

export type ReservationStatus = "Confirmed" | "Cancelled" | "CheckedIn" | "CheckedOut";

export interface Reservation {
  _id: string;
  roomId: Room | string;
  customerFullName: string;
  customerPhone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  pricePerNight: number;
  totalPrice: number;
  status: ReservationStatus;
  cancelledAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}