import { Logo } from "@/components/Logo";
import { useAuth } from "@/components/AuthProvider";

interface WelcomeSectionProps {
  greeting: string;
}

export const WelcomeSection = ({ greeting }: WelcomeSectionProps) => {
  const { user } = useAuth();

  return (
    <div className="text-center mt-8 mb-12">
      <Logo width="40" className="mx-auto mb-2.5" />
      <h1 className="text-4xl font-display font-black text-foreground mb-4">
        taxed<span className="text-primary">AF</span>
      </h1>
      {user ? (
        <p className="text-lg text-muted-foreground mb-2">{greeting}</p>
      ) : (
        <p className="text-lg text-muted-foreground mb-2">
          Welcome to the smartest way to handle your self-employed taxes
        </p>
      )}
    </div>
  );
};