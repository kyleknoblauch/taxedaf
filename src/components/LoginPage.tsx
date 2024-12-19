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
  const { user, signInWithEmail, signUpWithEmail, signInWithTwitter, signInWithLinkedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [marketingConsent, setMarketingConsent] = useState(false);

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
        console.log('Attempting password reset for:', email);
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
        console.log('Starting sign up process for:', email);
        const { data, error } = await signUpWithEmail(email, password, { 
          data: { 
            first_name: firstName,
            last_name: lastName,
            marketing_consent: marketingConsent
          }
        });
        
        console.log('Sign up response:', { data, error });
        
        if (error?.message.includes("User already registered")) {
          console.log('User already exists error');
          toast({
            variant: "destructive",
            title: "Account already exists",
            description: "Please sign in instead or use a different email.",
          });
          setIsSignUp(false);
          return;
        }
        
        // Track signup in Omnisend with consent status
        if (marketingConsent) {
          console.log('Pushing to Omnisend:', { email, firstName, lastName });
          window.omnisend.push(["subscribe", {
            email,
            firstName,
            lastName,
            subscriptionState: "subscribed"
          }]);
        }

        toast({
          title: "Verification email sent",
          description: "Please check your email and click the confirmation link to complete your registration.",
        });
      } else {
        console.log('Attempting sign in for:', email);
        const { data, error } = await signInWithEmail(email, password);
        console.log('Sign in response:', { data, error });
        
        if (error) {
          if (error.message.includes("Email not confirmed")) {
            console.log('Email not confirmed error');
            toast({
              variant: "destructive",
              title: "Email not confirmed",
              description: "Please check your email and click the confirmation link before signing in.",
            });
          } else {
            console.log('Sign in error:', error);
            toast({
              variant: "destructive",
              title: "Sign in failed",
              description: error.message,
            });
          }
        }
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <AuthHeader isResetPassword={isResetPassword} isSignUp={isSignUp} />
        
        <EmailPasswordForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          isSignUp={isSignUp}
          isResetPassword={isResetPassword}
          marketingConsent={marketingConsent}
          setMarketingConsent={setMarketingConsent}
          onSubmit={handleEmailAuth}
        />

        <AuthLinks
          isSignUp={isSignUp}
          isResetPassword={isResetPassword}
          setIsSignUp={setIsSignUp}
          setIsResetPassword={setIsResetPassword}
        />

        {!isResetPassword && (
          <SocialAuth 
            onTwitterSignIn={signInWithTwitter}
            onLinkedInSignIn={signInWithLinkedIn}
          />
        )}
      </div>
    </div>
  );
};

export default LoginPage;