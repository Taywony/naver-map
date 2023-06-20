import React, { useEffect, useState } from "react";
import "./Select.css";

const Select = ({ sidoData }) => {
  const [pickBox, setPickBox] = useState([]);
  console.log("sidoData", sidoData);

  useEffect(() => {
    setPickBox(sidoData);
  }, [sidoData]);

  console.log("pickBox", pickBox);
  // if (sgisData !== undefined) {
  //   data = sgisData;
  // }

  //   {
  //     sgisData &&
  //   });
  // }

  // Data.forEach((element) => {
  //   setPickBox((prev) => [
  //     ...prev,
  //     { cd: element.cd, addr: element.addr_name },
  //   ]);
  // });

  const handlePick = () => {
    return;
  };

  return (
    <div className="selectView">
      <div className="selectBox">
        <div>
          <input
            className="pick"
            type="radio"
            id="select1"
            name="select"
            value="first"
            defaultChecked
            onClick={() => handlePick()}
          />
          <label htmlFor="select1">first</label>
        </div>
        <div>
          <input
            className="pick"
            type="radio"
            id="select2"
            name="select"
            value="secound"
            onClick={() => handlePick()}
          />
          <label htmlFor="select2">secound</label>
        </div>
        <div>
          <input
            className="pick"
            type="radio"
            id="select3"
            name="select"
            value="third"
            onClick={() => handlePick()}
          />
          <label htmlFor="select3">third</label>
        </div>
        {pickBox &&
          pickBox.map(({ addr_name, cd }) => {
            <>
              <p>{addr_name}</p>
              <p>{cd}</p>
            </>;
          })}
      </div>
    </div>
  );
};

export default Select;
