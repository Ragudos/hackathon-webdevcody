import { cn } from "@/lib/utils";
import React from "react";

type Headings = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
	typeOfHeading: Headings;
	className?: string;
	description?: string;
	descriptionStyles?: string;
	containerStyles?: string;
	children: React.ReactNode;
};

const getHeading = (
	typeOfHeading: Headings,
	children: React.ReactNode,
	className?: string,
) => {
	switch (typeOfHeading) {
		case "h1":
			return <h1 className={cn("font-heading", className)}>{children}</h1>;
		case "h2":
			return <h2 className={cn("font-heading", className)}>{children}</h2>;
		case "h3":
			return <h3 className={cn("font-heading", className)}>{children}</h3>;
		case "h4":
			return <h4 className={cn("font-heading", className)}>{children}</h4>;
		case "h5":
			return <h5 className={cn("font-heading", className)}>{children}</h5>;
		case "h6":
			return <h6 className={cn("font-heading", className)}>{children}</h6>;
	}
};

export const Heading: React.FC<Props> = ({
	typeOfHeading,
	className,
	description,
	descriptionStyles,
	containerStyles,
	children,
}) => {
	if (description) {
		return (
			<div
				className={cn(
					"break-words overflow-auto whitespace-pre-wrap flex flex-col gap-1 text-center",
					containerStyles,
				)}
			>
				{getHeading(typeOfHeading, children, className)}
				<p className={cn("lg:text-lg", descriptionStyles)}>{description}</p>
			</div>
		);
	} else {
		return getHeading(typeOfHeading, children, className);
	}
};
