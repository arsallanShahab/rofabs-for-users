export type SearchResponse = {
  success?: boolean;
  message?: string;
  data: Property[];
};

export type Room = {
  _id: string;
  roomNumber: number;
  roomCategory: string;
  roomType: string;
  pricePerMonth: number;
  pricePerDay: number;
  roomSize: number;
  maxOccupancy: number;
  vacancy: number;
  guestDetails: Object[];
  isFeatured: boolean;
  isOccupied: boolean;
  description: string;
  propertyId: string;
  propertyType: string;
  images: {
    roomImage: { label: string; url: string }[];
    washroomImage: { label: string; url: string }[];
    bedImage: { label: string; url: string }[];
    additionalImages: { label: string; url: string }[];
  };
  facilities: string[] | [];
  reviews?: Object[];
  complaints?: Object[];
};

export type Property = {
  _id: string;
  name: string;
  type: string;
  address: string;
  coOfLocation: { type: "Point"; coordinates: [number, number] };
  nearbyPlaces?: string[];
  images: { label: string; url: string }[];
  manager: {
    name: string;
    email?: string;
    phoneNumber: string;
  };
  owner_user_id: string;
  status?: string;
  permissions?: string[];
  facilities: string[] | [];
  isParkingSpaceAvailable?: boolean | "true" | "false" | string;
  isCoupleFriendly?: boolean;
  foodMenu?: object[];
  complaints?: Object[];
  isFeatured?: boolean;
};

export type groupedRooms = {
  roomType?: string;
  roomCategory?: string;
  data: Room[];
};

export type OrderProps = {
  roomType: string;
  roomCategory: string;
  from: Date | string;
  to: Date | string;
  numberOfGuests: number;
  guestName: string;
  guestEmail: string;
  guestPhoneNumber: number;
  propertyId: string;
  roomId: string;
  amount: number;
  userId: string;
  userName: string;
};

export interface BookingProps {
  _id?: string;
  user?: UserProps;
  propertyId: string;
  bookingType: string;
  bookingStatus: string;
  paymentMethod: string;
  primaryGuestName: string;
  checkedIn?: {
    additionalGuests: {
      roomNumber: number;
      guest: GuestDetailsProps;
    }[];
    primaryGuest: {
      roomNumber: number;
      guest: GuestDetailsProps;
    };
  };
  guestName?: string;
  guestPhoneNumber: number;
  guestEmail?: string;
  roomCategory: string;
  roomType: string;
  from: Date;
  to: Date;
  checkIn: object;
  paymentStatus: string;
  numberOfGuests: number;
  paymentAmount: number;
  roomAssigned?: string;
  isCheckedIn?: boolean;
  isCheckedOut?: boolean;
  isCancelled?: boolean;
}

export interface UserProps {
  role: "Admin" | "Owner" | "Manager" | "User";
  name: string;
  username?: string;
  profilePicture?: string;
  phoneNumber?: string;
}

export interface GuestDetailsProps {
  name: string;
  email: string;
  phoneNumber: string;
  dob?: Date;
  checkOutDate?: Date;
  idProofBackImage?: { label: string; url: string };
  idProofFrontImage?: { label: string; url: string };
}

export interface PropertyProps {
  _id?: string;
  name: string;
  type: string;
  location: string;
  address: string;
  coOfLocation: { type: "Point"; coordinates: [number, number] };
  nearbyPlaces?: string[];
  images: { label: string; url: string }[];
  manager?: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  permissions?: string[];
  facilities?: string[];
  isParkingSpaceAvailable?: boolean | "true" | "false" | string;
  isCoupleFriendly?: boolean;
  foodMenu?: FoodMenuProps[];
}

export interface FoodMenuProps {
  day: string;
  meals: MealData[];
}

export interface MealData {
  name: string;
  hasMealItems?: boolean;
  vegMealItems: string[];
  nonVegMealItems: string[];
}
