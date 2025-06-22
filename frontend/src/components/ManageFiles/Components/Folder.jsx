import React, { useEffect, useState } from "react";
import { IoIosArrowForward, IoIosArrowDown } from "react-icons/io";
import { ImFolder, ImFolderOpen } from "react-icons/im";
import { ColorRing } from "react-loader-spinner";
import { FaRegFile } from "react-icons/fa";

import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavContext } from "../../../contexts/NavContext";

const Folder = ({
  filename,
  absPath,
  basePath,
  setCurrentPath,
  setCurrentFiles,
  currentPath,
  getFilesURL,
  createdFolder,
  deletedFile,
  uploadedFiles,
  renamedFile,
  searchedItems,
  searchedFiles,
  setSearchedFiles,
}) => {
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [files, setFiles] = useState(null);
  const [isHovered, setIsHovered] = useState(false);

  const { setErrorData } = useNavContext();

  const path = `${basePath}/${filename}`;

  useEffect(() => {
    if (!searchedItems.length) return;
    searchedItems.map(async (item) => {
      const filesArray = item.split("/");

      if (
        filesArray.some((p) => p.toLowerCase().includes(filename.toLowerCase()))
      ) {
        setSearchedFiles((prev) =>
          Array.from(new Set([...prev, filesArray[filesArray.length - 1]]))
        );
        if (path !== "") {
          openArrow();
        }
      }
    });
  }, [searchedItems, path]);

  useEffect(() => {
    if (currentPath === path) {
      setFiles(createdFolder);
    }
  }, [createdFolder]);

  useEffect(() => {
    if (currentPath === path) {
      setFiles(deletedFile);
    }
  }, [deletedFile]);

  useEffect(() => {
    if (currentPath === path) {
      setFiles(renamedFile);
    }
  }, [renamedFile]);

  useEffect(() => {
    if (currentPath === path) {
      setFiles(uploadedFiles);
    }
  }, [uploadedFiles]);

  const axiosPrivate = useAxiosPrivate();

  const getFiles = async (fullPath) => {
    try {
      const url = getFilesURL;
      const response = await axiosPrivate(url, {
        method: "POST",
        data: JSON.stringify({
          fullpath: path,
          pathabs: `${fullPath}`,
        }),
      });
      setFiles(response?.data?.data);
      return response?.data?.data;
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
    }
  };

  const openArrow = async () => {
    if (!isFolderOpen) {
      setIsFolderOpen(true);
      await getFiles(`${absPath}/${path}`);
    }
  };

  const handleArrowClick = async () => {
    setIsFolderOpen((prev) => !prev);
    if (!isFolderOpen) {
      await getFiles(`${absPath}/${path}`);
    }
  };

  const handleFolderClick = async () => {
    setCurrentFiles(null);
    setCurrentPath(path);
    const currentFiles = await getFiles(`${absPath}/${path}`);
    setCurrentFiles(currentFiles);
  };

  useEffect(() => {
    getFiles(`${absPath}/${path}`);
  }, []);

  return (
    <div className="flex flex-col w-full">
      <div
        className={`flex flex-row items-center rounded-md ${
          isHovered
            ? "bg-[rgb(229,231,235)] dark:bg-gray-800  cursor-pointer"
            : "cursor-default"
        }`}
      >
        <button
          className="py-2 px-[2px] hover:bg-gray-300 dark:hover:bg-gray-700 rounded-l-[4px] relative z-[2]"
          onClick={handleArrowClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isFolderOpen ? (
            <IoIosArrowDown color="rgb(107,114,128)" />
          ) : (
            <IoIosArrowForward color="rgb(107,114,128)" />
          )}
        </button>
        <div
          className="w-full py-1 px-[2px] flex flex-row gap-2 justify-start items-center relative z-[1]"
          onClick={handleFolderClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {isFolderOpen ? (
            <ImFolderOpen color="#54AEFF" />
          ) : (
            <ImFolder color="#54AEFF" />
          )}

          <p>{filename}</p>
        </div>
      </div>

      {isFolderOpen && (
        <div className="border-l-1 border-gray-300 dark:border-gray-700 w-full flex flex-col">
          {!files ? (
            <div className="w-full h-full px-2 flex flex-row items-center justify-start">
              <ColorRing
                type="ColorRing"
                colors={[
                  "rgb(107,114,128)",
                  "rgb(107,114,128)",
                  "rgb(107,114,128)",
                  "rgb(107,114,128)",
                  "rgb(107,114,128)",
                ]}
                height={20}
                width={20}
              />
              <p className="text-center px-2 text-[rgb(107,114,128)]">
                {`Loading`}
              </p>
            </div>
          ) : (
            <div className="w-full h-full px-2 flex flex-col items-start">
              {files.map((file, i) =>
                file.type === "folder" ? (
                  <Folder
                    key={i}
                    filename={file?.file}
                    absPath={absPath}
                    basePath={path}
                    setCurrentPath={setCurrentPath}
                    setCurrentFiles={setCurrentFiles}
                    currentPath={currentPath}
                    getFilesURL={getFilesURL}
                    createdFolder={createdFolder}
                    deletedFile={deletedFile}
                    uploadedFiles={uploadedFiles}
                    renamedFile={renamedFile}
                    searchedItems={searchedItems}
                    searchedFiles={searchedFiles}
                    setSearchedFiles={setSearchedFiles}
                  />
                ) : (
                  <div
                    key={i}
                    className={`w-full relative px-4 py-1 flex flex-row gap-2 justify-start items-center rounded-md hover:bg-gray-200 dark:hover:bg-gray-800 hover:cursor-pointer ${
                      searchedFiles.includes(file?.file)
                        ? "bg-[rgb(209,213,219)] dark:bg-gray-800"
                        : ""
                    }`}
                    onClick={() => {}}
                  >
                    {searchedFiles.includes(file?.file) && (
                      <div className="w-0 h-full absolute -left-[0px] top-0 border-[2px] border-blue-800 dark:border-blue-500"></div>
                    )}

                    <FaRegFile color="rgb(107,114,128)" />
                    <p className="truncate">{file?.file}</p>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Folder;
