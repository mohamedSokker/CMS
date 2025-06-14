import React from "react";
import { ColorRing } from "react-loader-spinner";
import { AiOutlineCaretDown } from "react-icons/ai";

import useDropdown from "../Controllers/dropdown";

const Dropdown = ({
  name,
  setLoading,
  setMessage,
  label,
  URL,
  column,
  siteData,
  setAllData,
  local,
  localData,
  data,
  setData,
  condition,
  setErrorData,
  setDetails,
  tableColumns,
  setTableColumns,
  setCurrentColumns,
  multiple = false,
}) => {
  const { datasLoading, handleChange, handleClick } = useDropdown({
    name,
    setLoading,
    setMessage,
    label,
    URL,
    column,
    local,
    localData,
    data,
    setData,
    siteData,
    setAllData,
    condition,
    setErrorData,
    setDetails,
    tableColumns,
    setTableColumns,
    setCurrentColumns,
  });

  return (
    <div
      className="w-full p-2 flex flex-col justify-center items-center bg-gray-100"
      style={{ height: multiple ? "100%" : "auto" }}
    >
      {/* Label */}
      <p className="w-full h-6 text-[14px] text-gray-400 flex flex-row justify-start">
        {`Select ${label}`}
      </p>

      {/* Select Wrapper */}
      <div className="relative w-full h-full">
        {/* Native Select */}
        <select
          className="p-2 w-full bg-gray-100 border-b-1 outline-none border-blue-500 appearance-none text-[14px] focus:border-[rgb(248,113,113)]"
          style={{
            color: data[label] === "" ? "rgb(156 163 175)" : "black",
            scrollbarWidth: "none", // Firefox
            height: multiple ? "100%" : "auto",
          }}
          onClick={handleClick}
          onChange={handleChange}
          value={data[label] === "" ? "" : data[label]}
          multiple={multiple ? true : false}
          disabled={datasLoading}
        >
          {!multiple && (
            <option hidden selected disabled>
              {""}
            </option>
          )}

          {localData &&
            localData.map((item, i) => (
              <option key={i} value={item[column]} onClick={handleChange}>
                {item[column]}
              </option>
            ))}
        </select>

        {/* Loader or Caret Icon */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none">
          {datasLoading ? (
            <ColorRing
              type="ColorRing"
              colors={[
                "rgb(156 163 175)",
                "rgb(156 163 175)",
                "rgb(156 163 175)",
                "rgb(156 163 175)",
                "rgb(156 163 175)",
              ]}
              height={20}
              width={20}
            />
          ) : (
            <AiOutlineCaretDown size={14} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dropdown;
