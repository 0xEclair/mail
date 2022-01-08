import './App.css';
import { CssBaseline, GeistProvider } from "@geist-ui/react";

export const Application = () => (
  <GeistProvider>
    <CssBaseline />
    <App />
  </GeistProvider>
)

function App() {
  return (
    <>
    </>
  );
}

export default Application;
