import { InertiaLinkProps } from '@inertiajs/react';
import { LucideIcon } from 'lucide-react';
import { StringifyOptions } from 'querystring';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: NonNullable<InertiaLinkProps['href']>;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

//typos for personal task

//typo for task
export interface Task{
    id: number;
    user_id: number;
    platform_id: number;
    title: string;
    description?: string;
    course?: string;
    due_date: string;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    priority: 'low' | 'medium' | 'high';
    source_type: 'external' | 'personal';
    created_at: string;
    updated_at: string;
}

//typo for platform
export interface Platform {
    id: number;
    name: string;
    type: 'classroom' | 'moodle' | 'personal';
    default_color: string;
    url?: string;
    created_at: string;
    updated_at: string;
}

//typo for create task data (personal task)
export interface CreateTaskData {
    title: string;
    description?: string;
    due_date: string;
    status: 'pending' | 'in_progress' | 'completed' | 'overdue';
    priority: 'low' | 'medium' | 'high';
    source_type: 'external' | 'personal';
}