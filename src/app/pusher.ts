import PusherServer from "pusher";
import PusherClient from "pusher-js";

export const pusherServer = new PusherServer({
  appId: "1961575",
  key: "fa3f9d9c964191830d88",
  secret: "e4703efc2fd89a93a1b2",
  cluster: "us2",
  useTLS: true,
});

export const pusherClient = new PusherClient("fa3f9d9c964191830d88", {
  cluster: "us2",
});
