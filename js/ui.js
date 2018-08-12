var canvas;
var texture;
var source;
var textureEdited;
var edited;
var updatedImage;
var finalImage;

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
  edited = document.getElementById('edited');
  textureEdited = canvas.texture(edited);

  edited.parentNode.insertBefore(canvas, edited);
  edited.parentNode.removeChild(edited);

  updatedImage = canvas.draw(textureEdited).update();
}

function uploadFile() {
  let source = document.getElementById('upload');

  source.addEventListener('change', (e) => {
  edited.src = URL.createObjectURL(e.target.files[0]);
  }, false);

  edited.onload = function() {
    textureEdited = canvas.texture(edited);
    updatedImage = canvas.draw(textureEdited).update();
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
  }
  else {
    textureEdited = canvas.texture(edited);
    updatedImage = canvas.draw(textureEdited).hueSaturation(0,0).update();
    updateTexture(updatedImage);
    updatedImage = canvas.draw(textureEdited).brightnessContrast(brightness,contrast).update();
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
    }
  });

  $( "#slider-contrast" ).slider({
     value: 50,
     animate:"fast",
     orientation: "horizontal",
     slide: function( event, ui ) {
       contrast = 1. * (( $( "#slider-contrast" ).slider( "value" ) / 100) - 0.5);
       canvas.draw(textureEdited).brightnessContrast(brightness,contrast).update();
    }
  });
};

function updateTexture(updatedImage) {
  textureEdited.loadContentsOf(updatedImage);
}

function download(){
  // console.log(textureEdited);
  // console.log(canvas);
  // console.log(canvas.width);
  // console.log();
  Canvas2Image.saveAsPNG(canvas, canvas.width, canvas.height);
  // canvas.toDataURL();
}

window.onload = function() {
  init();
  uploadFile();
  filter();
}
