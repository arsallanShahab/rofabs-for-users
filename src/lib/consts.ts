export const BookingTypeEnum = Object.freeze({
  ONLINE: "Online",
  WALK_IN: "Walk In",
  CALL: "Call",
});

export const RoomCategoryEnum = ["A/C", "Non A/C"];

export const RoomTypeEnum = ["Single", "Double", "Triple", "Dormitory"];

export const BookingStatusEnum = Object.freeze({
  CONFIRMED: "Confirmed",
  NOT_CONFIRMED: "Not Confirmed",
});

export const PaymentStatusEnum = Object.freeze({
  PAID: "Paid",
  NOT_PAID: "Not Paid",
});

export const PaymentMethodEnum = Object.freeze({
  CASH: "Cash",
  CARD: "Card",
  UPI: "UPI",
});

export const PropertyTypeEnum = ["Hostel/PG", "Family Apartment", "Hotel"];

export const ListOfStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir (union territory)",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];

export const UserRoles = Object.freeze({
  ADMIN: "Admin",
  OWNER: "Owner",
  MANAGER: "Manager",
  USER: "User",
  ACCOUNTANT: "Accountant",
  SALESMANAGER: "SalesManager",
  SUPERVISOR: "Supervisor",
  CHEF: "Chef",
});

export const ComplaintTypeEnum = [
  "General",
  "Electrical",
  "Plumbing",
  "Food",
  "Guest",
  "Staff",
];

export const DaysEnum = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const MealNameEnum = ["Breakfast", "Lunch", "Snack", "Dinner"];
