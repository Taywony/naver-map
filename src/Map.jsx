import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { selectState } from "./recoil/select";
import polygonData from "./sido.json";
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
  const [select, setSelect] = useRecoilState(selectState);
  const pickSido = [...select.selectSido];
  const mapElement = useRef(null);

  //accessToken 받아올때 넣는 body 값
  //env 파일로 관리
  const getAccessToken = {
    consumer_key: "9f5563a0ece544ddb338",
    consumer_secret: "dd29974fa87640b59235",
  };

  // 시/도 리스트 받아올대 넣는 body 값
  const getSido = {
    accessToken: accessToken,
  };

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

  // naver map 표시
  useEffect(() => {
    const { naver } = window;
    if (!mapElement.current || !naver) return;

    // 지도에 표시할 위치의 위도와 경도 좌표를 파라미터로 넣기
    // const location = new naver.maps.LatLng(37.5682, 126.8973);
    const mapOptions = {
      center: new naver.maps.LatLng(35.5, 127.4), //초기값 전체지도 보이게
      zoom: 7,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    };

    // data 구조 파악
    const map = new naver.maps.Map(mapElement.current, mapOptions);

    console.log("픽한 cd", select.selectSido[select.selectTab]);
    console.log("픽한 tap", select.selectTab);

    // // 인천, 전남 일때 좌표값 한번 더 가공하기
    // console.log("서울", polygonData[0].polygon);
    // console.log("인천", polygonData[3].polygon);

    const getCoordinates = polygonData.length
      ? polygonData.length > 1
        ? JSON.parse(polygonData[15]?.polygon)
        : polygonData.forEach((element) => {
            JSON.parse(element.polygon);
          })
      : [];

    const coordinates = Object.values(getCoordinates);
    // console.log(coordinates);

    let polygon = new naver.maps.Polygon({
      map: map,
      paths: [
        coordinates.map((item) => new naver.maps.LatLng(item[1], item[0])),
      ],
      fillColor: "#268eff",
      fillOpacity: 0.3,
      strokeColor: "#268eff",
      strokeOpacity: 0.6,
      strokeWeight: 3,
    });

    // 이벤트 넣어주고 ref에 새로 넣기
    // current 초기값은 배열
  }, [select]);

  console.log("polygonData", polygonData);
  console.log("select", select);
  console.log("pickSido", pickSido);

  console.log("------------------------------------------");
  return (
    <div className="view">
      <div
        className="map"
        ref={mapElement}
        style={{ minHeight: "100vh" }}
      ></div>
      <div className="radiobox">
        {RADIO.map(({ id, title, value }, index) => {
          return (
            <div className="selectBox" key={id}>
              <div className="selector">
                <input
                  type="radio"
                  className="pick"
                  id={id}
                  name={title}
                  value={value}
                  checked={select.selectTab === index}
                  onChange={() => {
                    setSelectedRadio(value);
                  }}
                  onClick={() => setSelect({ ...select, selectTab: index })}
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
                            onClick={() => {
                              pickSido[select.selectTab] = cd;
                              setSelect((prev) => {
                                return { ...select, selectSido: pickSido };
                              });
                            }}
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
      <Link to="/sub" className="toSub">
        이동
      </Link>
    </div>
  );
};

export default Map;
