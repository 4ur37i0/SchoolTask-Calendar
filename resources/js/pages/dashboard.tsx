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

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4 md:p-8">
                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    <div className="border border-sidebar-border/70 dark:border-sidebar-border/70 rounded-lg relative min-h-[150px]">
                        <PlaceholderPattern className="absolute inset-0 size-full" />
                    </div>
                    <div className="border border-sidebar-border/70 dark:border-sidebar-border/70 rounded-lg relative min-h-[150px]">
                        <PlaceholderPattern className="absolute inset-0 size-full" />
                    </div>
                    <div className="border border-sidebar-border/70 dark:border-sidebar-border/70 rounded-lg relative min-h-[150px]">
                        <PlaceholderPattern className="absolute inset-0 size-full" />
                    </div>
                </div>

                <div className="border border-sidebar-border/70 dark:border-sidebar-border/70 rounded-lg relative min-h-[300px]">
                    <PlaceholderPattern className="absolute inset-0 size-full" />
                </div>
            </div>
        </AppLayout>
    );
}
