"use client";
import { Card, Tabs } from "@mantine/core";

export default function Friends() {
  return (
    <Card shadow="md" padding="md" radius="md">
      <Tabs defaultValue="friends" color="pink" p={10}>
        <Tabs.List mb={20}>
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
          <div>Add a new friend here.</div>
        </Tabs.Panel>
        <Tabs.Panel value="pending">
          <div>Pending friend requests will show here.</div>
        </Tabs.Panel>
      </Tabs>
    </Card>
  );
}
