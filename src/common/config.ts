import { config } from "dotenv";

config();

export const {
  URI,
  SECRET_ACCESS_TOKEN,
  PORT,
  DOODSTREAM_API,
  SECRET_REFRESH_TOKEN,
  CLOUDINARY_SECRET
} = process.env;
