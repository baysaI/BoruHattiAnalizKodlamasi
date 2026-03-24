if (typeof jQuery !== "undefined") {
  $(document).ready(function () {
    console.log("jQuery yüklendi");
  });
} else {
  console.log("jQuery yüklenmemiş");
}
var index = 0;
function ekle() {
  var yeniEleman = $("#yeniEleman").val();
  console.log(yeniEleman);
  var yeniID = "liste_" + index;
  $("#listem").append(
    '<li id="' +
      yeniID +
      '" onclick="secim(' +
      index +
      ')">' +
      yeniEleman +
      "</li>",
  );
  $("#yeniEleman").val("");
  index++;
}
function secim(deger) {
  console.log("Değer: " + deger);
  $("li").removeClass("aktif");
  var elemanAdi = "liste_" + deger;
  $("#" + elemanAdi).addClass("aktif");
}
