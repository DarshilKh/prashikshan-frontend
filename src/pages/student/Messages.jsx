/**
 * Student Messages Page
 *
 * Route entry point for student messaging.
 * Integrates with the messaging module.
 */

import React from "react";
import { useParams } from "react-router-dom";
import { StudentInbox } from "../../features/messaging";

export default function Messages() {
  const { threadId } = useParams();

  return <StudentInbox threadId={threadId} />;
}
