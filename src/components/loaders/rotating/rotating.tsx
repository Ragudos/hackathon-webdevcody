import React from "react";
import styles from "./rotating.module.scss";

type Props = {
  size: "sm" | "md" | "lg";
  text?: string;
}

const RotatingLoader: React.FC<Props> = ({
  size,
  text
}) => (
  <React.Fragment>
    {text ? (
      <div className={styles["rotating-container"]}>
        <span className={`${styles["rotating-loader"]} ${styles[size]} animate-spin`} />
        <span>{text}</span>
      </div>
    ) : <span className={`${styles["rotating-loader"]} ${styles[size]} animate-spin`} />}
  </React.Fragment>
);

export default RotatingLoader;