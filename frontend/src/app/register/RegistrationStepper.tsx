"use client";
import MainRegisterComponent from "./MainRegisterComponent";
import PersonalDataComponent from "./PersonalDataComponent";
import IntroductionComponent from "./IntroductionComponent";
import { useRegistrationContext } from "./RegistrationContextManager";

const RegistrationStepper = () => {
  const steps = [
    <MainRegisterComponent />,
    <PersonalDataComponent />,
    <IntroductionComponent />,
  ];
  const { currentStep } = useRegistrationContext();
  return <div className="w-full h-full">{steps[currentStep]}</div>;
};

export default RegistrationStepper;
