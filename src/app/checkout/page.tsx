import type { Metadata } from "next";
import CheckoutClient from "./CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your Ohr Hanachal order — direct from the press, secure checkout, free US shipping over $75.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
