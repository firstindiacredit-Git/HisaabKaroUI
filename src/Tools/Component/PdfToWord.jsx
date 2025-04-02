import React from "react";
import { Back } from "./back";

const PdfToWord = () => {
    return (
      <div style={{ width: "100%", height: "600px", border: "1px solid #ccc" , backgroundColor: "white" }}>
        <div className="p-2 border-b flex items-center border-gray-100 dark:border-gray-800">
          <span className="text-gray-900 flex items-center rounded-full bg-blue-50 dark:bg-gray-100/50 border border-gray-100 dark:border-gray-800 pr-4 dark:text-gray-700">
            <Back />
            Back
          </span>
        </div>
        <iframe
          src="https://pdftowordpizeonfly.vercel.app/" // Replace with the desired URL
          width="100%"
          height="100%"
          style={{ border: "none" }}
          title="Example Website"
        />
      </div>
    );
};

export default PdfToWord;
