import React, { useEffect, useRef, useState } from "react";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import { ColorRing } from "react-loader-spinner";

import "../Styles/UploadCard.css";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavContext } from "../../../contexts/NavContext";

const RenameFolderCard = ({
  setIsRenameFolder,
  absPath,
  path,
  currentFiles,
  setCurrentFiles,
  setFiles,
  renameFilesURL,
  setRenamedFile,
  newFileName,
  setNewFileName,
  oldFileName,
}) => {
  const baseURL = import.meta.env.VITE_BASE_URL;

  const axiosPrivate = useAxiosPrivate();

  const [isCanceled, setIsCanceled] = useState(false);
  const [loading, setLoading] = useState(false);

  const { setErrorData } = useNavContext();

  useEffect(() => {
    setNewFileName(oldFileName.file);
  }, []);

  const handleRenameFile = async (file, oldFile) => {
    try {
      setLoading(true);
      const url = renameFilesURL;
      //   const newPath = prompt("Enter New Folder Name");
      await axiosPrivate(url, {
        method: "POST",
        data: JSON.stringify({
          path: oldFileName.file,
          endPath: `${path}/${newFileName}`,
          pathabs: `${absPath}/${oldFileName.file}`,
          endPathabs: `${absPath}/${path}/${newFileName}`,
        }),
      });
      let result = [];
      currentFiles.map((f) => {
        if (f.file === oldFileName.file) {
          result.push({ ...f, file: newFileName });
        } else {
          result.push(f);
        }
      });
      setCurrentFiles(result);
      setRenamedFile(result);
      // setFiles(result);
      setLoading(false);
    } catch (err) {
      setErrorData((prev) => [
        ...prev,
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message,
      ]);
      console.log(
        err?.response?.data?.message
          ? err?.response?.data?.message
          : err?.message
      );
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed opacity-100 w-screen h-screen flex flex-col items-center justify-center left-0 top-0"
      style={{ zIndex: "1000" }}
    >
      <div
        className="absolute  w-screen h-screen flex flex-col items-center justify-center left-0 top-0 z-[1000]"
        style={{ backdropFilter: "blur(2px)", opacity: 0.8 }}
      ></div>
      <div
        className={`md:w-[500px] w-[90%] md:h-[180px] h-[80%] flex flex-col justify-between items-center bg-white relative z-[1001] mainContent overflow-y-scroll`}
        style={{
          animation: !isCanceled
            ? "animate-in 0.5s ease-in-out"
            : "animate-out 0.5s ease-in-out",
        }}
      >
        <div className="flex flex-row w-full p-2 px-6 justify-between">
          <div>
            <TooltipComponent
              content="close"
              position="BottomCenter"
              className="flex items-center"
            >
              <button
                className="hover:cursor-pointer p-2 hover:rounded-full hover:bg-gray-300 aspect-square flex justify-center items-center"
                onClick={() => {
                  setIsCanceled(true);
                  setTimeout(() => {
                    setIsRenameFolder(false);
                  }, 500);
                }}
              >
                X
              </button>
            </TooltipComponent>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full px-8">
          <p className="font-[400] text-[12px] text-gray-500">Folder Name</p>
          <input
            className="w-full border-b-1 border-gray-300 outline-none focus:border-red-400 font-[400] text-[12px] pl-4"
            type="text"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onFocus={(e) => {
              e.target.previousElementSibling.classList.add("focused");
            }}
            onBlur={(e) => {
              e.target.previousElementSibling.classList.remove("focused");
            }}
          />
        </div>

        <div className="flex flex-row w-full justify-end px-4 py-2">
          <button
            className="text-red-400 font-[600] text-[14px]"
            onClick={async () => {
              handleRenameFile();
              // handleSave(val, category);
              setIsCanceled(true);
              setTimeout(() => {
                setIsRenameFolder(false);
              }, 500);
            }}
          >
            Ok
          </button>
        </div>
      </div>
    </div>
  );
};

export default RenameFolderCard;
