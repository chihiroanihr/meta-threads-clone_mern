/*
An endpoint handler that processes incoming webhook events from Clerk.

Resource:
- https://clerk.com/docs/users/sync-data-to-your-backend (Why we need webhooks i.e., to sync data, to our backend?)
- https://docs.svix.com/receiving/verifying-payloads/why (Wehy we need to verify webhooks?)
- https://clerk.com/docs/integration/webhooks#supported-events (Webhook API supported events)
- https://github.com/perkinsjr/Clerk-App-Router-Webhooks/blob/main/src/app/api/webhook/route.ts (Sample webhook code)

Reference:
- Code snippet copied from : https://gist.github.com/adrianhajdin/060e4c9d3d8d4274b7669e260dbbcc8e#file-clerk-route-ts
*/

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { IncomingHttpHeaders } from "http";
import { Webhook, WebhookRequiredHeaders } from "svix";
import { WebhookEvent } from "@clerk/nextjs/server";

import {
  addMemberToCommunity,
  createCommunity,
  deleteCommunity,
  removeUserFromCommunity,
  updateCommunityInfo,
} from "@/lib/actions/community.actions";

let communityJustCreated = false;

/**
 * Backend endpoint setup to receive the webhook events.
 * @param request
 * @returns
 */
export const POST = async (request: Request) => {
  try {
    // Get the headers
    const header = headers();
    const svix_id = header.get("svix-id");
    const svix_timestamp = header.get("svix-timestamp");
    const svix_signature = header.get("svix-signature");
    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
      console.log("[LOG] Error: No svix headers.");
      // Send the response
      return new Response("No svix headers.", {
        status: 400,
      });
    }

    // Create headers
    const heads = {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    };

    // Get the body
    const payload = await request.json();

    // Create body
    const body = JSON.stringify(payload);

    /*
    Activitate Webhook in the Clerk Dashboard.
    After adding the endpoint, you'll see the secret on the right side.
    */
    let webhookSecret: string;
    // If webhook secret key exists
    if (process.env.CLERK_WEBHOOK_SECRET) {
      webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
    } else {
      throw new Error("[LOG] Error: Clerk webhook secret key not found.");
    }

    // Create a new SVIX (webhook) instance with your secret
    const webhook = new Webhook(webhookSecret);

    let evnt: WebhookEvent | null = null;
    // Verify the authenticity of the webhook headers + payload (important for security).
    try {
      evnt = webhook.verify(
        body,
        heads as IncomingHttpHeaders & WebhookRequiredHeaders
      ) as WebhookEvent;
    } catch (error) {
      console.error("[LOG] Error verifying webhook:", error);
      // Send the response
      return NextResponse.json({ message: error }, { status: 400 });
    }

    // If event data missing
    if (!evnt || !evnt.data) {
      console.log("[LOG] Error: Event data is missing.");
      // Send the response
      return new Response("Event data is missing.", {
        status: 400,
      });
    }

    // Get the event type
    const eventType = evnt.type;
    if (!eventType) {
      console.log("[LOG] Unknown event type");
      return NextResponse.json(
        { message: "Unknown event type" },
        { status: 400 }
      );
    }

    // Different response for newly created community
    if (communityJustCreated) {
      /*
      The flow (API callstack) of the organization creation event from the clerk:
      1. organization.created ->
      2. organizationMembership.created ->
      3. organization.updated
      */
      if (
        eventType === "organizationMembership.created" ||
        eventType === "organization.updated"
      ) {
        communityJustCreated = false;
        // Send the response
        return NextResponse.json(
          { message: "Execiton Skipped." },
          { status: 200 }
        );
      }
    } else {
      // Handle event
      switch (eventType) {
        // Handle the webhook: Listen organization creation event
        case "organization.created":
          communityJustCreated = true;

          // Retrieve webhook response data &
          // Insert/Create a community (Call to backend)
          await createCommunity({
            communityId: evnt.data.id,
            communityName: evnt.data.name,
            communitySlug: String(evnt.data.slug),
            communityImage: evnt.data.image_url,
            communityBio: "org bio",
            createdByUserId: evnt.data.created_by,
          });

          // Send the response
          return NextResponse.json(
            { message: "Community created." },
            { status: 201 }
          );
        /*
        Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/CreateOrganization
        Show what evnt?.data sends from above resource
        */

        // Handle the webhook: Listen organization invitation creation event.
        /*
        Just to show. You can avoid this
        or tell people that we can create a new mongoose action and add pending invites in the database.
        */
        case "organizationInvitation.created":
          // Retrieve webhook response data
          const res = evnt.data || {};

          // Send the response
          return NextResponse.json(
            { message: "Invitation created." },
            { status: 201 }
          );
        /*
        Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Invitations#operation/CreateOrganizationInvitation
        Show what evnt?.data sends from above resource
        */

        // Handle the webhook: Listen organization membership (member invite & accepted) creation
        case "organizationMembership.created":
          // Retrieve webhook response data &
          // Insert/Create a member to the community based on its community ID and the member's user ID (Call to backend)
          await addMemberToCommunity({
            communityId: evnt.data.organization.id,
            userId: evnt.data.public_user_data.user_id,
            admin: evnt.data.role === "admin",
          });

          // Send the response
          return NextResponse.json(
            { message: "Invitation accepted." },
            { status: 201 }
          );
        /*
        Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/CreateOrganizationMembership
        Show what evnt?.data sends from above resource
        */

        // Handle the webhook: Listen member deletion event
        case "organizationMembership.deleted":
          // Retrieve webhook response data &
          // Delete a member from the community based on its community ID and the member's user ID (Call to backend)
          await removeUserFromCommunity({
            communityId: evnt.data.organization.id,
            userId: evnt.data.public_user_data.user_id,
            admin: evnt.data.role === "admin",
          });

          // Send the response
          return NextResponse.json(
            { message: "Member removed." },
            { status: 200 }
          );
        /*
        Resource: https://clerk.com/docs/reference/backend-api/tag/Organization-Memberships#operation/DeleteOrganizationMembership
        Show what evnt?.data sends from above resource
        */

        // Handle the webhook: Listen organization updation event
        case "organization.updated":
          // Retrieve webhook response data &
          // Update the community info via community ID (Call to backend)
          await updateCommunityInfo({
            communityId: evnt.data.id,
            communityName: evnt.data.name,
            communitySlug: String(evnt.data.slug),
            communityImage: evnt.data.image_url,
          });

          // Send the response
          return NextResponse.json(
            { message: "Community updated." },
            { status: 200 }
          );
        /*
        Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/UpdateOrganization
        Show what evnt?.data sends from above resource
        */

        // Handle the webhook: Listen organization deletion event
        case "organization.deleted":
          // Retrieve webhook response data &
          // Delete the community info via community ID (Call to backend)
          await deleteCommunity(String(evnt.data.id));

          // Send the response
          return NextResponse.json(
            { message: "Community deleted." },
            { status: 200 }
          );
        /*
        Resource: https://clerk.com/docs/reference/backend-api/tag/Organizations#operation/DeleteOrganization
        Show what evnt?.data sends from above resource
        */
      }
    }
  } catch (error) {
    console.error("[LOG] Internal Server Error:", error);
    // Send the response
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
};
