---
title: "A Data Warehouse That Doesn't Cost a Fortune: Ducklake + SQLMesh + Jupyter"
description: "How I built a performant, open-source data warehouse setup for my project — and why I'm genuinely impressed."
date: 2025-07-28
tags: ["data-engineering", "duckdb", "open-source", "side-project"]
toc: false
---

*Originally posted on [LinkedIn](https://www.linkedin.com/feed/update/urn:li:activity:7347027683119169538/).*

---

During work on my main project I needed a simplistic but performant data warehouse. And as a frugal person I decided not to go with enterprise-grade solutions, but to go with open source.

I chose this setup: **Ducklake**, **SQLMesh**, and **Jupyter**.

I'm genuinely impressed by this combination.

## What it gave me

- **Fast queries** — DuckDB's performance and simplicity still amazes me
- **Clean data modeling** — SQLMesh brought solid workflow management to the table
- **CI/CD-like data models** — version-controlled, testable, deployable
- **Intuitive development experience** — Jupyter delivered what it should: a classy and polished notebook experience
- **Google-scale potential** — combined with the Ducklake standard, DuckDB can handle serious amounts of data

## Why it matters

This feels like it could be valuable to the broader data community. It addresses some real pain points I've had in previous projects — the kind where you need real analytical power but don't want to spin up (and pay for) a full enterprise data warehouse.

The stack is entirely open source. No vendor lock-in. No surprise invoices. Just fast SQL on your own terms.

Check it out: [**duckpond** on GitHub](https://github.com/wundervaflja/duckpond)
