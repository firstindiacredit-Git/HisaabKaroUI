import React, { useState } from "react";
import { Back } from "./back";

const CompareLoan = () => {
    const [loan1, setLoan1] = useState({ principal: '', interest: '', tenure: '' });
    const [loan2, setLoan2] = useState({ principal: '', interest: '', tenure: '' });
    const [results, setResults] = useState({ emi1: 0, emi2: 0, totalInterest1: 0, totalInterest2: 0, totalPayment1: 0, totalPayment2: 0 });
    const [showComparePopup, setShowComparePopup] = useState(true);

    const calculateEMI = (P, R, N) => {
        const monthlyRate = R / 12 / 100;
        return (P * monthlyRate * Math.pow(1 + monthlyRate, N)) / (Math.pow(1 + monthlyRate, N) - 1);
    };

    const handleCompare = () => {
        const emi1 = calculateEMI(parseFloat(loan1.principal), parseFloat(loan1.interest), parseInt(loan1.tenure));
        const emi2 = calculateEMI(parseFloat(loan2.principal), parseFloat(loan2.interest), parseInt(loan2.tenure));
        const totalPayment1 = emi1 * parseInt(loan1.tenure);
        const totalPayment2 = emi2 * parseInt(loan2.tenure);
        const totalInterest1 = totalPayment1 - parseFloat(loan1.principal);
        const totalInterest2 = totalPayment2 - parseFloat(loan2.principal);

        setResults({ emi1, emi2, totalInterest1, totalInterest2, totalPayment1, totalPayment2 });
    };

    const handleClear = () => {
        setLoan1({ principal: '', interest: '', tenure: '' });
        setLoan2({ principal: '', interest: '', tenure: '' });
        setResults({ emi1: 0, emi2: 0, totalInterest1: 0, totalInterest2: 0, totalPayment1: 0, totalPayment2: 0 });
    };

    const closeComparePopup = () => {
        setShowComparePopup(false);
    };

    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900  flex items-start justify-center pt-4">
        <div className="max-w-4xl w-full px-2">
          <div className="bg-white dark:bg-gray-800 rounded-[30px] shadow-md overflow-hidden border-2 dark:border-gray-600 border-gray-100">
            {/* Back Button */}
            <div className="p-4 border-b flex items-center border-gray-100 ">
              <span className="text-gray-900 flex items-center rounded-full bg-blue-50 dark:bg-gray-100/50 border border-gray-100 dark:border-gray-800 dark:bg-gray-800 pr-4">
                <Back />
                Back
              </span>
            </div>

            {/* Header */}
                <div className="bg-gray-50 dark:bg-gray-800  p-2 border-b  dark:border-gray-600 border-gray-100">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white text-center">
                Compare Loans
              </h1>
            </div>

            <div className="p-4">
              {/* Input Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Loan 1 Section */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Loan 1 Details
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">
                      Principal Amount
                    </label>
                    <input
                      type="number"
                      value={loan1.principal}
                      onChange={(e) =>
                        setLoan1({ ...loan1, principal: e.target.value })
                      }
                      className="w-full px-3 py-2 dark:bg-gray-600 dark:border-gray-600 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                      placeholder="Enter principal amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      value={loan1.interest}
                      onChange={(e) =>
                        setLoan1({ ...loan1, interest: e.target.value })
                      }
                      className="w-full px-3 py-2 dark:bg-gray-600 dark:border-gray-600 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                      placeholder="Enter interest rate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">
                      Tenure (Months)
                    </label>
                    <input
                      type="number"
                      value={loan1.tenure}
                      onChange={(e) =>
                        setLoan1({ ...loan1, tenure: e.target.value })
                      }
                      className="w-full px-3 py-2 dark:bg-gray-600 dark:border-gray-600 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                      placeholder="Enter loan tenure"
                    />
                  </div>
                </div>

                {/* Loan 2 Section */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4 space-y-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
                    Loan 2 Details
                  </h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">
                      Principal Amount
                    </label>
                    <input
                      type="number"
                      value={loan2.principal}
                      onChange={(e) =>
                        setLoan2({ ...loan2, principal: e.target.value })
                      }
                      className="w-full px-3 py-2 dark:bg-gray-600 dark:border-gray-600 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                      placeholder="Enter principal amount"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">
                      Interest Rate (%)
                    </label>
                    <input
                      type="number"
                      value={loan2.interest}
                      onChange={(e) =>
                        setLoan2({ ...loan2, interest: e.target.value })
                      }
                        className="w-full px-3 py-2 dark:bg-gray-600 dark:border-gray-600 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                      placeholder="Enter interest rate"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 dark:text-white mb-1">
                      Tenure (Months)
                    </label>
                    <input
                      type="number"
                      value={loan2.tenure}
                      onChange={(e) =>
                        setLoan2({ ...loan2, tenure: e.target.value })
                      }
                      className="w-full px-3 py-2 dark:border-gray-600   dark:bg-gray-600 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-colors"
                      placeholder="Enter loan tenure"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-center space-x-4 mb-6">
                <button
                  onClick={handleCompare}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Compare Loans
                </button>
                <button
                  onClick={handleClear}
                  className="px-6 py-2 bg-gray-500 text-white font-medium rounded-xl hover:bg-gray-600 transition-all duration-200"
                >
                  Clear
                </button>
              </div>

              {/* Results Section */}
              {(results.emi1 !== 0 || results.emi2 !== 0) && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
                    Comparison Results
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Loan 1 Results */}
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                        Loan 1
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm dark:text-gray-400 text-gray-600">Monthly EMI</p>
                          <p className="text-lg font-bold dark:text-white text-gray-800">
                            {" "}
                            {results.emi1.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm dark:text-gray-400 text-gray-600">
                            Total Interest
                          </p>
                          <p className="text-lg font-bold dark:text-white text-gray-800">
                            {" "}
                            {results.totalInterest1.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm dark:text-gray-400 text-gray-600">Total Payment</p>
                          <p className="text-lg font-bold dark:text-white text-gray-800">
                            {" "}
                            {results.totalPayment1.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Loan 2 Results */}
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                        Loan 2
                      </h3>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm dark:text-gray-400 text-gray-600">Monthly EMI</p>
                          <p className="text-lg font-bold dark:text-white text-gray-800">
                            {" "}
                            {results.emi2.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm dark:text-gray-400 text-gray-600">
                            Total Interest
                          </p>
                          <p className="text-lg font-bold dark:text-white text-gray-800">
                            {" "}
                            {results.totalInterest2.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm dark:text-gray-400 text-gray-600">Total Payment</p>
                          <p className="text-lg font-bold dark:text-white text-gray-800">
                            {" "}
                            {results.totalPayment2.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Difference Section */}
                    <div className="md:col-span-2 bg-white dark:bg-gray-600 p-4 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-semibold text-red-600 mb-3">
                        Difference (Loan 1 - Loan 2)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm dark:text-gray-400 text-gray-600">
                            EMI Difference
                          </p>
                          <p className="text-lg font-bold dark:text-white text-gray-800">
                            {" "}
                            {(results.emi1 - results.emi2).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm dark:text-gray-400 text-gray-600">
                            Interest Difference
                          </p>
                          <p className="text-lg font-bold dark:text-white text-gray-800">
                            {" "}
                            {(
                              results.totalInterest1 - results.totalInterest2
                            ).toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm dark:text-gray-400 text-gray-600">
                            Total Payment Difference
                          </p>
                          <p className="text-lg font-bold dark:text-white text-gray-800">
                            {" "}
                            {(
                              results.totalPayment1 - results.totalPayment2
                            ).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default CompareLoan;