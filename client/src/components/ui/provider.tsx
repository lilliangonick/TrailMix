"use client";

import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes"
import { ColorModeProvider, type ColorModeProviderProps } from "./color-mode";

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      fonts: {
        heading: { value: "Space Mono, monospace" },
        body: { value: "Space Mono, monospace" }, 
        mono: { value: "Space Mono, monospace" },
      },
    },
  },
});

export function Provider(props: ColorModeProviderProps & { children: React.ReactNode }) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props}>
        <ThemeProvider attribute="class" disableTransitionOnChange>
          {props.children}
        </ThemeProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}




// export function Provider(props: { children: React.ReactNode }) {
//   return (
//     <ChakraProvider value={system}>
//       <ThemeProvider attribute="class" disableTransitionOnChange>
//         {props.children}
//       </ThemeProvider>
//     </ChakraProvider>
//   )
// }