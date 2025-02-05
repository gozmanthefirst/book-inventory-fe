// External Imports
import { Noto_Sans, Noto_Serif, Young_Serif } from "next/font/google";

export const notoSerif = Noto_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
});
export const notoSans = Noto_Sans({
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
});
export const youngSerif = Young_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal"],
});
