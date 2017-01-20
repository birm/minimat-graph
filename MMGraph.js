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

  // add the canvas to the page
  var canvas = d3.select("body")
    .append("svg")
    .attr("id", tag)
    .attr("width", drawx)
    .attr("height", drawy);

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

  static lin_scale(val, min, max){
      // linear color scale function (from 0 to 1)
      if (isNaN(val) || val === Infinity || val === -Infinity){
          return NaN;
      }
      return (val - min)/(max - min);
  }

  // some plot color scheme engines
  // all appended _gc for graph coloring

  //HSLA style schemes
  // expect values between 0 and 1
  // return a hsla set in oder ['hsla', hue, sat, luminence, alpha]
  // hue from 0 to 360, rest 0 to 1

  static blue_gc(value){
      //change sauration and alpha value of blue-like
      return ["hsla", 249, (value*0.8+0.2), 255, (value/3+0.65)];
  }

  static grey_gc(value){
      //keep in a greyscale range
      return ["hsla", 197, 0.11, (0.28*value+11), 0.9];
  }


  static gray_gc(value){
      // alias to grey
      //keep in a greyscale range
      MMGraph.grey_gc(value);
  }

  static rainbow_gc(value){
      // change hue for rainbow
      return ["hsla", (242*value), 0.84, 0.48, 0.9];
  }

  static redgreen_gc(value){
      // split at 0.5, red less, green higher
      var color;
      if (value > 0.5){
          color = ["hsla", 350, 1, 0.5+(0.5-value), 0.9];
      } else {
          color = ["hsla", 11, 1, 0.2+(0.4*value), 0.98];
      }
      return color;
  }


  static scale_color(value, scheme=MMGraph.redgreen_gc){
      // get a color from a normalized value (between 0 and 1)
      // deal with bad values now so we don't mess up color
      if (isNaN(value)){
          // don't color in missing data
          return [0,0,0,0];
      } else if (value>1){
          value=0.99;
      } else if (value<0){
          value=0;
      }
      // get the color
      var color = scheme(value);
      var color_str;
      // parse the string
      switch(color[0].toLowerCase()){
          case "hsla":
              // expect 4 other elements, 1 is ok, 2,3,4 to % form
              color_str = "hsla("+str(parseInt(color[1],10))+"," +
                  str(parseInt(color[2]*100,10))+"%"+"," +
                  str(parseInt(color[3]*100,10))+"%"+"," +
                  str(parseInt(color[4]*100,10))+"%"+")";
              break;
          default:
              // not an array, but a string of preformmated color, hopefully
              color_str = color;
      }
      return color_str;
  }

  draw(Mat) {
      // draw the Mat to this.tag given, already initalized
      // a function to get the x,y position given coord
      var get_elem_pos = function(pos, x_len){
        return [(Math.floor(x/x_len))*this.drawsize, (x%x_len)*this.drawsize];
      }
      var float_filter = function(val) { return (!(isNaN(val)||val === Infinity||val === -Infinity))};
      // filter and get range for min and max of normal data
      var filtered = Mat.data.filter(float_filter);
      var data_range = [Math.min.apply(Math, filtered), Math.max.apply(Math, filtered)];

      // draw each element in the matrix
      for (var x=0; x< Mat.data.length; x++){
          // for each one, get the element's position
          var coords = get_elem_pos(x, Mat.x_len);
          // get the color for the value
          var color = scale_color(lin_scale(Mat.data[x], data_range[0], data_range[1]), "redgreen");
          // add the node
          this.canvas.append("rect")
            .attr("width", this.drawsize)
            .attr("height", this.drawsize)
            .attr("x", coords[0])
            .attr("y", coords[1])
            .attr("id", this.tag + "- " + str(x))
            .attr("style", "fill:" + color + ";");
      }
  }
}

// try to add make_canvas to the class
MMGraph.prototype.make_canvas = make_canvas;

module.exports = MMGraph;
