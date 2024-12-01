interface AuthHeaderProps {
  isResetPassword: boolean;
  isSignUp: boolean;
}

export const AuthHeader = ({ isResetPassword, isSignUp }: AuthHeaderProps) => (
  <div>
    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
      {isResetPassword 
        ? "Reset your password"
        : isSignUp 
          ? "Create an account" 
          : "Sign in to your account"}
    </h2>
  </div>
);