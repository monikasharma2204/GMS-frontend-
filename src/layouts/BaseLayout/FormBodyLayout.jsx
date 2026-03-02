import React from "react";

const FormBodyLayout = ({ children }) => {
  return (
    <>
      <div className="form_body_wrp"  >
        <div className="block">
       { children }



        </div>
      </div>
    </>
  );
};

export default FormBodyLayout;
