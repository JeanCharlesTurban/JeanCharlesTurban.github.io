
d3.csv("data3.csv").then( function(data) {
  let fightdata = data;
  fightdata.forEach( (d) => {
    d['Intelligence'] = Number(d['Intelligence']);
    d['Strength'] = Number(d['Strength']);
    d['Speed'] = Number(d['Speed']);
    d['Durability'] = Number(d['Durability']);
    d['Power'] = Number(d['Power']);
    d['Combat'] = Number(d['Combat']);
    d['Height'] = Number(d['Height']);
    d['Weight'] = Number(d['Weight']);
    });

    avgH = d3.median(fightdata, function(d) {return d['Height']; });
    avgW = d3.median(fightdata, function(d) {return d['Weight']; });

    namelist = []
    for(i=0; i < fightdata.length;i++) {
        namelist.push(fightdata[i].Name)
      }

    fighter1a = "Spider-Man";
    fighter2b = "Harry Potter";

    //d1_left  array of 16 dictionaries d1_left[0].name
    //d2_right  array of 16 dictionaries d2_right[0].name
    //n n+1

    function fightBro(fighter1, fighter2) {
      let player1 = fightdata[namelist.indexOf(fighter1)];
      let player2 = fightdata[namelist.indexOf(fighter2)];

      am = 1;
      bm = 1;
      cm = 1;
      dm = 1;
      tm = 1;

      a1 = ((player1.Power)+(player1.Strength)+(player1.Combat))/300;
      b1 = (player1.Height/avgH)+(player1.Weight/avgW)/2;
      c1 = (player1.Durability)/100;
      d1 = ((player1.Intelligence)+(player1.Speed))/200;
      t1 = player1.Tier;

      a2 = ((player2.Power)+(player2.Strength)+(player2.Combat))/300;
      b2 = (player2.Height/avgH)+(player2.Weight/avgW)/2;
      c2 = (player2.Durability)/100;
      d2 = ((player2.Intelligence)+(player2.Speed))/200;
      t2 = player2.Tier;

      n1 = (((bm*b1)+(cm*c1))/((am*a2)*(dm*d2)))*((t1/t2)*tm);
      n2 = (((bm*b2)+(cm*c2))/((am*a1)*(dm*d1)))*((t2/t1)*tm);

      console.log(a1 + " " + b1 + " " + c1 + " " + d1 + " " + t1);
      console.log(a2 + " " + b2 + " " + c2 + " " + d2 + " " + t2)
      console.log(n1);
      console.log(n2);

      if(n2 > n1) {
        console.log(player2.Name + " Wins");
      }
      else {
        console.log(player1.Name + " Wins");
      }



    }

    fightBro(fighter1a,fighter2b);




})
