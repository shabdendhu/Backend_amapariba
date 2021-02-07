import React from "react";
import { Button, Radio, Card } from "@material-ui/core";
import {
  BlockHeading,
  HeaderOne
} from "../mzeet-custumerapp/mzeet-customer-app/src/Component/template";
import Subcategory from "../../../Component/parselCategory/subcategory";
import Api from "../mzeet-custumerapp/mzeet-customer-app/src/api";
import axios from "axios";

const api = new Api();
const CategoryBooking = () => {
  const RequestData = JSON.parse(
    sessionStorage.getItem("pickup_drop_location")
  );
  const ConformRequest = () => {
    axios.post(api.make_request, RequestData).then(response => {
      sessionStorage.clear();
      console.log("response", response);
    });
  };
  return (
    <div>
      <HeaderOne pageName="Booking" />
      <div style={{ marginTop: "15px" }}>
        <span>
          <span>
            <BlockHeading title="Select Parsel Quantity" />
          </span>
          <Subcategory
            iconName="shopping_bag"
            range="0kg - 25kg"
            fontsize="20px"
            color="rgb(52 67 95)"
          />
          <Subcategory
            iconName="shopping_bag"
            range="25kg - 50kg"
            fontsize="25px"
            color="rgb(52 67 95)"
          />
          <Subcategory
            iconName="shopping_bag"
            range="50kg - 100kg"
            fontsize="30px"
            color="rgb(52 67 95)"
          />
        </span>
        <Button
          onClick={() => {
            ConformRequest();
          }}
          variant="contained"
          color="secondary"
          style={{
            width: "90%",
            borderRadius: 20,
            marginLeft: "5%",

            marginTop: "50px",
            background: "var(--secondary-color)"
          }}
        >
          Cnform Request
        </Button>
      </div>
    </div>
  );
};

export default CategoryBooking;
