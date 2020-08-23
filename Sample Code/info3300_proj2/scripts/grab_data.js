// constants
const heroes = d3.csv("../final_dataset.csv");
const max_first_round = 32;
const max_second_round = 8;
const max_third_round = 4;
const max_fourth_round = 2;
const max_last_round = 1;
const total_num_chars = 604;
const num_of_filter_options = 4;
const avgH2 = 178;
const avgW2 = 72;

// global variables
filter_trans = {
  good: "Alignment",
  bad: "Alignment",
  Male: "Gender",
  Female: "Gender"
};
var previous_selections_l = { alignment: "", gender: "" };
var previous_selections_r = { alignment: "", gender: "" };
var d1_left = [];
var d1_right = [];
var final_chars = [];
var winners_data = [];
var speed = 1;

function fightBro(fighter1, fighter2, fightdata, user_weights) {
  namelist = [];
  for (i = 0; i < fightdata.length; i++) {
    namelist.push(fightdata[i].Name);
  }

  let player1 = fighter1;
  let player2 = fighter2;

  //weights of the tiers
  am = user_weights[0]; //attack
  bm = user_weights[1]; //health
  cm = user_weights[2]; //defense
  dm = user_weights[3]; //accuracy
  tm = user_weights[4]; //tier

  a1 = (player1.Power + player1.Strength + player1.Combat) / 300;
  b1 = player1.Height / avgH2 + player1.Weight / avgW2 / 2;
  c1 = player1.Durability / 100;
  d1 = (player1.Intelligence + player1.Speed) / 200;
  t1 = player1.Tier;

  a2 = (player2.Power + player2.Strength + player2.Combat) / 300;
  b2 = player2.Height / avgH2 + player2.Weight / avgW2 / 2;
  c2 = player2.Durability / 100;
  d2 = (player2.Intelligence + player2.Speed) / 200;
  t2 = player2.Tier;

  n1 = ((bm * b1 + cm * c1) / (am * a2 * (dm * d2))) * ((t1 / t2) * tm);
  n2 = ((bm * b2 + cm * c2) / (am * a1 * (dm * d1))) * ((t2 / t1) * tm);

  if (n2 > n1) {
    return player2;
  } else {
    return player1;
  }
}

/*
This function calculates the winner of each round.

RETURNS: _____
PARAMETERS: fightdata => list of dicitonaries corresponding to the characters (e.g: )
*/
function algorithm(fightdata, user_weights) {
  fightdata.forEach(d => {
    d["Intelligence"] = Number(d["Intelligence"]);
    d["Strength"] = Number(d["Strength"]);
    d["Speed"] = Number(d["Speed"]);
    d["Durability"] = Number(d["Durability"]);
    d["Power"] = Number(d["Power"]);
    d["Combat"] = Number(d["Combat"]);
    d["Height"] = Number(d["Height"]);
    d["Weight"] = Number(d["Weight"]);
  });
  d1_left = fightdata.slice(0, 16);
  d1_right = fightdata.slice(16, 32);

  round1a = [];
  round2a = [];
  round3a = [];
  round4 = [];
  round1b = [];
  round2b = [];
  round3b = [];
  finalround = [];
  finalround = [];

  for (j = 0; j < 15; j = j + 2) {
    round1a.push(fightBro(d1_left[j], d1_left[j + 1], fightdata, user_weights));
    round1b.push(
      fightBro(d1_right[j], d1_right[j + 1], fightdata, user_weights)
    );
  }

  for (j = 0; j < 8; j = j + 2) {
    round2a.push(fightBro(round1a[j], round1a[j + 1], fightdata, user_weights));
    round2b.push(fightBro(round1b[j], round1b[j + 1], fightdata, user_weights));
  }
  for (j = 0; j < 4; j = j + 2) {
    round3a.push(fightBro(round2a[j], round2a[j + 1], fightdata, user_weights));
    round3b.push(fightBro(round2b[j], round2b[j + 1], fightdata, user_weights));
  }

  round4.push(fightBro(round3a[0], round3a[1], fightdata, user_weights));
  round4.push(fightBro(round3b[0], round3b[1], fightdata, user_weights));
  finalround.push(fightBro(round4[0], round4[1], fightdata, user_weights));
  results = {
    round1a: round1a,
    round1b: round1b,
    round2a: round2a,
    round2b: round2b,
    round3a: round3a,
    round3b: round3b,
    round4: round4,
    finalround: finalround
  };
  return results;
}

