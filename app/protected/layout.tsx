import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Protected Page",
  description: "details: ",
};

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div>{children}</div>;
}
