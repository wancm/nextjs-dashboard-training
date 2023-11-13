/**
 * By adding the 'use server', you mark all the exported functions within the file as server functions.
 * These server functions can then be imported into Client and Server components, making them extremely versatile.
 * */

"use server"  // <=  a Server Action

import { z } from "zod"
import { sql } from "@vercel/postgres"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

const InvoiceSchema = z.object({
    id: z.string(),
    customerId: z.string(),
    amount: z.coerce.number(),
    status: z.enum(["pending", "paid"]),
    date: z.string(),
})

const CreateInvoice = InvoiceSchema.omit({ id: true, date: true })
const UpdateInvoice = InvoiceSchema.omit({ date: true, id: true });

export async function createInvoice(formData: FormData) {
    console.log("create invoices")
    const { customerId, amount, status } = CreateInvoice.parse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    })

    /**
     * Storing values in cents
     * It's usually good practice to store monetary values in cents in your database
     * to eliminate JavaScript floating-point errors and ensure greater accuracy.
     * */
    const amountInCents = amount * 100

    // let's create a new date with the format "YYYY-MM-DD" for the invoice's creation date:
    const date = new Date().toISOString().split("T")[0]

    await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `

    /**
     * 6. Revalidate and redirect
     * Next.js has a Client-side Router Cache that stores the route segments in the user's browser for a time.
     * Along with prefetching, this cache ensures that users can quickly navigate between routes while reducing
     * the number of requests made to the server.
     *
     * Since you're updating the data displayed in the invoices route,
     * you want to clear this cache and trigger a new request to the server.
     * You can do this with the revalidatePath function from Next.js:
     * */

    // Once the database has been updated, the /dashboard/invoices path will be revalidated,
    // and fresh data will be fetched from the server.
    revalidatePath("/dashboard/invoices")

    // you also want to redirect the user back to the /dashboard/invoices page.
    // You can do this with the redirect function from Next.js:

    redirect("/dashboard/invoices")
}

export async function updateInvoice(id: string, formData: FormData) {

    const UpdateInvoice = InvoiceSchema.omit({ date: true, id: true })

    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get("customerId"),
        amount: formData.get("amount"),
        status: formData.get("status"),
    })

    const amountInCents = amount * 100

    await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `

    revalidatePath("/dashboard/invoices")
    redirect("/dashboard/invoices")
}

export async function deleteInvoice(id: string) {
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath('/dashboard/invoices');
}