/*
This is a helper function for select_charachters. It will create a final_list of
32 characters of the characters of tmp_list. If tmp_list is too small (< 32), it
will randomly fill in the remaining ppl so that a final list of length 32 is reached

RETURNS: nothing
PARAMTERS: already_grabbed_set => set of ppl already grabbed
           final_list => the list of the final 32 characters; should be final_chars
           tmp_list => the list of the characters that match the user's filter inputs
           entire_list => the entire list of characters of the database (should be data)
           size => how big to make the final list
*/
function lower_selection_number(
  already_grabbed_set,
  final_list,
  tmp_list,
  entire_list,
  size
) {
  let num_chosen = 0;
  if (tmp_list.length == 0) {
    console.log("empty tmp_list");
    return;
  }
  // not enough characters to make a full set; have to add random ppl
  if (tmp_list.length < size) {
    for (let i = 0; i < tmp_list.length; i++) {
      if (!already_grabbed_set.has(tmp_list[i].Name)) {
        final_list.push(tmp_list[i]);
        already_grabbed_set.add(tmp_list[i].Name);
      }
    }
    num_chosen = final_list.length;
    while (num_chosen < size) {
      let potential = Math.floor(Math.random() * entire_list.length);
      let po = entire_list[potential];
      if (!already_grabbed_set.has(po.Name)) {
        final_list.push(po);
        already_grabbed_set.add(po.Name);
        num_chosen += 1;
      }
    }
    return;
  }
  let stop = 0;
  while (num_chosen < size && stop < tmp_list.length) {
    let pot = Math.floor(Math.random() * tmp_list.length);
    let potential = tmp_list[pot];
    if (!already_grabbed_set.has(potential.Name)) {
      final_list.push(potential);
      already_grabbed_set.add(potential.Name);
      num_chosen += 1;
    }
    stop += 1;
  }
  //run out of options to choose from tmp_list
  while (num_chosen < size) {
    let potential = Math.floor(Math.random() * entire_list.length);
    let po = entire_list[potential];
    if (!already_grabbed_set.has(po.Name)) {
      final_list.push(po);
      already_grabbed_set.add(po.Name);
      num_chosen += 1;
    }
  }
}

/*
This function changes the global variable speed to represent how fast the user
wants to make the transition
*/
function fast_forward(ratio) {
  if (ratio == -1) {
    speed = 1;
    // document.getElementById("reset_notif").style.visibility = "visible";
    d3.select("#reset_notif")
      .text("Resetting back to original speed!")
      .style("visibility", "visible")
      .transition()
      .delay(900)
      .duration(500)
      .style("visibility", "hidden");
    // .style("opacity",0);
  } else {
    prev_speed = speed;
    text = "";
    speed = speed * ratio;
    if (speed < prev_speed) {
      text = "Match Speed Increased";
    } else {
      text = "Match Speed Decreased";
    }
    d3.select("#reset_notif")
      .text(text)
      .style("visibility", "visible")
      .transition()
      .delay(900)
      .duration(500)
      .style("visibility", "hidden");
  }
  if (speed <= 0.001953125) {
    document.getElementById("fast").style.visibility = "hidden";
  } else if (speed >= 8) {
    document.getElementById("slow").style.visibility = "hidden";
  } else {
    document.getElementById("slow").style.visibility = "visible";
    document.getElementById("fast").style.visibility = "visible";
  }
}

