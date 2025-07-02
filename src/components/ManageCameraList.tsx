import { useCallback, useEffect } from "react";
import { getCameraList } from "../apiService/camera";
import "../css/manageCamera.css";
import CameraListWrapper from "./CameraListWrapper";
import CameraTableContainer from "./CameraTableContainer";
import useCameraStore from "../hooks/useCameraStore";

export default function ManageCameraList() {
  const setCameraList = useCameraStore((state) => state.setCameraList); // accessing camera list from zustand
  const setLoading = useCameraStore((state) => state.setLoading); // accessing loading from zustand

  // Function for getting camera data from `apiService/camera.ts` file
  const getCameraDataOnce = useCallback(async () => {
    setLoading(true);
    const data = await getCameraList();

    // No error in list & the returned value is an array then only updating in store
    if (!data.error && Array.isArray(data.data)) {
      setCameraList(data.data);
    } else {
      // else showing simple error message in console
      console.error(data.message ?? "Something went wrong");
    }
    setLoading(false);
  }, [setCameraList, setLoading]);

  useEffect(() => {
    // Fetching the list of all cameras
    getCameraDataOnce();
  }, [getCameraDataOnce]);

  return (
    <div className="manageCameraContainer | flex flex-col gap-[1.75rem]">
      <img src="/logo.svg" alt="Logo" className="mainLogo" />
      {/* Camera List Wrapper containing header & search */}
      <CameraListWrapper>
        {/* Table Container containing all filters and table */}
        <CameraTableContainer />
      </CameraListWrapper>
    </div>
  );
}
