import React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Input } from "./ui/input";

type Props = {
	onChange: (_value: string) => void;
	value: string;
	placeholder: string;
};

export const SearchBar: React.FC<Props> = ({
	onChange,
	value,
	placeholder,
}) => {
	const [toggle, setToggle] = React.useState(value ? true : false);

	return (
		<div className="my-2 relative w-full min-w-[2.25rem] min-h-[2.25rem]">
			{!toggle && (
				<Button
					onClick={() => setToggle((p) => !p)}
					variant="ghost"
					size="icon"
					className="absolute top-0 left-0 rotate-[90deg]"
					aria-label="Toggle Search Bar"
					aria-controls="searchbar"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 20 20"
						fill="currentColor"
						className="w-5 h-5"
					>
						<path
							fillRule="evenodd"
							d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
							clipRule="evenodd"
						/>
					</svg>
				</Button>
			)}

			<div
				id="searchbar"
				className={cn("w-0 relative border rounded-lg", {
					"w-full": toggle,
				})}
				aria-expanded={toggle}
			>
				{toggle && (
					<React.Fragment>
						<Input
							type="text"
							placeholder={placeholder}
							value={value}
							onChange={(e) => onChange(e.target.value)}
							aria-label="Search Bar"
							className="border-0"
							autoFocus
						/>
						<Button
							aria-controls="searchbar"
							aria-label="Close Search Bar"
							onClick={() => {
								setToggle(false);
								onChange("");
							}}
							className="bg-background absolute top-[50%] translate-y-[-50%] right-0"
							size="icon"
							variant="ghost"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor"
								className="w-5 h-5"
							>
								<path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
							</svg>
						</Button>
					</React.Fragment>
				)}
			</div>
		</div>
	);
};
