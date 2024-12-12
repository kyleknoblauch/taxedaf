import { Button } from "@/components/ui/button";

interface SubscriptionButtonProps {
  type: 'lifetime' | 'quarterly' | 'trial';
  price?: string;
  originalPrice?: string;
  isLoading: boolean;
  onSubscribe: (type: 'lifetime' | 'quarterly' | 'trial') => void;
}

export const SubscriptionButton = ({ 
  type, 
  price, 
  originalPrice,
  isLoading,
  onSubscribe 
}: SubscriptionButtonProps) => {
  const getButtonText = () => {
    if (isLoading) return 'Processing...';
    
    switch (type) {
      case 'lifetime':
        return 'Get Lifetime Access';
      case 'quarterly':
        return 'Get 3 Months Access';
      case 'trial':
        return "I'm broke, let me use it for another 30 days for free";
    }
  };

  if (type === 'trial') {
    return (
      <button
        onClick={() => onSubscribe(type)}
        className="text-sm text-muted-foreground hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        {getButtonText()}
      </button>
    );
  }

  return (
    <div className="border rounded-lg p-4 hover:border-primary transition-colors">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold">
          {type === 'lifetime' ? 'Lifetime Access' : 'Quarterly Access'}
        </h3>
        <div className="text-right">
          {originalPrice && (
            <span className="text-sm line-through text-muted-foreground mr-2">
              {originalPrice}
            </span>
          )}
          <span className="text-lg font-bold">{price}</span>
        </div>
      </div>
      <Button 
        className="w-full" 
        variant={type === 'lifetime' ? 'default' : 'outline'}
        onClick={() => onSubscribe(type)}
        disabled={isLoading}
      >
        {getButtonText()}
      </Button>
    </div>
  );
};