/*
This is a helper function that removes the svg text elements of the selected 32
figheters. It is called in show_characters and is used when the user wants to
change the filters for selecting 32 possible fighters.

RETURNS: Nothing
CHANGES TO THE SITE: removes svg text elements
PARAMETER: class_name => name of the class of the svg elements showing the character's names
*/
function remove_text(class_name) {
  let to_remove = document.getElementsByClassName(class_name);
  while (to_remove.length > 0) {
    to_remove[0].remove();
  }
}

/*
This function displays the names of the chosen fighters (chosen baed on user input).
It calls remove_text to clear the previous selected fighters. It is called in select_characters
so the user knows which characters will be fighting based on their filters.

RETURNS: nothing
CHANGES TO THE SITE: adds svg text elements of class "left_ppl" or "right_ppl"
                     depending on the side of the brackets
PARAMETERS: final_side => the list of characters for the current side
            side => the side you are drawing on ('left' or 'right')
            round => current round you are on
            y_mult => what you should be multiplying y coordinate by for drawing the svg element
*/
function show_characters(final_side, side, round, y_mult) {
  let svg = d3.select("#brackets");
  let class_name = side + "_ppl";
  remove_text(class_name);
  let x = -1;
  if (side === "left") {
    if (round == 1) {
      x = 0;
    } else if (round == 2) {
      x = 170;
    }
  } else {
    if (round == 1) {
      x = chartwidth - boxwidth;
    } else if (round == 2) {
      x = 830;
    }
  }
  final_side.forEach(function(d, i) {
    if (d.Name.length >= 18) {
      d3.selectAll("." + class_name + "Img")
        .style("opacity", 1)
        .transition()
        .delay(600 * speed)
        .duration(200 * speed)
        .style("opacity", 0);

      c = bold_winners(winners_data, class_name, d);
      let name = d.Name.split(" ");
      svg
        .append("text")
        .attr("class", class_name)
        .attr("x", x + 5)
        .attr("y", 0.63 * boxheight * i + 20)
        .text(name.slice(0, 2).join(" "))
        .transition()
        .delay(600 * speed)
        .duration(150 * speed)
        .style("font-weight", c.weight)
        .style("fill", c.color);

      d3.selectAll("." + class_name + "Img")
        .style("opacity", 1)
        .transition()
        .delay(600 * speed)
        .duration(200 * speed)
        .style("opacity", 0);

      svg
        .append("text")
        .attr("class", class_name)
        .attr("x", x + 5)
        .attr("y", 0.63 * boxheight * i + 40)
        .text(name[name.length - 1])
        .transition()
        .delay(600 * speed)
        .duration(150 * speed)
        .style("font-weight", c.weight)
        .style("fill", c.color);
    } else {
      d3.selectAll("." + class_name + "Img")
        .style("opacity", 1)
        .transition()
        .delay(600 * speed)
        .duration(200 * speed)
        .style("opacity", 0);

      c = bold_winners(winners_data, class_name, d);
      svg
        .append("text")
        .attr("class", class_name)
        .attr("x", x + 5)
        .attr("y", 0.63 * boxheight * i + 15)
        .text(d.Name)
        .transition()
        .delay(600 * speed)
        .duration(150 * speed)
        .style("font-weight", c.weight)
        .style("fill", c.color);
    }
  });
}

/*
This function is in charge of bolding the winners of a round. If the character is in the next
round that they won the previous round so bold and turn them red.
RETURNS: c which is a string that indicates whether the text of bold or normal
*/

