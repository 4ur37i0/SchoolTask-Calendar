import { PlaceholderPattern } from '@/components/ui/placeholder-pattern';
import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];


const Dashboard = ({taskData}) => {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-8">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">                    
                    <div className="border border-sidebar-border/70 dark:border-sidebar-border/70 rounded-lg relative min-h-[150px] flex flex-col items-center justify-center overflow-hidden bg-[#e3e7eb] dark:bg-[#d3d8e7] dark:bg-slate-900/50 backdrop-blur-sm">
                        <span className="text-sm font-bold uppercase tracking-widest dark:text-slate-400 mb-1 z-10">
                            Tarea proxima para el
                        </span>
                        <p className="text-xs font-bold uppercase inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-indigo-900 inset-ring inset-ring-indigo-400/30 mt-2 dark:text-white">
                            {taskData.proxima}
                        </p>
                    </div>
                    <div className="border border-sidebar-border/70 dark:border-sidebar-border/70 rounded-lg relative min-h-[150px] flex flex-col items-center justify-center overflow-hidden bg-[#e3e7eb] dark:bg-[#d3d8e7] dark:bg-slate-900/50 backdrop-blur-sm">
                        <span className="text-sm font-bold uppercase tracking-widest dark:text-slate-400 mb-1 z-10">
                            Tareas pendientes
                        </span>
                        <p className="text-xl font-bold uppercase inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-indigo-900 inset-ring inset-ring-indigo-400/30 mt-2 dark:text-white">
                            {taskData.pendientes}
                        </p>
                    </div>
                    <div className="border border-sidebar-border/70 dark:border-sidebar-border/70 rounded-lg relative min-h-[150px] flex flex-col items-center justify-center overflow-hidden bg-[#e3e7eb] dark:bg-[#d3d8e7] dark:bg-slate-900/50 backdrop-blur-sm">
                        <span className="text-sm font-bold uppercase tracking-widest dark:text-slate-400 mb-1 z-10">
                            Tareas atrasadas
                        </span>
                        <p className="text-xl font-bold uppercase inline-flex items-center rounded-md bg-indigo-400/10 px-2 py-1 text-indigo-900 inset-ring inset-ring-indigo-400/30 mt-2 dark:text-white">
                            {taskData.atrasadas}
                        </p>
                    </div>
                </div>

                <div className="border border-sidebar-border/70 dark:border-sidebar-border/70 rounded-lg relative min-h-[300px]">
                    <PlaceholderPattern className="absolute inset-0 size-full" />
                </div>
            </div>
        </AppLayout>
    );
}

export default Dashboard;

