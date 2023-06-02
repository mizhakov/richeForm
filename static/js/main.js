var _state_market = -1;
var state_prod = -1;
files_loads = []


function toggleRadioButton(id) {
  var radio = document.getElementById(id);
  radio.checked = true;
  _state_market = 1;
}

var rait_box = 0;
var rait_prod = 0;

$(document).ready(function () {
  $("#rateBox").rateYo({
    spacing: "16px",
    starWidth: "40px",
    starSvg: `<svg width="36" height="33" fill="#D5D5D5" xmlns="http://www.w3.org/2000/svg"><path d="M16.2619 1.0535C17.0289 -0.293979 18.9711 -0.293978 19.7381 1.0535L23.9356 8.42744C24.2202 8.92745 24.7064 9.28067 25.2699 9.39685L33.58 11.1102C35.0985 11.4233 35.6987 13.2704 34.6542 14.4163L28.9382 20.687C28.5506 21.1122 28.365 21.6837 28.4286 22.2555L29.3671 30.6884C29.5386 32.2293 27.9673 33.3709 26.5547 32.7317L18.8246 29.2332C18.3005 28.996 17.6995 28.996 17.1754 29.2332L9.44527 32.7317C8.03271 33.3709 6.46142 32.2293 6.63292 30.6884L7.57141 22.2555C7.63505 21.6837 7.44935 21.1122 7.06176 20.687L1.34581 14.4163C0.301302 13.2704 0.901484 11.4233 2.42003 11.1102L10.7301 9.39685C11.2936 9.28067 11.7798 8.92745 12.0644 8.42744L16.2619 1.0535Z" fill=""/></svg> `, ratedFill: "#E7B766",
    onSet: function (rating, rateYoInstance) {
      rait_box = rating;
    },
    fullStar: true
  });

  $("#rateProd").rateYo({
    spacing: "16px",
    starWidth: "40px",
    starSvg: `<svg width="36" height="33" fill="#D5D5D5" xmlns="http://www.w3.org/2000/svg"><path d="M16.2619 1.0535C17.0289 -0.293979 18.9711 -0.293978 19.7381 1.0535L23.9356 8.42744C24.2202 8.92745 24.7064 9.28067 25.2699 9.39685L33.58 11.1102C35.0985 11.4233 35.6987 13.2704 34.6542 14.4163L28.9382 20.687C28.5506 21.1122 28.365 21.6837 28.4286 22.2555L29.3671 30.6884C29.5386 32.2293 27.9673 33.3709 26.5547 32.7317L18.8246 29.2332C18.3005 28.996 17.6995 28.996 17.1754 29.2332L9.44527 32.7317C8.03271 33.3709 6.46142 32.2293 6.63292 30.6884L7.57141 22.2555C7.63505 21.6837 7.44935 21.1122 7.06176 20.687L1.34581 14.4163C0.301302 13.2704 0.901484 11.4233 2.42003 11.1102L10.7301 9.39685C11.2936 9.28067 11.7798 8.92745 12.0644 8.42744L16.2619 1.0535Z" fill=""/></svg> `, ratedFill: "#E7B766",
    onSet: function (rating, rateYoInstance) {
      rait_prod = rating;
    },
    fullStar: true
  });
});


$(document).ready(function () {

  var selectizes = $('#selectProd').selectize({
    items: ['Выберите продукт'],
    onChange: function (value) {
      var image = document.getElementById('selected_prod');

      document.getElementById('selected_prod').style.display = 'block';

      state_prod = value;
      image.src = `/static/products/${value}.jpg`;

      document.getElementById('selected_prod').style.display = 'block';
    }
  });

  // state_prod = $('#selectProd').val();
});


$(document).ready(function () {
  document.querySelectorAll('[id*="-selectized"]').forEach(function (elem) {
    elem.readOnly = true;
    $(`#${elem.getAttribute('id')}`).attr("disabled", true);;
  });

});

function generateRandomWord() {
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  var randomWord = '';
  for (var i = 0; i < 20; i++) {
    var randomIndex = Math.floor(Math.random() * characters.length);
    randomWord += characters.charAt(randomIndex);
  }
  return randomWord;
}