function bold_winners(data, round, name) {
  let c = "normal";
  let color = "black";
  let components = { color: "black", weight: "normal" };
  if (
    !round.includes(3) &&
    !round.includes(4) &&
    round != "winner" &&
    !round.includes("left") &&
    !round.includes("right")
  ) {
    var n = round.indexOf("d");
    round_letter = round.slice(n + 2);
    round_number = Number(round.slice(n + 1, n + 2));
    if (data["round" + (round_number + 1) + round_letter].includes(name)) {
      c = "bold";
      color = "red";
    } else {
      c = "normal";
      color = "black";
    }
  } else if (round.includes(3)) {
    if (data["round4"].includes(name)) {
      c = "bold";
      color = "red";
    } else {
      c = "normal";
      color = "black";
    }
  } else if (round.includes(4)) {
    if (data["finalround"].includes(name)) {
      c = "bold";
      color = "red";
    } else {
      c = "normal";
      color = "black";
    }
  } else if (round.includes("left")) {
    if (data["round1a"].includes(name)) {
      c = "bold";
      color = "red";
    } else {
      c = "normal";
      color = "black";
    }
  } else if (round.includes("right")) {
    if (data["round1b"].includes(name)) {
      c = "bold";
      color = "red";
    } else {
      c = "normal";
      color = "black";
    }
  }

  components["color"] = color;
  components["weight"] = c;
  return components;
}

