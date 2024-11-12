import Link from "next/link";

export default function Home() {
  return (
    <main>
      <p className="text-2xl">
        Check{" "}
        <Link href={"/example"} className="underline">
          example
        </Link>{" "}
        page for some components
      </p>
    </main>
  );
}
