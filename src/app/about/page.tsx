import Wrapper from "@/components/wrapper";
import Image from "next/image";
import React from "react";

type Props = {};

const TEAMS = [
  {
    name: "Sheetal",
    role: "Investor Relations",
    image: "https://picsum.photos/seed/picsum/700/700",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "Jayandra",
    role: "operations head",
    image: "https://picsum.photos/seed/picsum/700/700",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    name: "Bhasvesh",
    role: "Marketing Head",
    image: "https://picsum.photos/seed/picsum/700/700",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

type TeamProps = {
  name: string;
  role: string;
  image: string;
  description: string;
};

const Page = (props: Props) => {
  return (
    <Wrapper>
      <div className="flex flex-col items-center justify-center gap-5 px-5 py-7">
        <h1 className="font-sora text-5xl font-extrabold">About Us</h1>
        {/* <h3 className="text-gray-bg-black text-left text-2xl font-semibold">
          Our Mission
        </h3> */}
        <p className="text-left text-lg font-medium text-gray-500">
          connecting hostels/PG, service apartments into a single chain
        </p>
      </div>
      <div className="flex flex-col items-start justify-center gap-5 px-5 py-7">
        <h1 className="font-sora text-5xl font-extrabold">Who we are?</h1>
        <p className="max-w-lg text-left text-lg font-medium text-gray-500">
          We are a group of people who are passionate about providing a better
          living experience for students and working professionals.
        </p>
      </div>
      <div className="flex flex-col items-start justify-center gap-5 px-5 py-7">
        <h1 className="font-sora text-5xl font-extrabold">Our Team</h1>
        <div className="grid w-full grid-cols-3 gap-5">
          {TEAMS.map((team, index) => (
            <Team key={index} {...team} />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

const Team = (props: TeamProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 px-5 py-7">
      <Image
        src={props.image}
        alt={props.name}
        className="h-40 w-40 rounded-full"
        width={160}
        height={160}
      />
      <h1 className="font-sora text-3xl font-extrabold">{props.name}</h1>
      <p className="text-lg font-medium text-gray-500">{props.role}</p>
      <p className="max-w-lg text-center text-lg font-medium text-gray-500">
        {props.description}
      </p>
    </div>
  );
};

export default Page;