$(document).ready(function () {
  var uploader = new plupload.Uploader({
    browse_button: 'uploader',
    drop_element: 'uploader',
    url: '/upload',
    multi_selection: true,
    dragdrop: true,

    filters: {
      mime_types: [
        { title: "Image files", extensions: "jpg,jpeg,png,gif" },
        { title: "Document files", extensions: "pdf,doc,docx,xls,xlsx" }
      ]
    }
  });

  uploader.init();

  uploader.bind('FilesAdded', function (up, files) {
    var filelist = '';
    plupload.each(files, function (file) {
      filelist += '<div id="' + file.id + '"></div>';
    });

    uploader.start();
  });


  uploader.bind('Error', function (up, err) {
    alert('Ошибка загрузки: ' + err.message);
  });

  uploader.bind('FileUploaded', function (up, file, response) {

    var fileContainer = $('#preview');


    if (file.type && file.type.startsWith('image/')) {
      var reader = new FileReader();
      reader.onload = function (e) {

        var id_div = generateRandomWord()

        var naw_div = $('<div>');
        naw_div.attr('id', id_div);


        var imagePreview = $('<img>');
        imagePreview.attr('src', e.target.result);
        imagePreview.attr('id', fileContainer.length);
        naw_div.append(imagePreview);

        var imgDel = $('<img>');
        imgDel.attr('src', '/static/img/x.png');
        imgDel.attr('class', 'cross-icon');
        imgDel.attr('onclick', `$("#${id_div}").remove();var index = files_loads.indexOf($(${imagePreview.src}));files_loads.splice(index, 1);`)

        naw_div.append(imgDel);

        fileContainer.append(naw_div);
      };

      reader.readAsDataURL(file.getNative());

    } else {
      var fileInfo = $('<div>').html(file.name + ' загружен');
      fileContainer.append(fileInfo);
    }
    files_loads.push(response.response);
  })

});

function autoResize(textarea) {
  if (textarea.value.length <= 28) {
    textarea.style.height = '28px';
  } else {
    textarea.style.height = "auto";
    textarea.style.height = (textarea.scrollHeight - 40) + "px";
  }
}

$(document).ready(function () {
  autoResize(document.getElementById("name"));
  autoResize(document.getElementById("pos"));
  autoResize(document.getElementById("neg"));
  autoResize(document.getElementById("rewue"));
});

$(document).ready(function () {});


function push() {

  var data = {};

  $('#alert_msg').css({ 'background': 'f9d8d8'});


  if (_state_market == 1) {
    data.market = $('#wb')[0].checked ? "wb" : "ozon";
  } else {
    $('#alert_msg').css({ 'opacity': '1', 'top': "20px" });
    $('#msg').text("Выберите место где покупали товар");
    setTimeout(function () {
      $('#alert_msg').css({ 'opacity': '1', 'top': "-120px" });
    }, 5000);


    return -1;
  }

  if (state_prod == -1) {
    $('#alert_msg').css({ 'opacity': '1', 'top': "20px" });
    $('#msg').text("Выберите продукт");
    setTimeout(function () {
      $('#alert_msg').css({ 'opacity': '1', 'top': "-120px" });
    }, 5000);
    return -1;
  } else {
    data.prod = state_prod;
  };

  if (rait_box == 0) {
    $('#alert_msg').css({ 'opacity': '1', 'top': "20px" });
    $('#msg').text("Оцените упаковку");
    setTimeout(function () {
      $('#alert_msg').css({ 'opacity': '1', 'top': "-120px" });
    }, 5000);
    return -1;
  } else {
    data.rateBox = rait_box;
  }

  data.name = $('#name').val();

  if (rait_prod == 0) {
    $('#alert_msg').css({ 'opacity': '1', 'top': "20px" });
    $('#msg').text("Оцените продукт");
    setTimeout(function () {
      $('#alert_msg').css({ 'opacity': '1', 'top': "-120px" });
    }, 5000);
    return -1;
  } else {
    data.rateProd = rait_prod;
  }

  if ($('#pos').val() == ""){
    $('#alert_msg').css({ 'opacity': '1', 'top': "20px" });
    $('#msg').text("Укажите достоинства");
    setTimeout(function () {
      $('#alert_msg').css({ 'opacity': '1', 'top': "-120px" });
    }, 5000);
    return -1;
  } else {
    data.pos = $('#pos').val();
  }
  if ($('#neg').val() == ""){
    $('#alert_msg').css({ 'opacity': '1', 'top': "20px" });
    $('#msg').text("Укажите недостатки");
    setTimeout(function () {
      $('#alert_msg').css({ 'opacity': '1', 'top': "-120px" });
    }, 5000);
    return -1;
  } else {
    data.neg = $('#neg').val();
  }

  data.rewue = $('#rewue').val();
  data.files = files_loads

  


  $.ajax({
    url: '/rewue_save',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(data),
    success: function(response) {
      $('#alert_msg').css({ 'opacity': '1', 'top': "20px" , 'background' : "green"});
      $('#msg').text("Спасибо за отзыв !");
        setTimeout(function () {
      $('#alert_msg').css({ 'opacity': '1', 'top': "-120px" });
      // redirect();
    }, 5000);
    },
    error: function(xhr, status, error) {
      console.error(error);
    }
  });

function redirect() {
  var newUrl = '/successfully';
  var link = document.createElement('a');
  link.href = newUrl;
  link.click();
  $('#wb').prop("checked", false);
  $('#ozon').prop("checked", false);
}
  


}


$(document).ready(function () {
  $('#wb').prop("checked", false);
  $('#ozon').prop("checked", false);
  $('#name').val('');
  $('#pos').val('');
  $('#neg').val('');
  $('#rewue').val('');

});