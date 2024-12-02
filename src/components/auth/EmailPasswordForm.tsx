import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface EmailPasswordFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  firstName: string;
  setFirstName: (firstName: string) => void;
  lastName: string;
  setLastName: (lastName: string) => void;
  isSignUp: boolean;
  isResetPassword: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export const EmailPasswordForm = ({
  email,
  setEmail,
  password,
  setPassword,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  isSignUp,
  isResetPassword,
  onSubmit,
}: EmailPasswordFormProps) => (
  <form onSubmit={onSubmit} className="mt-8 space-y-6">
    <div className="rounded-md shadow-sm space-y-4">
      {isSignUp && !isResetPassword && (
        <>
          <div>
            <label htmlFor="firstName" className="sr-only">First Name</label>
            <Input
              id="firstName"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="First Name"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="sr-only">Last Name</label>
            <Input
              id="lastName"
              type="text"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Last Name"
            />
          </div>
        </>
      )}
      <div>
        <label htmlFor="email" className="sr-only">Email address</label>
        <Input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email address"
        />
      </div>
      {!isResetPassword && (
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            minLength={6}
          />
        </div>
      )}
    </div>

    <Button type="submit" className="w-full">
      {isResetPassword 
        ? "Send reset instructions"
        : isSignUp 
          ? "Sign up" 
          : "Sign in"}
    </Button>
  </form>
);