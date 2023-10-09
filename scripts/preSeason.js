$.each(chapters, function (index, chapter) {
  var formattedHTML = "";

  formattedHTML +=
    '<h2 style="text-transform: uppercase">Previous Fortnite seasons</h2>';

  // Iterate over the chapters array and generate HTML for each chapter
  $.each(chapters, function (index, chapter) {
    // Add the chapter header
    formattedHTML += '<div class="chapters-container">';
    formattedHTML += `<h3>${chapter.label}</h3>`;
    formattedHTML += '<div class="chapters">';
    // Iterate over the seasons within the chapter and generate HTML for each season
    $.each(chapter.seasons, function (seasonIndex, season) {
      formattedHTML += '<div class="season">';
      formattedHTML += `<img src="${season.image}" alt="Season ${season.season}" />`;
      formattedHTML += "<ul>";
      formattedHTML += `<li style="text-transform: uppercase">Season ${season.season}</li>`;
      formattedHTML += '<li><a href="/home">Battle Pass</a></li>';
      formattedHTML += `<li>${season.published} — ${season.lasted}</li>`;
      formattedHTML += `<li>${season.lasted} ago, lasted ${season.lasted}</li>`;
      formattedHTML += "</ul>";
      formattedHTML += "</div>";
    });

    // Close the chapter container
    formattedHTML += "</div>";
    formattedHTML += "</div>";
  });

  // Append the generated HTML to a container element
  $("#pre-season").html(formattedHTML);
});
