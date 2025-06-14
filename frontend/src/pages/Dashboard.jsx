import React, { useEffect, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { useNavigate } from "react-router-dom";

import DashboardCard from "../components/DashboardCard";
import DashboardBrekdownCard from "../components/DashboardBrekdownCard";
import DashboardPerMaint from "../components/DashboardPerMaint";
import { useNavContext } from "../contexts/NavContext";
import useChildData from "../hooks/Dashboard/getChildData";
import { useDashboardContext } from "../contexts/DashboardContext";
import useGetData from "../hooks/Dashboard/getData";
import useAvailability from "../hooks/Dashboard/Availability";
import useFuelConsumption from "../hooks/Dashboard/FuelConsumption";
import useOilConsumption from "../hooks/Dashboard/OilConsumption";
import useProductionTrench from "../hooks/Dashboard/ProductionTrench";
import useProductionPiles from "../hooks/Dashboard/ProductionPiles";
import useBreakdown from "../hooks/Dashboard/Breakdown";
import usePerMaint from "../hooks/Dashboard/PerMaint";
import useMessages from "../hooks/Dashboard/Messages";

const Dashboard = ({ socket }) => {
  const navigate = useNavigate();
  const { usersData } = useNavContext();
  const {
    error,
    errorDetails,
    fieldsLoading,
    fieldsPerLoading,
    cardsData,
    setCardsData,
    fieldsData,
    fieldsAllData,
    fieldsAllResults,
    fieldsXData,
    fieldsYData,
    fieldsPerData,
    messages,
    currentMessage,
  } = useDashboardContext();

  console.log(fieldsAllResults);

  const [startDate, setStartDate] = useState(
    new Date(
      new Date().setMinutes(
        new Date().getMinutes() - new Date().getTimezoneOffset()
      )
    )
      .toISOString()
      .slice(0, 10)
  );

  const { getChildData } = useChildData();

  const { getData } = useGetData();

  useMessages();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    if (usersData?.length > 0) getData(controller);

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [usersData]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();
    socket.on("appDataUpdate", () => getData(controller));

    return () => {
      isMounted = false;
      controller.abort();
      socket.off("appDataUpdate", () => getData(controller));
    };
  }, [socket, usersData]);

  useAvailability();

  useFuelConsumption();

  useOilConsumption();

  useProductionTrench();

  useProductionPiles();

  useBreakdown();

  usePerMaint();

  useEffect(() => {
    setCardsData([]);
  }, []);

  const changeDateValue = (e) => {
    setStartDate(e.target.value);
    setCardsData((prev) => ({
      ...prev,
      Availability: { ...prev["Availability"], dateTime: e.target.value },
      FuelConsumption: { ...prev["FuelConsumption"], dateTime: e.target.value },
      OilConsumption: { ...prev["OilConsumption"], dateTime: e.target.value },
      Breakdowns: { ...prev["Breakdowns"], dateTime: e.target.value },
      PeriodicMaintenance: {
        ...prev["PeriodicMaintenance"],
        dateTime: e.target.value,
      },
      ProductionTrench: {
        ...prev["ProductionTrench"],
        dateTime: e.target.value,
      },
      ProductionPiles: { ...prev["ProductionPiles"], dateTime: e.target.value },
    }));
  };

  return (
    <div className="w-full h-auto Main--Page flex flex-col justify-around items-center overflow-y-scroll md:mt-0 mt-[58px] gap-4">
      <div className="w-[99%] h-[3vh] bg-white p-4 flex items-center flex-row mb-2 shadow-lg rounded-md relative mt-2">
        <div className="mr-2 text-[14px] flex flex-row gap-2">
          <span className=" font-extrabold">From</span>
          <p>01/01/2023</p>
          <span className="font-extrabold">To</span>
        </div>
        <input
          className="outline-none rounded-lg mr-2 text-[14px]"
          type="date"
          value={startDate}
          onChange={changeDateValue}
        />
        <button
          onClick={() => {
            navigate("/Vnc/8000");
          }}
        >
          VNC
        </button>
      </div>
      <div className="w-full flex md:flex-row flex-col flex-wrap relative gap-2 p-2">
        {(Number(fieldsData.Availability) !== 0 || cardsData?.Availability) && (
          <DashboardCard
            name="Availability"
            title="Availability"
            value={`${fieldsData.Availability} %`}
            percentage={`${fieldsPerData.Availability} %`}
            getChildData={getChildData}
            cardsData={cardsData?.Availability}
            loading={fieldsLoading.Availability}
            perLoading={fieldsPerLoading.Availability}
            data={fieldsAllData.Availability}
            result={fieldsAllResults.Availability}
            xData={fieldsXData.Availability}
            yData={fieldsYData.Availability}
            label="Percentage"
            isGraph={true}
            isPer={true}
            isFilter={true}
            filters={["All", "Trench_Cutting_Machine", "Drilling_Machine"]}
          />
        )}

        {(Number(fieldsData.FuelConsumption) !== 0 ||
          cardsData?.FuelConsumption) && (
          <DashboardCard
            name="Fuel Consumption"
            title="FuelConsumption"
            value={`${fieldsData.FuelConsumption} L`}
            percentage={`${fieldsPerData.FuelConsumption} L`}
            getChildData={getChildData}
            cardsData={cardsData?.FuelConsumption}
            loading={fieldsLoading.FuelConsumption}
            perLoading={fieldsPerLoading.FuelConsumption}
            data={fieldsAllData.FuelConsumption}
            result={fieldsAllResults.FuelConsumption}
            xData={fieldsXData.FuelConsumption}
            yData={fieldsYData.FuelConsumption}
            label="Consumption"
            isGraph={true}
            isPer={true}
            isFilter={true}
            filters={["All", "Trench_Cutting_Machine", "Drilling_Machine"]}
          />
        )}

        {(Number(fieldsData.OilConsumption) !== 0 ||
          cardsData?.OilConsumption) && (
          <DashboardCard
            name="Oil Consumption"
            title="OilConsumption"
            value={`${fieldsData.OilConsumption} L`}
            percentage={`${fieldsPerData.OilConsumption} L`}
            getChildData={getChildData}
            cardsData={cardsData?.OilConsumption}
            loading={fieldsLoading.OilConsumption}
            perLoading={fieldsPerLoading.OilConsumption}
            data={fieldsAllData.OilConsumption}
            result={fieldsAllResults.OilConsumption}
            xData={fieldsXData.OilConsumption}
            yData={fieldsYData.OilConsumption}
            label="Consumption"
            isGraph={true}
            isPer={true}
            isFilter={true}
            filters={["All", "Trench_Cutting_Machine", "Drilling_Machine"]}
          />
        )}

        {(Number(fieldsData.ProductionTrench) !== 0 ||
          cardsData?.ProductionTrench) && (
          <DashboardCard
            name="Production Trench"
            title="ProductionTrench"
            value={`${fieldsData.ProductionTrench} M2`}
            percentage={`${fieldsPerData.ProductionTrench} %`}
            getChildData={getChildData}
            cardsData={cardsData?.ProductionTrench}
            loading={fieldsLoading.ProductionTrench}
            perLoading={fieldsPerLoading.ProductionTrench}
            data={fieldsAllData.ProductionTrench}
            result={fieldsAllResults.ProductionTrench}
            xData={fieldsXData.ProductionTrench}
            yData={fieldsYData.ProductionTrench}
            label="m2"
            isGraph={true}
            isPer={true}
            isFilter={true}
            filters={["All", "DW", "Barrettes", "Cut-Off Wall"]}
          />
        )}

        {(Number(fieldsData.ProductionPiles) !== 0 ||
          cardsData?.ProductionPiles) && (
          <DashboardCard
            name="Production Piles"
            title="ProductionPiles"
            value={`${fieldsData.ProductionPiles} M.L`}
            percentage={`${fieldsPerData.ProductionPiles} %`}
            getChildData={getChildData}
            cardsData={cardsData?.ProductionPiles}
            loading={fieldsLoading.ProductionPiles}
            perLoading={fieldsPerLoading.ProductionPiles}
            data={fieldsAllData.ProductionPiles}
            result={fieldsAllResults.ProductionPiles}
            xData={fieldsXData.ProductionPiles}
            yData={fieldsYData.ProductionPiles}
            label="ml"
            isGraph={true}
            isPer={true}
            isFilter={true}
            filters={["All", "Piles"]}
          />
        )}
      </div>
      <div className="w-full md:h-[56vh] h-[800px] flex md:flex-row justify-around items-center relative">
        <DashboardBrekdownCard
          name={`Breakdowns`}
          cardsData={cardsData?.Breakdowns}
          getChildData={getChildData}
          data={fieldsData.Breakdowns}
          result={fieldsAllResults.Breakdowns}
          loading={fieldsLoading.Breakdowns}
        />
      </div>
      <div className="w-full md:h-[100vh] h-[800px] flex md:flex-row justify-around items-center mb-4">
        <DashboardPerMaint
          name={`Periodic Maintenance`}
          title={`PeriodicMaintenance`}
          cardsData={cardsData?.PeriodicMaintenance}
          getChildData={getChildData}
          data={fieldsData.PeriodicMaintenance}
          loading={fieldsLoading.PeriodicMaintenance}
        />
      </div>
      {error && (
        <div className=" w-full h-14 bg-red-600 text-white flex justify-center items-center fixed bottom-14 left-0 flex-row border-t-1 border-gray-400">
          <CiWarning className="text-[40px] font-extrabold" />
          <p className="ml-5 text-xl font-semibold">{errorDetails}</p>
        </div>
      )}

      <div
        className={[
          `w-full h-14 text-white flex justify-center items-center fixed bottom-0 left-0 flex-row border-t-1 border-gray-400`,
        ]}
        style={{
          backgroundColor: messages.length === 0 ? "white" : "orange",
        }}
      >
        <p className="ml-5 text-xl font-semibold">{currentMessage}</p>
      </div>
    </div>
  );
};

export default Dashboard;
