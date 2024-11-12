"use client";

import { ChangeEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// data fetching
import { useMutation } from "@tanstack/react-query";
import { post } from "@/lib/api/handlers";
import { Token } from "@/types/Token";
import { ErrorResponse, Response } from "@/types/Response";

export default function RegisterForm() {
  const [email, setEmail] = useState("Lorena.Veum@example.org");
  const [password, setPassword] = useState("Abcd@1234");

  const { data, error, isPending, mutate, reset } = useMutation<
    Response<Token>,
    ErrorResponse
  >({
    mutationKey: ["login"],
    mutationFn: async () =>
      await post(
        "/auth/register",
        {
          name: "Lorena Veum",
          email: email,
          password: password,
          phoneNumber: "00000000000000 x56442",
        },
        {
          "Content-Type": "application/json",
        }
      ),
  });

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    mutate();
  }

  if (data) {
    if (data.success) {
      alert("Registered successfully");
    }
  }

  if (error) {
    reset();
    if (error.code === "ERR_NETWORK") {
      alert(error.message);
    } else {
      alert(error.response?.data?.error);
    }
  }

  return (
    <div>
      <Card className="w-[350px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Register</CardTitle>
          <CardDescription>
            Enter your email and password to Register
          </CardDescription>
        </CardHeader>
        <CardContent className="">
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Lorena.Veum@example.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Abcd@1234"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={onSubmit} disabled={isPending}>
            {isPending ? "loading..." : "Sign Up"}
          </Button>
        </CardFooter>
      </Card>

      <div>
        {data && (
          <pre className="text-green-500">{JSON.stringify(data, null, 2)}</pre>
        )}
      </div>
      <div>
        {error && (
          <pre className="text-destructive">
            {JSON.stringify(error.response?.data, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
