import getCurrentUser from "@/lib/auth";
import TeacherMoneyPage from "../../(teacher)/components/TeacherMoneyPage";
import StudentMoneyPage from "../../(student)/components/StudentMoneyPage";

const MoneyPage = async () => {
  const user = await getCurrentUser();

  return user?.role === "Teacher" ? (
    <TeacherMoneyPage></TeacherMoneyPage>
  ) : (
    <StudentMoneyPage></StudentMoneyPage>
  );
};

export default MoneyPage;
