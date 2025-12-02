import React from "react";
import {
  UserCircleIcon,
  PresentationChartLineIcon,
  ClockIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

function DashboardPage() {
  // Tidak perlu logic User/Logout di sini lagi, sudah di MainLayout

  return (
    <div className="max-w-6xl mx-auto animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <UserCircleIcon className="w-24 h-24 text-[#850E35]" />
                </div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mb-4 text-[#850E35]">
                        <UserCircleIcon className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Total Mahasiswa</p>
                    <h4 className="text-4xl font-bold text-[#850E35] mt-1">120</h4>
                    <div className="flex items-center gap-1 mt-4 text-green-500 text-sm font-medium">
                        <PresentationChartLineIcon className="w-4 h-4" />
                        <span>+5% bulan ini</span>
                    </div>
                </div>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ClockIcon className="w-24 h-24 text-[#EE6983]" />
                </div>
                <div className="relative z-10">
                    <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4 text-[#EE6983]">
                        <ClockIcon className="w-6 h-6" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Presensi Hari Ini</p>
                    <h4 className="text-4xl font-bold text-[#850E35] mt-1">45</h4>
                    <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#EE6983] h-1.5 rounded-full" style={{ width: '45%' }}></div>
                    </div>
                </div>
            </div>

            {/* Card 3 */}
            <div className="bg-gradient-to-br from-[#850E35] to-[#a01d4a] p-6 rounded-2xl shadow-lg text-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
                <div className="absolute -bottom-4 -right-4 opacity-20">
                    <ExclamationTriangleIcon className="w-32 h-32 text-white" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                            <ExclamationTriangleIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">URGENT</span>
                    </div>
                    <p className="text-pink-200 text-sm font-medium">Belum Check-Out</p>
                    <h4 className="text-4xl font-bold mt-1">12</h4>
                    <p className="text-sm text-pink-200 mt-4 opacity-80">Mahasiswa belum check-out hari ini.</p>
                </div>
            </div>
        </div>
    </div>
  );
}

export default DashboardPage;