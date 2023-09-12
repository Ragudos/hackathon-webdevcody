import React from "react";

type Headings = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

type Props = {
  typeOfHeading: Headings;
  description?: string;
  descriptionStyles?: string;
  containerStyles?: string;
  children: React.ReactNode;
}

const getHeading = (typeOfHeading: Headings, children: React.ReactNode) => {
  switch (typeOfHeading) {
    case "h1":
      return <h1>{children}</h1>;
    case "h2":
      return <h2>{children}</h2>;
    case "h3":
      return <h3>{children}</h3>;
    case "h4":
      return <h4>{children}</h4>;
    case "h5":
      return <h5>{children}</h5>;
    case "h6":
      return <h6>{children}</h6>;
  }
};

export const Heading: React.FC<Props> = ({
  typeOfHeading,
  description,
  descriptionStyles,
  containerStyles,
  children
}) => {

  if (description) {
    return (
      <div className={`${containerStyles} heading-container`}>
        {getHeading(typeOfHeading, children)}
        <p className={`${descriptionStyles}`}>{description}</p>
      </div>
    );
  } else {
    return getHeading(typeOfHeading, children);
  }
};