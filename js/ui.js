// ----------------- Image Editing functions -----------------

var canvas;
var texture;
var source;
var textureEdited;
var edited;
var updatedImage;
var finalImage;
var imgdiv;
var sourceWidth;

let brightness = 0;
let contrast = 0;
let saturation = -1;
let invert = ([[0,0], [1,1]]);

function openTab(evt, tabContent) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tabOption");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabContent).style.display = "block";
    evt.currentTarget.className += " active";
}

function init() {
  $( "#accordion" ).accordion({
    heightStyle: "content",
    collapsible: true
  });
  document.getElementById("imageTab").click();
  $( "#blackAndWhite" ).prop('checked', false);

  try {
      canvas = fx.canvas();
  } catch (e) {
      alert(e);
      return;
  };
  imgdiv = document.getElementById('imgdiv');

  edited = document.getElementById('edited');
  textureEdited = canvas.texture(edited);
  canvas.id = "sourceCanvas";

  edited.parentNode.insertBefore(canvas, edited);
  edited.parentNode.removeChild(edited);

  updatedImage = canvas.draw(textureEdited).update();
  imgdiv.src = canvas.toDataURL();
  sourceWidth = canvas.width;
}

function uploadFile() {
  let source = document.getElementById('upload');

  source.addEventListener('change', (e) => {
  edited.src = URL.createObjectURL(e.target.files[0]);
  }, false);

  edited.onload = function() {
    textureEdited = canvas.texture(edited);
    updatedImage = canvas.draw(textureEdited).update();
    imgdiv.src = canvas.toDataURL();
    sourceWidth = canvas.width;
    document.getElementById("imageTab").click();
    resetValues();
  };
}

function resetValues() {
  $( "#slider-brightness" ).each(function(){
    $(this).slider( 'value', 50 );
    brightness = 0;
  });
  $( "#slider-contrast" ).each(function(){
    $(this).slider( 'value', 50 );
    contrast = 0;
  });
  $( "#slider-stroke" ).each(function(){
    $(this).slider( 'value', 0 );
    strokeThickness = 0;
  });
  $( "#blackAndWhite" ).removeClass('active');
  $( "#blackAndWhite" ).attr("aria-pressed", "false");
  $( "#invert" ).removeClass('active');
  $( "#invert" ).attr("aria-pressed", "false");
  saturation = 0;
  invert = ([[0,0], [1,1]]);

}

function revertImage() {
  resetValues();
  textureEdited = canvas.texture(edited);
  updatedImage = canvas.draw(textureEdited).update();
  updateTexture(updatedImage);
};

function blackAndWhite() {
  if ($( "#blackAndWhite" ).attr("aria-pressed") === "false") {
    saturation = -1;
  }
  else {
    saturation = 0;
  }
  updateToggle(saturation, invert);
  updateTexture(updatedImage);
};

function invertImage(){
  if ($( "#invert" ).attr("aria-pressed") === "false") {
    invert = [[0,1], [1,0]];
  }
  else {
    invert = [[0,0], [1,1]];
  }
  updateToggle(saturation, invert);
  updateTexture(updatedImage);
};

function updateToggle(saturation, invert) {
  textureEdited = canvas.texture(edited);
  updatedImage = canvas.draw(textureEdited).hueSaturation(0,saturation).update();
  updateTexture(updatedImage);
  updatedImage = canvas.draw(textureEdited).curves(invert).update();
  updateTexture(updatedImage);
  updatedImage = canvas.draw(textureEdited).brightnessContrast(brightness,contrast).update();
};

function brightnessAndContrast() {
  $( "#slider-brightness" ).slider({
    value: 50,
    animate:"fast",
    orientation: "horizontal",
    slide: function( event, ui ) {
      brightness = 1.75 * (( $( "#slider-brightness" ).slider( "value" ) / 100) - 0.5);
      canvas.draw(textureEdited).brightnessContrast(brightness,contrast).update();
      imgdiv.src = canvas.toDataURL();
    }
  });

  $( "#slider-contrast" ).slider({
     value: 50,
     animate:"fast",
     orientation: "horizontal",
     slide: function( event, ui ) {
       contrast = 1. * (( $( "#slider-contrast" ).slider( "value" ) / 100) - 0.5);
       canvas.draw(textureEdited).brightnessContrast(brightness,contrast).update();
       imgdiv.src = canvas.toDataURL();
    }
  });
};

