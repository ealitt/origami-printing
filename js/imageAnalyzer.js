ORIGAMI.imageAnalyzer = (function(){
  var imgSize;
  var scale;

  const width = 360;

  return{
    loadFile: function(image){
      let mat = cv.imread(image);
      let dst = new cv.Mat();

      imgSize = [image.width, image.height];
      scale = image.height / (image.width / width);

      let dsize = new cv.Size(width, scale);
      cv.resize(mat, dst, dsize, 0, 0, cv.INTER_AREA);

      cv.imshow('canvasOutput', dst);
      mat.delete();
      dst.delete();
    },

    loadBars: function(){
      $("#slider-range-min").slider({
        range: "min",
        value: 37,
        min: 1,
        max: 700,
        slide: function( event, ui ) {
          $( "#amount" ).val( "$" + ui.value );
        }
      });
      $( "#amount" ).val( "$" + $( "#slider-range-min" ).slider( "value" ) );
    },
    }
}());
