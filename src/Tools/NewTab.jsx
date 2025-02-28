import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FaFilePdf,
  FaTasks,
  FaCalculator,
  FaTh,
  FaFileImage,
  FaEdit,
  FaUnlockAlt,
  FaLock,
  FaStream,
  FaCropAlt,
} from "react-icons/fa";
import {
  AiFillFileText,
  AiOutlineMergeCells,
  AiOutlineNumber,
} from "react-icons/ai";

import ButtonComponent from "./ButtonComponent";
import { FaCompress, FaList, FaScissors } from "react-icons/fa6";
import GridComponent from "./GridComponent";

const NewTab = () => {
  const { t } = useTranslation();
  const [viewType, setViewType] = useState("grid");
  const [toolsUsed, setToolsUsed] = useState(0);
  const totalTools = 60;

  // Initialize tools used from localStorage
  useEffect(() => {
    const usedTools = JSON.parse(localStorage.getItem("usedTools") || "[]");
    setToolsUsed(usedTools.length);
  }, []);

  const handleToolUse = () => {
    setToolsUsed((prev) => prev + 1);
  };

  return (
    <>
      <div className="min-h-screen w-full dark:bg-gray-900 bg-gray-50">
        {/* Header */}
        <div className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-600">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <h1 className="text-2xl dark:text-white font-bold text-gray-900">
              {t("tools.title")}
            </h1>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white dark:bg-gray-800 border-b dark:border-gray-600">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                  <span className="text-lg font-bold">
                    {Math.round((toolsUsed / totalTools) * 100)}%
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {t("tools.progress.title")}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {toolsUsed} {t("tools.progress.of")} {totalTools}{" "}
                    {t("tools.progress.explored")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`px-3 py-1 rounded-full ${
                    toolsUsed === 0
                      ? "bg-gray-100 text-gray-600"
                      : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <span className="text-sm font-medium">
                    {toolsUsed === 0
                      ? t("tools.progress.getStarted")
                      : `${toolsUsed} ${t("tools.progress.toolsUsed")}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="w-full h-2.5 bg-gray-100  rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full transition-all duration-700 ease-in-out transform hover:scale-y-110"
                  style={{
                    width: `${(toolsUsed / totalTools) * 100}%`,
                    boxShadow: "0 1px 2px rgba(30, 58, 138, 0.3)",
                  }}
                />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
              <span>{t("tools.progress.levels.beginner")}</span>
              <span>{t("tools.progress.levels.intermediate")}</span>
              <span>{t("tools.progress.levels.expert")}</span>
            </div>

            {toolsUsed === 0 && (
              <div className="mt-4 bg-blue-50 dark:bg-gray-700 rounded-lg p-4 flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-xl">💡</span>
                </div>
                <div>
                  <p className="text-sm text-blue-700 dark:text-white font-medium">
                    {t("tools.progress.notification.title")}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-white/50 mt-1">
                    {t("tools.progress.notification.message")}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* View Toggle */}
          <div className="flex justify-end mb-6">
            <div className="bg-white rounded-lg shadow-sm border p-1 inline-flex">
              <button
                onClick={() => setViewType("grid")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewType === "grid"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                title={t("tools.viewTypes.grid")}
              >
                <FaTh size={20} />
              </button>
              <button
                onClick={() => setViewType("list")}
                className={`p-2 rounded-md transition-all duration-200 ${
                  viewType === "list"
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                title={t("tools.viewTypes.list")}
              >
                <FaList size={20} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm dark:border-gray-600 border p-6">
            {viewType === "list" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
                <div>
                  <h3 className="font-semibold dark:text-white dark:border-gray-600 text-lg text-neutral-600 text-left mb-4">
                    {t("tools.categories.pdf")}
                  </h3>
                  <ButtonComponent
                    path="/imagetopdf"
                    name={t("tools.pdfTools.imageToPdf")}
                    icon={<FaFilePdf className="mr-3 text-red-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/splitpdf"
                    name={t("tools.pdfTools.splitPdf")}
                    icon={<FaScissors className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/compress"
                    name={t("tools.pdfTools.compressPdf")}
                    icon={<FaCompress className="mr-3 text-red-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/mergepdf"
                    name={t("tools.pdfTools.mergePdf")}
                    icon={
                      <AiOutlineMergeCells className="mr-3 text-blue-500" />
                    }
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/pdfconverter"
                    name={t("tools.pdfTools.wordToPdf")}
                    icon={<AiFillFileText className="mr-3 text-red-600" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/searchpdf"
                    name={t("tools.pdfTools.searchExcel")}
                    icon={<FaFilePdf className="mr-3 text-red-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/editpdf"
                    name={t("tools.pdfTools.editPdf")}
                    icon={<FaEdit className="mr-3 text-green-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/extractpages"
                    name={t("tools.pdfTools.extractPage")}
                    icon={<FaStream className="mr-3 text-blue-800" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/pdfcropper"
                    name={t("tools.pdfTools.pdfCropper")}
                    icon={<FaCropAlt className="mr-3 text-green-300" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/addpagenum"
                    name={t("tools.pdfTools.addPageNum")}
                    icon={<AiOutlineNumber className="mr-3 text-green-300" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/protect"
                    name={t("tools.pdfTools.protectPdf")}
                    icon={<FaLock className="mr-3 text-pink-700" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/unlockpdf"
                    name={t("tools.pdfTools.unlockPdf")}
                    icon={<FaUnlockAlt className="mr-3 text-pink-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/pdftoimage"
                    name={t("tools.pdfTools.pdfToImage")}
                    icon={<FaFileImage className="mr-3 text-yellow-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/pdftoword"
                    name={t("tools.pdfTools.pdfToWord")}
                    icon={<FaFilePdf className="mr-3 text-red-500" />}
                    onToolUse={handleToolUse}
                  />
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white dark:border-gray-600 text-lg text-neutral-600 text-left mb-4">
                    {t("tools.categories.tasks")}
                  </h3>
                  <ButtonComponent
                    path="/grocery"
                    name={t("tools.taskTools.groceryList")}
                    icon={<FaTasks className="mr-3 text-purple-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/bulkemailchecker"
                    name={t("tools.taskTools.emailChecker")}
                    icon={<FaTasks className="mr-3 text-purple-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/bulkemailsender"
                    name={t("tools.taskTools.emailSender")}
                    icon={<FaTasks className="mr-3 text-purple-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/googlemap"
                    name={t("tools.taskTools.googleMapExtractor")}
                    icon={<FaTasks className="mr-3 text-purple-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/cardvalidation"
                    name={t("tools.taskTools.cardValidator")}
                    icon={<FaTasks className="mr-3 text-purple-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/cardgenerator"
                    name={t("tools.taskTools.cardGenerator")}
                    icon={<FaTasks className="mr-3 text-purple-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/templategenerator"
                    name={t("tools.taskTools.htmlTemplateGenerator")}
                    icon={<FaTasks className="mr-3 text-purple-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/phonenumberformat"
                    name={t("tools.taskTools.phoneNumberFormatter")}
                    icon={<FaTasks className="mr-3 text-purple-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/randompassword"
                    name={t("tools.taskTools.randomPasswordGenerator")}
                    icon={<FaTasks className="mr-3 text-purple-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/Linkedinscraper"
                    name={t("tools.taskTools.linkedinScraper")}
                    icon={<FaTasks className="mr-3 text-purple-500" />}
                    onToolUse={handleToolUse}
                  />
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white text-lg dark:border-gray-600 text-neutral-600 text-left mb-4 pl-4">
                    {t("tools.categories.calculators")}
                  </h3>
                  <ButtonComponent
                    path="/calculator"
                    name={t("tools.calculatorTools.calculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/percentage"
                    name={t("tools.calculatorTools.percentageCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/bmi"
                    name={t("tools.calculatorTools.bmiCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/scientific"
                    name={t("tools.calculatorTools.scientificCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/compareloan"
                    name={t("tools.calculatorTools.compareLoan")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/currencyconverter"
                    name={t("tools.calculatorTools.currencyConverter")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/fractioncalculator"
                    name={t("tools.calculatorTools.fractionCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/averagecalculator"
                    name={t("tools.calculatorTools.averageCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/lcm"
                    name={t("tools.calculatorTools.lcmCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/agecalculator"
                    name={t("tools.calculatorTools.ageCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/datediffcalculator"
                    name={t("tools.calculatorTools.dateDifferenceCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/compoundintrest"
                    name={t("tools.calculatorTools.compoundInterestCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/simpleinterest"
                    name={t("tools.calculatorTools.simpleInterestCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/discountcalculator"
                    name={t("tools.calculatorTools.discountCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/gstcalculator"
                    name={t("tools.calculatorTools.gstCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/vatcalculator"
                    name={t("tools.calculatorTools.vatCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/electricitybill"
                    name={t("tools.calculatorTools.electricityBillCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/testscorecalculator"
                    name={t("tools.calculatorTools.testScoreCalculator")}
                    icon={<FaCalculator className="mr-3 text-teal-500" />}
                    onToolUse={handleToolUse}
                  />
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white text-lg text-neutral-600 text-left dark:border-gray-600 mb-4 pl-4">
                    {t("tools.categories.converters")}
                  </h3>
                  <ButtonComponent
                    path="/faren-to-celcius"
                    name={t("tools.converterTools.fahrenheitToCelsius")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/second"
                    name={t("tools.converterTools.secondToHour")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/hours"
                    name={t("tools.converterTools.hourToSecond")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/texttospeech"
                    name={t("tools.converterTools.textToSpeech")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/speechtotext"
                    name={t("tools.converterTools.speechToText")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/onlinevoiceRecorder"
                    name={t("tools.converterTools.onlineVoiceRecorder")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/onlinescreenRecorder"
                    name={t("tools.converterTools.onlineScreenRecorder")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/onlinescreenshot"
                    name={t("tools.converterTools.onlineScreenshot")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/onlinewebcamtest"
                    name={t("tools.converterTools.onlineWebcamTest")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/calendar"
                    name={t("tools.converterTools.calendar")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/clock"
                    name={t("tools.converterTools.clock")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/stopwatch"
                    name={t("tools.converterTools.stopWatch")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/timer"
                    name={t("tools.converterTools.countdownTimer")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/alarm"
                    name={t("tools.converterTools.alarmClock")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/binarytodecimal"
                    name={t("tools.converterTools.binaryToDecimal")}
                    icon={<FaFilePdf className="mr-3 text-blue-500" />}
                    onToolUse={handleToolUse}
                  />
                </div>
                <div>
                  <h3 className="font-semibold dark:text-white text-lg text-neutral-600 text-left mb-4 dark:border-gray-600 pl-4">
                    {t("tools.categories.misc")}
                  </h3>
                  <ButtonComponent
                    path="/paypal"
                    name={t("tools.miscTools.paypalLink")}
                    icon={<FaFilePdf className="mr-3 text-pink-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/beautifier"
                    name={t("tools.miscTools.htmlBeautifier")}
                    icon={<FaFilePdf className="mr-3 text-pink-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/resumebuild"
                    name={t("tools.miscTools.resumeBuilder")}
                    icon={<FaFilePdf className="mr-3 text-pink-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/linkchecker"
                    name={t("tools.miscTools.linkChecker")}
                    icon={<FaFilePdf className="mr-3 text-pink-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/wordcounter"
                    name={t("tools.miscTools.wordCounter")}
                    icon={<FaFilePdf className="mr-3 text-pink-500" />}
                    onToolUse={handleToolUse}
                  />
                  <ButtonComponent
                    path="/trafficchecker"
                    name={t("tools.miscTools.trafficChecker")}
                    icon={<FaFilePdf className="mr-3 text-pink-500" />}
                    onToolUse={handleToolUse}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-12">
                {/* PDF Section */}
                <div>
                  <h3 className="font-semibold dark:text-white text-xl text-gray-900 mb-6 pb-2 dark:border-gray-600 border-b">
                    {t("tools.categories.pdf")}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <GridComponent
                      path="/imagetopdf"
                      name={t("tools.pdfTools.imageToPdf")}
                      icon={<FaFilePdf className="text-red-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/splitpdf"
                      name={t("tools.pdfTools.splitPdf")}
                      icon={<FaScissors className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/compress"
                      name={t("tools.pdfTools.compressPdf")}
                      icon={<FaCompress className="text-red-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/mergepdf"
                      name={t("tools.pdfTools.mergePdf")}
                      icon={<AiOutlineMergeCells className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/pdfconverter"
                      name={t("tools.pdfTools.wordToPdf")}
                      icon={<AiFillFileText className="text-red-600" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/searchpdf"
                      name={t("tools.pdfTools.searchExcel")}
                      icon={<FaFilePdf className="text-red-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/editpdf"
                      name={t("tools.pdfTools.editPdf")}
                      icon={<FaEdit className="text-green-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/extractpages"
                      name={t("tools.pdfTools.extractPage")}
                      icon={<FaStream className="text-blue-800" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/pdfcropper"
                      name={t("tools.pdfTools.pdfCropper")}
                      icon={<FaCropAlt className="text-green-300" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/addpagenum"
                      name={t("tools.pdfTools.addPageNum")}
                      icon={<AiOutlineNumber className="text-green-300" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/protect"
                      name={t("tools.pdfTools.protectPdf")}
                      icon={<FaLock className="text-pink-700" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/unlockpdf"
                      name={t("tools.pdfTools.unlockPdf")}
                      icon={<FaUnlockAlt className="text-pink-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/pdftoimage"
                      name={t("tools.pdfTools.pdfToImage")}
                      icon={<FaFileImage className="text-yellow-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/pdftoword"
                      name={t("tools.pdfTools.pdfToWord")}
                      icon={<FaFilePdf className="text-red-500" />}
                      onToolUse={handleToolUse}
                    />
                  </div>
                </div>

                {/* TODO Section */}
                <div>
                  <h3 className="font-semibold dark:text-white text-xl text-gray-900 mb-6 pb-2 dark:border-gray-600 border-b">
                    {t("tools.categories.tasks")}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <GridComponent
                      path="/grocery"
                      name={t("tools.taskTools.groceryList")}
                      icon={<FaTasks className="text-purple-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/bulkemailchecker"
                      name={t("tools.taskTools.emailChecker")}
                      icon={<FaTasks className="text-purple-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/bulkemailsender"
                      name={t("tools.taskTools.emailSender")}
                      icon={<FaTasks className="text-purple-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/googlemap"
                      name={t("tools.taskTools.googleMapExtractor")}
                      icon={<FaTasks className="text-purple-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/cardvalidation"
                      name={t("tools.taskTools.cardValidator")}
                      icon={<FaTasks className="text-purple-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/cardgenerator"
                      name={t("tools.taskTools.cardGenerator")}
                      icon={<FaTasks className="text-purple-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/templategenerator"
                      name={t("tools.taskTools.htmlTemplateGenerator")}
                      icon={<FaTasks className="text-purple-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/phoneNumberFormat"
                      name={t("tools.taskTools.phoneNumberFormatter")}
                      icon={<FaTasks className="text-purple-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/randompassword"
                      name={t("tools.taskTools.randomPasswordGenerator")}
                      icon={<FaTasks className="text-purple-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/linkedinscraper"
                      name={t("tools.taskTools.linkedinScraper")}
                      icon={<FaTasks className="text-purple-500" />}
                      onToolUse={handleToolUse}
                    />
                  </div>
                </div>

                {/* Calculator Section */}
                <div>
                  <h3 className="font-semibold dark:text-white text-xl text-gray-900 mb-6 pb-2 dark:border-gray-600 border-b">
                    {t("tools.categories.calculators")}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <GridComponent
                      path="/calculator"
                      name={t("tools.calculatorTools.calculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/percentage"
                      name={t("tools.calculatorTools.percentageCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/bmi"
                      name={t("tools.calculatorTools.bmiCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/scientific"
                      name={t("tools.calculatorTools.scientificCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/compareloan"
                      name={t("tools.calculatorTools.compareLoan")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/currencyconverter"
                      name={t("tools.calculatorTools.currencyConverter")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/fractioncalculator"
                      name={t("tools.calculatorTools.fractionCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/averagecalculator"
                      name={t("tools.calculatorTools.averageCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/lcm"
                      name={t("tools.calculatorTools.lcmCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/agecalculator"
                      name={t("tools.calculatorTools.ageCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/datediffcalculator"
                      name={t("tools.calculatorTools.dateDifferenceCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/compoundintrest"
                      name={t(
                        "tools.calculatorTools.compoundInterestCalculator"
                      )}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/simpleinterest"
                      name={t("tools.calculatorTools.simpleInterestCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/discountcalculator"
                      name={t("tools.calculatorTools.discountCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/gstcalculator"
                      name={t("tools.calculatorTools.gstCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/vatcalculator"
                      name={t("tools.calculatorTools.vatCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/electricitybill"
                      name={t(
                        "tools.calculatorTools.electricityBillCalculator"
                      )}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/testscorecalculator"
                      name={t("tools.calculatorTools.testScoreCalculator")}
                      icon={<FaCalculator className="text-teal-500" />}
                      onToolUse={handleToolUse}
                    />
                  </div>
                </div>

                {/* Converter Section */}
                <div>
                  <h3 className="font-semibold text-xl dark:text-white text-gray-900 mb-6 pb-2 dark:border-gray-600 border-b">
                    {t("tools.categories.converters")}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <GridComponent
                      path="/faren-to-celcius"
                      name={t("tools.converterTools.fahrenheitToCelsius")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/second"
                      name={t("tools.converterTools.secondToHour")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/hours"
                      name={t("tools.converterTools.hourToSecond")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/texttospeech"
                      name={t("tools.converterTools.textToSpeech")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/speechtotext"
                      name={t("tools.converterTools.speechToText")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/onlinevoiceRecorder"
                      name={t("tools.converterTools.onlineVoiceRecorder")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/onlinescreenRecorder"
                      name={t("tools.converterTools.onlineScreenRecorder")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/onlinescreenshot"
                      name={t("tools.converterTools.onlineScreenshot")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/onlinewebcamtest"
                      name={t("tools.converterTools.onlineWebcamTest")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/calendar"
                      name={t("tools.converterTools.calendar")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/clock"
                      name={t("tools.converterTools.clock")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/stopwatch"
                      name={t("tools.converterTools.stopWatch")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/timer"
                      name={t("tools.converterTools.countdownTimer")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/alarm"
                      name={t("tools.converterTools.alarmClock")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/binarytodecimal"
                      name={t("tools.converterTools.binaryToDecimal")}
                      icon={<FaFilePdf className="text-blue-500" />}
                      onToolUse={handleToolUse}
                    />
                  </div>
                </div>

                {/* Misc Section */}
                <div>
                  <h3 className="font-semibold dark:text-white text-xl text-gray-900 mb-6 pb-2 dark:border-gray-600 border-b">
                    {t("tools.categories.misc")}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    <GridComponent
                      path="/paypal"
                      name={t("tools.miscTools.paypalLink")}
                      icon={<FaFilePdf className="text-pink-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/beautifier"
                      name={t("tools.miscTools.htmlBeautifier")}
                      icon={<FaFilePdf className="text-pink-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/resumebuild"
                      name={t("tools.miscTools.resumeBuilder")}
                      icon={<FaFilePdf className="text-pink-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/linkchecker"
                      name={t("tools.miscTools.linkChecker")}
                      icon={<FaFilePdf className="text-pink-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/wordcounter"
                      name={t("tools.miscTools.wordCounter")}
                      icon={<FaFilePdf className="text-pink-500" />}
                      onToolUse={handleToolUse}
                    />
                    <GridComponent
                      path="/trafficchecker"
                      name={t("tools.miscTools.trafficChecker")}
                      icon={<FaFilePdf className="text-pink-500" />}
                      onToolUse={handleToolUse}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NewTab;
