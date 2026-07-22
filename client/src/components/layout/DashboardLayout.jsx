import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import Topbar from "./Topbar.jsx";

export default function DashboardLayout() {
    return (
        <div className="flex min-h-screen bg-blueprint-950">
            <Sidebar />

            <div className="flex flex-1 flex-col">
                <Topbar />

                <main className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}