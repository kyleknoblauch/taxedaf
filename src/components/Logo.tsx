import { useTheme } from "@/components/ThemeProvider";

export const Logo = ({ className = "", width = "80" }: { className?: string; width?: string }) => {
  const { theme } = useTheme();
  
  // Calculate height based on original aspect ratio (229.78/245.85)
  const height = (Number(width) * 229.78 / 245.85).toString();
  
  // Use theme-aware colors
  const fillColor = theme === 'dark' ? 'hsl(var(--foreground))' : 'hsl(var(--foreground))';

  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 245.85 229.78"
      className={className}
      aria-label="taxedAF Logo"
    >
      <g className="transition-colors duration-200">
        <path
          d="m43.01,223.26c-1.9,0-3.83-.29-5.74-.91-9.82-3.17-15.22-13.7-12.05-23.52C53.43,111.3,128.92,59.05,227.16,59.05c10.32,0,18.69,8.37,18.69,18.69s-8.37,18.69-18.69,18.69c-42.64,0-79.17,10.85-108.58,32.24-26.9,19.57-46.89,47.8-57.79,81.63-2.55,7.92-9.89,12.96-17.78,12.96Z"
          fill={fillColor}
        />
        <path
          d="m163.6,229.78c-9-.03-17.15-2.21-24.45-6.55-7.3-4.33-13.1-10.26-17.38-17.78-4.29-7.51-6.42-15.86-6.39-25.05.03-9.37,2.21-17.76,6.55-25.15,4.33-7.39,10.17-13.23,17.49-17.52,7.33-4.29,15.49-6.42,24.49-6.39,9.19.03,17.43,2.21,24.73,6.55,7.3,4.34,13.09,10.22,17.38,17.64,4.29,7.42,6.42,15.82,6.39,25.19s-2.21,17.53-6.55,25.01c-4.34,7.49-10.17,13.38-17.5,17.66-7.33,4.29-15.59,6.42-24.77,6.39Zm.39-32.35c3.94.01,7.36-1.62,10.28-4.89,2.92-3.27,4.38-7.25,4.4-11.94s-1.43-8.68-4.32-11.97c-2.9-3.29-6.31-4.94-10.25-4.96-4.13-.01-7.65,1.62-10.56,4.89-2.92,3.27-4.38,7.26-4.4,11.94-.02,4.69,1.42,8.68,4.32,11.97,2.89,3.29,6.41,4.94,10.53,4.96Z"
          fill={fillColor}
        />
        <path
          d="m90.65,24.18c-4.29-7.42-10.08-13.3-17.38-17.64C65.97,2.21,57.72.02,48.54,0c-9-.03-17.17,2.1-24.49,6.39-7.33,4.29-13.16,10.13-17.5,17.52C2.21,31.31.03,39.69,0,49.06c-.03,9.19,2.1,17.55,6.39,25.06,4.29,7.51,10.08,13.44,17.38,17.77,7.3,4.34,15.45,6.52,24.45,6.55,9.19.03,17.45-2.1,24.78-6.39,7.32-4.29,13.15-10.18,17.49-17.66,4.34-7.49,6.52-15.83,6.55-25.02.03-9.37-2.1-17.77-6.39-25.19Zm-31.76,37.03c-2.92,3.27-6.34,4.9-10.28,4.89-4.13-.02-7.64-1.67-10.53-4.96-2.9-3.29-4.34-7.28-4.32-11.97.01-4.68,1.47-8.67,4.39-11.94,2.92-3.27,6.44-4.9,10.57-4.89,3.93.02,7.35,1.67,10.25,4.96,2.89,3.29,4.33,7.28,4.32,11.97-.02,4.69-1.48,8.67-4.4,11.94Z"
          fill={fillColor}
        />
      </g>
    </svg>
  );
};