const BASE_URL = import.meta.env.VITE_BASE_URL;
const AUTHORIZATION_TOKEN = import.meta.env.VITE_AUTHORIZATION_TOKEN;

export type CameraDataType = {
  id: number;
  name: string;
  current_status: string;
  hasWarning: boolean;
  location: string;
  recorder: string;
  status: string;
  tasks: string;
  health?: {
    cloud: "A";
    device: "A";
    id: string;
  };
};
type CameraApiType = {
  data: CameraDataType[] | null;
  message?: string;
  error?: boolean;
};

export const getCameraList = async (): Promise<CameraApiType> => {
  try {
    const response = await fetch(`${BASE_URL}/fetch/cameras`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AUTHORIZATION_TOKEN}`,
      },
    });
    const data: CameraApiType = await response.json();

    return data;
  } catch (err: unknown) {
    return {
      data: null,
      error: true,
      ...(err && typeof err == "object" && "message" in err
        ? { message: err.message as string }
        : {}),
    };
  }
};

type UpdateStatusBodyType = {
  id: number;
  status: string;
};
type UpdateStatusApiType = {
  message?: string;
  error?: boolean;
};
export const updateCameraStatus = async ({
  id,
  status,
}: UpdateStatusBodyType): Promise<UpdateStatusApiType> => {
  try {
    const response = await fetch(`${BASE_URL}/update/camera/status`, {
      method: "PUT",
      body: JSON.stringify({
        id,
        status,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${AUTHORIZATION_TOKEN}`,
      },
    });
    const data: UpdateStatusApiType = await response.json();

    if (response.status.toString().startsWith("2")) return data;
    else {
      return { error: true, message: data.message };
    }
  } catch (err: unknown) {
    return {
      error: true,
      ...(err && typeof err == "object" && "message" in err
        ? { message: err.message as string }
        : {}),
    };
  }
};
