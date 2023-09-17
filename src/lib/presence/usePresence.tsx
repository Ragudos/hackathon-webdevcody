/* eslint-disable react-refresh/only-export-components */
import type { Id } from "convex/_generated/dataModel";
import { api } from "convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { Value } from "convex/values";

import React from "react";

import { useSingleFlight } from "./useSingleFlight";

export type PresenceData<D> = {
  _id: Id<"presence">,
  _creationTime: number,
  updatedAt: number,
  userID: Id<"users">,
  roomID: Id<"chatRooms"> | Id<"notes">,
  data: D
}

export const HEARTBEAT = 5000;
export const TIME_OFFLINE_TO_CONSIDER_USER_OFFLINe = 10_000;

const usePresence = <T extends { [key: string]: Value }>(
  roomID: Id<"chatRooms"> | Id<"notes">,
  userID: Id<"users">,
  initialData: T,
  heartbeat = HEARTBEAT
) => {
  const [data, setData] = React.useState(initialData);

  const presence  = useQuery(api.presence.getPresence, { roomID });

  const updatePresence = useSingleFlight(useMutation(api.presence.updatePresence));
  const updateHeartbeat = useSingleFlight(useMutation(api.presence.onHeartbeat));

  React.useEffect(() => {
    void updatePresence({ roomID, userID, data });
    const intervalID = setInterval(() => {
      void updateHeartbeat({ roomID });
    }, heartbeat);

    return () => {
      clearInterval(intervalID);
    };
  }, [
    updatePresence,
    updateHeartbeat,
    roomID,
    userID,
    data,
    heartbeat
  ]);

  const updateData = React.useCallback(
    (updatedData: Partial<T>) => {
      setData((prevData) => ({ ...prevData, updatedData }));
    },
    []
  );
  
  return [data, presence, updateData] as const;
};

export const isOnline = <D,>(presence: PresenceData<D>) => (
  Date.now() - presence.updatedAt < TIME_OFFLINE_TO_CONSIDER_USER_OFFLINe 
);

export default usePresence;