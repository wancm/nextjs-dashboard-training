import CardWrapper from "@/app/ui/dashboard/cards"
import RevenueChart from "@/app/ui/dashboard/revenue-chart"
import LatestInvoices from "@/app/ui/dashboard/latest-invoices"
import { lusitana } from "@/app/ui/fonts"
import { fetchLatestInvoices } from "@/app/lib/data"
import { Suspense } from "react"
import { CardsSkeleton, RevenueChartSkeleton } from "@/app/ui/skeletons"

/**
 * https://nextjs.org/learn/dashboard-app/streaming
 *
 * Deciding where to place your Suspense boundaries
 * Where you place your Suspense boundaries will depend on a few things:
 *
 * How you want the user to experience the page as it streams.
 * What content you want to prioritize.
 * If the components rely on data fetching.
 * Take a look at your dashboard page, is there anything you would've done differently?
 *
 * Don't worry. There isn't a right answer.
 *
 * You could stream the whole page like we did with loading.tsx... but that may lead to a longer loading time if one of the components has a slow data fetch.
 * You could stream every component individually... but that may lead to UI popping into the screen as it becomes ready.
 * You could also create a staggered effect by streaming page sections. But you'll need to create wrapper components.
 * Where you place your suspense boundaries will vary depending on your application. In general, it's good practice to move your data fetches down to the components that need it, and then wrap those components in Suspense. But there is nothing wrong with streaming the sections or the whole page if that's what your application needs.
 *
 * Don't be afraid to experiment with Suspense and see what works best, it's a powerful API that can help you create more delightful user experiences.
 * */

export default async function Page() {
    // const revenue = await fetchRevenue()
    const latestInvoices = await fetchLatestInvoices()

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton/>}>
                    <CardWrapper/>
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton/>}>
                    <RevenueChart/>
                </Suspense>
                {<LatestInvoices latestInvoices={latestInvoices}/>}
            </div>
        </main>
    )
}