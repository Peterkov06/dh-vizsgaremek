import getCurrentUser from "@/lib/auth";
import AddTimeBlock from "./AddTimeBlock";

const TimeTableSidebar = async () => {
  const user = await getCurrentUser();

  return (
    <div className="border-4 border-light-bg-gray rounded-2xl h-fit px-2 py-4 bg-light-bg-gray w-[20em]">
      <h1 className="text-2xl text-primary text-center">Órarendem</h1>
      <hr className="mt-4 mb-4" />
      {user?.role === "Teacher" && <AddTimeBlock></AddTimeBlock>}
    </div>
  );
};

export default TimeTableSidebar;
