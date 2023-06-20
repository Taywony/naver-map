import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Map.css";

const RADIO = [
  { id: "select1", title: "select", value: "first" },
  { id: "select2", title: "select", value: "second" },
  { id: "select3", title: "select", value: "third" },
];

const Map = () => {
  const mapElement = useRef(null);
  const [sgisData, setSgisData] = useState([]);
  const [accessToken, setAccessToken] = useState(null);
  const [selectedRadio, setSelectedRadio] = useState(RADIO[0].value);

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

  useEffect(() => {
    const { naver } = window;
    if (!mapElement.current || !naver) return;

    // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣어줍니다.
    const location = new naver.maps.LatLng(37.5682, 126.8973);
    const mapOptions = {
      center: location,
      zoom: 17,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    };
    const map = new naver.maps.Map(mapElement.current, mapOptions);
    new naver.maps.Marker({
      position: location,
      map,
    });
  }, []);

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
