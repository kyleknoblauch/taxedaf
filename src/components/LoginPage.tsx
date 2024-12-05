import { useAuth } from "./AuthProvider";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AuthHeader } from "./auth/AuthHeader";
import { EmailPasswordForm } from "./auth/EmailPasswordForm";
import { AuthLinks } from "./auth/AuthLinks";
import { SocialAuth } from "./auth/SocialAuth";

const LoginPage = () => {
  const { user, signInWithEmail, signUpWithEmail, signInWithTwitter } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);

  useEffect(() => {
    if (user) {
      const state = location.state as { returnTo?: string; estimateData?: any } | null;
      if (state?.returnTo) {
        navigate(state.returnTo, { state: { estimateData: state.estimateData } });
      } else {
        navigate('/');
      }
    }
  }, [user, navigate, location]);

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
        <AuthHeader isResetPassword={isResetPassword} isSignUp={isSignUp} />
        
        <EmailPasswordForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={setLastName}
          setLastName={setLastName}
          isSignUp={isSignUp}
          isResetPassword={isResetPassword}
          onSubmit={handleEmailAuth}
        />

        <AuthLinks
          isSignUp={isSignUp}
          isResetPassword={isResetPassword}
          setIsSignUp={setIsSignUp}
          setIsResetPassword={setIsResetPassword}
        />

        {!isResetPassword && (
          <SocialAuth onTwitterSignIn={signInWithTwitter} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;