function updateTexture(updatedImage) {
  textureEdited.loadContentsOf(updatedImage);
  imgdiv.src = canvas.toDataURL();
}

function downloadImage(link) {
  link.href = imgdiv.src;
}

// ----------------- SVG functions -----------------
var scaleFactor;
var width = 360;
var strokeThickness;
var path = null;

var svgdiv;
var svgObject;
var trace = new Potrace();;

function initSVG(e) {
  document.getElementById("svgTab").click();
  svgObject = document.getElementById("svg");
  handleFiles(imgdiv.src);
  svgdiv = document.getElementById('svgdiv');
}

function stroke(){
  $( "#slider-stroke" ).slider({
    value: 0,
    animate:"fast",
    orientation: "horizontal",
    slide: function( event, ui ) {
      strokeThickness = $( "#slider-stroke" ).slider( "value" ) * 0.1;
      if(path != null){
        path.stroke({ width: strokeThickness });
      }
    }
  });
}

function checkStroke(){
  if(document.getElementById("blackStroke").checked){
    path.stroke("white");
  }
  else{
    path.stroke("black");
  }
}

function handleFiles(files) {
  trace.loadImageFromUrl(files);
  trace.process(function(){
    scaleFactor = width / sourceWidth;
    displaySVG(1);
  });
}

function displaySVG(size, type) {
  svgdiv.innerHTML = trace.getSVG(scaleFactor);
  svgObject = document.getElementById("svg");
  svgObject.children[0].id = "pathSVG";
  path = SVG.adopt(document.getElementById("pathSVG"));
  path.stroke("white");
}

var tempSVG;
var tempPath;
function generateTempSVG(download, e) {
  tempSVG = document.getElementById("tempSVG");
  let tempPotrace = new Potrace();
  svgAsPngUri(svgObject, {backgroundColor: "white"}, function(uri) {
    tempPotrace.loadImageFromUrl(uri);
    tempPotrace.process(function(){
      tempPath = tempPotrace.getSVG(scaleFactor);
      tempSVG.innerHTML = tempPath;
      if(download){
        downloadSVG(e);
      }
      else {
        init3D();
      }
    });
  });
}

function downloadSVG(e){
  var fileBlobSVG = new Blob([tempPath], {type: "application/octet-binary"});
  e.target.download = (new Date()).toLocaleTimeString() + ".svg";
  e.target.href = URL.createObjectURL(fileBlobSVG);
}

// ------------------ 3D Model Functions ------------------
var meshes;
var model;

function init3D() {
  document.getElementById("3DTab").click();
	var viewerSettings = {
		cameraEyePosition : [0, 0, 1.5],
		cameraCenterPosition : [0.0, 0.0, 0.0],
		cameraUpVector : [0.0, 1.0, 0.0]
	};

	var viewer = new JSM.ThreeViewer ();
	viewer.Start (document.getElementById ('viewer3D'), viewerSettings);

	model = JSM.SvgToModel (tempSVG, 1, 5, null);
	meshes = JSM.ConvertModelToThreeMeshes (model);
	viewer.AddMeshes(meshes);

	viewer.FitInWindow ();
	viewer.Draw ();
}

function download3D(e) {
  let stl = JSM.ExportModelToStl (model, 'JSModelerBody', false);
  let fileBlobSTL = new Blob([stl], {type: "application/octet-binary"});
  e.target.download = (new Date()).toLocaleTimeString() + ".stl";
  e.target.href = URL.createObjectURL(fileBlobSTL);
}

// ------------------ On Load ------------------

window.onload = function() {
  init();
  uploadFile();
  brightnessAndContrast();
  stroke();
}
