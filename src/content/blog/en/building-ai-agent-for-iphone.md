---
title: "I Built My Own AI Agent for iPhone. Here's What Happened."
description: "Two weeks building a custom AI agent for iOS — what it can do, what Apple won't let it do, and the creative workarounds it finds on its own."
date: 2026-03-03
tags: ["ai", "agents", "ios", "side-project"]
toc: false
---

*Originally posted on [LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7429507376141148160/).*

---

Spent the last two weeks building my own AI agent for iPhone. Siri is good but I was curious — how close to Siri's features could I get? And could I build something better?

Spoiler: matched some things, didn't match others. Apple's sandbox is the main limitation.

## What it can do

- Voice support
- Interacts with clipboard / music / photos / contacts / weather / location / shortcuts
- Opens links in Safari, opens any app
- Has on-device memory about the user
- Custom tool creation
- And yes, it can turn the flashlight on/off

## What it can't do

- Read notes or emails
- Activate with voice like "Hey Siri"
- Deep system-level access

## But here's where it gets interesting

I ask the agent to send a message to Tomas. It doesn't have direct messaging access, so it finds a workaround:

1. Creates the message text
2. Finds Tomas in my contacts
3. Opens the message thread with Tomas
4. Pastes text from clipboard

I just press send.

That's the thing about agents — constrain them enough and they get creative. The sandbox becomes a puzzle, not a wall.

Now I'm itching to see how far I can push this on iPhone — and to build the same thing for Android.
