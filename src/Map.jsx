import React, { useEffect, useRef, useState } from "react";
import Select from "./Select";
import axios from "axios";
import "./Map.css";

const Map = () => {
  const mapElement = useRef(null);
  const [sgisData, setSgisData] = useState([]);
  const [accessToken, setAccessToken] = useState({});

  const getAccessToken = {
    consumer_key: "9f5563a0ece544ddb338",
    consumer_secret: "dd29974fa87640b59235",
  };

  const getSido = {
    accessToken: accessToken,
    // cd: "24",
  };

  useEffect(() => {
    const { naver } = window;
    if (!mapElement.current || !naver) return;

    // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
    const location = new naver.maps.LatLng(37.5656, 126.9769);
    const mapOptions = {
      center: location,
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.BOTTOM_RIGHT,
      },
    };
    const map = new naver.maps.Map(mapElement.current, mapOptions);
    new naver.maps.Marker({
      position: location,
      map,
    });
  }, []);

  useEffect(() => {
    axios
      .get("https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json", {
        params: getAccessToken,
      })
      .then((res) => console.log(res));
  }, []);

  useEffect(() => {
    axios("https://sgisapi.kostat.go.kr/OpenAPI3/addr/stage.json", {
      params: getSido,
    })
      .then((res) => {
        setSgisData(res.data);
      })
      .catch((error) => {
        console.error("에러에러:", error);
      });
  }, []);

  console.log(accessToken);

  return (
    <div className="view" ref={mapElement} style={{ minHeight: "100vh" }}>
      {sgisData.errMsg === "Success" && <Select sidoData={sgisData.result} />}
    </div>
  );
};

export default Map;
