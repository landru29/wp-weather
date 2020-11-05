function getMetar() {
  jQuery.getJSON(
          meteoMetarURL,
          function( data ) {
            console.log(JSON.stringify(data));
          }
      );
}