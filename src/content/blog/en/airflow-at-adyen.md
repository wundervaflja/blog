---
title: "Airflow at Adyen: Adoption as ETL/ML Orchestrator"
description: "How we migrated from an in-house ETL framework to Airflow, adopted data mesh, and scaled our data platform at Adyen."
date: 2021-06-15
tags: ["data-engineering", "airflow", "adyen", "etl", "mlops"]
toc: true
---

*Originally published on [Medium/Adyen](https://medium.com/adyen/airflow-at-adyen-adoption-as-etl-ml-orchestrator-206996037a3f). Co-authored with Ravi Autar.*

---

Adyen makes many decisions within and outside of the payment flow to provide state-of-the-art payment processing. Challenges that need to be solved include optimization of the payment conversion rates, rescuing failed subscription payments, or predicting and monitoring payment volumes, just to name a few.

All of these decisions are made by enabling an array of specialized data teams to leverage the vast amount of data generated throughout the payment flow. However, to leverage this data we need a versatile platform and toolset to cater to all common needs of the data teams, while still giving each team the flexibility to work on their unique and domain-specific solution.

Building such a platform allows us to achieve operational excellence and allows our data teams to launch fast and iterate on their solutions. In this blog post let's see how we kickstarted with an in-house built ETL framework, the issues we faced with it, and how we migrated to Airflow.

## Spoink

At the beginning of Adyen's data initiative, we developed a framework for creating and scheduling data processing pipelines — we called it **Spoink**. We built the Spoink framework with a lot of design concepts taken from Airflow. As a result, our framework inherited a lot of Airflow's API, such as DAG and task dependency definition. The initial plan was to grow Spoink into a feature-complete open-source ETL framework.

In a previous blog post, we discussed the various reasons for designing our own ETL framework, among which lightweight, security, and alignment with existing infrastructure at Adyen were the key reasons. The simplicity of its use by the stakeholders played a key role as an increasing number of teams adopted this tool for data analysis and data preparation. Furthermore, many machine learning pipelines were being deployed through Spoink as well. After becoming a central component of the data infrastructure, we understood that we have a crucial dependency on Spoink.

## Problems with Spoink

As our understanding and use cases for our big data platform grew over the years, so did the technical debt we had incurred for Spoink; it had grown to such an extent that it was beyond maintenance. One of such decisions was the use of a single DAG where all streams had shared ownership as opposed to modular ownership based on the data product. Another implementation detail made it impossible to submit Spark jobs in cluster-mode, which would lead to increased operational overhead since a single edge node would be overloaded all the time. Scheduling and backfilling jobs would require users to have intricate knowledge of the Spoink framework and any mistakes made would lead to big operational overhead to both the engineering and infrastructure teams.

Adding to these issues, the most prominent issue with Spoink was its **closed source nature**. With the increase in technical debt and simultaneous increase in teams and products dependent on the Big Data platform, supporting Spoink's codebase became increasingly more difficult. Being closed source also meant that we were missing out on a plethora of recent developments in ETL orchestration developed by the open-source community. Continuing to work on Spoink would also close the possibility of ever contributing back to the open-source community.

In summary, it was clear that we needed to reassess the way we scheduled ETL jobs and how we managed data ownership.

## Evolution of Data Approach

Before deciding on a new orchestration framework, we first had to rethink the way we managed data organizationally in terms of ETL tasks and data ownership. Spoink framework had a single daily DAG which contained all the ETL jobs across multiple product teams. Therefore, the DAG was updated and maintained by every team resulting in huge run times, decreased flexibility, and increased operational overhead in case of failed runs.

We needed to shift to a more decentralized approach, where teams had clear ownership of their ETL processes and increased clarity in data ownership as well. To achieve this, we adopted the **data mesh architecture**.

## Data Mesh at Adyen

Each data team at Adyen is specialized in the problems they are solving and by developing and maintaining the entire data pipeline for their solution. Depending on the team and the problem they are solving, the data product can come in different forms such as dashboards, reports, or ML artifacts. Starting from the raw data, the team holds ownership of all the intermediate tables/artifacts required to facilitate their data solution.

Many challenges need to be taken into consideration when we apply the data mesh architecture in practice. Giving teams ownership of their ETLs processes also introduces more variation in the types of use cases the CDI teams need to account for. Some of them are:

### ETL scheduling

One of the undisputed requirements is the ability to schedule different ETLs with unique characteristics. While most teams require their ETL jobs to run daily, some jobs need to run on an hourly, weekly, or monthly basis. Teams not only need the flexibility to specify different scheduling intervals but also different starting/ending times and retrying behaviors for their specific ETL.

### Task dependencies

Teams also need to specify dependencies between different ETL jobs. These can be dependencies between different jobs owned by a single team, but can also be extended to include dependencies on jobs owned by other teams, i.e. cross-team dependencies. An example of this is when the Business Intelligence team wants to reuse a table created by the Authentication team to build summary tables that eventually power their dashboards.

### Undoing and backfilling

Every team at Adyen strives to productionize their tables fast and iterate on them. This usually means that teams require rerunning some of their ETLs multiple times. Sometimes, data might be corrupted/incomplete for certain date ranges. This inevitably requires us to rerun their ETL pipelines for specified date ranges for certain tables, while also considering their downstream dependencies and (possibly varying) schedule intervals.

## Adoption of Airflow

The previously mentioned problems and change in view on work with data prompted us to look for a replacement framework, for which we chose **Airflow**.

Airflow is an open-source scheduling framework that allows you to benefit from the rapid developments made by the open-source community. There were multiple reasons we chose it over competitors:

- **Scalability.** With its design, it can scale with minimum efforts from the infrastructure team.
- **Extensible model.** It is extremely easy to add custom functionality to Airflow to fulfill specific needs.
- **Built-in retry policy, sensors, and backfilling.** With these features, we can add DAG/task and retroactively run ETL, or wait for events to trigger DAGs.
- **Monitoring and management interface.**
- **Built-in interface to interact with logs.**

Our data system is built around Spark and Hadoop for running our ETL and ML jobs with HDFS as data storage. We use Apache YARN as a main resource manager. This standard setup made the process of installing and deploying Airflow much easier, as Airflow comes with built-in support for submitting Spark jobs through YARN.

We also have the following Airflow components running:

- **Airflow web-server:** The main component responsible for the UI that all our stakeholders will interact with. However, downtime of the web server does not automatically translate to ETLs not being able to run (this is handled by the scheduler and workers).
- **Airflow scheduler:** Brains of the Airflow. Responsible for DAG serialization, defining DAG execution plan, and communicating with Airflow workers.
- **Airflow worker:** Workhorse of the installation and gets tasks from the scheduler to run in a specific manner. With workers, we can scale indefinitely. Also, there can be different types of workers with different configurations. At Adyen, we make use of Celery workers.

Apart from the standard Airflow components, we also need a couple of other services to support our installation:

- **Redis** as the broker queue, responsible for keeping track of tasks that were scheduled and still need to be executed.
- **PostgreSQL** for storing metadata needed for DAGs and Airflow to run, and storing the results of the task executions.
- **Flower** (optional) for monitoring what is happening with Celery workers and the tasks they are executing.

At least the workers, PostgreSQL database, and Redis need to have high availability — which means more instances and more load on the cluster. After careful thinking, we introduced a new type of machine to our Hadoop installation. Those machines have all the required clients to interact with Spark, HDFS, Apache Ranger, Apache YARN but will not host any workload for running ETL or ML tasks. We call them **edge nodes**. The machines which are running ETL/ML workload are the **workers**.

With this separation of machines which are running jobs and which control them, we can have painless maintenance and be secure if something fails:

- With a worker's failure, we maintain all the information about the success or failure of the tasks and can reschedule it in the future.
- With an edge failure, we still can complete ongoing tasks.

*Update: we have recently upgraded to Airflow 2.0 and now also use the Airflow scheduler in HA mode.*

## Migration to Airflow

One of the biggest challenges during the adoption of Airflow was the migration of already existing pipelines from Spoink. During such a migration we carefully needed to choose our strategy, since most of the jobs running on Spoink were also production critical to our product teams. We needed to support the uninterrupted operation of the existing infrastructure, while simultaneously deploying a new architecture and migrating production jobs and users.

For such an activity, we chose a **blue-green approach**. This relatively simple method allows us to adhere to the aforementioned constraints during this migration. To follow this approach you need to consider these assumptions:

- We needed to have old and new installations running at the same time and achieve feature parity. This essentially meant having all production jobs running simultaneously on both Spoink and Airflow for multiple days.
- You do not add new features to the old installation. We introduced a code freeze for the duration of the migration to avoid adding more moving components (2–3 weeks).
- You do not migrate teams all at once, but slowly with proper testing and validation.

With regards to ETL pipeline and data ownership, we decided to tackle the problem structurally by reflecting the respective ownerships directly in the codebase. As a result, the codebase which contains the logic for each ETL pipeline was segregated into the product teams which were the first point of contact for that specific logic. Ownership of tables was also reflected using DDL (Data Definition Language) files, which contains the schema of said table and again segregated between the teams that own that table.

Each team then has its own Airflow DAGs and the tables they create/update using those DAGs. In this sense, using Airflow made it possible for us to split up a single massive DAG we had in Spoink, into multiple smaller DAGs — each owned by their specific stream with their unique scheduling configurations.

## Results

We extended Airflow by introducing custom Airflow views, operators, sensors, and hooks that are tailored for running ETLs on Adyen's Big Data platform. By doing this we built tools and functionalities that are common across different streams, while still giving streams the freedom to work on the data solution they are the domain experts in.

With Airflow's built-in functionality for managing schedules and defining within-DAG dependencies, our data teams leveraged the newly gained flexibilities and were suddenly able to define dozens of tasks with intricate dependencies between each other.

While the out-of-the-box features of Airflow already solved a wide range of problems we faced with our in-house developed framework, we still encountered multiple operational problems with regards to backfilling and specifying dependencies across multiple Airflow DAGs. In our next "Airflow at Adyen" series we dive further into the challenges we faced with cross-DAG dependencies and backfilling and how we extended Airflow's functionalities to address these problems.
