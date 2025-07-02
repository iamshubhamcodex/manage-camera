import { useCallback, useEffect, useState, useTransition } from "react";
import { updateCameraStatus, type CameraDataType } from "../apiService/camera";
import CloudIcon from "../assets/CloudIcon";
import DeleteIcon from "../assets/DeleteIcon";
import ErrorInfoIcon from "../assets/ErrorInfoIcon";
import StorageIcon from "../assets/StorageIcon";
import type { DataColumnType } from "../types/common/datatable";
import DataTable from "./common/DataTable";
import useCameraStore from "../hooks/useCameraStore";
import { filterDataByField } from "../utils/utility";

// Column Renderer for Name Field
const NameRenderer = ({
  name,
  isActive,
  hasWarning,
}: {
  name: CameraDataType["name"];
  isActive: boolean;
  hasWarning: CameraDataType["hasWarning"];
}) => {
  return (
    <div className="flex gap-2 items-center">
      <span
        className="cirlce"
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          backgroundColor: isActive ? "var(--greenColor)" : "var(--redColor)",
          display: "inline-block",
        }}
      ></span>
      <p>{name}</p>
      {hasWarning && <ErrorInfoIcon />}
    </div>
  );
};
// Column Renderer for Health Field
const HealthRenderer = ({ health }: { health: CameraDataType["health"] }) => {
  const iconSize = 20; // for dynamic icon size
  const percentageCloud = !health
    ? 0
    : Math.max(5, ((70 - health.cloud.charCodeAt(0)) / 5) * 100); // Getting percentage of cloud health (assuming A is 100% and F is 0%)
  const percentageDevice = !health
    ? 0
    : Math.max(5, ((70 - health.device.charCodeAt(0)) / 5) * 100); // Getting percentage of device health (assuming A is 100% and F is 0%)

  const cloudColor =
    percentageCloud < 33
      ? "var(--redColor)"
      : percentageCloud < 66
      ? "var(--orangeColor)"
      : "var(--greenColor)"; // Getting color of cloud health based on percentage
  const deviceColor =
    percentageDevice < 33
      ? "var(--redColor)"
      : percentageDevice < 66
      ? "var(--orangeColor)"
      : "var(--greenColor)"; // Getting color of cloud health based on percentage

  return (
    <div className="flex gap-4 items-center">
      <div className="flex items-center gap-1">
        {/* Cloud Icon */}
        <CloudIcon />
        {/* Circular progressbar with dynamic color */}
        <div
          style={{ position: "relative", width: iconSize, height: iconSize }}
        >
          <svg width={iconSize} height={iconSize}>
            <circle
              cx={iconSize / 2}
              cy={iconSize / 2}
              r={iconSize / 2 - 2}
              stroke="#e0e0e0"
              strokeWidth={3}
              fill="none"
            />
            <circle
              cx={iconSize / 2}
              cy={iconSize / 2}
              r={iconSize / 2 - 2}
              stroke={cloudColor}
              strokeWidth={iconSize / 10}
              fill="none"
              strokeDasharray={2 * Math.PI * (iconSize / 2 - 2)}
              strokeDashoffset={
                2 * Math.PI * (iconSize / 2 - 2) * (1 - percentageCloud / 100)
              }
              strokeLinecap="round"
              transform={`rotate(-90 ${iconSize / 2} ${iconSize / 2})`}
            />
          </svg>
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: iconSize / 2 - 1,
              fontWeight: 500,
            }}
          >
            {health ? health.cloud : "-"}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {/* Storage Icon */}
        <StorageIcon />
        {/* Circular progressbar with dynamic color */}
        <div
          style={{ position: "relative", width: iconSize, height: iconSize }}
        >
          <svg width={iconSize} height={iconSize}>
            <circle
              cx={iconSize / 2}
              cy={iconSize / 2}
              r={iconSize / 2 - 2}
              stroke="#e0e0e0"
              strokeWidth={3}
              fill="none"
            />
            <circle
              cx={iconSize / 2}
              cy={iconSize / 2}
              r={iconSize / 2 - 2}
              stroke={deviceColor}
              strokeWidth={iconSize / 10}
              fill="none"
              strokeDasharray={2 * Math.PI * (iconSize / 2 - 2)}
              strokeDashoffset={
                2 * Math.PI * (iconSize / 2 - 2) * (1 - percentageDevice / 100)
              }
              strokeLinecap="round"
              transform={`rotate(-90 ${iconSize / 2} ${iconSize / 2})`}
            />
          </svg>
          <span
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: iconSize / 2 - 1,
              fontWeight: 500,
            }}
          >
            {health ? health.device : "-"}
          </span>
        </div>
      </div>
    </div>
  );
};
// Column Renderer for Status Field
const StatusRenderer = ({
  status,
  handleStatusClick,
}: {
  status: CameraDataType["status"];
  handleStatusClick: () => void;
}) => {
  const isActive = status === "Active";

  return (
    <div className="flex justify-center items-center">
      <div
        className=" h-max"
        style={{
          padding: ".2rem .6rem",
          borderRadius: ".3rem",
          background: isActive ? "var(--textGreenBg)" : "var(--grayWhiteColor)",
        }}
        onClick={() => handleStatusClick()}
      >
        <p
          style={{
            color: isActive ? "var(--textGreen)" : "var(--textBodyColor)",
            fontWeight: 500,
            fontSize: "var(--fs10)",
          }}
        >
          {status}
        </p>
      </div>
    </div>
  );
};

