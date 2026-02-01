import React from "react";
import "./Skeleton.css";

const Skeleton = ({ width, height, borderRadius, style, className }) => {
    return (
        <div
            className={`skeleton-loader ${className || ""}`}
            style={{
                width: width || "100%",
                height: height || "100%",
                borderRadius: borderRadius || "4px",
                ...style,
            }}
        ></div>
    );
};

export default Skeleton;
