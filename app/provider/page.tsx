import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ProviderDashboard from "../_component/ProviderDashboard";


export default async function ProviderPage() {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const user = await currentUser();

    return <ProviderDashboard clerkId={userId} userName={user?.firstName ?? ""} />
}