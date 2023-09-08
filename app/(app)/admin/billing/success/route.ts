import { getUserSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const user = await getUserSession();

  const session_id = req.nextUrl.searchParams.get("session_id");

  if (!session_id) {
    redirect("/admin/billing");
    return;
  }

  const checkoutSession = await stripe.checkout.sessions.retrieve(session_id);

  await prisma.tenant.update({
    where: { id: user.tenant.id },

    data: { stripeCustomrId: checkoutSession.customer as string, plan: "PRO" },
  });

  redirect("/admin/billing");
}
