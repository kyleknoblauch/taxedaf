import { Logo } from "../Logo";

interface AuthHeaderProps {
  isResetPassword: boolean;
  isSignUp: boolean;
}

export const AuthHeader = ({ isResetPassword, isSignUp }: AuthHeaderProps) => (
  <div className="flex flex-col items-center space-y-4">
    <Logo width="40" className="dark:invert" />
    <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">taxedAF</h1>
    <h2 className="text-xl text-gray-600 dark:text-gray-300">
      {isResetPassword 
        ? "Reset your password"
        : isSignUp 
          ? "Create an account" 
          : "Sign in to your account"}
    </h2>
  </div>
);