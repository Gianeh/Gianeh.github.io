# Two‑Week Operating Room Scheduling Optimization

Project Context:
This research project was carried out under a six‑month research grant at the Department of Information Engineering and Mathematics (DIISM), University of Siena. The underlying mixed‑integer linear programming model—originally developed by DIISM's researchers—was not authored by me; my role focused on adapting and integrating the existing Python/Gurobi model into a modular web service with RESTful APIs, creating an online showcase interface for hospital directors.

# Collaboration

This initiative originates from a project held by the management engineering department at my University, in the context of the "Tuscany Health Ecosystem" project. This research work aims at demonstrating the capability of an optimization model to position the software for production in real hospitals in Tuscany.

# Scheduling Model REST Interface

A two‑week scheduling interface ingests operating room session data, waiting‑list cases, and bed inventories, then delegates scheduling to the adapted MILP engine. The Python service handles all session filtering, data preparation, and result aggregation, exposing:

RESTful APIs for managing sessions, waiting lists, beds, and optimization runs

Automatic discharge and occupancy tracking over the 14‑day horizon

CSV downloads of assignment, occupancy, and updated waiting‑lists

The web service does not implement the optimization logic—it leverages the pre‑existing Gurobi model maintained by [Ilaria Salvadori](https://www.linkedin.com/in/ilaria-salvadori-91a6a419a/), focusing instead on seamless integration and usability.