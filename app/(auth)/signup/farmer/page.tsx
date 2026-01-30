import { FarmerSignupForm } from "@/components/auth/FarnerSignupForm"

export default function FarmerSignupPage() {
  return (
    <div className="bg-muted flex min-h-svh items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <FarmerSignupForm />
      </div>
    </div>
  )
}
