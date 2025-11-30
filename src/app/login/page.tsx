import { login } from "@/actions/auth";

export const metadata = {
  title: "Sign In",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm p-6">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>
      <form action={login} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="w-full rounded-md border bg-background p-2"
            required
            defaultValue=""
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="w-full rounded-md border bg-background p-2"
            required
            defaultValue=""
          />
        </div>
        <button type="submit" className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground">
          Sign in
        </button>
      </form>
    </div>
  );
}