/*
This function is in charge of starting the animation of showing the winners;

RETURNS: nothing
CHANGES TO THE CITE: will gradually add svg text elements and fun stuff?
*/
async function start_animation(data) {
  remove_text("winner");
  remove_text("round1a");
  remove_text("round1b");
  remove_text("round2a");
  remove_text("round2b");
  remove_text("round3a");
  remove_text("round3b");
  remove_text("round4");

  d3.select("#reset_notif")
    .text("Let the battle begin!!!!")
    .style("visibility", "visible")
    .transition()
    .delay(900)
    .duration(800)
    .style("visibility", "hidden");

  color_transitions = [];
  let svg = d3.select("#brackets");

  let k = boxheight + boxheight / 2 + y1;
  let c = "";
  for (let v in data) {
    if (v == "round1a") {
      data[v].forEach(function(d, i) {
        color_transitions[v + i] = d;
        if (i % 2 == 0) {
          k = boxheight + (boxheight + y1) * i;
        } else {
          k = y1 + (boxheight + y1) * i;
        }
        svg
          .append("text")
          .attr("class", "round1a")
          .attr("id", "" + v + i)
          .attr("x", boxwidth + x1 + 5)
          .attr("y", k - 5)
          .text(d.Name)

          .style("opacity", 0);
      });
    } else if (v == "round1b") {
      data[v].forEach(function(d, i) {
        color_transitions[v + i] = d;
        if (i % 2 == 0) {
          k = boxheight + (boxheight + y1) * i;
        } else {
          k = y1 + (boxheight + y1) * i;
        }
        svg
          .append("text")
          .attr("class", "round1b")
          .attr("id", "" + v + i)
          .attr("x", chartwidth - x1 - boxwidth * 2 + 5)
          .attr("y", k - 5)

          .text(d.Name)
          .style("opacity", 0);
      });
    } else if (v == "round2a") {
      data[v].forEach(function(d, i) {
        color_transitions[v + i] = d;
        if (i % 2 == 0) {
          k = y3 + 20 + (boxheight + y1) * i * 2;
        } else {
          k = 20 + (boxheight + y1) * i * 2;
        }
        svg
          .append("text")
          .attr("class", "round2a")
          .attr("id", "" + v + i)
          .attr("x", boxwidth * 2 + x1 + x2 + 5)
          .attr("y", k)
          .text(d.Name)
          .style("opacity", 0);
      });
    } else if (v == "round2b") {
      data[v].forEach(function(d, i) {
        color_transitions[v + i] = d;
        if (i % 2 == 0) {
          k = y3 + 20 + (boxheight + y1) * i * 2;
        } else {
          k = 20 + (boxheight + y1) * i * 2;
        }
        svg
          .append("text")
          .attr("class", "round2b")
          .attr("id", "" + v + i)
          .attr("x", chartwidth - boxwidth * 3 - x2 - x1 + 5)
          .attr("y", k)
          .text(d.Name)
          .style("opacity", 0);
      });
    } else if (v == "round3a") {
      data[v].forEach(function(d, i) {
        color_transitions[v + i] = d;
        svg
          .append("text")
          .attr("class", "round3a")
          .attr("id", "" + v + i)
          .attr("x", boxwidth * 2 + x1 + x2 + 100 + 5)
          .attr("y", y4 + 25 + y1 * 2 * i)
          .text(d.Name)
          .style("opacity", 0);
      });
    } else if (v == "round3b") {
      data[v].forEach(function(d, i) {
        color_transitions[v + i] = d;
        svg
          .append("text")
          .attr("class", "round3b")
          .attr("id", "" + v + i)
          .attr("x", chartwidth - boxwidth * 3 - x1 - x2 - 100 + 5)
          .attr("y", y4 + 25 + y1 * 2 * i)
          .text(d.Name)
          .style("opacity", 0);
      });
    } else if (v == "round4") {
      data[v].forEach(function(d, i) {
        color_transitions[v + i] = d;
        svg
          .append("text")
          .attr("class", "round4")
          .attr("id", "" + v + i)
          .attr("x", cx - boxwidth / 2 + 5)
          .attr("y", 218 + y1 * 2.4 * i)
          .text(d.Name)
          .style("opacity", 0);
      });
    } else {
      data[v].forEach(function(d, i) {
        svg
          .append("text")
          .attr("class", "winner")
          .attr("x", cx - boxwidth / 2 + 5)
          .attr("y", 20)
          .text(d.Name)
          .style("font-weight", "bold")
          .style("opacity", 0);

        d3.select("#winner_image").remove();
        svg
          .append("image")
          .attr("id", "winner_image")
          .attr("xlink:href", "images/" + d.Creator + ".png")
          .attr("x", cx - boxwidth / 2)
          .attr("y", 25)
          .attr("width", boxwidth)
          .attr("height", boxwidth / 1.5)
          .style("opacity", "0");
      });
    }
  }

  let wait_time = 1000 * speed;
  for (v in color_transitions) {
    if (v.includes("round1a") || v.includes("round1b")) {
      let round = v.slice(0, v.length - 1);
      //animation
      d3.selectAll("." + round + "Img")
        .transition()
        .delay(950 * speed)
        .duration(500 * speed)
        .style("opacity", 1)
        .transition()
        .delay(900 * speed)
        .duration(200 * speed)
        .style("opacity", 0);
      //color change
      c = bold_winners(data, round, color_transitions[v]);
      d3.select("#" + v)
        .transition()
        .delay(900 * speed)
        .duration(500 * speed)
        .style("opacity", 1)
        .transition()
        .delay(300 * speed)
        .duration(500 * speed)
        .style("font-weight", c.weight)
        .style("fill", c.color);
    }
  }

  //round2
  await setTimeout(function() {
    //mouseovers begin for previous round?
    for (v in color_transitions) {
      if (v.includes("round2a") || v.includes("round2b")) {
        let round = v.slice(0, v.length - 1);
        //animation
        d3.selectAll("." + round + "Img")
          .transition()
          .delay(950 * speed)
          .duration(500 * speed)
          .style("opacity", 1)
          .transition()
          .delay(900 * speed)
          .duration(300 * speed)
          .style("opacity", 0);
        //color change
        c = bold_winners(data, round, color_transitions[v]);
        d3.select("#" + v)
          .transition()
          .delay(900 * speed)
          .duration(500 * speed)
          .style("opacity", 1)
          .transition()
          .delay(300 * speed)
          .duration(500 * speed)
          .style("font-weight", c.weight)
          .style("fill", c.color);
      }
    }
    wait_time = 1000 * speed;
  }, wait_time);

  await setTimeout(function() {
    for (v in color_transitions) {
      if (v.includes("round3a") || v.includes("round3b")) {
        let round = v.slice(0, v.length - 1);
        //animation
        d3.selectAll("." + round + "Img")
          .transition()
          .delay(1800 * speed)
          .duration(500 * speed)
          .style("opacity", 1)
          .transition()
          .delay(400 * speed)
          .duration(300 * speed)
          .style("opacity", 0);
        //color change
        c = bold_winners(data, round, color_transitions[v]);
        d3.select("#" + v)
          .transition()
          .delay(1700 * speed)
          .duration(500 * speed)
          .style("opacity", 1)
          .transition()
          .delay(400 * speed)
          .duration(500 * speed)
          .style("font-weight", c.weight)
          .style("fill", c.color);
      }
    }
    wait_time = 1000 * speed;
  }, wait_time);

  await setTimeout(function() {
    for (v in color_transitions) {
      if (v.includes("round4")) {
        let round = v.slice(0, v.length - 1);
        //animation
        d3.selectAll("." + round + "Img")
          .transition()
          .delay(2600 * speed)
          .duration(500 * speed)
          .style("opacity", 1)
          .transition()
          .delay(400 * speed)
          .duration(300 * speed)
          .style("opacity", 0);
        //color change
        c = bold_winners(data, round, color_transitions[v]);
        d3.select("#" + v)
          .transition()
          .delay(2600 * speed)
          .duration(500 * speed)
          .style("opacity", 1)
          .transition()
          .delay(400 * speed)
          .duration(500 * speed)
          .style("font-weight", c.weight)
          .style("fill", c.color);
      }
    }
    wait_time = 1000 * speed;
  }, wait_time);

  //winner
  await setTimeout(function() {
    d3.selectAll(".winner")
      .transition()
      .delay(3600 * speed)
      .duration(500 * speed)
      .style("opacity", 1);
    d3.select("#winner_image")
      .transition()
      .delay(3600 * speed)
      .duration(500 * speed)
      .style("color", "red")
      .style("opacity", 1)
      .style("font-weight", "bolder");
    wait_time = 900 * speed;
  }, wait_time);
}

