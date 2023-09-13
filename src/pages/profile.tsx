import React from "react";
import { useUser } from "@clerk/clerk-react";

import { AuthWrapper } from "@/components/auth-wapper";


const Component: React.FC = () => {
  const { user } = useUser();

  return (
    <AuthWrapper>
      <div>Profile Page</div>
    </AuthWrapper>
  );
};

Component.displayName = "ProfilePage";
export {
  Component
};