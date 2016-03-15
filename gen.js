'use strict'

const Genea = require('genea')

function getTargetStr (targetStr) {
    var binaryStr = '';
    for (var i = 0 , len = targetStr.length; i < len; i++) {
        binaryStr += paddingWith0((Number(targetStr.charCodeAt(i))).toString(2))
    }
    return binaryStr;
}

function paddingWith0 (num) {
    while (num.length < 8) {
        num = '0' + num
    }
    return num
}

function run (str) {
    var tar = getTargetStr(str)
    const ga = new Genea({
      geneLength: tar.length,
      mutateProbability: 0.5,
      doneFitness: 1,
      populationSize: 30,
      generationsSize: 400,
      getFitness: function(gene) {
        var count = 0
        for (var i = 0, len = gene.length; i < len; i++) {
            if (gene[i] === tar[i]) count++
        }
        // console.log(toChars(gene))
        const likeness = count / tar.length
        return likeness
      },
      done: function(genes) {
        // this.history.push(toChars(genes[0].gene + ''))
      },
      onGeneration: function(generation, genes) {
        var max = 0, index = 0;
        this.fitnesses.forEach(function (fitness, i) {
          if (fitness > max) {
            max = fitness
            index = i
          }
        })
        this.history.push(toChars(genes[index]))
      },
      outOfGenerationsSize: function(generations, fitnesses) {
        // console.log(generations, fitnesses)
      }
    })

    ga.history = []
    ga.start()
    return ga;
}

function toChars (gene) {
    var str = ''
    while (gene.length) {
        var ch = gene.substr(0, 8)
        gene = gene.substr(8)
        str += String.fromCharCode(parseInt(ch, 2))
    }
    return str
}

module.exports = run
