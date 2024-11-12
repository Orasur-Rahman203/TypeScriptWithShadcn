"use client";

import { Button } from "@/components/ui/button";
import React from "react";

const ClientButton = () => {
  return (
    <div>
      <Button
        onClick={() => {
          // console.log("client button clicked");
        }}
      >
        Client API call
      </Button>
    </div>
  );
};

export default ClientButton;
