import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import { MotionConfig } from "framer-motion";
import BrightHome, { ModeSwitch } from "./pages/BrightHome";
import { useTheme } from "./contexts/ThemeContext";
import LeaveNote from "./components/LeaveNote";
import { lazy, Suspense } from "react";
const PrivateNotes = lazy(() => import("./pages/PrivateNotes"));
function OwnerRoute() { return <Suspense fallback={<div style={{ padding:40 }}>404<br />Nothing here.</div>}><PrivateNotes /></Suspense>; }

function Portfolio() {
  const { theme } = useTheme();
  return (
    <>
      {theme === "light" ? (
        <BrightHome />
      ) : (
        <>
          <header className="dark-theme-header">
            <span>nourah</span>
            <ModeSwitch />
          </header>
          <Home />
        </>
      )}
      <LeaveNote />
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Portfolio} />
      <Route path="/n-1350c3164f9571a92386ede205b5e6e17aa891a12291d21a" component={OwnerRoute} />
      <Route path="/s-20bbf1274fbb9e796eb540bad32c3931ae0dd27ebf3dee27" component={OwnerRoute} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster />
          <MotionConfig reducedMotion="user">
            <Router />
          </MotionConfig>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
