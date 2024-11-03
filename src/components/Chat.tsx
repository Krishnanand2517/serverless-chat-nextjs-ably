"use client";

import * as Ably from "ably";
import { AblyProvider, ChannelProvider } from "ably/react";

export default function Chat() {
  const client = new Ably.Realtime({ authUrl: "/api" });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="serverless-chat-nextjs-ably"></ChannelProvider>
    </AblyProvider>
  );
}
