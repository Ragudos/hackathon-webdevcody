import { useConvexAuth, useMutation } from "convex/react";
import React from "react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/clerk-react";

const useStoreUser = () => {
	const { isLoading, isAuthenticated } = useConvexAuth();
	const { user } = useUser();

	const [userID, setUserID] = React.useState<Id<"users"> | null>(null);
	const storeUser = useMutation(api.users.store);

	React.useEffect(() => {
		if (!isAuthenticated) {
			return;
		}

		storeUser().then(setUserID);

		return () => {
			setUserID(null);
		};
	}, [isAuthenticated, user?.id, storeUser]);

	return { isLoading, isAuthenticated, userID };
};

export default useStoreUser;
