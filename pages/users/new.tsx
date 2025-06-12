import { useAcl } from "@/client/hooks"
import { UserForm } from "@/components/ui/userForm";

export default function Page(){
  useAcl();
  return <div className="w-full h-full flex flex-col justify-center items-center">
      <UserForm />
    </div>
}