import CreateNewForm from "@/components/CreateNewForm";
import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";

const AddPage = async () => {
  const session = await getAuth();
  if (!session) {
    redirect("/login");
  }
  return (
    <>
      <CreateNewForm />
    </>
  );
};

export default AddPage;
