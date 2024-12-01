interface AuthLinksProps {
  isSignUp: boolean;
  isResetPassword: boolean;
  setIsSignUp: (value: boolean) => void;
  setIsResetPassword: (value: boolean) => void;
}

export const AuthLinks = ({
  isSignUp,
  isResetPassword,
  setIsSignUp,
  setIsResetPassword,
}: AuthLinksProps) => (
  <div className="mt-4 text-center space-y-2">
    {!isResetPassword && (
      <button
        onClick={() => setIsSignUp(!isSignUp)}
        className="text-sm text-blue-600 hover:text-blue-500 block w-full"
      >
        {isSignUp
          ? "Already have an account? Sign in"
          : "Don't have an account? Sign up"}
      </button>
    )}
    
    {!isSignUp && !isResetPassword && (
      <button
        onClick={() => setIsResetPassword(true)}
        className="text-sm text-blue-600 hover:text-blue-500 block w-full"
      >
        Forgot your password?
      </button>
    )}

    {isResetPassword && (
      <button
        onClick={() => setIsResetPassword(false)}
        className="text-sm text-blue-600 hover:text-blue-500 block w-full"
      >
        Back to sign in
      </button>
    )}
  </div>
);