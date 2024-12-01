import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "./AuthProvider";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const LoginPage = () => {
  const { user, signInWithEmail, signUpWithEmail, signInWithTwitter } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isResetPassword) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/callback`,
        });
        if (error) throw error;
        toast({
          title: "Password reset email sent",
          description: "Please check your email for the password reset link.",
        });
        setIsResetPassword(false);
        return;
      }

      if (isSignUp) {
        const { error } = await signUpWithEmail(email, password, { 
          data: { 
            first_name: firstName,
            last_name: lastName
          }
        });
        if (error?.message.includes("User already registered")) {
          toast({
            variant: "destructive",
            title: "Account already exists",
            description: "Please sign in instead or use a different email.",
          });
          setIsSignUp(false);
          return;
        }
        toast({
          title: "Verification email sent",
          description: "Please check your email and click the confirmation link to complete your registration.",
        });
      } else {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            toast({
              variant: "destructive",
              title: "Email not confirmed",
              description: "Please check your email and click the confirmation link before signing in.",
            });
          } else {
            toast({
              variant: "destructive",
              title: "Sign in failed",
              description: error.message,
            });
          }
        }
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isResetPassword 
              ? "Reset your password"
              : isSignUp 
                ? "Create an account" 
                : "Sign in to your account"}
          </h2>
        </div>

        <form onSubmit={handleEmailAuth} className="mt-8 space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            {isSignUp && !isResetPassword && (
              <>
                <div>
                  <label htmlFor="firstName" className="sr-only">
                    First Name
                  </label>
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
                  <label htmlFor="lastName" className="sr-only">
                    Last Name
                  </label>
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
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
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
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
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

          <div>
            <Button type="submit" className="w-full">
              {isResetPassword 
                ? "Send reset instructions"
                : isSignUp 
                  ? "Sign up" 
                  : "Sign in"}
            </Button>
          </div>
        </form>

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

        {!isResetPassword && (
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={signInWithTwitter}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span>Continue with X</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;