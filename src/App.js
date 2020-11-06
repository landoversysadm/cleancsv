import React, { useState } from "react";
import { CSVReader } from "react-papaparse";
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
      //  phone = phone.toString();
      phone = phone.trim();
      let newPhone;
      if (
        phone.charAt(0) === "7" ||
        phone.charAt(0) === "8" ||
        phone.charAt(0) === "9"
      ) {
        //   phone = parseInt(phone);
        newPhone = "0" + phone;
      } else if (phone.substring(0, 4) === "2340") {
        let slashed = phone.slice(4);
        //phone = parseInt(slashed);
        newPhone = "0" + slashed;
      } else if (phone.substring(0, 5) === "+2340") {
        let slashed = phone.slice(5);
        //phone = parseInt(slashed);
        newPhone = "0" + slashed;
      } else if (phone.substring(0, 3) === "234") {
        let slashed = phone.slice(3);
        //    phone = parseInt(slashed);
        newPhone = "0" + slashed;
      } else if (phone.substring(0, 4) === "+234") {
        let slashed = phone.slice(4);
        //     phone = parseInt(slashed);
        newPhone = "0" + slashed;
      } else {
        newPhone = phone;
      }
      return newPhone;
    }
  };

  const handleFormat = () => {
    let info = [];
    if (!isloading) {
      for (let i = 1; i <= passengerInfo.length - 2; i++) {
        //   info.push(clean(clean(passengerInfo[i].data[15])));
        const data = {
          phone_no: clean(passengerInfo[i].data[15]),
        };

        info.push(data);
      }

      setPhoneNumbers(info);
      setIsClean(true);
    }
  };

  if (!isloading) {
    console.log(phoneNumbers);
    //  console.log(phoneNumbers.length);
  }

  //headers = [{ label: "Phone Number", key: "Phone Number" }];

  //  console.log(headers);

  // console.log(passengerInfo);

  function convertToCSV(objArray) {
    if (!isloading) {
      var array = typeof objArray != "object" ? JSON.parse(objArray) : objArray;
      var str = "";

      for (var i = 0; i < array.length; i++) {
        var line = "";
        for (var index in array[i]) {
          if (line !== "") line += ",";

          line += array[i][index];
        }

        str += line + "\r\n";
      }

      return str;
    }
  }

  function exportCSVFile(headers, items, fileTitle) {
    if (!isloading) {
      if (headers) {
        items.unshift(headers);
      }

      // Convert Object to JSON
      var jsonObject = JSON.stringify(items);

      var csv = convertToCSV(jsonObject);

      var exportedFilenmae = fileTitle + ".csv" || "export.csv";

      var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      if (navigator.msSaveBlob) {
        // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
      } else {
        var link = document.createElement("a");
        if (link.download !== undefined) {
          // feature detection
          // Browsers that support HTML5 download attribute
          var url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", exportedFilenmae);
          link.style.visibility = "hidden";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    }
  }

  function download() {
    if (!isloading) {
      var headers = {
        phone_no: "Phone Number",
      };

      const itemsNotFormatted = phoneNumbers;

      var itemsFormatted = [];

      // format the data
      itemsNotFormatted.forEach((item) => {
        itemsFormatted.push({
          phone_no: item.phone_no,
        });
      });

      var fileTitle = "cleancsv"; // or 'my-unique-title'

      exportCSVFile(headers, itemsFormatted, fileTitle);
    }
  }

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

      {isClean && phoneNumbers !== undefined && phoneNumbers.length > 0 ? (
        /*     <CSVLink
          data={phoneNumbers}
          headers={headers}
          filename={"Passengers_information (cleaned).csv"}
        >
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
        </CSVLink> */
        // <Dsv phone={phoneNumbers} />
        <button
          onClick={download}
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
      ) : (
        ""
      )}
    </div>
  );
};

export default App;