// Columns list for getting all columns of table with the action provided
const getColums = (
  handleStatusChange: (row: CameraDataType, index: number) => void,
  deleteAction: (row: CameraDataType) => void
): DataColumnType<CameraDataType>[] => {
  const columns: DataColumnType<CameraDataType>[] = [
    {
      heading: "NAME",
      customSelector: (row) => (
        <NameRenderer
          name={row.name}
          isActive={!!row.health}
          hasWarning={row.hasWarning}
        />
      ),
      sortable: true,
      sortableKey: "name",
      minWidth: 110,
    },
    {
      heading: "HEALTH",
      customSelector: (row) => <HealthRenderer health={row.health} />,
      minWidth: 120,
    },
    {
      heading: "LOCATIONS",
      selector: "location",
      sortable: true,
      minWidth: 100,
    },
    {
      heading: "RECORDER",
      selector: "recorder",
      sortable: true,
      minWidth: 120,
    },
    {
      heading: "TASKS",
      customSelector: (row) => (
        <p className="h-max">
          {row.tasks
            ? row.tasks + " Task" + (+row.tasks > 1 ? "s" : "")
            : "N/A"}
        </p>
      ),
      sortable: true,
      sortableKey: "tasks",
    },
    {
      heading: "STATUS",
      customSelector: (row, index) => (
        <StatusRenderer
          handleStatusClick={() => handleStatusChange(row, index)}
          status={row.status}
        />
      ),
      sortable: true,
      sortableKey: "status",
    },
    {
      heading: "ACTIONS",
      customSelector: (row) => (
        <div
          className="flex gap-1 items-center"
          onClick={() => deleteAction(row)}
        >
          <DeleteIcon />
          <p>Delete</p>
        </div>
      ),
    },
  ];

  return columns;
};

export default function CameraTable() {
  const { cameraList, searchVal, loading, setCameraList } = useCameraStore(); // accessing

  const [cameraData, setCameraData] = useState<CameraDataType[]>(
    cameraList ?? []
  ); // local state for sorting, searching, filtering the list
  const startTransition = useTransition()[1]; // Using useTransition to avoid system lag

  const handleDeleteAction = (row: CameraDataType) => {
    // Deleting the camera based on id of camera passed and then updating to both local and global state
    startTransition(() => {
      const filteredCameraList = cameraList.filter((p) => p.id !== row.id);
      setCameraData(filteredCameraList);
      setCameraList(filteredCameraList);
    });
  };
  const handleStatusChange = async (row: CameraDataType, index: number) => {
    const data = await updateCameraStatus({
      id: row.id,
      status: row.status === "Active" ? "Inactive" : "Active",
    });

    if (!data.error) {
      // Updating the the active status of  camera based on id of camera passed
      startTransition(() => {
        const filteredCameraList = [...cameraList];
        filteredCameraList[index].status =
          row.status === "Active" ? "Inactive" : "Active";
        setCameraData(filteredCameraList);
        setCameraList(filteredCameraList);
      });
    } else {
      console.error("Failed to updated Status, ", data.message);
    }
  };
  // Filtering the camera list based on search value
  const handleCameraListChange = useCallback(() => {
    startTransition(() => {
      if (!searchVal || searchVal.trim() === "") setCameraData(cameraList);
      else {
        setCameraData(
          // common function to iterate over the comma seperated fields and search value
          filterDataByField(
            cameraList,
            "name,location,current_status,status",
            searchVal
          )
        );
      }
    });
  }, [cameraList, searchVal, startTransition]);

  useEffect(() => {
    handleCameraListChange();
  }, [handleCameraListChange]);

  return (
    <>
      <div className="grow overflow-auto">
        {/* Custom DataTable component for rendering the table */}
        <DataTable<CameraDataType>
          columns={getColums(handleStatusChange, handleDeleteAction)}
          data={
            // To prevent flickering while setting filtering the table in useEffect (with transition)
            !searchVal || searchVal.trim() === ""
              ? cameraData.length === 0
                ? cameraList
                : cameraData
              : cameraData ?? []
          }
          selectableRows // selectableRows
          pagination // pagination
          loading={loading} // loading
        />
      </div>
    </>
  );
}
