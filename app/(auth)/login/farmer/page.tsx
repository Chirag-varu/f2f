import { FarmerLoginForm } from "@/components/auth/FarmerLoginForm";

export default function FarmerLoginPage() {
  return (
    <div className="bg-muted flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <FarmerLoginForm />;
      </div>
    </div>
  );
}
