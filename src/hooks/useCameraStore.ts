import { create } from "zustand";
import type { CameraDataType } from "../apiService/camera";

interface StoreState {
  cameraList: CameraDataType[];
  searchVal: string;
  setCameraList: (cameraList: CameraDataType[]) => void;
  setSearchVal: (searchVal: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const useCameraStore = create<StoreState>((set) => ({
  cameraList: [],
  searchVal: "",
  setCameraList: (cameraList: CameraDataType[]) => set({ cameraList }),
  setSearchVal: (searchVal: string) => set({ searchVal }),
  loading: false,
  setLoading: (loading: boolean) => set({ loading }),
}));

export default useCameraStore;
