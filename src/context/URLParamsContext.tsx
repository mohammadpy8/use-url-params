import { createContext } from "react";
import type { TURLParamsContext } from "../types";

export const URLParamsContext = createContext<TURLParamsContext | null>(null);
