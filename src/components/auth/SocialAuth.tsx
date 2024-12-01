import { Button } from "@/components/ui/button";

interface SocialAuthProps {
  onTwitterSignIn: () => void;
}

export const SocialAuth = ({ onTwitterSignIn }: SocialAuthProps) => (
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
        onClick={onTwitterSignIn}
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
);