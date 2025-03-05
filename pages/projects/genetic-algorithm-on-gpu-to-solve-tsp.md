# Island GA to Solve TSP on GPU - GATSPGPU - Genetic TSP

This ambitious project holds a special place in my portfolio. I'm particularly proud of the results achieved, and it remains one of the most complex programming endeavors I've undertaken.

## Collaboration

Originally conceived as a team assignment with a colleague, the collaboration became largely unilateral. I dedicated months to debugging and implementation details, while my partner secured full-time employment elsewhere, contributing minimally to the project. Although he's a smart individual and I hold no ill feelings, I believe that with additional effort, this project could have reached publication—a goal I couldn't pursue further due to university obligations.

## Parallel Genetic Algorithm in the Island Model

A parallel genetic algorithm in the island model divides the population into multiple subpopulations, known as "islands." Each island evolves independently, maintaining its genetic diversity. Occasionally, individuals migrate between islands, introducing new genetic material and enhancing the search process. This structure is inherently parallel, as each island can be processed independently on separate computing resources, leading to improved efficiency.

## Application to the Traveling Salesman Problem (TSP)

In this project, the island model genetic algorithm was employed to tackle the Traveling Salesman Problem (TSP). The TSP seeks the shortest possible route that visits a set of cities exactly once and returns to the origin city—a classic NP-hard problem. By distributing subpopulations across different islands and allowing periodic migration, the algorithm effectively explored diverse solutions, enhancing the likelihood of finding an optimal or near-optimal route. **Implementing this approach on a GPU** further accelerated computations, leveraging parallel processing capabilities to handle the complex calculations inherent in solving the TSP.

For more details, read the [project report](https://github.com/Gianeh/GeneticTSP/blob/main/Project_Report.pdf).