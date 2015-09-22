Hommage à Molnar
---------------- 

![Homage a Durer](http://digitalartmuseum.org/molnar/images/molnar_hommage_d_rer.jpg)

http://digitalartmuseum.org/gallery/image/8745.html

"In spite of their advantages, computers, no more than other simpler tools, do not guarantee that a work of art of good quality will result, for it is an artist's skill that is the decisive factor"

 - Vera Molnar, "Toward Aesthetic Guidelines for Painting with the Aid of a Computer"

Todo
----

 - [x] start new sketch for gen algorithm
 - [ ] research genetic algorithms
 - [ ] figure out how to use a gen algorithm to recreate
 - [ ] proto with gen algorithm 
 - [ ] start new sketch and build composition based on above


Implementation
---------------

Use a genetic algorithm to recreate Molnar's homage to Durer. Basic steps for the algorithm (via [projectspot](http://www.theprojectspot.com/tutorial-post/creating-a-genetic-algorithm-for-beginners/3)):


### Initialization

This should be variable, in order to eveluate speed. Would be nice to be able to 

### Evaluation

Abstractly, eveluation should probably be based on how close the image "looks" to Molnar's final composition. However, this is not an easy feat so we may have to stick with numbers.

One simple evaluation could be the distance of each individual's position to the desired position. So For instance:

```javascript
// these are the positions of our desired outcome
var desired = [0, 13, 14, 3, 11, 6, 5, 8, 7, 10, 9, 4, 12, 1, 2, 15];

// these are the positions of our individual
var individual = [1, 2, 12, 3, 13, 4, 7, 14, 8, 9, 10, 6, 15, 11, 0, 5];

// we have a granular fitness that contains the distance between each
// individual value and the desired outcome
var granularFitness = [];

// --> [1, 11, 2, 0, 2, 2, 2, 6, 1, 1, 1, 2, 3, 10, 2, 10]
individual.forEach(function(value, index){
  granularFitness.push(Math.abs(desired[index] - value));
});


// this will just add all of the granular fitnesses together a lower number is better
var overallFitness = granularFitness.reduce(function(mem, value, i) {
  return mem + value;
});
```

### Selection

Need to research selection methods, but essentially need to throw out the worst individuals for the next round.

### Crossover

Need to combine attributes of selected individuals for new population. Essentially a random mixing? This is a little tricky because we need to maintain the same unique set of numbers. One approach would be to switch certain indexes between individuals:


```javascript
// our two love birds
var individual1 = [1, 2, 12, 3, 13, 4, 7, 14, 8, 9, 10, 6, 15, 11, 0, 5];
var individual2 = [13, 8, 15, 11, 14, 7, 12, 4, 1, 3, 2, 10, 5, 0, 9, 6];

// our baby-to-be
var child = [];

// our algorithm will have one parent that is genetically
// dominant, and one that is less so (although it may work
// the other way around in certain situations)
var dominantParent;
var nonDominantParent;


// 1. randomly select a parent to be the initial genetic contributor
if(Math.random() < 0.5) {
  dominantParent = individual1;
  nonDominantParent = individual2;
} else {
  dominantParent = individual2;
  nonDominantParent = individual1;  
}

// 2. randomly select indexes to copy over verbatim.

dominantParent.forEeach(function(value, index) {
  child[index] = (Math.random() < 0.5) ? value : undefined;
});

// 3. iterate through empty slots in the child array & copy in from the other parent
//    if those values aren't already in the child array

child.forEach(function(value, index) {
  if(typeof value === 'undefined' && child.indexOf(nonDominatParent[index]) === -1) {
    child[index] = nonDominantParent[index];
  };
});

// 4. fill in any remaining values
if(child.length < individual1.length) {
  individual1.forEach(function(value) {
    var nextEmpty;
    if(child.indexOf(value) === -1) {
      nextEmpty = child.indexOf(undefined);
      child[nextEmpty] = value;
    }
  });
}

// now we should have a merged version of both parent arrays, with some potential
// mutation in cases where there were empty slots that needed to be filled

### Mutation

Because of how the crossover algorithm works, there should be some built-in mutation. However, may want to add another mutation step depending on how things work.


Design Notes
============

Present as a webpage that loads just as a duplication of Molnar's composition in the window. Scrolling down will reveal:

 - A description of the project
 - An image of each previous generation, including information about those which were selected.
