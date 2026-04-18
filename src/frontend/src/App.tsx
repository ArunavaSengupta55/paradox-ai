import { Layout } from "@/components/Layout";
import { useParadoxStore } from "@/store/useParadoxStore";
import { useEffect } from "react";

export default function App() {
  const theme = useParadoxStore((s) => s.theme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <Layout />;
}
