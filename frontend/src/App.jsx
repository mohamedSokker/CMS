import { Routes, Route } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";

import { useNavContext } from "./contexts/NavContext";
import "./App.css";
import logo from "./assets/logoblue.jpg";
import { socket } from "./socket/socket";
import MainLoading from "./components/MainLoading";
import { ManagePowerPiDataContextProvider } from "./pages/ManageMiniPowerBi/Contexts/DataContext";
import { ManagePowerPiInitContextProvider } from "./pages/ManageMiniPowerBi/Contexts/InitContext";
import { EditPowerPiDataContextProvider } from "./pages/EditMiniPowerBi/Contexts/DataContext";
import { EditPowerPiInitContextProvider } from "./pages/EditMiniPowerBi/Contexts/InitContext";
import { PowerPiDataContextProvider } from "./pages/MiniPowerBi/Contexts/DataContext";
import { PowerPiInitContextProvider } from "./pages/MiniPowerBi/Contexts/InitContext";
import { DragContextProvider } from "./pages/ManageMiniPowerBi/Components/Customs/DragContext";

const Login = lazy(() => import("./pages/Login"));
const EditTables = lazy(() => import("./pages/EditTables"));
const ManageUsers = lazy(() => import("./pages/ManageUsers"));

const RequiredAuth = lazy(() => import("./hooks/useAuth"));
const PersistLogin = lazy(() => import("./components/PersistLogin"));
const UnAuthorized = lazy(() => import("./pages/UnAuthorized"));
const CustomDataEntry = lazy(() =>
  import("./pages/CustomDataEntry/View/CustomDataEntry")
);
const CustomDataEntryDetails = lazy(() =>
  import("./pages/CustomDataEntryDetail/View/CustomDataEntryDetails")
);
const ManageCustomDataEntry = lazy(() =>
  import("./pages/ManageCustomDataEntry/View/ManageCustomDataEntry")
);

const MiniPowerBiCat = lazy(() =>
  import("./pages/MiniPowerBiCat/View/MiniPowerBiCat")
);
const MiniPowerBi = lazy(() => import("./pages/MiniPowerBi/View/MiniPowerBi"));
const ManageMiniPowerBi = lazy(() =>
  import("./pages/ManageMiniPowerBi/View/ManageMiniPowerBi")
);
const EditMiniPowerBi = lazy(() =>
  import("./pages/EditMiniPowerBi/View/ManageMiniPowerBi")
);
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const Register = lazy(() => import("./pages/Register"));

