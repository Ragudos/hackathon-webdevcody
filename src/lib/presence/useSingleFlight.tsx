/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

type UpNext<F extends (...args: Array<any>) => Promise<unknown>> = {
  fn: F,
  resolve: unknown,
  reject: unknown,
  args: Parameters<F>
}

type FlightStatus<F extends (...args: Array<any>) => Promise<unknown>> = {
  inFlight: boolean,
  upNext: UpNext<F> | null
}

export const useSingleFlight = <F extends (...args: Array<any>) => Promise<unknown>>
  (fn: F) => {
  const flightStatus = React.useRef({
    inFlight: false as boolean,
    upNext: null as null | UpNext<F>
  } satisfies FlightStatus<F>);

  return React.useCallback(
    (...args: Parameters<F>): ReturnType<F> | void => {
      if (flightStatus.current.inFlight) {
        return new Promise((resolve, reject) => {
          flightStatus.current.upNext = { fn, resolve, reject, args };
        }) as ReturnType<F>;
      }

      flightStatus.current.inFlight = true;
      const firstRequest = fn(...args) as ReturnType<F>;

      while (flightStatus.current.upNext) {
        const current = flightStatus.current.upNext;
        flightStatus.current.upNext = null;
        current.fn(...current.args)
          .then(current.resolve as ((value: unknown) => unknown) | null | undefined)
          .catch(current.reject as ((value: unknown) => unknown) | null | undefined);
      }
      flightStatus.current.inFlight = false;

      return firstRequest;
    },
    [fn]
  );
};