/*
This function returns true or false to determine if the current character is a valid
fighter candidate based on the user's criteria.

RETURNS: true/false
CHANGES TO THE SITE: none
PARAMTERS: c = 0 / 1 (0 if left side, 1 if right side)
           d = dicitonary of current character
           checkedFilters = user selected filters
           selectedOrgs = user selected organization
*/
function check_sat(c, d, checkedFilters, selectedOrgs) {
  let sat = true;
  //only filter by universe
  if (selectedOrgs[c] != "all" && checkedFilters.length == 0) {
    sat = sat && d["Creator"] === selectedOrgs[c];
  }
  //only filter by choices
  else if (selectedOrgs[c] == "all" && checkedFilters.length != 0) {
    for (let filt = 0; filt < checkedFilters.length; filt += 1) {
      let col = filter_trans[checkedFilters[filt]];
      sat = sat && d[col] == checkedFilters[filt];
    }
  }
  //lots of filtering
  else if (selectedOrgs[c] != "all" && checkedFilters.length != 0) {
    if (d["Creator"] === selectedOrgs[c]) {
      for (let filt = 0; filt < checkedFilters.length; filt += 1) {
        let col = filter_trans[checkedFilters[filt]];
        sat = sat && d[col] == checkedFilters[filt];
      }
    } else {
      sat = false;
    }
  }
  return sat;
}

