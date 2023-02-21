import React from "react";

export const StateContext = React.createContext<any>(null);
export const DispatchContext = React.createContext((() => {}) as any);
