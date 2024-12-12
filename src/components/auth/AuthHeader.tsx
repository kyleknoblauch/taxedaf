import { Logo } from "../Logo";

interface AuthHeaderProps {
  isResetPassword: boolean;
  isSignUp: boolean;
}

export const AuthHeader = ({ isResetPassword, isSignUp }: AuthHeaderProps) => (
  <div className="flex flex-col items-center space-y-4">
    <Logo width="120" className="dark:invert" />
    <h1 className="text-2xl font-bold tracking-tight">taxedAF</h1>
    <h2 className="text-xl text-gray-600 dark:text-gray-400">
      {isResetPassword 
        ? "Reset your password"
        : isSignUp 
          ? "Create an account" 
          : "Sign in to your account"}
    </h2>
  </div>
);