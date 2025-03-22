import React from "react";

import { useParams } from "react-router-dom";
import SpecificServiceTable from "./SpecificServiceTable";

const SpecificService = () => {
  const { serviceType } = useParams();

  return (
    <div className="w-auto h-auto ">
      <SpecificServiceTable />
    </div>
  );
};

export default SpecificService;
