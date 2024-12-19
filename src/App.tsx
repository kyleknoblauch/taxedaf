import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { AppRouter } from "./components/router/AppRouter";
import { AuthProvider } from "./components/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OmnisendTracker } from "./components/OmnisendTracker";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>
          <OmnisendTracker />
          <AppRouter />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;