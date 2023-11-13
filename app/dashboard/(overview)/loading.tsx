import DashboardSkeleton from '@/app/ui/skeletons';

/**
 * loading.tsx is a special Next.js file built on top of Suspense,
 * it allows you to create loading UI to show as a replacement while page content loads.
 * */
export default function Loading() {
    // return'Loading ....';
    return <DashboardSkeleton />;
}