"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function HubNavbar() {
    const router = useRouter();

    function logout() {
        localStorage.removeItem("session");
        toast.success("Logged out");
        router.push("/hub-operator/login");
    }

    return (
        <nav className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
            <h1 className="text-lg font-semibold">Hub Dashboard</h1>

            <div className="flex gap-3">
                <Button
                    variant="outline"
                    onClick={() => router.push("/hub-operator/verified")}
                >
                    Verified Batches
                </Button>

                <Button
                    variant="outline"
                    onClick={() => router.push("/hub-operator/booked")}
                >
                    Booked Batches
                </Button>




                <Button variant="destructive" onClick={logout}>
                    Logout
                </Button>
            </div>
        </nav>
    );
}
