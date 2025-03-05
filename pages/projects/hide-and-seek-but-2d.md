# Game Mechanics

he purpose of this project is to develop our version of the Hide and Seek game, where two players navigate custom maps with different levels of difficulty taking actions dictated by reinforcement learning algorithms.
The main goal was to observe some intelligent behaviours from the players during the training.
The game map is a matrix (26x26 blocks) composed of different types of object, like floor (walkable tile), movable wall (wall that can be grabbed/relased by players), wall (unmovable object), 
Hider (tries to hide from the seeker), Seeker (tries to catch the hider).
Each player has a view of the map, a list of map objects with depth of 4 blocks and width of 3 blocks used to determine the winning policy of the game as the seeker wins when,
for a certain amount of consecutive steps, his opponent is in view, while the hider wins if after a predefined amount of frames he isn't caught. 
The player's view is limited in depth by the first encountered obstacole that occlude his line of sight and by the map edges.

A more detailed explanation of the results and the game environment can be found in the [project slideshow](https://github.com/Gianeh/Hide_and_Seek/blob/neural/Project_report.pdf)

## Credits

A big thank you goes to [Kevin](https://www.linkedin.com/in/kevin-gagliano-0703a12a3/) and [Jacopo](https://www.linkedin.com/in/jacopo-andreucci-2a7b29252/) for supporting my initial idea of solving a 2D grid game and carrying out the development with me.