import { createContext, useContext, useEffect, useState } from "react";
import { dsaProblems } from "../data/dsaProblems";
const STORAGE_KEY = "blaezi_dsa";

const DsaContext = createContext();

export function DsaProvider({ children }) {
  const [problems, setProblems] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if(stored){
      setProblems(JSON.parse(stored));
    } else{
      setProblems(dsaProblems);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(dsaProblems)
      );
    }
  }, []);
useEffect(() => {
  if (problems.length > 0) {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(problems)
    );
  }
}, [problems]);

  const updateProblemStatus = (id, status) => {
    setProblems((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              lastSolvedAt: new Date().toISOString(),
            }
          : p
      )
    );
  };

  return (
    <DsaContext.Provider value={{ problems, updateProblemStatus }}>
      {children}
    </DsaContext.Provider>
  );
}

export function useDsa() {
  return useContext(DsaContext);
}
