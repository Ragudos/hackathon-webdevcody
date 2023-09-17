import { AuthWrapper } from "@/components/auth-wapper";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

export const Component: React.FC = () => (
    <AuthWrapper>
      <Heading
        typeOfHeading="h1"
        description="This page does not have anything. Perhaps you meant to see one of your notes?"
      >
        404 | Page Not Found
      </Heading>
      <Button
        onClick={() => history.back()}
        type="button"
        title="Go back to Homepage"
        aria-label="Go back to Homepage"
      >
        <ArrowLeftIcon className="w-4 h-4" />
        Go back
      </Button>
    </AuthWrapper>
  );