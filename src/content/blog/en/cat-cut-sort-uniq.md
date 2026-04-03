---
title: "Why I cat | cut | sort | uniq | wc -l Instead of Buying Analytics Tools"
description: "The curse of the technical founder — when your CLI kung fu is both your superpower and your biggest time sink."
date: 2025-08-03
tags: ["startups", "engineering", "devops"]
toc: false
---

*Originally posted on [LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7348074412560015361/).*

---

The curse of the technical founder.

A couple of days ago I was running a LinkedIn campaign. The page was prepared, visuals, messaging — all of that was super good!

When stats of the campaign were checked — it showed a huge number of impressions, but zero visitors in Analytics. Zero. Nada!

My first instinct? Fire up the terminal:

```bash
cat access.log | cut -d' ' -f4 | sort | uniq | wc -l
```

Turns out I had a huge number of visitors but most of them were bots and scrapers. Our campaign metrics looked great while we were essentially **paying to attract robots**.

Done. 30 seconds, zero cost, and actual truth.

But here's the thing — while I'm proud of my CLI kung fu, I just spent 30 seconds on something a proper bot detection tool would have caught automatically. And what happens when someone non-technical needs the same analysis?

## The founder trap

This is the classic founder trap: we're so used to building everything ourselves that we forget sometimes the best solution is the one that already exists.

The irony? I'll spend hours perfecting a bash one-liner to solve a problem, then hesitate paying $10 for a tool that would save me dozens of hours.

I'm learning that "scrappy" doesn't always mean "from scratch." Sometimes the most resourceful thing you can do is buy the damn tool.
