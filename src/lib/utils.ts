import bcrypt from "bcryptjs";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function groupByProperties<T>(
  items: T[],
  keys: (keyof T)[],
): Record<string, T[]> {
  return items.reduce(
    (result, item) => {
      const groupKey = keys
        .map((key) => item[key])
        .join("-")
        .replace(/\s/g, "-");
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    },
    {} as Record<string, T[]>,
  );
}

export function groupByProp<T>(
  items: T[],
  keys: (keyof T)[],
): Array<{ [K in keyof T]?: T[K] } & { data: T[] }> {
  const groups = items.reduce(
    (result, item) => {
      const groupKey = keys
        .map((key) => item[key])
        .join("-")
        .replace(/\s/g, "-");
      if (!result[groupKey]) {
        result[groupKey] = keys.reduce(
          (group, key) => ({ ...group, [key]: item[key] }),
          {} as T & { data: T[] }, // Update the type of `result` to include the `data` property
        );
        result[groupKey].data = [];
      }
      result[groupKey].data.push(item);
      return result;
    },
    {} as Record<string, T & { data: T[] }>,
  );

  return Object.values(groups);
}

//bcryptjs
export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => {
  return await bcrypt.compare(password, hashedPassword);
};
