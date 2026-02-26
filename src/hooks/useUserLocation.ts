import { useEffect, useState } from "react";

type LocationState = {
  lat: number | null;
  lng: number | null;
  loading: boolean;
  error: string | null;
  isValid: boolean | null;
  area: string | null;
};

export function useUserLocation() {
  const [state, setState] = useState<LocationState>({
    lat: null,
    lng: null,
    loading: true,
    error: null,
    isValid: null, 
    area: null,
  });

  useEffect(() => {

    if (!navigator.geolocation) {
      setState((s) => ({
        ...s,
        loading: false,
        error: "Trình duyệt không hỗ trợ định vị",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch("http://localhost:4004/api/location", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              lat: latitude,
              lng: longitude,
            }),
          });

          const data = await res.json();
          console.log("📦 BACKEND RESPONSE:", data);

          setState({
            lat: latitude,
            lng: longitude,
            loading: false,
            error: null,
            isValid: data.isValid,
            area: data.area,
          });
        } catch (e) {
          setState((s) => ({
            ...s,
            loading: false,
            error: "Không kết nối được backend",
          }));
        }
      },
      (err) => {
        console.log("❌ getCurrentPosition ERROR", err);

        setState((s) => ({
          ...s,
          loading: false,
          error: err.message,
          isValid: null,
        }));
      }
    );
  }, []);

  return state;
}
