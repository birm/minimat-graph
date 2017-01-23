
var test = require('tape');
var MiniMat = require("minimat");
var MMGraph = require("./MMGraph");

// test itialization
test( 'graph object test', function(t) {
    t.plan(1);


    t.doesNotThrow( function() {
        onetwothreefour = new MMGraph(new MiniMat([1,2,3,4], 2, 2));
    }, '*', "new MMGraph() construction");
});

// test color scaler
test( 'color scale test', function(t) {
    t.plan(1);


    t.doesNotThrow( function() {
        MMGraph.scale_color(0.5);
    }, '*', "test color scale function");
});
