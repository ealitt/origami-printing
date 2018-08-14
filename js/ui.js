// ----------------- Image Editing functions -----------------

var canvas;
var texture;
var source;
var textureEdited;
var edited;
var updatedImage;
var finalImage;
var image;

let brightness = 0;
let contrast = 0;

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
  document.getElementById("defaultOpen").click();
  $( "#blackAndWhite" ).prop('checked', false);

  try {
      canvas = fx.canvas();
  } catch (e) {
      alert(e);
      return;
  };
  image = new Image;

  edited = document.getElementById('edited');
  textureEdited = canvas.texture(edited);
  canvas.id = "sourceCanvas";

  edited.parentNode.insertBefore(canvas, edited);
  edited.parentNode.removeChild(edited);

  updatedImage = canvas.draw(textureEdited).update();
  image.src = canvas.toDataURL();
}

function uploadFile() {
  let source = document.getElementById('upload');

  source.addEventListener('change', (e) => {
  edited.src = URL.createObjectURL(e.target.files[0]);
  }, false);

  edited.onload = function() {
    textureEdited = canvas.texture(edited);
    updatedImage = canvas.draw(textureEdited).update();
    image.src = canvas.toDataURL();
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
  $('#blackAndWhite').removeClass('active');
  $( "#blackAndWhite" ).attr("aria-pressed", "false");
}

function revertImage() {
  resetValues();
  textureEdited = canvas.texture(edited);
  updatedImage = canvas.draw(textureEdited).update();
  updateTexture(updatedImage);
};

function blackAndWhite() {
  if ($( "#blackAndWhite" ).attr("aria-pressed") === "false") {
    textureEdited = canvas.texture(edited);
    updatedImage = canvas.draw(textureEdited).hueSaturation(0,-1).update();
    updateTexture(updatedImage);
    updatedImage = canvas.draw(textureEdited).brightnessContrast(brightness,contrast).update();
    image.src = canvas.toDataURL();
  }
  else {
    textureEdited = canvas.texture(edited);
    updatedImage = canvas.draw(textureEdited).hueSaturation(0,0).update();
    updateTexture(updatedImage);
    updatedImage = canvas.draw(textureEdited).brightnessContrast(brightness,contrast).update();
    image.src = canvas.toDataURL();
  }
  updateTexture(updatedImage);
};

function filter() {
  $( "#slider-brightness" ).slider({
    value: 50,
    animate:"fast",
    orientation: "horizontal",
    slide: function( event, ui ) {
      brightness = 1.75 * (( $( "#slider-brightness" ).slider( "value" ) / 100) - 0.5);
      canvas.draw(textureEdited).brightnessContrast(brightness,contrast).update();
      image.src = canvas.toDataURL();
    }
  });

  $( "#slider-contrast" ).slider({
     value: 50,
     animate:"fast",
     orientation: "horizontal",
     slide: function( event, ui ) {
       contrast = 1. * (( $( "#slider-contrast" ).slider( "value" ) / 100) - 0.5);
       canvas.draw(textureEdited).brightnessContrast(brightness,contrast).update();
       image.src = canvas.toDataURL();
    }
  });
};

function updateTexture(updatedImage) {
  textureEdited.loadContentsOf(updatedImage);
  image.src = canvas.toDataURL();
}

function downloadImage(link) {
  link.href = image.src;
}

window.onload = function() {
  init();
  uploadFile();
  filter();
}

// ----------------- SVG functions -----------------

var svgCanvas;
var formData;
var test;

function initSVG() {
  svgCanvas = document.getElementById('sourceCanvas');
  // svgCanvas = Canvas2Image.convertToJPEG(document.getElementById('sourceCanvas'), edited.width, edited.height);
  // var svg = svgCanvas.getSvg();
	// image.src = svgCanvas.toDataURL("image/png");
  // var canvasImage = new Image;
  // console.log(textureEdited);
  // canvasImage.src = svgCanvas.toDataURL();
  // document.body.appendChild(canvasImage);
  // test = document.getElementById('edited');
  // test.src = svgCanvas.toDataURL();
  // document.body.appendChild(test);
  // svgCanvas.parentNode.insertBefore(image, edited);
  // svgCanvas.parentNode.removeChild(edited);
  // handleFile(svgCanvas);
  document.body.appendChild(image);
}

function handleFile(file) {
  Potrace.loadImageFromUrl(file);
  Potrace.process(function(){
    displayImg();
    displaySVG(1);
  });
}

function displayImg(){
  var imgdiv = document.getElementById('imgdiv');
  imgdiv.style.display = 'inline-block';
  imgdiv.innerHTML = "<p>Input image:</p>";
  imgdiv.appendChild(Potrace.img);
}

function displaySVG(size, type){
  var svgdiv = document.getElementById('svgdiv');
  svgdiv.style.display = 'inline-block';
  svgdiv.innerHTML = "<p>Result:</p>" + Potrace.getSVG(size, type);
}
