import React from "react";

export const useDidComponentMount = () => {
  const [state, setState] = React.useState(false);

  React.useEffect(() => {
    setState(true);
  }, []);

  return state;
};