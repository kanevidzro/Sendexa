// components/ui/EnhancedLoader.tsx
import { cn } from "@/lib/utils";

interface EnhancedLoaderProps {
  message?: string;
  subMessage?: string;
  className?: string;
  spinnerSize?: "sm" | "md" | "lg";
  showLogo?: boolean;
}

export function EnhancedLoader({
  message = "Loading...",
  subMessage,
  className,
  spinnerSize = "md",
  showLogo = false,
}: EnhancedLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-3",
    lg: "w-16 h-16 border-4",
  };

  const dotSizes = {
    sm: "w-1 h-1",
    md: "w-1.5 h-1.5",
    lg: "w-2 h-2",
  };

  return (
    <div className={cn("flex flex-col items-center justify-center p-8", className)}>
      {showLogo && (
        <div className="mb-6">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
            <span className="text-xl">🚀</span>
          </div>
        </div>
      )}
      
      {/* Animated spinner with gradient */}
      <div className="relative">
        {/* Outer ring with gradient */}
        <div className={cn(
          "border-4 border-transparent rounded-full animate-spin",
          sizeClasses[spinnerSize],
          "bg-gradient-to-r from-primary/20 via-primary/10 to-transparent",
          "before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-primary before:to-primary/50 before:blur-sm"
        )}></div>
        
        {/* Inner dot */}
        <div className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2",
          dotSizes[spinnerSize],
          "bg-primary rounded-full"
        )}></div>
      </div>
      
      {/* Loading text */}
      <div className="mt-6 text-center">
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 animate-pulse">
          {message}
        </p>
        {subMessage && (
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {subMessage}
        </p>
        )}
      </div>
      
      {/* Optional progress bar */}
      <div className="mt-4 w-48 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-primary rounded-full animate-[loading_1.5s_ease-in-out_infinite]"></div>
      </div>
    </div>
  );
}