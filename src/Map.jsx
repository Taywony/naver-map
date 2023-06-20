import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Map.css";

const RADIO = [
  { id: "select1", title: "select", value: "first" },
  { id: "select2", title: "select", value: "second" },
  { id: "select3", title: "select", value: "third" },
];

const Map = () => {
  const [sgisData, setSgisData] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [selectedRadio, setSelectedRadio] = useState(RADIO[0].value);
  const [polygonData, setPolygonData] = useState([]);
  const mapElement = useRef(null);

  //accessToken 받아올때 넣는 body 값
  const getAccessToken = {
    consumer_key: "9f5563a0ece544ddb338",
    consumer_secret: "dd29974fa87640b59235",
  };

  // 시/도 리스트 받아올대 넣는 body 값
  const getSido = {
    accessToken: accessToken,
    // cd: "24",
  };

  // naver map 표시
  useEffect(() => {
    const { naver } = window;
    if (!mapElement.current || !naver) return;

    // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
    const location = new naver.maps.LatLng(37.5682, 126.8973);
    const mapOptions = {
      center: new naver.maps.LatLng(35.5, 127.4), //초기값 전체지도 보이게
      zoom: 7,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    };
    const map = new naver.maps.Map(mapElement.current, mapOptions);

    let polygon = new naver.maps.Polygon({
      map: map,
      paths: [
        [
          new naver.maps.LatLng(37.37544345085402, 127.11224555969238),
          new naver.maps.LatLng(37.37230584065902, 127.10791110992432),
          new naver.maps.LatLng(37.35975408751081, 127.10795402526855),
          new naver.maps.LatLng(37.359924641705476, 127.11576461791992),
          new naver.maps.LatLng(37.35931064479073, 127.12211608886719),
          new naver.maps.LatLng(37.36043630196386, 127.12293148040771),
          new naver.maps.LatLng(37.36354029942161, 127.12310314178465),
          new naver.maps.LatLng(37.365211629488016, 127.12456226348876),
          new naver.maps.LatLng(37.37544345085402, 127.11224555969238),
        ],
      ],
      fillColor: "#ff0000",
      fillOpacity: 0.3,
      strokeColor: "#ff0000",
      strokeOpacity: 0.6,
      strokeWeight: 3,
    });
  }, [polygonData]);

  //polygon 좌표 가져오는 api
  useEffect(() => {
    axios("/sido.json").then((res) => setPolygonData(res.data[4]));
  }, []);

  const polygonCoor = JSON.parse(polygonData.polygon);
  const coordinates = Object.values(polygonCoor);
  console.log(coordinates);

  //accessToken 받아오는 api
  useEffect(() => {
    axios
      .get("https://sgisapi.kostat.go.kr/OpenAPI3/auth/authentication.json", {
        params: getAccessToken,
      })
      .then((res) => setAccessToken(res.data.result.accessToken));
  }, []);

  // sgis에서 시/도 리스트 받아오는 api
  useEffect(() => {
    accessToken &&
      axios("https://sgisapi.kostat.go.kr/OpenAPI3/addr/stage.json", {
        params: getSido,
      })
        .then((res) => {
          setSgisData([{ addr_name: "전체", cd: "0" }, ...res.data.result]);
        })
        .catch((error) => {
          console.error("에러에러:", error);
        });
  }, [accessToken]);

  console.log("sgisData", sgisData);

  console.log("------------------------------------------");
  return (
    <div className="view">
      <div
        className="map"
        ref={mapElement}
        style={{ minHeight: "100vh" }}
      ></div>
      <div className="radiobox">
        {RADIO.map(({ id, title, value }) => {
          return (
            <div className="selectBox" key={id}>
              <div className="selector">
                <input
                  type="radio"
                  className="pick"
                  id={id}
                  name={title}
                  value={value}
                  defaultChecked={value === "first"}
                  onChange={() => {
                    setSelectedRadio(value);
                  }}
                />
                <label htmlFor={id}>{value}</label>
              </div>
              <div className="sidoBox">
                {/* 선택된 라디오 버튼의 값과 현재 반복문의 value 값이 일치하는 경우에만 sidoList를 렌더링 */}
                {selectedRadio === value && (
                  <div className="sidoList">
                    {sgisData?.map(({ addr_name, cd }) => {
                      return (
                        <label key={cd} className="sidoItem">
                          <input
                            className="sidoRadio"
                            type="radio"
                            id="sido"
                            name="sido"
                            value={addr_name}
                          />
                          <span>{addr_name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Map;
