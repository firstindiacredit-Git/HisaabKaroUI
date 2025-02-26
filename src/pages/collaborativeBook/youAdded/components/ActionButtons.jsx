import React from 'react';

const ActionButtons = ({ 
  transaction, 
  transactionTableRef,
  initiateNewTransaction
}) => {
  const buttons = [
    {
      type: 'get',
      onClick: () => initiateNewTransaction("you will get"),
      className: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      text: "You Will Get",
      mobileText: "Get"
    },
    {
      type: 'give',
      onClick: () => initiateNewTransaction("you will give"),
      className: "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4" />
        </svg>
      ),
      text: "You Will Give",
      mobileText: "Give"
    },
    {
      type: 'export',
      onClick: () => {
        if (transaction && transactionTableRef.current) {
          transactionTableRef.current.exportToPDF();
        }
      },
      className: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
      icon: (
        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586L7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
        </svg>
      ),
      text: "Export PDF",
      mobileText: "Export PDF"
    }
  ];

  return (
    <div className="relative z-5 mb-6 mt-6">
      {/* Desktop View */}
      <div className="hidden sm:flex gap-4">
        {buttons.map((button) => (
          <button
            key={button.type}
            type="button"
            onClick={button.onClick}
            className={`flex items-center px-6 py-3 ${button.className} text-white font-semibold rounded-xl 
              transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg`}
          >
            {button.icon}
            {button.text}
          </button>
        ))}
      </div>

      {/* Mobile View */}
      <div className="grid grid-cols-2 gap-3 sm:hidden">
        {buttons.slice(0, 2).map((button) => (
          <button
            key={button.type}
            type="button"
            onClick={button.onClick}
            className={`flex items-center justify-center px-4 py-2.5 ${button.className.replace('hover:', 'active:')} 
              text-white font-medium rounded-xl shadow-md text-sm`}
          >
            {React.cloneElement(button.icon, { className: 'w-4 h-4 mr-1.5' })}
            {button.mobileText}
          </button>
        ))}
        <button
          type="button"
          onClick={buttons[2].onClick}
          className={`flex items-center justify-center px-4 py-2.5 ${buttons[2].className.replace('hover:', 'active:')} 
            text-white font-medium rounded-xl shadow-md text-sm col-span-2`}
        >
          {React.cloneElement(buttons[2].icon, { className: 'w-4 h-4 mr-1.5' })}
          {buttons[2].mobileText}
        </button>
      </div>
    </div>
  );
};

export default ActionButtons;
