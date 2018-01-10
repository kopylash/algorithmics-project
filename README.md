# The Mysterious Jaak	

HTML5 arcade game showing Particle Swarm Optimization algorithm in practice. Built with [Phaser](https://phaser.io/) for
"Advanced algorithmics" course project at [University of Tartu](https://www.cs.ut.ee/en).

## Getting started

Clone and open index.html in browser.

```
git clone https://github.com/kopylash/algorithmics-project.git
```
Or play [here](https://kopylash.github.io/algorithmics-project/).

## Algorithm

PSO is a population based stochastic optimization technique which simulates the social behavior of species in nature. A good example
is a flock of birds or school of fish. PSO is initialized with a group of random particles (solutions) and then searches for optima by
updating generations. All particles try to optimize fitness function. They explore solution space moving to the current known optimum. In every iteration, each
particle velocity is recalculated based on two "best" values. The first one is the best fitness achieved by particle itself. This value is
called `pbest`. Second one is the best fitness achieved by swarm in total, called `gBest`. It represents the concept of shared memory in population.
After finding these two values, particle updates its velocity and positions with following equations (a) and (b).

```
a) v[] = v[] + c1 * rand() * (pbest[] - present[]) + c2 * rand() * (gbest[] - present[])
b) present[] = persent[] + v[]
```

`v[]` is the particle velocity, `persent[]` is the current particle position (solution). `pbest[]` and `gbest[]` are defined as stated before. `rand()` is a
random number between (0,1). `c1, c2` are learning factors. usually `c1 = c2 = 2`. Particles' velocities on each dimension are clamped to a maximum
velocity `Vmax`. If the sum of accelerations would cause the velocity on that dimension to exceed `Vmax`, which is a parameter specified by the user.
Then the velocity on that dimension is limited to `Vmax`.

**PSO examples**
* https://youtu.be/M028vafB0l8
* https://www.youtube.com/watch?v=gkGa6WZpcQg

## Game

![Game](assets/sprites/logo-black.png)

The game tells us the story of young Jaak. Because of the global laziness, students transformed into baddies. 
Only Jaak can save the situation, but he has to get the Ph.D first.
Students don't want this to happen so they are trying to catch him (using Particle Swarm Optimization) and make Jaak lazy. 
The game consists of two phases: getting of the Ph.D and saving of the world.

![First mode](assets/sprites/escape_mode.png)
*PSO in action*


![Second mode](assets/sprites/chasing_mode.png)
*Baddies escape following the maximum distance greedy algorithm*

## Credits


