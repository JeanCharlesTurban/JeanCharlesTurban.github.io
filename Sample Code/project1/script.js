let spotifyData = [];
d3.csv("genreSpotifyData.csv").then( function(data) {
  spotifyData = data;
  spotifyData.forEach( (d) => {
    //Three channels that must be Numbers are energy (x axis), valence (y axis), and popularity (radius size)
    //Color is our fourth channel and does not need a number in our code
    d['energy'] = Number(d['energy']);
    d['audio_valence'] = Number(d['audio_valence']);
    d['song_popularity'] = Number(d['song_popularity']);
  });

  //Getting mins and maxes of the three channels that are non-categorical.
  //Color is the categorical channel and, thus, does not need a min or max value
  let maxEnergy = d3.max(spotifyData, function(d) {return d['energy']; });
  let minEnergy = d3.min(spotifyData, function(d) { return d['energy']; });
  let maxValence = d3.max(spotifyData, function(d) { return d['audio_valence']; });
  let minValence = d3.min(spotifyData, function(d) { return d['audio_valence']; });
  let maxPopularity = d3.max(spotifyData, function(d) { return d['song_popularity']; });
  let minPopularity = d3.min(spotifyData, function(d) { return d['song_popularity']; });

  let q3 = d3.select("#viz");
  q3.append("svg").attr("width", 800).attr("height", 600).attr("id", "chart");
  let svg = d3.select("svg#chart")
  let width = d3.select("#chart").attr("width");
  let height = d3.select("#chart").attr("height");
  let margin = { top: 60, right: 40, bottom: 70, left: 60};
  let chartWidth = width - margin.left - margin.right;
  let chartHeight = height - margin.top - margin.bottom;

  //Setting up scales
  let energyScale = d3.scaleLinear().domain([Math.round(minEnergy *10)/10,maxEnergy]).range([margin.left,chartWidth]);
  let valenceScale = d3.scaleLinear().domain([0,maxValence]).range([chartHeight ,margin.top]);
  let popularityScale = d3.scaleLinear().domain([minPopularity,maxPopularity]).range([1,10]);

  //Setting up axes. Energy is on x axis and valence is on y axis
  let x_axis = d3.axisBottom(energyScale);
  let y_axis = d3.axisLeft(valenceScale);

  //These are the 8 genres we are displaying. Spotify has odd playlist/genre names. We gave a color for each genre
  let arrayOfGenres = ["00s Rock Anthems", "100% LatinX", "90's Hip-Hop Don't Stop",
   "African Heat", "Alternative 00s", "Country's Greatest Hits_ The '90s", "Pop Royalty", "RapCaviar"];
  const genreScale = d3.scaleOrdinal()
    .domain(arrayOfGenres)
    .range(["#e600e6", "#ff7e28", "#F4B400", "#DB4437", "#4285F4", "Teal", "HotPink", "#0F9D58"]);           //change colors here

  //Go through each genre and display the genre in the legend at the bottom
  //of the main graph. We generalized the genres so that the user wasn't
  //confused with the slightly confusing playlist names that Spotify has
  //(e.g RapCaviar is just display as Rap)
  genreScale.domain().forEach(function(d,i) {
    let actualDisplay = "African Heat";
    if (d === "00s Rock Anthems") {
      actualDisplay = "Rock";
    } else if (d === "100% LatinX") {
      actualDisplay = "Latin";
    } else if (d === "90's Hip-Hop Don't Stop") {
      actualDisplay = "Hip-Hop";
    } else if (d === "Alternative 00s") {
      actualDisplay = "Alternative";
    } else if (d === "Country's Greatest Hits_ The '90s") {
      actualDisplay = "Country";
    } else if (d === "Pop Royalty") {
      actualDisplay = "Pop";
    } else if (d === "RapCaviar"){
      actualDisplay = "Rap";
    }

    d3.select("#ourLegend")
      .append("span").text(actualDisplay + "  ")
      .style("color", genreScale(d))
      .style("font-size", "20px").attr("class","title spcl")
  });

  svg.append("text")
    .attr("x", (chartWidth / 2) + 60)
    .attr("y",  margin.top - 20)
    .attr("text-anchor", "middle")
    .style("font-size", "35px")
    .style("fill", "#1db954")
    .attr("class","title")
    .text("Spotify Data Analysis");

  svg.append("text")
    .attr("x", (chartWidth / 2) + 60)
    .attr("y",  margin.top + 10)
    .attr("text-anchor", "middle")
    .style("font-size", "15px")
    .style("fill", "#1db954");

  //This link (https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e) helped me with
  //making axis titles
  svg.append("text")
    .attr("transform",
          "translate(" + (chartWidth/2) + " ," +
                         (chartHeight + margin.top + 50) + ")")
    .style("text-anchor", "middle")
    .style("fill", "#1db954")
    .style("font-size", "25px")
    .attr("class","title")
    .text("Energy");

  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", margin.left - 60)
    .text("Radius Size indicates Popularity")
    .attr("x",0 - (height / 2) - 60)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("fill", "#1db954")
    .style("font-size", "25px")
    .attr("class","title")
    .text("Valence");

  svg.append("g").attr("class","axiss").style("stroke", "#1db954").style("fill", "#1db954")
    .attr("transform","translate(0 , "
    +(chartHeight + margin.top)+")").call(x_axis);
  svg.append("g").attr("class","axiss").style("stroke", "#1db954").style("fill", "#1db954")
    .attr("transform","translate("+margin.left+ " , "
    +(margin.top)+")").call(y_axis);

  //plot the circles in their corresponding x,y locations
  spotifyData.forEach(function(d,i) {
    svg.append("circle")
      .attr("r", popularityScale(d['song_popularity']))
      .attr("cx", energyScale(d['energy']))
      .attr("cy", valenceScale(d['audio_valence']) + margin.top)
      .style("fill", genreScale(d['playlist']))
      .style("opacity", "1");
  });

  //genreOfInterest represents the snapshot genre we are graphing. Rock is the leftmost
  //snapshot graph, so it is genreOfInterest
  let genreOfInterest = "00s Rock Anthems";
  //snapshot is simply all the same data but filtered such that it only contains songs with playlist=00s Rock Anthems
  let snapshot = spotifyData.filter( d => d['playlist'] == genreOfInterest);

  svg = d3.select("#rockpoints").append("svg");
  let genreWidth = 350;
  let genreHeight = 350;
  svg.attr("width", genreWidth).attr("height", genreHeight);
  svg.append("rect").attr("width", genreWidth).attr("height", genreHeight).style("fill", "white");
  spotifyData = snapshot;
  margin = { "top": 100, "right": 60, "bottom": 30, "left":40};
  width = svg.attr("width");
  height = svg.attr("height");
  chartwidth = width - margin["left"] - margin["right"];
  chartheight = height - margin["top"]-margin["bottom"];

  //corner image in snapshot graph
  svg.append("image")
    .attr("x","10")
    .attr("y","10")
    .attr("width","75")
    .attr("class","biopic")
    .attr("xlink:href","rock3.png");

  //text in snapshot graph
  svg.append("text")
    .attr("x", (chartwidth/2) + 30 )
    .attr("y",  20)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .attr("class","title")
    .style("fill", "e600e6")
    .text("Rock Snapshot");

//Snapshot caption
  svg.append("text")
    .attr("x", 100 )
    .attr("y",  44)
    .attr("text-anchor", "left")
    .attr("class" ,'font')
    .style("font-size", "12px")
    .style("fill", "blck")
    .text("Overall high energy.");
  svg.append("text")
    .attr("x", 100 )
    .attr("y",  60)
    .attr("text-anchor", "left")
    .attr("class" ,'font')
    .style("font-size", "12px")
    .style("fill", "blck")
    .text("Energy remains high as valence");
  svg.append("text")
    .attr("x", 100 )
    .attr("y",  76)
    .attr("text-anchor", "left")
    .attr("class" ,'font')
    .style("font-size", "12px")
    .style("fill", "blck")
    .text("varies.");

  //Setting up scales for snapshot graph
  energyScale = d3.scaleLinear().domain([Math.round(minEnergy *10)/10,maxEnergy]).range([0, chartwidth]);
  valenceScale = d3.scaleLinear().domain([0,maxValence]).range([chartheight,0]);
  popularityScale = d3.scaleLinear().domain([minPopularity,maxPopularity]).range([1,3]);

  //colorOfPoints is the color of the circles in the rock graph
  let colorOfPoints = "#e600e6";
  svg.append("g").attr("id","RockGroup")
  svgb2 = d3.select("g#RockGroup");

  //Plot all the rock points in the rock snapshot graph
  for(k=0;k < spotifyData.length;k++){
    svgb2.append("circle")
      .attr("cx",energyScale(spotifyData[k].energy)+margin["left"])
      .attr("cy",valenceScale(spotifyData[k].audio_valence)+margin["top"])
      .attr("r",popularityScale(spotifyData[k].song_popularity))
      .style("fill", colorOfPoints)
      .attr("opacity",.7);
  }

  leftAxis = d3.axisLeft(valenceScale);
  svg.append("g")
    .attr("stroke-width",1.8)
    .attr("transform","translate("+(margin.left)+","+margin.top+")")
    .style("font", "12px times")
    .attr("class","yscale")
    .call(leftAxis.ticks(0));

  bottomAxis = d3.axisBottom(energyScale)
  svg.append("g")
    .attr("stroke-width",1.8)
    .style("font", "12px times")
    .attr("class","xscale")
    .attr("transform","translate("+(margin.left)+","+(chartheight + margin.top)+")")
    .call(bottomAxis.ticks(0));

  //Must reset spotifyData to the original data because we are going to
  //do another filter with African Heat genre music
  spotifyData = data;
  genreOfInterest = "African Heat";
  snapshot = spotifyData.filter( d => d['playlist'] === genreOfInterest);

  svg = d3.select("#africapoints").append("svg");
  svg.attr("width", genreWidth).attr("height", genreHeight);
  svg.append("rect").attr("width", genreWidth).attr("height", genreHeight).style("fill", "white");
  svg.append("text")
    .attr("x", (chartwidth/2)+80 )
    .attr("y",  20)
    .attr("text-anchor", "middle")
    .style("font-size", "18px")
    .style("fill", "Red")
    .attr("class","title")
    .text("African Heat Snapshot");

  svg.append("image")
    .attr("x","10")
    .attr("y","10")
    .attr("width","75")
    .attr("class","biopic")
    .attr("xlink:href","heat.png");

  //Add snapshot caption
  svg.append("text")
    .attr("x", 100 )
    .attr("y",  44)
    .attr("class" ,'font')
    .style("font-size", "12px")
    .style("fill", "black")
    .text("Overall high valence and energy. ");
  svg.append("text")
      .attr("x", 100 )
      .attr("y",  60)
      .attr("class" ,'font')
      .style("font-size", "12px")
      .style("fill", "black")
      .text("Valence increases with increasing ");
      svg.append("text")
          .attr("x", 100 )
          .attr("y",  76)
          .attr("class" ,'font')
          .style("font-size", "12px")
          .style("fill", "black")
          .text("energy.");

  spotifyData = snapshot;
  margin = { "top": 100, "right": 60, "bottom": 30, "left":40};
  width = svg.attr("width");
  height = svg.attr("height");
  chartwidth = width - margin["left"] - margin["right"];
  chartheight = height - margin["top"]-margin["bottom"];

  //Setting up scales for African Heat snapshot
  energyScale = d3.scaleLinear().domain([Math.round(minEnergy *10)/10,maxEnergy]).range([0, chartwidth]);
  valenceScale = d3.scaleLinear().domain([0,maxValence]).range([chartheight,0]);
  popularityScale = d3.scaleLinear().domain([minPopularity,maxPopularity]).range([1,3]);

  //Color of African Heat data points
  colorOfPoints = "Red";
  svg.append("g").attr("id","AfricaGroup")
  svgb2 = d3.select("g#AfricaGroup");

  //Plot African Heat snapshot data points
  for(k=0;k < spotifyData.length;k++){
    svgb2.append("circle")
      .attr("cx",energyScale(spotifyData[k].energy)+margin["left"])
      .attr("cy",valenceScale(spotifyData[k].audio_valence)+margin["top"])
      .attr("r",popularityScale(spotifyData[k].song_popularity))
      .style("fill", colorOfPoints)
      .attr("opacity",.7);
  }

  leftAxis = d3.axisLeft(valenceScale);
  svg.append("g")
    .attr("stroke-width",1.8)
    .attr("transform","translate("+(margin.left)+","+margin.top+")")
    .style("font", "12px times")
    .attr("class","yscale")
    .call(leftAxis.ticks(0));

  bottomAxis = d3.axisBottom(energyScale)
  svg.append("g")
    .attr("stroke-width",1.8)
    .style("font", "12px times")
    .attr("class","xscale")
    .attr("transform","translate("+(margin.left)+","+(chartheight + margin.top)+")")
    .call(bottomAxis.ticks(0));
})
.catch( e => { console.log("Error: "+e.message);} );
