/**
 * Faculty Messages Page
 *
 * Route entry point for faculty messaging.
 */

import React from "react";
import { useParams } from "react-router-dom";
import { FacultyInbox } from "../../features/messaging";

export default function Messages() {
  const { threadId } = useParams();

  return <FacultyInbox threadId={threadId} />;
}
