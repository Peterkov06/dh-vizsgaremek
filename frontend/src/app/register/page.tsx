import MainRegisterComponent from "./MainRegisterComponent";
import PersonalDataComponent from "./PersonalDataComponent";

const page = () => {
  return (
    <div className="min-h-screen w-full bg-registration-bg flex flex-col justify-center items-center px-10">
      <PersonalDataComponent />
    </div>
  );
};

export default page;
