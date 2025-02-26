import React from "react";
import { Back } from "./back";

const LinkedinScraper = () => {
    return (
      <div style={{ width: "100%", height: "700px", border: "1px solid #ccc" }}>
        <div className="p-2 mt-2 border-b flex items-center border-gray-100 dark:border-gray-800">
          <span className="text-gray-900 flex items-center rounded-full bg-blue-50 dark:bg-gray-100/50 border border-gray-100 dark:border-gray-800 pr-4 dark:text-gray-100">
            <Back />
            Back
          </span>
        </div>
        <iframe
          src="https://linked-in-extractor.vercel.app/" // Replace with the desired URL
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="Example Website"
        />
      </div>
    );
};

export default LinkedinScraper;

