import { useContext } from "react";
import { GlobalContext } from "../context/GlobalContext.jsx";

export function useGlobal() {
  return useContext(GlobalContext);
}
