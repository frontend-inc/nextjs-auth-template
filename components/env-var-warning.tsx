import Link from "next/link";
import { Alert } from "./ui/alert";
import { Button } from "./ui/button";
import { InfoIcon } from "lucide-react";

export function EnvVarWarning() {
  return (
    <div className="flex gap-4 items-center">      
      <div className="flex flex-row space-x-2 items-center p-2 rounded-lg border-1 border-blue-400 bg-blue-400/10">
        <InfoIcon className="text-blue-400 h-4 w-4" />
        <p className=' text-blue-500 text-sm'>        
          Connect Supabase for authentication
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          asChild
          size="sm"
          variant={"outline"}
          disabled
          className="opacity-75 cursor-none pointer-events-none"
        >
          <Link href="/sign-in">Sign in</Link>
        </Button>
        <Button
          asChild
          size="sm"
          variant={"default"}
          disabled
          className="opacity-75 cursor-none pointer-events-none"
        >
          <Link href="/sign-up">Sign up</Link>
        </Button>
      </div>
    </div>
  );
}
