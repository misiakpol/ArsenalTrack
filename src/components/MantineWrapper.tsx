"use client";

import { MantineProvider } from "@mantine/core";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function MantineWrapper({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const colorScheme = mounted ? (resolvedTheme === "dark" ? "dark" : "light") : "light";

  return <MantineProvider forceColorScheme={colorScheme}>{children}</MantineProvider>;
}
