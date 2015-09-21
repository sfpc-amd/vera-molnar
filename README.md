Hommage à Molnar
---------------- 
http://digitalartmuseum.org/gallery/image/8745.html

Todo
----

[x] start new sketch for gen algorithm
[ ] research genetic algorithms
[ ] figure out how to use a gen algorithm to recreate
[ ] proto with gen algorithm 
[ ] start new sketch and build composition based on above


Implementation
---------------

Use a genetic algorithm to recreate Molnar's homage to Durer. Basic steps for the algorithm (via [projectspot](http://www.theprojectspot.com/tutorial-post/creating-a-genetic-algorithm-for-beginners/3)):


### Initialization

This should be variable, in order to eveluate speed. Would be nice to be able to 

### Evaluation

Abstractly, eveluation should probably be based on how close the image "looks" to Molnar's final composition. However, this is not an easy feat so we may have to stick with numbers.

One simple evaluation could be the distance of each individual's position to the desired position. So For instance:

    # these are the positions of our desired outcome
    var desired = [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15];

    # these are the positions of our individual
    var individual = [1, 2, 12, 3, 13, 4, 7, 14, 8, 9, 10, 6, 15, 11, 0, 5];

    # we have a granular fitness that contains the distance between each
    # individual value and the desired outcome
    var granularFitness = [];

    # --> [1, 11, 2, 0, 2, 2, 2, 6, 1, 1, 1, 2, 3, 10, 2, 10]
    individual.forEach(function(value, index){
      granularFitness.push(Math.abs(desired[index] - value));
    });


    # this will just add all of the granular fitnesses together a lower number is better
    var overallFitness = granularFitness.reduce(function(mem, value, i) {
      return mem + value;
    });


### Selection

Need to research selection methods, but essentially need to throw out the worst individuals for the next round.

### Crossover

Need to combine attributes of selected individuals for new population. Essentially a random mixing?

### Mutation

Maybe randomly swap a few of the items in new populations?


