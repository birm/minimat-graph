/**
 *  @fileoverview Matrix graphing library for javascript.
 *  @author birm@rbirm.us (Ryan Birmingham)
 *  @license Copyright 2017 Ryan Birmingham.
 *  Licensed under GPL-3.
 */

MiniMat = require("minimat");
d3 = require("d3");

// canvas creation tool outside of class
function make_canvas(tag, x_len, y_len, drawsize){
  // take in a tag(id) to put the drawing at, the matrix dimensions,
  // and the drawing size of each element in pixels.
  // if tag doesn't start with "#", add it
  if (!(tag[0] === "#")){
    tag = tag + "#";
  }

  // figure out how big to draw the whole plot
  var drawx = parseInt(drawsize*x_len, 10);
  var drawy = parseInt(drawsize*y_len, 10);

  // actually add the canvas div
  var canvas = d3.select("body").append("svg").attr("id", tag).attr("width", drawx).attr("height", drawy);

  // return the canvas
  return canvas;
}

class MMGraph{
  constuctor(Mat, tag="#matgraph", drawsize=5){
    // take in a matrix to draw,
    // a tag to create the chart as (or update)
    // and the drawing size of each element in pixels.
    this.Mat = Mat;
    this.tag = tag;
    // initializes a new canvas to draw on
    this.canvas = make_canvas(tag, Mat.x_len, Mat.y_len, drawsize);
    this.drawsize = drawsize;
  }

  static lin_scale(val){
      // linear color scale function (from 0 to 1)
      if (isNaN(val) || val==Infinity || val==-Infinity){
          return NaN;
      }
      return (val - Math.min.apply(Math, filtered))/(Math.max.apply(Math, filtered) - Math.min.apply(Math, filtered));
  }

  static scale_color(value, scheme="redgreen"){
      // change depending on scheme
      // expects value between 0 and 1
      // return a hsla set in oder [hue, sat, luminence, alpha]
      // hue from 0 to 360, rest 0 to 1

      // deal with bad  values now so we don't mess up color
      if (isNaN(value)){
          // don't color in missing data
          return [0,0,0,0];
      } else if (value>1){
          value=0.99;
      } else if (value<0){
          value=0;
      }
      switch(scheme){
          case "blue":
              //change sauration and alpha value of blue-like
              return [249, (value*0.8+0.2), 255, (value/3+0.65)];
          case "grey":
              //keep in a greyscale range
              return [197, 0.11, (0.28*value+11), 0.9];
          case "rainbow":
              // change hue for rainbow
              return [(242*value), 0.84, 0.48, 0.9];
          case "redgreen":
              // split at 0.5, red less, green higher
              if (value > 0.5){
                  return [350, 1, 0.5+(0.5-value), 0.9];
              } else {
                  return [11, 1, 0.2+(0.4*value), 0.98];
              }
          default:
              // same as redgreen, kept because want to switch later
              // split at 0.5, red less, green higher
              if (value > 0.5){
                  return [350, 1, 0.5+(0.5-value), 0.9];
              } else {
                  return [11, 1, 0.2+(0.4*value), 0.98];
              }
      }
  }

  draw(Mat) {
      // draw the Mat to this.tag given, already initalized
      // a function to get the x,y position given coord
      var get_elem_pos = function(pos, x_len){
        return [(Math.floor(x/x_len))*this.drawsize, (x%x_len)*this.drawsize];
      }
      var float_filter = function(val) { return (!(isNaN(val)||val==Infinity||val==-Infinity))};
      for (var x=0; x< Mat.data.length; x++){
          // for each one, get the element's position
          var coords = get_elem_pos(x, Mat.x_len);
          var filtered = Mat.data.filter(float_filter);
          // draw the value on the square in field
          var color = scale_color(lin_scale(Mat.data[x]), "redgreen");
      }
  }
}

// try to add make_canvas to the class
MMGraph.prototype.make_canvas = make_canvas;

module.exports = MMGraph;