/*
This function grabs the filters selected by the user. It then goes through all the
data points and updates the global variables: final_chars, d1_left, and d1_right.
After, it will display the 32 starting characters and begin the animation to show
who the final winner is.

RETURNS: nothing
CHANGES TO THE SITE: see helper functions above
GLOBAL VARIABLES: final_chars => the 32 characters to fight
                  d1_left => the 16 characters on the left side
                  d1_right => the 16 characters on the right side
*/
function select_characters() {
  //reset section
  final_chars.length = 0;
  d1_left.length = 0;
  d1_right.length = 0;

  //grab universes to filter by ; element 0 = left; 1 = right;
  let selectedOrgs = [];
  let orgs = document.getElementsByClassName("org_choice");
  for (let o = 0; o < orgs.length; o += 1) {
    let opt = orgs[o];
    let check = opt.options[opt.selectedIndex].value;
    selectedOrgs.push(check);
  }
  //grab filters to filter by
  let checkedFilters_l = [];
  let checkedFilters_r = [];
  let filters = document.getElementsByClassName("filter");
  for (let f = 0; f < filters.length; f += 1) {
    if (filters[f].checked) {
      if (f < 4) {
        checkedFilters_l.push(filters[f].value);
      } else {
        checkedFilters_r.push(filters[f].value);
      }
    }
  }
  //grabbing user weights
  let u_weights = document.getElementsByClassName("weight");
  let weights = [];
  for (let w = 0; w < u_weights.length; w += 1) {
    if (u_weights[w].value.length == 0) {
      weights.push(1);
    } else {
      weights.push(Number(u_weights[w].value));
    }
  }

  let already_grabbed = new Set();
  let left = [];
  let right = [];
  let final_left = [];
  let final_right = [];
  let winners = [];
  heroes.then(function(data) {
    data.forEach(function(d, i) {
      let left_sat = check_sat(0, d, checkedFilters_l, selectedOrgs);
      let right_sat = check_sat(1, d, checkedFilters_r, selectedOrgs);
      if (left_sat) {
        left.push(d);
      }
      if (right_sat) {
        right.push(d);
      }
    });

    lower_selection_number(
      already_grabbed,
      final_left,
      left,
      data,
      max_first_round / 2
    );
    lower_selection_number(
      already_grabbed,
      final_right,
      right,
      data,
      max_first_round / 2
    );

    final_chars = final_left.concat(final_right);

    let d1_left = final_chars.slice(0, max_first_round / 2);
    let d1_right = final_chars.slice(max_first_round / 2);
    winners = algorithm(final_chars, weights);
    winners_data = winners;
    show_characters(d1_left, "left", 1, y1 * 2);
    show_characters(d1_right, "right", 1, y1 * 2);
    start_animation(winners);
  });
}

/*
can_check_helper ensures that only one checkbox per filter topic is allowed. This
ensures that the user can't select hero and villian as a filter at the same time
(because no such character exists)

RETURNS: nothing
PARAMETERS: arr is a list of the input values of size 2. It contains the information of
                the checkbox inputs for a specific side and name (col)
            name is which column the user is filtering by (alignment or gender)
            previous is the previous_selection_i dictionary, where i is dependent on
                     which side is currently being checked
*/
function can_check_helper(arr, name, previous) {
  let yescheck = new Set();
  let f;
  for (let i = 0; i < 2; i += 1) {
    f = arr[i];
    if (f.checked) {
      yescheck.add(f);
    }
  }
  if (yescheck.size == 2) {
    let prev = previous[name];
    document.getElementById(prev.id).checked = false;
    yescheck.delete(prev);
    yescheck.forEach(function(cur) {
      previous[name] = cur;
    });
  } else if (yescheck.size == 1) {
    yescheck.forEach(function(f) {
      previous[name] = f;
    });
  } else {
    previous[name] = "";
  }
}

/*
    This function calls can_check_helper and determines if the filters the user
    has chosen is valid (e.g: can't choose both male and female)
*/
function can_check() {
  let filters = document.getElementsByClassName("filter");
  let arr = [];
  let previous = previous_selections_l;
  for (let f = 0; f < filters.length; f += 1) {
    arr.push(filters[f]);
    if ((f + 1) % 2 == 0) {
      if (f >= 4) {
        previous = previous_selections_r;
      }
      can_check_helper(arr, filters[f].name, previous);
      arr.length = 0;
    }
  }
}

// mix the ppls together, so that comapnies are not divided on left and right side
// potentially choose the characters from each company
// put in the limiting features from before (reasons for combining the 2 datasets)
// get rid of the reset hack lmao
// make the filters checkboxes so ppl can choose multiple things

//email jeff/3300-staff
//ask for help

//do the writeup
