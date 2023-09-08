import { Button } from "@/components/ui/button";
import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

const vercel = process.env.VERCEL_URL;

const YOUR_DOMAIN = vercel ? `https://${vercel}` : "http://localhost:3000";

export default async function BillingPage() {
  async function createCheckoutSession(data: FormData) {
    "use server";

    const lookup = data.get("lookup_key") as string;

    const prices = await stripe.prices.list({
      lookup_keys: [lookup],
      expand: ["data.product"],
    });

    const user = await getUserSession();

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "auto",
      line_items: [
        {
          price: prices.data[0].id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      subscription_data: {
        metadata: {
          tenantId: user.tenant.id,
        },
      },
      success_url: `${YOUR_DOMAIN}/admin/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${YOUR_DOMAIN}/admin/billing?canceled=true`,
    });

    redirect(session.url || "");
  }

  async function createPortalSession() {
    "use server";

    const user = await getUserSession();

    const tenant = await prisma.tenant.findUnique({
      where: {
        id: user.tenant.id,
      },
    });

    if (!tenant) throw new Error("No tenant found");

    if (!tenant.stripeCustomrId) throw new Error("No strip subscription found");

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: tenant.stripeCustomrId,

      return_url: `${YOUR_DOMAIN}/admin/billing`,
    });

    redirect(portalSession.url);
  }

  return (
    <div className="container">
      <h1 className="text-lg font-semibold">Billing</h1>
      <div className="flex items-center justify-between bg-green-300 px-4 my-4 rounded-md">
        <div className="py-4 space-y-2">
          <h2 className="font-semibold">Current Plan</h2>

          <p className="text-sm">
            The plan you are currently subscribed to. You can upgrade or
            downgrade at any time.
          </p>

          <p className="text-sm font-medium">
            Pro subscription is $1/month or $10/year
          </p>
        </div>
        <div className="space-y-1">
          <form action={createCheckoutSession}>
            <input type="hidden" name="lookup_key" value="pro-monthly" />

            <Button type="submit">Upgrade to Monthly Plan</Button>
          </form>
          <form action={createCheckoutSession}>
            <input type="hidden" name="lookup_key" value="pro-yearly" />

            <Button type="submit">Upgrade to Yearly Plan</Button>
          </form>
        </div>
      </div>

      <div className="flex items-center justify-between bg-yellow-300 px-4 my-4 rounded-md">
        <div className="py-4 space-y-2">
          <h2 className="font-semibold">Manage Plan</h2>

          <p className="text-sm">You can manage your plan here.</p>
        </div>
        <div>
          <form action={createPortalSession}>
            <Button type="submit">Subscription Details</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
