export default function DashboardCard({ icon, title, description, action }: { icon?: React.ReactNode, title: string, description: string, action: React.ReactNode }) {
  return (
    <div className="rounded-2xl shadow p-6 bg-white flex flex-col justify-between min-h-[180px]">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-bold text-lg">{title}</span>
      </div>
      <div className="text-gray-600 mb-4">{description}</div>
      {action}
    </div>
  );
}
