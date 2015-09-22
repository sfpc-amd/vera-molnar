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

// this all gets rather confusing because our values are essentially
// the same data set as our indexes, only in a different order!

// get our swap indexes
var n = 2;
var swapIndexes = [];
var rand

// get random values for `swapIndexes`
while(swapIndexes.length < n) {
  rand = Math.floor(Math.rand(desired.length));
  if(swapIndexes.indexOf(rand) === -1) {
    swapIndexes.push(rand);
  }
}

// now swap those indexes for each individual
// showing example for when `value = 5`
swapIndexes.forEach(function(value) {

  // 5 is at index 15 in individual 1
  var i1Index = individual1.indexOf(value);
  // 5 is at index 12 in individual 2
  var i2Index = individual2.indexOf(value);

  // save existing values in swap slots

  // 15 is at index 12 in individual 1
  var i1Save = individual1[i2Index];
  // 6 is at index 15 in individual 2
  var i2Save = indivicual2[i1Index];

  // swap indexes for individual 1
  individual1[i1Index] = i1Save;
  individual1[i2Index] = value;

  // swap indexes for individual 2
  individual2[i2Index] = i2Save;
  individual2[i1Index] = value;

});

```

# swap those indexes between the two individual


### Mutation

This should be fairly straightforward, just swap indexes.


Design Notes
============

Present as a webpage that loads just as a duplication of Molnar's composition in the window. Scrolling down will reveal:

 - A description of the project
 - An image of each previous generation, including information about those which were selected.
