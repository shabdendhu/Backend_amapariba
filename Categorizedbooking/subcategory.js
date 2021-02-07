import React from "react";
import { HeaderOne } from "../../../Component/template";
import SubcategoryCard from "../../../Component/parselCategory/subcategory-card";
import { Radio } from "@material-ui/core";

const Subcategory = () => {
  return (
    <React.Fragment>
      <HeaderOne pageName="Subcategory" />
      <div className="page-content">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={{ width: "-webkit-fill-available" }}>
            <div
              style={{
                display: "flex",
                // flexDirection: "column",
                width: "fit-content",
                alignItems: "center",
                margin: "10px"
              }}
            >
              <span>
                <Radio />
              </span>
              <span>Chairs & Sofa-Set</span>
            </div>
            <div
              style={{
                display: "flex",
                // flexDirection: "column",
                width: "fit-content",
                alignItems: "center",
                margin: "10px"
              }}
            >
              <span>
                <Radio />
              </span>
              <span>Almirha & Godreg</span>
            </div>
            <div
              style={{
                display: "flex",
                // flexDirection: "column",
                width: "fit-content",
                alignItems: "center",
                margin: "10px"
              }}
            >
              <span>
                <Radio />
              </span>
              <span>Fridge</span>
            </div>
            <div
              style={{
                display: "flex",
                // flexDirection: "column",
                width: "fit-content",
                alignItems: "center",
                margin: "10px"
              }}
            >
              <span>
                <Radio />
              </span>
              <span>Bed & Mattress</span>
            </div>{" "}
            <div
              style={{
                display: "flex",
                // flexDirection: "column",
                width: "fit-content",
                alignItems: "center",
                margin: "10px"
              }}
            >
              <span>
                <Radio />
              </span>
              <span>Mirror & Glasses</span>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default Subcategory;
