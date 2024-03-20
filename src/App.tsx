import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "./components/Navbar";
import { Component } from "./components/component/component";
function App({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      {children}
      {/* <Navbar /> */}
      <Component />
    </ThemeProvider>
  );
}

export default App;