function App() {
  const { token, usersData } = useNavContext();

  useEffect(() => {
    if (!socket.connected && token && usersData) {
      socket.connect();
      socket.emit("userName", usersData[0]?.username);
    }
  }, [socket, token, usersData]);

  return (
    <Suspense
      fallback={
        <div className="w-screen h-screen flex flex-col gap-6 justify-center items-center transition-colors duration-300 bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
          <img
            src={logo}
            alt="Logo"
            className="w-20 h-20 rounded-md object-contain shadow-md dark:shadow-none"
          />

          <MainLoading />
        </div>
      }
    >
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/register" element={<Register />} />
        {/* <Route path="/Voice" element={<Voice />} />
        <Route path="/Vnc/:tableName" element={<Vnc socket={socket} />} /> */}
        <Route path="/UnAuthorized" element={<UnAuthorized />} />

        <Route element={<PersistLogin />}>
          <Route element={<RequiredAuth allowedRole={"CustomDataEntry"} />}>
            <Route path="/" element={<CustomDataEntry />} />
          </Route>
          {/* <Route path="/" element={<Home socket={socket} />} /> */}
          {/* <Route element={<RequiredAuth allowedRole={true} />}>
            <Route path="/" element={<Home socket={socket} />} />
          </Route>

          <Route element={<RequiredAuth allowedRole={"Dashboard"} />}>
            <Route path="/Dashboard" element={<Dashboard socket={socket} />} />
          </Route>

          <Route element={<RequiredAuth allowedRole={"Kanban"} />}>
            <Route path="/Kanban" element={<ManageKanban socket={socket} />} />
            <Route path="/ManageKanban" element={<Kanban socket={socket} />} />
          </Route>
          <Route element={<RequiredAuth allowedRole={"Transportations"} />}>
            <Route
              path="/Transportations"
              element={<Transportaions socket={socket} />}
            />
          </Route>
          <Route element={<RequiredAuth allowedRole={"Sites"} />}>
            <Route path="/Sites/:tableName" element={<Locations />} />
          </Route> */}
          <Route element={<RequiredAuth allowedRole={"CustomDataEntry"} />}>
            <Route path="/CustomDataEntry" element={<CustomDataEntry />} />
          </Route>
          <Route element={<RequiredAuth allowedRole={"CustomDataEntry"} />}>
            <Route
              path="/CustomDataEntry/:id"
              element={<CustomDataEntryDetails />}
            />
          </Route>
          <Route element={<RequiredAuth allowedRole={"ManageDataEntry"} />}>
            <Route
              path="/ManageDataEntry"
              element={<ManageCustomDataEntry />}
            />
          </Route>
          <Route element={<RequiredAuth allowedRole={"Tables"} />}>
            <Route
              path="/Tables/:tableName"
              element={<EditTables socket={socket} />}
            />
          </Route>
          {/* <Route element={<RequiredAuth allowedRole={"ManageDatabase"} />}>
            <Route path="/ManageDatabase" element={<ManageDatabase />} />
          </Route>
          <Route element={<RequiredAuth allowedRole={"Equipments"} />}>
            <Route path="/Equipments/:tableName" element={<Equipments />} />
          </Route>
          <Route element={<RequiredAuth allowedRole={"Equipments"} />}>
            <Route path="/GearboxTrench" element={<GearboxTrench />} />
          </Route>
          <Route element={<RequiredAuth allowedRole={"Equipments"} />}>
            <Route path="/breport" element={<Files />} />
          </Route>
          <Route element={<RequiredAuth allowedRole={"Orders"} />}>
            <Route path="/Orders/:tableName" element={<Orders />} />
          </Route>
          <Route element={<RequiredAuth allowedRole={"Stocks"} />}>
            <Route path="/Stocks/:tableName" element={<Stocks />} />
          </Route>
          <Route element={<RequiredAuth allowedRole={"Tables"} />}>
            <Route
              path="/Tables/:tableName"
              element={<EditTables socket={socket} />}
            />
          </Route>
          <Route element={<RequiredAuth allowedRole={"DataEntry"} />}>
            <Route
              path="/DataEntry/:tableName"
              element={<DataEntry socket={socket} />}
            />
          </Route>
          <Route element={<RequiredAuth allowedRole={"Catalogues"} />}>
            <Route path="/Catalogues" element={<Catalogues />} />
          </Route>
          <Route element={<RequiredAuth allowedRole={"OilSamples"} />}>
            <Route path="/OilSamples" element={<OilSamples />} />
          </Route>
          <Route element={<RequiredAuth allowedRole={"OilSamplesAnalyzed"} />}>
            <Route
              path="/OilSamplesAnalyzed"
              element={<OilSamplesAnalyzed />}
            />
          </Route> */}
          <Route element={<RequiredAuth allowedRole={"ManageUsers"} />}>
            <Route path="/ManageUsers/:tableName" element={<ManageUsers />} />
          </Route>

          <Route element={<RequiredAuth allowedRole={"ManageMiniPowerBi"} />}>
            <Route
              path="/ManageMiniPowerBi"
              element={
                <ManagePowerPiDataContextProvider>
                  <ManagePowerPiInitContextProvider>
                    <DragContextProvider>
                      <ManageMiniPowerBi />
                    </DragContextProvider>
                  </ManagePowerPiInitContextProvider>
                </ManagePowerPiDataContextProvider>
              }
            />
          </Route>

          <Route element={<RequiredAuth allowedRole={"MiniPowerBi"} />}>
            <Route path="/MiniPowerBi" element={<MiniPowerBiCat />} />
          </Route>

          <Route element={<RequiredAuth allowedRole={"MiniPowerBi"} />}>
            <Route
              path="/MiniPowerBi/:id"
              element={
                <PowerPiDataContextProvider>
                  <PowerPiInitContextProvider>
                    <MiniPowerBi />
                  </PowerPiInitContextProvider>
                </PowerPiDataContextProvider>
              }
            />
          </Route>
          <Route element={<RequiredAuth allowedRole={"MiniPowerBi"} />}>
            <Route
              path="/MiniPowerBi/Edit/:id"
              element={
                <EditPowerPiDataContextProvider>
                  <EditPowerPiInitContextProvider>
                    <EditMiniPowerBi />
                  </EditPowerPiInitContextProvider>
                </EditPowerPiDataContextProvider>
              }
            />
          </Route>
          {/* <Route element={<RequiredAuth allowedRole={"ManageAppUsers"} />}>
            <Route
              path="/ManageAppUsers/:tableName"
              element={<ManageAppUsers />}
            />
          </Route> */}
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
