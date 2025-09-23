"use client";
import { Card, Tabs } from "@mantine/core";
import AddFriendTab from "./AddFriendTab";

export default function Friends() {
  return (
    <Card shadow="sm" padding="md" radius="md" withBorder>
      <Tabs defaultValue="friends" color="pink" p={5}>
        <Tabs.List
          mb={20}
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          <Tabs.Tab value="friends">Your Friends</Tabs.Tab>
          <Tabs.Tab value="add">Add Friend</Tabs.Tab>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="friends">
          <h1>Your friends will appear here.</h1>
          <h1>Your friends will appear here.</h1>
          <h1>Your friends will appear here.</h1>
          <h1>Your friends will appear here.</h1>
          <h1>Your friends will appear here.</h1>
          <h1>Your friends will appear here.</h1>
          <h1>Your friends will appear here.</h1>
        </Tabs.Panel>
        <Tabs.Panel value="add">
          <AddFriendTab />
        </Tabs.Panel>
        <Tabs.Panel value="pending">
          <div>Pending friend requests will show here.</div>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
