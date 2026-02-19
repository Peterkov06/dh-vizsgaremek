"use client";

import RegistrationContextManager from "./RegistrationContextManager";
import RegistrationStepper from "./RegistrationStepper";

const WrapWrapper = () => {
  return (
    <RegistrationContextManager>
      <RegistrationStepper />
    </RegistrationContextManager>
  );
};

export default WrapWrapper;
