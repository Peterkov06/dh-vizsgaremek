import getCurrentUser from "@/lib/auth";
import TeacherMoneyPage from "../../(teacher)/components/TeacherMoneyPage";

const MoneyPage = async () => {
  const user = await getCurrentUser();

  return user?.role === "Teacher" ? (
    <TeacherMoneyPage></TeacherMoneyPage>
  ) : (
    <></>
  );
};

export default MoneyPage;
