import "./App.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Component } from "./components/component/component";

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Component />
    </ThemeProvider>
  );
}

export default App;
