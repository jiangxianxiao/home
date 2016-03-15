/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _gen = __webpack_require__(1);

	var _gen2 = _interopRequireDefault(_gen);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var init = function init() {
	  var head = document.getElementById('head');
	  var capture = window.location.search.match(/\?post=(\d+)/);
	  var postid = capture ? capture[1] : null;
	  if (postid) {
	    window.location.href = 'https://github.com/livoras/blog/issues/' + postid;
	  }
	  (0, _gen2.default)('Too young, too simple. Sometimes, naive.').history.forEach(function (text, i) {
	    setTimeout(function () {
	      head.innerText = text;
	    }, i * 30);
	  });
	};

	init();

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var Genea = __webpack_require__(2);

	function getTargetStr(targetStr) {
	    var binaryStr = '';
	    for (var i = 0, len = targetStr.length; i < len; i++) {
	        binaryStr += paddingWith0(Number(targetStr.charCodeAt(i)).toString(2));
	    }
	    return binaryStr;
	}

	function paddingWith0(num) {
	    while (num.length < 8) {
	        num = '0' + num;
	    }
	    return num;
	}

	function run(str) {
	    var tar = getTargetStr(str);
	    var ga = new Genea({
	        geneLength: tar.length,
	        mutateProbability: 0.5,
	        doneFitness: 1,
	        populationSize: 30,
	        generationsSize: 400,
	        getFitness: function getFitness(gene) {
	            var count = 0;
	            for (var i = 0, len = gene.length; i < len; i++) {
	                if (gene[i] === tar[i]) count++;
	            }
	            // console.log(toChars(gene))
	            var likeness = count / tar.length;
	            return likeness;
	        },
	        done: function done(genes) {
	            // this.history.push(toChars(genes[0].gene + ''))
	        },
	        onGeneration: function onGeneration(generation, genes) {
	            var max = 0,
	                index = 0;
	            this.fitnesses.forEach(function (fitness, i) {
	                if (fitness > max) {
	                    max = fitness;
	                    index = i;
	                }
	            });
	            this.history.push(toChars(genes[index]));
	        },
	        outOfGenerationsSize: function outOfGenerationsSize(generations, fitnesses) {
	            // console.log(generations, fitnesses)
	        }
	    });

	    ga.history = [];
	    ga.start();
	    return ga;
	}

	function toChars(gene) {
	    var str = '';
	    while (gene.length) {
	        var ch = gene.substr(0, 8);
	        gene = gene.substr(8);
	        str += String.fromCharCode(parseInt(ch, 2));
	    }
	    return str;
	}

	module.exports = run;

/***/ },
/* 2 */
/***/ function(module, exports) {

	'use strict'

	class Genea {
	  constructor(config) {
	    this.currentGeneration = 0
	    this.populations = []
	    this.fitnesses = []

	    this.mutateProbability = config.mutateProbability || 0.5 // 0 ~ 1
	    this.generationsSize = config.generationsSize || 100
	    this.populationSize = config.populationSize || 100
	    this.doneFitness = config.doneFitness || 1 // 0 ~ 1

	    this.geneLength = config.geneLength
	    this.getFitness = config.getFitness

	    this.outOfGenerationsSize = config.outOfGenerationsSize || this.outOfGenerationsSize
	    this.onGeneration = config.onGeneration || this.onGeneration
	    this.done = config.done || this.done
	  }

	  start() {
	    this.initPopulation()
	    this.makeFitnesses()
	    this.select()
	  }

	  initPopulation() {
	    this.currentGeneration = 1
	    this.populations = []
	    for (let i = 0, len = this.populationSize; i < len; i++) {
	      let gene = getRandomGene(this.geneLength)
	      this.populations.push(gene)
	    }
	    this.onGeneration(this.currentGeneration, this.populations)
	  }

	  select() {
	    if (this.currentGeneration >= this.generationsSize) {
	      return this.outOfGenerationsSize(this.populations, this.fitnesses)
	    }
	    let matches = this.getMatches()
	    if (matches.length > 0) return this.done(matches)
	    this.generateNextGeneration()
	  }

	  makeFitnesses() {
	    this.fitnesses = []
	    this.totalFitness = 0
	    this.populations.forEach((individual, i) => {
	      let fitness = this.getFitness(individual, this.populations)
	      this.fitnesses[i] = fitness
	      this.totalFitness += fitness
	    })
	  }

	  getMatches() {
	    let bests = []
	    this.populations.forEach((individual, i) => {
	      let fitness = this.fitnesses[i]
	      if (fitness >= this.doneFitness) {
	        bests.push({
	          gene: individual,
	          fitness: fitness,
	          pos: i
	        })
	      }
	    })
	    return bests
	  }

	  generateNextGeneration() {
	    this.currentGeneration++
	    let oldPopulations = this.populations
	    let newPopulations = []
	    for (var i = 0, len = oldPopulations.length; i < len; i++) {
	      let father = this.rotate()
	      let mother = this.rotate()
	      let child = this.crossOver(father, mother)
	      child = this.mutate(child)
	      newPopulations.push(child)
	    }
	    this.populations = newPopulations
	    this.makeFitnesses()
	    this.onGeneration(this.currentGeneration, this.populations)
	    this.select()
	  }

	  crossOver(father, mother) {
	    let pos = Math.floor(father.length * Math.random())
	    let child1 = father.substring(0, pos) + mother.substring(pos)
	    let child2 = mother.substring(0, pos) + father.substring(pos)
	    return this.getFitness(child1) > this.getFitness(child2)
	      ? child1
	      : child2
	  }

	  mutate(child) {
	    let mutateProbability = Math.random()
	    if (mutateProbability < this.mutateProbability) return child
	    let pos = Math.floor(Math.random() * this.geneLength)
	    let arr = child.split("")
	    arr[pos] = +child[pos] ^ 1
	    return arr.join("")
	  }

	  rotate() {
	    let pos = Math.random() // let's roll!
	    let soFar = 0
	    for(let i = 0, len = this.fitnesses.length; i < len; i++) {
	      let fitness = this.fitnesses[i]
	      soFar += fitness
	      if (soFar / this.totalFitness >= pos) {
	        return this.populations[i]
	      }
	    }
	  }

	  done() {}
	  onGeneration() {}
	  outOfGenerationsSize() {}
	}

	function getRandomGene(len) {
	  let gene = ""
	  for(let i = 0; i < len; i++) {
	    gene += ((Math.floor(Math.random() * 100)) % 2 === 0)
	      ? "1"
	      : "0"
	  }
	  return gene
	}

	module.exports = Genea


/***/ }
/******/ ]);