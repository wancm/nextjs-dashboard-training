"use client"

/**
 * There are three Next.js client hooks that you'll use to implement the search functionality:
 *
 *  -   useSearchParams- Allows you to access the parameters of the current URL. For example, the search params for this URL /dashboard/invoices?page=1&query=pending would look like this: {page: '1', query: 'pending'}.
 *  -   usePathname - Lets you read the current URL's pathname. For example, the route /dashboard/invoices, usePathname would return '/dashboard/invoices'.
 *  -   useRouter - Enables navigation between routes within client components programmatically. There are multiple methods you can use.
 * */

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

export default function Search({ placeholder }: { placeholder: string }) {

    /**
     * ${pathname} is the current path, in your case, "/dashboard/invoices".
     * As the user types into the search bar, params.toString() translates this input into a URL-friendly format.
     * The replace(${pathname}?${params.toString()}); command updates the URL with the user's search data. For example, /dashboard/invoices?query=lee if the user searches for "lee".
     * The URL is updated without reloading the page, thanks to Next.js's client-side navigation (which you learned about in the chapter on navigating between pages.
     * */
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term) => {
        console.log(`Searching... ${term}`)

        const params = new URLSearchParams(searchParams)

        // defaulting the pagination page number
        params.set("page", "1")

        if (term) {
            params.set("query", term)
        } else {
            params.delete("query")
        }
        replace(`${pathname}?${params.toString()}`)
    }, 500)

    return (
        <div className="relative flex flex-1 flex-shrink-0">
            <label htmlFor="search" className="sr-only">
                Search
            </label>
            <input
                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                placeholder={placeholder}
                onChange={(e) => {
                    handleSearch(e.target.value)
                }}

                /* To ensure the input field is in sync with the URL and will be populated when sharing, you can pass a defaultValue to input by reading from */
                defaultValue={searchParams.get("query")?.toString()}
            />
            <MagnifyingGlassIcon
                className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
        </div>
    )
}
