"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, Eye, EyeOff, Sparkles, TrendingUp, Users, Briefcase } from "lucide-react";
import { login, register } from "@/lib/actions/auth";
import { ROLES } from "@/lib/types";

interface AuthFormProps {
  mode: "login" | "register";
}

const roleIcons = {
  FOUNDER: Sparkles,
  INVESTOR: TrendingUp,
  DEVELOPER: Users,
  MENTOR: Briefcase,
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("FOUNDER");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError("");

    try {
      const action = mode === "login" ? login : register;
      
      if (mode === "register") {
        formData.set("role", selectedRole);
      }

      const result = await action(formData);

      if (!result.success) {
        setError(result.error || "Something went wrong");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="space-y-1 text-center">
        <Link href="/" className="mx-auto mb-4 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">AfriFound</span>
        </Link>
        <CardTitle className="text-2xl font-bold">
          {mode === "login" ? "Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription>
          {mode === "login"
            ? "Enter your credentials to access your account"
            : "Join the African innovation ecosystem"}
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          {mode === "register" && (
            <div className="space-y-3">
              <Label>I am a...</Label>
              <RadioGroup
                value={selectedRole}
                onValueChange={setSelectedRole}
                className="grid grid-cols-2 gap-3"
              >
                {ROLES.map((role) => {
                  const Icon = roleIcons[role.value];
                  return (
                    <div key={role.value}>
                      <RadioGroupItem
                        value={role.value}
                        id={role.value}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={role.value}
                        className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-border bg-secondary/30 p-4 text-center transition-all hover:bg-secondary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10"
                      >
                        <Icon className="h-5 w-5 text-primary" />
                        <span className="font-medium">{role.label}</span>
                      </Label>
                    </div>
                  );
                })}
              </RadioGroup>
            </div>
          )}

          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                required
                disabled={isLoading}
                className="bg-secondary/30"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              disabled={isLoading}
              className="bg-secondary/30"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === "login" && (
                <Link
                  href="/forgot-password"
                  className="text-xs text-muted-foreground hover:text-primary"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder={mode === "register" ? "Min. 8 characters" : "Enter your password"}
                required
                disabled={isLoading}
                className="bg-secondary/30 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {mode === "register" && (
              <p className="text-xs text-muted-foreground">
                Must contain uppercase, lowercase, and number
              </p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "login" ? "Signing in..." : "Creating account..."}
              </>
            ) : mode === "login" ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </>
            )}
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}
