/**
 * Industry Messages Page
 *
 * Route entry point for industry messaging.
 */

import React from "react";
import { useParams } from "react-router-dom";
import { IndustryInbox } from "../../features/messaging";

export default function Messages() {
  const { threadId } = useParams();

  return <IndustryInbox threadId={threadId} />;
}
