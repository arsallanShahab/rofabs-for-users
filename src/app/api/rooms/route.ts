import { connectToDatabase } from "@/lib/mongodb";
import { groupByProp } from "@/lib/utils";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

type Filter = {
  propertyId?: ObjectId;
  from?: Date;
  to?: Date;
  numberOfGuests?: number;
};

async function getRooms(filter: Filter): Promise<any> {
  const { db } = await connectToDatabase();
  const rooms = await db
    .collection("rooms")
    .find({ propertyId: filter.propertyId })
    .toArray();

  return groupByProp(rooms, ["roomType", "roomCategory"]);
}

async function updateRoomAvailability(
  group: any,
  filter: Filter,
): Promise<void> {
  const { db } = await connectToDatabase();

  for (const room of group) {
    const bookings = await db
      .collection("bookings")
      .find({
        propertyId: filter.propertyId,
        roomType: room.roomType,
        roomCategory: room.roomCategory,
        from: { $gte: filter.from },
        to: { $lte: filter.to },
      })
      .toArray();

    const bookingTotalGuests = bookings.reduce(
      (acc, curr) => acc + curr.numberOfGuests,
      0,
    );
    const totalGuess = bookingTotalGuests + (filter.numberOfGuests || 0);
    const totalMaxOccupancy = room.data.reduce(
      (acc: number, curr: any) => acc + curr.maxOccupancy,
      0,
    );

    room.isAvailable = totalGuess <= totalMaxOccupancy;
  }
}

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const propertyId = searchParams.get("property-id");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const numberOfGuests = searchParams.get("no-of-guests");
  // const roomId = searchParams.get("room-id");

  const headersList = headers();
  const ip =
    headersList.get("x-forwarded-for") ||
    headersList.get("cf-connecting-ip") ||
    headersList.get("fastly-client-ip") ||
    headersList.get("x-real-ip") ||
    headersList.get("x-cluster-client-ip") ||
    headersList.get("x-forwarded") ||
    headersList.get("forwarded-for") ||
    headersList.get("forwarded");

  const response = await fetch(`https://ipapi.co/${ip}/json`);
  const data = await response.json();
  console.log(data, "data");
  // console.log(ip, "ip");

  const filter: Filter = {
    propertyId: propertyId ? new ObjectId(propertyId) : undefined,
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
    numberOfGuests: numberOfGuests ? Number(numberOfGuests) : undefined,
  };

  if (!filter.propertyId) {
    return Response.json({
      success: false,
      message: "Please provide property id",
    });
  }

  const { db } = await connectToDatabase();
  const property = await db
    .collection("properties")
    .findOne({ _id: filter.propertyId });

  if (!property) {
    return Response.json({
      success: false,
      message: "Property not found",
    });
  }
  const reviews = await db
    .collection("reviews")
    .find({ propertyId: filter.propertyId })
    .toArray();

  let totalRating = 0;
  const ratings = [0, 0, 0, 0, 0]; // Array to store ratings count for each star

  for (const review of reviews) {
    totalRating += review.rating;

    if (review.rating >= 1 && review.rating <= 5) {
      ratings[review.rating - 1]++; // Increment count for corresponding rating
    }
  }

  const averageRating = Number((totalRating / reviews.length).toFixed(1));
  const maxRating = ratings.reduce(
    (max, count, rating) => {
      if (count > max.count) {
        return { rating: rating + 1, count };
      }
      return max;
    },
    { rating: 0, count: 0 },
  );

  console.log(
    `The rating with the maximum number of occurrences is ${maxRating.rating} with a count of ${maxRating.count}.`,
  );

  const group = await getRooms(filter);
  await updateRoomAvailability(group, filter);

  return Response.json({
    property,
    rooms: group,
    location: data,
    reviews: {
      total: reviews.length,
      avgRating: averageRating,
      maxRating,
      ratings,
      data: reviews,
    },
  });
}

// const rooms = await db
//   .collection("rooms")
//   .find({ propertyId: filter.propertyId })
//   .sort({ pricePerDay: 1 })
//   .toArray();
// const group = groupByProp(rooms, ["roomType", "roomCategory"]);
// for (const room of group) {
//   const bookings = await db
//     .collection("bookings")
//     .find({
//       propertyId: filter.propertyId,
//       roomType: room.roomType,
//       roomCategory: room.roomCategory,
//       from: { $gte: filter.from },
//       to: { $lte: filter.to },
//     })
//     .toArray();
//   const bookingTotalGuests = bookings.reduce((acc, curr) => {
//     return acc + curr.numberOfGuests;
//   }, 0);
//   const totalGuess = bookingTotalGuests + filter.numberOfGuests;
//   const totalMaxOccupancy = room.data.reduce((acc, curr) => {
//     return acc + curr.maxOccupancy;
//   }, 0);
//   room.isAvailable = totalGuess <= totalMaxOccupancy;
//   if (totalGuess > totalMaxOccupancy) {
//     room.isAvailable = false;
//   }
// }
