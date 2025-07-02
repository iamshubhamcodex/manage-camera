import {
  startTransition,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import LocationIcon from "../assets/LocationIcon";
import StatusIcon from "../assets/StatusIcon";
import CameraTable from "./CameraTable";
import useCameraStore from "../hooks/useCameraStore";

type FilterData = {
  location: string;
  status: string;
};

// Camera Table Component container
export default function CameraTableContainer() {
  // State for filtering of data based on locaiton and status
  const [filterData, setFilterData] = useState<FilterData>({
    location: "",
    status: "",
  });
  // State for generating and storing dynamic location map based on actual data
  const [locationMap, setLocationMap] = useState<Record<string, string>>({});

  // Simple status map for filtering using existing search Val
  const statusMap: Record<string, string> = useMemo(
    () => ({
      active: "active",
      inactive: "inactive",
    }),
    []
  );
  const cameraList = useCameraStore((state) => state.cameraList);
  const setSearchVal = useCameraStore((state) => state.setSearchVal);
  const searchVal = useCameraStore((state) => state.searchVal);

  // Function to generate unique locations based on camera data provided
  const generateLocationMap = useCallback(() => {
    startTransition(() => {
      const uniqueLocations: typeof locationMap = {};
      cameraList.forEach((camera) => {
        if (!uniqueLocations[camera.location])
          uniqueLocations[camera.location] = camera.location;
      });
      setLocationMap(uniqueLocations);
    });
  }, [cameraList]);
  // Function to handle location or status change
  function handleFilterChange(key: keyof FilterData, value: string) {
    setFilterData((prev) => ({
      ...prev,
      [key]: value,
    }));

    setSearchVal(value);
  }

  useEffect(() => {
    // Effect for generating location map
    generateLocationMap();
  }, [generateLocationMap]);

  useEffect(() => {
    // Effect for resetting the filter once search value changes
    setFilterData({
      location: locationMap[searchVal] ?? "",
      status: statusMap[searchVal] ?? "",
    });
  }, [searchVal, locationMap, statusMap]);

  return (
    <div className="cameraTableContainer | flex flex-col gap-0 grow overflow-auto">
      <div className="head | py-1 px-2 flex gap-2 items-center">
        <div className="select">
          <LocationIcon />
          <select
            value={filterData.location}
            onChange={(e) => handleFilterChange("location", e.target.value)}
          >
            <option value="">-Select-</option>
            {/* Looping over entries of locaiton map */}
            {Object.entries(locationMap).map(([location]) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div className="select">
          <StatusIcon />
          <select
            value={filterData.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">-Select-</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      {/* Camera Table */}
      <CameraTable />
    </div>
  );
}
