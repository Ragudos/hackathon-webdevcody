import React from "react";
import { ThemeContext } from "./theme";

export const useTheme = () => (
  React.useContext(ThemeContext)
);