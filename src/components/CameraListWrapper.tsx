import { useEffect, useState, type PropsWithChildren } from "react";
import useDebounce from "../hooks/useDebounce";
import useCameraStore from "../hooks/useCameraStore";
import SearchIcon from "../assets/SearchIcon";

export default function CameraListWrapper({ children }: PropsWithChildren) {
  const [searchVal, setSearchVal] = useState(""); // Search Value state

  const debouncedValue = useDebounce(searchVal, 450); // Debouncing the searchVal that will be updated in store
  const setSearchValStore = useCameraStore((state) => state.setSearchVal);

  function handleSearchValueChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchVal(e.target.value);
  }

  useEffect(() => {
    // Updating the searchval in store after debounced value has been changed.
    setSearchValStore(debouncedValue);
  }, [debouncedValue, setSearchValStore]);

  return (
    <div className="cameraListWrapperContainer | flex flex-col grow overflow-auto">
      {/* Header displaying title and search */}
      <div className="cameraListHeader | flex items-center justify-between">
        <div className="title | flex flex-col">
          <h3 className="">Cameras</h3>
          <p className="">Manage your cameras here.</p>
        </div>
        <div className="searchInp | flex items-center gap-1">
          <input
            className="grow"
            type="text"
            value={searchVal}
            onChange={handleSearchValueChange}
            placeholder="Search..."
          />
          <SearchIcon />
        </div>
      </div>
      {/* Rendering of all childrens of Camera Wrapper */}
      {children}
    </div>
  );
}
