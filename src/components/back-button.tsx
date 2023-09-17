import { Button } from "./ui/button";


const BackButton: React.FC = () => (
  <Button
    onClick={() => history.back()}
    type="button"
    title="Go back to Homepage"
    aria-label="Go back to Homepage"
    className="w-auto gap-2"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>

    Go back
  </Button>
);

export default BackButton;