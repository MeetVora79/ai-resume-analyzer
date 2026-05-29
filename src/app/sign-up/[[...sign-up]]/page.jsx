import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-muted/40 px-4 py-12">
      <SignUp />
    </div>
  );
}