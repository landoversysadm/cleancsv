import React, { useState } from "react";
import { CSVReader } from "react-papaparse";
import { CSVLink } from "react-csv";
import "./App.css";

const App = () => {
  const [passengerInfo, setPassengerInfo] = useState([]);
  const [isloading, setIsloading] = useState(true);
  const [isClean, setIsClean] = useState(false);
  const [phoneNumbers, setPhoneNumbers] = useState([]);

  const handleOnFileLoad = (data) => {
    setPassengerInfo(data);
    setIsloading(false);
  };

  const buttonRef = React.createRef();

  const handleOpenDialog = (e) => {
    // Note that the ref is set async, so it might be null at some point
    setIsClean(false);
    if (buttonRef.current) {
      buttonRef.current.open(e);
    }
  };

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err);
  };

  const clean = (phone) => {
    // var newPhone = phone;
    // var time = new Date().getHours();
    if (phone !== undefined) {
      phone = phone.toString();
      phone = phone.trim();
      let newPhone;
      if (
        phone.charAt(0) === "7" ||
        phone.charAt(0) === "8" ||
        phone.charAt(0) === "9"
      ) {
        newPhone = "0" + phone;
      } else if (phone.substring(0, 4) === "2340") {
        let slashed = phone.slice(4);
        newPhone = "0" + slashed;
      } else if (phone.substring(0, 5) === "+2340") {
        let slashed = phone.slice(5);
        newPhone = "0" + slashed;
      } else if (phone.substring(0, 3) === "234") {
        let slashed = phone.slice(3);
        newPhone = "0" + slashed;
      } else if (phone.substring(0, 4) === "+234") {
        let slashed = phone.slice(4);
        newPhone = "0" + slashed;
      } else {
        newPhone = phone;
      }
      return newPhone;
    }
  };

  if (!isloading) {
    console.log(passengerInfo.length);
  }

  const handleFormat = () => {
    let info = [];
    if (!isloading) {
      for (let i = 1; i < passengerInfo.length - 1; i++) {
        //   info.push(clean(clean(passengerInfo[i].data[15])));
        const data = {
          "Phone Number": clean(clean(passengerInfo[i].data[15])),
        };

        info.push(data);
      }

      setPhoneNumbers(info);
      setIsClean(true);
    }
  };

  //headers = [{ label: "Phone Number", key: "Phone Number" }];

  console.log(phoneNumbers);

  return (
    <div className="card">
      <h2 className="title">CSV CLEANER</h2>
      <CSVReader
        ref={buttonRef}
        onFileLoad={handleOnFileLoad}
        onError={handleOnError}
      >
        {({ file }) => (
          <aside
            style={{
              display: "flex",
              flexDirection: "row",
              margin: "auto",
              padding: "10px",
              width: "60%",
            }}
          >
            <button
              type="button"
              onClick={handleOpenDialog}
              className="button"
              style={{ backgroundColor: "#366992", width: "200px" }}
            >
              Upload CSV
            </button>
            <div
              style={{
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "#ccc",
                height: 45,
                lineHeight: 2.5,
                marginTop: 5,
                marginBottom: 5,
                paddingLeft: 13,
                paddingTop: 3,
                width: "70%",
              }}
            >
              {file && file.name}
            </div>
            <button
              onClick={handleFormat}
              className="button"
              style={{ backgroundColor: "#DD2222", width: "200px" }}
            >
              Clean data
            </button>
          </aside>
        )}
      </CSVReader>
      {/*  <button onClick={handleFormat}>Clean Data</button> */}

      {isClean ? (
        <CSVLink data={phoneNumbers}>
          <button
            className="button"
            style={{
              backgroundColor: "green",
              padding: "15px",
              marginLeft: "40%",
              marginTop: "50px",
            }}
          >
            Download New CSV
          </button>
        </CSVLink>
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
