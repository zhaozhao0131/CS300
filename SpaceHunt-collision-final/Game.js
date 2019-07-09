document.addEventListener("keydown", move);

var spaceshipUp = new Image();
/*
spaceshipUp.src = "images/spaceship.png";
spaceshipUp.width = 38;
spaceshipUp.height = 38;
*/

var spaceshipRight = new Image();
/*
spaceshipRight.src = "images/spaceshipRight.png";
spaceshipRight.width = 38;
spaceshipRight.height = 38;
*/

var spaceshipLeft = new Image();
/*
spaceshipLeft.src = "images/spaceshipLeft.png";
spaceshipLeft.width = 38;
spaceshipLeft.height = 38;
*/

var spaceshipDown = new Image();
/*
spaceshipDown.src = "images/spaceshipDown.png";
spaceshipDown.width = 38;
spaceshipDown.height = 38;
*/

var asteroid = new Image();
/*
asteroid.src = "images/Asteroid.png";
asteroid.width = 38;
asteroid.height = 38;
*/

var planet = new Image();
/*
planet.src = "images/azuria_norings.png";
planet.width = 38;
planet.height = 38;
*/

var station = new Image();
/*
station.src = "images/station.png";
station.width = 38;
station.height = 38;
*/


var freighter = new Image();
/*
freighter.src = "images/freighter.png";
freighter.width = 38;
freighter.height = 38;
*/

var wormhole = new Image();
/*
wormhole.src = "images/wormhole.png";
wormhole.width = 38;
wormhole.height = 38;
*/

//var dock = new Image();
/*
dock.src = "images/dock.png";
dock.width = 38;
dock.height = 38;
*/

var meteors = new Image();

var visited = [];  //Keeps visited coordinates
var visited_information = [];// Used to save and grab details of visited celestial artifacts for future load of game.

var currDistance = 0;  //Values for the movement

/*
All the game vars that are used throughout the game
*/
var gameVars =
{
    ctx:            null,
    cameraSize:     16,
    Ts:             608/16,
    ship:           null,
    gameMap:        null,

    //Vals supplied by Settings in the menu -
    //will be supplied in the create game and updated here
    fix_start:      false,
    startX:         1,
    startY:         1,
    init_energy:    1000,
    init_supplies:  100,
    init_credits:   1000,
    fix_wormhole:   false,
    unlim_game:     false,
    mapSize:        128,
    fix_objects:    false,
    object_list:    {}, //Dictionary of all objects and their locations
    saved_games:    [], //List of all saved game states.
    planets:        {} //Dictionary of planets
}

/*
Helper vars used initially in the game to distinguish different objects on the map (colors).
Number codes are still used to draw/encounter a particular object (number codes are used to distinguish objects)
*/
var objects =
{
    wormHole    :["red", 0],
    asteroid    :["green", 1],
    station     :["purple", 2],
    space       :["rgba(0,0,0,.8)", 3],
    planet      :["blue", 111],
    freighter   :["CHOCOLATE",4],
    meteors     :["white", 5],
    currColor   : null,

    //sets currColor to be used in drawGame()
    updateColor(index)
    {
        if(index == 0) { this.currColor = "red"; }
        else if(index == 1) { this.currColor = "green"; }
        else if(index == 2) { this.currColor = "purple"; }
        else if(index == 111){this.currColor = "blue"; }
        else if (index == 4){this.currColor = "CHOCOLATE";}
        else if(index == 5) {this.currColor = "white";}
        else { this.currColor = "rgba(0,0,0,.6)"; }
    }
};

//For minimap
var miniVars =
{
  ctx:    null,
  tileSize:   null,
}

/*
Helper function to load images
*/
function preloadImages()
{
  spaceshipUp.src = "images/spaceship.png";
  spaceshipUp.width = 38;
  spaceshipUp.height = 38;

  spaceshipRight.src = "images/spaceshipRight.png";
  spaceshipRight.width = 38;
  spaceshipRight.height = 38;

  spaceshipLeft.src = "images/spaceshipLeft.png";
  spaceshipLeft.width = 38;
  spaceshipLeft.height = 38;

  spaceshipDown.src = "images/spaceshipDown.png";
  spaceshipDown.width = 38;
  spaceshipDown.height = 38;

  asteroid.src = "images/Asteroid.png";
  asteroid.width = 38;
  asteroid.height = 38;

  planet.src = "images/azuria_norings.png";
  planet.width = 38;
  planet.height = 38;

  station.src = "images/station.png";
  station.width = 38;
  station.height = 38;

  freighter.src = "images/freighter.png";
  freighter.width = 38;
  freighter.height = 38;

  wormhole.src = "images/wormhole.png";
  wormhole.width = 38;
  wormhole.height = 38;

  meteors.src = "images/meteors.png";
  meteors.width = 38;
  meteors.height = 38;
}

/*
Helper function that sets the distance when scroller has been moved (IN-GAME)
*/
function updateDistance(newVal)
{
    currDistance = newVal;
}

/*
Function is called when MOVE button is pressed
*/
function startMovement(direction)
{
  //startMove(currDistance, currDegree);
  switch(direction)
  {
    //up
    case 0:
      startMove(0, (-1*currDistance));
      break;
    //down
    case 1:
      startMove(0, (currDistance));
      break;
    //left
    case 2:
      startMove((-1*currDistance), 0);
      break;
    //right
    case 3:
      startMove((currDistance), 0);
      break;
  }
}

/*
Helper function that activates the visibility sensor -> when button is pressed (IN-GAME)
*/
function callSensor()
{
    activate_sensor();
}

/*
Function taht loads saved game (from the main menu)
*/
function loadSaved(fS, Sl, iE, iS, iC, fW, uG, mS, fO)
{
  if(testPersist() === true)
  {
    preloadImages();
    i = 0;
    loadSaves();
    name = prompt("Your current saved games are: " + gameVars.saved_games + " \nPlease enter the name of the saved game you would like to load: ", " ");
    while((loadState(name) === false) && (i < 3))
    {
      name = prompt("Name entered is invalid, please try again: ", " ");
      i += 1
    }

    if(i == 3)
    {
      alert("Load unsuccessful. Press 'OK' to begin a new game.");

      createGame(init_game.fix_start, init_game.init_energy, init_game.init_supplies, init_game.init_credits,
          init_game.fix_wormhole, init_game.unlim_game, init_game.map_size, false);
    }

    gameVars.ctx = document.getElementById('game').getContext("2d");
    miniVars.ctx = document.getElementById('minimap').getContext("2d");
    miniVars.tileSize = (192/gameVars.mapSize);
    drawGame(38);

    if(i < 3)
      populate_gazetteer();
  }
  else
  {
    alert("You have no saved games! Press 'OK' to begin a new game.");
    //createGame(fS, iE, iS, iC, fW, uG, mS);
    createGame(init_game.fix_start, init_game.init_energy, init_game.init_supplies, init_game.init_credits,
               init_game.fix_wormhole, init_game.unlim_game, init_game.map_size, false);
  }
}

/*
Function used by loader to make sure that the gazetteer is
correctly populated based on visited celestial artifacts
from saved game.
*/
function populate_gazetteer()
{
  // Grab number of visited celestial artifacts.
  var num_visited = visited_information.length;

  // Loop through to add to HTML, so can be seen.
  for (var i = 0; i < num_visited; i++)
  {
    var ul = document.getElementById("list");
    var li = document.createElement("li");

    var knd = visited_information[i][2];
    var x = visited_information[i][0];
    var y = visited_information[i][1];

    li.appendChild(document.createTextNode("[" + x + ":" + y + "] " + knd));

    //li.setAttribute("id", "element4");
    ul.appendChild(li);
  }
}

/*
Function that creates and starts the game (called from the main menu)
*/
function createGame(fS, iE, iS, iC, fW, uG, mS, fO)
{
  preloadImages();

  gameVars.fix_start = fS;
  gameVars.init_energy = iE;
  gameVars.init_supplies = iS;
  gameVars.init_credits = iC;
  gameVars.fix_wormhole = fW;
  gameVars.unlim_game = uG;
  gameVars.mapSize = mS;
  gameVars.fix_objects = fO;

  gameVars.ship = new Ship(fS, iE, iS, iC, mS);
  gameVars.gameMap = new Map(mS);

  if(gameVars.fix_objects)
    gameVars.gameMap.buildCustom();
  else
    gameVars.gameMap.buildRandom();

  gameVars.ctx = document.getElementById('game').getContext("2d");

  miniVars.ctx = document.getElementById('minimap').getContext("2d");
  miniVars.tileSize = (192/mS);

  //add the planets to the initial list
  var eniac = gameVars.gameMap.getPlanetByName("eniac");
  addInitialObjects("Eniac", eniac.x, eniac.y);

  var celeron = gameVars.gameMap.getPlanetByName("celeron");
  addInitialObjects("Celeron", celeron.x, celeron.y);

  var xeon = gameVars.gameMap.getPlanetByName("xeon");
  addInitialObjects("Xeon", xeon.x, xeon.y);

  var ryzen = gameVars.gameMap.getPlanetByName("ryzen");
  addInitialObjects("Ryzen", ryzen.x, ryzen.y);

  makeVisible();
  drawGame(38);
}

/*
Helper function that preloads initial planets to the list (so that the user knows their location at start)
*/
function addInitialObjects(name, x, y)
{
  var currTile = gameVars.gameMap.getTile(x, y);

  var ul = document.getElementById("list");
  var li = document.createElement("li");

  li.appendChild(document.createTextNode("[" + x + ":" + y + "] " + name));

  ul.appendChild(li);
  visited.push(currTile);
  visited_information.push([x, y, name])
}

/*
Adds all the visited object to the list and appends in-code visited list (to not add to the on-screen list multiple times)
*/
function addObjectsToList(x, y)
{
  var currTile = gameVars.gameMap.getTile(x, y);
  if(currTile.val != 3 && !visited.includes(currTile) && !visited_information.includes[x, y, getObject(gameVars.gameMap.getTile(x, y).val)])
  {
    var ul = document.getElementById("list");
    var li = document.createElement("li");

    var knd = getObject(gameVars.gameMap.getTile(x, y).val);
    li.appendChild(document.createTextNode("[" + x + ":" + y + "] " + knd));

    ul.appendChild(li);
    visited.push(currTile);
    visited_information.push([x, y, knd])
  }
}

/*
Helper function to get kind of the object (e.g.: planet, station etc)
*/
function getObject(kind)
{
  switch(kind)
  {
    case 0:
      return "Wormhole";
    case 1:
      return "Asteroid";
    case 2:
      return "Station";
    case 4:
      return "Freighter";
    case 5:
      return "Meteor Shower";
    case 111:
      return "Planet"
    default:
      return "Unknown";
  }
}

/*
Helper function that adds a particular object on the map
*/
function addObject(obj)
{
  var entered = window.prompt("Where would you like to add the object?", "(0, 0)");
  var nums = entered.match(/\d+/g); //Regex for matching numbers, gets a list of strings containing only digits
  if (nums.length < 2)
   alert("Error: must provide an X and a Y coordinate");
  var x = nums[0];
  var y = nums[1];

  if((x + ':' + y) in gameVars.object_list)
  {
    alert("There's already something in that location!");
    return;
  }

  gameVars.object_list[(x + ':' + y)] = obj;
}

/*
Helper function that decreases ships health
*/
function descreaseHealth()
{
  gameVars.ship.health -= Math.floor(Math.random()*100)+50;
  if(gameVars.ship.health <= 0 && gameVars.unlim_game == false)
    die(3);
}

/*
Helper function that checks if ship has encountered some object (collided)
*/
function collision(x,y)
{
  var tile = gameVars.gameMap.getTile(x, y);
  var obj = tile.val; 

  switch(obj)
  {
    case 0:
      //Case 1: Wormhole is fixed -> worm to 25:25
      if(gameVars.fix_wormhole)
      {
        var middle = Math.floor(gameVars.mapSize/2)
        alert ('You hit a wormhole! Wormed to [' + middle +':' + middle + ']');
        gameVars.ship.posX = middle;
        gameVars.ship.posY = middle;
      }
      //Case 2: Random wormhole -> worm to random place on the map
      else
      {
        var new_x = Math.floor(Math.random() * gameVars.mapSize);
        var new_y = Math.floor(Math.random() * gameVars.mapSize);

        alert ('You hit a wormhole! Wormed to [' + new_x + ':' + new_y + ']');
        gameVars.ship.posX = new_x;
        gameVars.ship.posY = new_y;
      }
      return 'wormhole';
    case 1:
      //Hit an asteroid and died
      if(gameVars.unlim_game == true)
        alert("You hit an asteroid, BUT you are invincible. Play on!")
      else
        die(5);
      return null;
    case 2:
      var option = prompt ("Do you want to play a game with the Casinian to earn some reward credits (1) or buy some extra energies (2)?");
      if (option == 2) {
        space_station();
      }
      else if (option == 1) {
        alien();
      }
      else {
        alert ("You lost the chance of earning some credits. Better enter the correct number for choosing option next time");
      }
      //gameVars.gameMap.removeTile(x,y);
      //space_station();
      return 'station';
    case 4:
      var s = Math.floor(Math.random()*100)+20;
      var e = Math.floor(Math.random()*100)+50;
      alert("You took on the the abandoned freighter's " + s + " supplies and " + e + " energies.");
      gameVars.ship.energy += e; // increase energy by 5
      gameVars.ship.supplies += s;
      gameVars.gameMap.removeTile(x,y);
      return 'freighter';
    case 5:
      alert("Uh-oh, you hit one of those notorious meteor storms! Your ship has taken damage.")
      gameVars.ship.health = true;
      break;
    case 111:
      var planet = gameVars.gameMap.getPlanetByCoords(x, y);
      alert("This is planet " + planet);
      
      if(planet == "pentium5"){
        alert("You've found the secret recipe on planet pentium5! YOU WIN!");
        window.location.reload();
      }
  }
  return 'empty';
}

/*
Helper function that gets called when ship encounters alien ship
*/
function alien()
{
  var answer = prompt("Hey, I am a Casinian, do you want to play a game with me? You could earn a reward if you are lucky! (y or n)");
  if (answer == 'y' || answer == 'Y')
  {
    var keepgoing = true;
    while (keepgoing)
    {
      var input = prompt("Easy game. Guess my favorite number from 1-10. If you win, the number is your additional credits, but you will lose some energies if you lose")
      var result = Math.floor(Math.random() * 10 + 1)

      if (input == result)
      {
        alert("Wow, you have more luck than I thought. Here's your reward credits " + result)
        gameVars.ship.credits += result;
        keepgoing = false;
      }
      else
      {
        alert("Better luck next time! Your credit has been deducted by " + result)
        gameVars.ship.credits -= result;
        keepgoing = false;
      }
    }
  }
}

/*
Helper function that gets called when ship encounters space station
*/
function space_station()
{
  var energy_avaliable = Math.floor(Math.random() * 300);
  var price = energy_avaliable * 1.5;
  var answer = prompt("Welcome to the Musk-Tesla Energy Station! We have " + energy_avaliable + " units of energy to sell, for the low price of " + price + " credits! Would you like to purchase the energy? (Y/N)");

  if(answer.toUpperCase() == 'Y')
  {
    if(gameVars.ship.credits >= price)
    {
      gameVars.ship.energy += energy_avaliable;
      gameVars.ship.credits -= price;
      alert("Thanks for your purchase!");
    }
    else
      alert("Sorry, you don't have enough credits.")
  }
  else
    alert("Maybe another time!");

  if(gameVars.ship.health)
  {
    var answer = prompt("...we also noticed your ship is damaged. We can repair it for only 300 credits. Would you like your ship repaired?")

    if(answer.toUpperCase() == 'Y')
    {
      if(gameVars.ship.credits >= price)
      {
        gameVars.ship.health = false;
        gameVars.ship.credits -= 300;
        alert("Your ship is good as new!");
      }
      else
        alert("Sorry, you don't have enough credits.")
    }
    else
      alert("I hope you know what you're doing...");
  }
}

/*
Helper function that decreases energy
*/
function decreaseEnergy(dist)
{
  //Case 1: decrease energy up till 0 when unlimited play
  if(gameVars.unlim_game && gameVars.ship.energy > 0)
  {
    if(!gameVars.ship.health)
      //gameVars.ship.energy -= 10*Math.abs(dist);
        gameVars.ship.energy -= 10;
    else
      gameVars.ship.energy -= 50*Math.abs(dist);
  }
  //Case 2: else decrease till 0 and DIE
  else if(!gameVars.unlim_game)
  {
    if(!gameVars.ship.health)
      //gameVars.ship.energy -= 10*Math.abs(dist);
      gameVars.ship.energy -= 10;
    else
      gameVars.ship.energy -= 50*Math.abs(dist);
    if(gameVars.ship.energy <= 0)
      die(1);
  }
}

/*
Helper function that decreases supplies
*/
function decreaseSupplies()
{
  gameVars.ship.supplies -= 0.02*gameVars.ship.supplies;
  if(gameVars.ship.supplies <= 1 && gameVars.unlim_game == false)
    die(2);
}

/*
Helper function that alerts the user the reason of death (end of the game)
*/
function die(flag)
{
  // Catch-all to make sure unlimited play users do not 
  // end up dying.
  if(gameVars.unlim_game == false)
  {
    if(flag ==1)
    {
      alert("You run out of Energy. Game Over!");
      window.location.reload();
    }
    else if(flag ==2)
    {
      alert("You run out of Supplies. Game Over!");
      window.location.reload();
    }
    else if(flag ==3)
    { //this could add in decreasehealth() function.
      alert("You are destoryed and No health. Game Over!");
      window.location.reload();
    }
    else if(flag ==4)
    { //this cound add in BadMax choose kill ship.
      alert("You are killed by BadMax. Game Over!");
      window.location.reload();
    }
    else if(flag ==5)
    {
      alert("Asteroid collision destroyed your ship. Game Over!");
      window.location.reload();
    }
  }
}

/*
Main move function -> moves ship through space (does all the calculations):
Called when MOVE button is pressed
*/
function startMove(x, y)
{
  var newX = eval(gameVars.ship.posX) + eval(x);
  var newY = eval(gameVars.ship.posY) + eval(y);

  if(x != 0) { x /= Math.abs(x); }
  if(y != 0) { y /= Math.abs(y); }

  if((x != 0 && y != 0) && gameVars.ship != null)
    alert("Something is wrong");

  //only decrease supplies per "turn".
  //this logic should perhaps be on keypress in menu? that way any action
  //that takes a turn can call decreaseSupplies (scanning, going into orbit, docking with a station)
  //seems like cleaner control.
  decreaseSupplies();
  var gm = setInterval(function(){shipMove(gm, x, y, newX, newY);}, 1);

  gameVars.ship.energy += 10;
}

/*
Helper function that calculates direction of the ship movement:
left=37 up=38 right=39 down=40
*/
function calculateKeyCode(x, y)
{
  if(x < 0)
    return 37;
  else if(x > 0)
    return 39;
  else if(y < 0)
    return 38;
  else
    return 40;
}

/*
Helper function to move the ship throug space:
Called from startMove() function
*/
var shipMove = function(gm, x, y, newX, newY)
{
  var nextX = gameVars.ship.posX + x;
  var nextY = gameVars.ship.posY + y;
  var tileOccupant = 'empty';

  decreaseEnergy(1);

  //wormhole behavior
  if((nextX < 0 && newX < 0) || (nextX >= gameVars.mapSize && newX >= gameVars.mapSize) || (newY < 0 && nextY < 0) || (newY >= gameVars.mapSize &&nextY >= gameVars.mapSize))
  {
    outOfMap();
    makeVisible();
    drawGame(calculateKeyCode(x, y));
    clearInterval(gm);
    alert("You wormholed!");
  }
  //non wormhole behavior - still need to move
  else if(gameVars.ship.posX != newX || gameVars.ship.posY != newY)
  {
    gameVars.ship.move(nextX, nextY);
    makeVisible();
    drawGame(calculateKeyCode(x, y));

    //needs to be in this wrapper to avoid scope issues i think?
    if(gameVars.ship != null) { tileOccupant = collision(gameVars.ship.posX, gameVars.ship.posY); }

    if(tileOccupant != 'empty')
    {
      clearInterval(gm);

      if(tileOccupant == 'wormhole')
      {
        if(gameVars.fix_wormhole)
          gameVars.ship.move(Math.floor(gameVars.mapSize / 2), Math.floor(gameVars.mapSize / 2));
        else
          gameVars.ship.move(Math.floor(Math.random() * (gameVars.mapSize - 2)), Math.floor(Math.random() * (gameVars.mapSize - 2)));

        makeVisible();
        drawGame(calculateKeyCode(x, y));
        clearInterval(gm);
        alert("You wormholed!");
      }
    }
  }

  //only other option is that we're done moving and have arrived at our location
  else
  {
    //getting rid of this cause its too annoying    alert("You have arrived at ("+newX+','+newY+').');
    clearInterval(gm);
  }

}

/*
Test function that accepts keyboard input
*/
function move(e)
{
  e.preventDefault();

  switch(e.keyCode)
  {
    case 37:
      if(gameVars.ship.posX - 1 >= 0 && gameVars.ship.posX - 1 <= gameVars.mapSize-1)
      {
        gameVars.ship.posX = gameVars.ship.posX-1;
        collision(gameVars.ship.posX, gameVars.ship.posY);
      }
      else
        outOfMap();
      break;
    case 38:
      if(gameVars.ship.posY - 1 >= 0 && gameVars.ship.posY - 1 <= gameVars.mapSize-1)
      {
        gameVars.ship.posY = gameVars.ship.posY-1;
        collision(gameVars.ship.posX, gameVars.ship.posY);
      }
      else
        outOfMap();
      break;
    case 39:
      if(gameVars.ship.posX + 1 >= 0 && gameVars.ship.posX + 1 <= gameVars.mapSize-1)
      {
        gameVars.ship.posX = gameVars.ship.posX+1;
        collision(gameVars.ship.posX, gameVars.ship.posY);
      }
      else
        outOfMap();
      break;
    case 40:
      if(gameVars.ship.posY + 1 >= 0 && gameVars.ship.posY + 1 <= gameVars.mapSize-1)
      {
        gameVars.ship.posY = gameVars.ship.posY+1;
        collision(gameVars.ship.posX, gameVars.ship.posY);
      }
      else
        outOfMap();
      break;
    default: break;
  }
  decreaseEnergy(1);
  decreaseSupplies();
  makeVisible();
  drawGame(e.keyCode);
}

/*
Helper function for wormhole behavior when ship moves out of the map
*/
function outOfMap()
{
  if(gameVars.fix_wormhole)
  {
    gameVars.ship.posX = Math.floor(gameVars.mapSize / 2);
    gameVars.ship.posY = Math.floor(gameVars.mapSize / 2);
  }
  else
  {
    gameVars.ship.posX = Math.floor(Math.random() * gameVars.mapSize);
    gameVars.ship.posY = Math.floor(Math.random() * gameVars.mapSize);
  }
}

/*
Helper function to make tiles in range 2 from the ship visible:
Called from drawGame() function
*/
function makeVisible()
{
  for(var i = -1; i < 2; i++)
  {
    for(var j = -1; j < 2; j++)
    {
      if(gameVars.ship.posX + i >= 0 && gameVars.ship.posX + i <= gameVars.mapSize-1 && gameVars.ship.posY + j >= 0 && gameVars.ship.posY + j <= gameVars.mapSize-1)
      {
        var sensTile = gameVars.gameMap.getTile(gameVars.ship.posX + i, gameVars.ship.posY + j);
        addObjectsToList(gameVars.ship.posX + i, gameVars.ship.posY + j)
        sensTile.vis = true;
      }
    }
  }
}

/*
Helper function to make tiles in range 2 from the ship visible:
Called when ENGAGE SENSOR button is pressed
*/
function activate_sensor()
{
    var pos_x = gameVars.ship.posX;
    var pos_y = gameVars.ship.posY;

    for(var i = -2; i < 3; i++)
    {
        for(var j = -2; j < 3; j++)
        {
            if(pos_x + i >=0 && pos_x + i <= gameVars.mapSize-1 && pos_y + j >= 0 && pos_y + j <= gameVars.mapSize-1)
            {
                var sensTile = gameVars.gameMap.getTile(pos_x + i, pos_y + j);
                addObjectsToList(pos_x + i, pos_y + j);
                sensTile.vis = true;
            }
        }
    }
    gameVars.ship.consume_supplies(0.02);

    if(gameVars.ship.supplies < 1)
      die(2)
    drawGame(38);
}

/*
Function that draws the game (canvas and all elements on it)
*/
function drawGame(drctn)
{
  var ts = gameVars.Ts;
  var offX = 0;
  var offY = 0;

  //clear the canvas before redrawing
  gameVars.ctx.clearRect(0,0, 608,608);

  //Case 1: offset top left(x,y) to not display out of bounds "black" map
  //Basically display starts a bit lower to not go out of bounds
  if(gameVars.ship.posX - 8 < 0) { offX = (8 - gameVars.ship.posX); }
  if(gameVars.ship.posY - 8 < 0) { offY = (8 - gameVars.ship.posY); }

  //Case 2: offset top left(x,y) to not display out of bounds "black" mao
  //Basically display starts a bit higher to not go out of bounds
  if(gameVars.ship.posX + 8 > gameVars.mapSize) { offX = -(gameVars.ship.posX - (gameVars.mapSize - 8)); }
  if(gameVars.ship.posY + 8 > gameVars.mapSize) { offY = -(gameVars.ship.posY - (gameVars.mapSize - 8)); }

  var pos =
  {
    x: 0,
    y: 0,
  }

  drawMini();

  for(var x = 0; x < gameVars.cameraSize; x++)
  {
    for(var y = 0; y < gameVars.cameraSize; y++)
    {
      pos.x =  Math.round((gameVars.ship.posX) - gameVars.cameraSize/2) + x + offX;
      pos.y =  Math.round((gameVars.ship.posY) - gameVars.cameraSize/2) + y + offY;

      var tile = gameVars.gameMap.getTile(pos.x, pos.y);

      //If this is ships coords
      if(pos.x == gameVars.ship.posX && pos.y == gameVars.ship.posY)
      {
        //Draw the ship
        if(drctn == 38) gameVars.ctx.drawImage(spaceshipUp, x*ts, y*ts, ts, ts);
        else if(drctn == 40) gameVars.ctx.drawImage(spaceshipDown, x*ts, y*ts, ts, ts);
        else if(drctn == 37) gameVars.ctx.drawImage(spaceshipLeft, x*ts, y*ts, ts, ts);
        else gameVars.ctx.drawImage(spaceshipRight, x*ts, y*ts, ts, ts);
      }
      //Else something besides ship
      else
      {
        if(!tile.vis)
        {
          gameVars.ctx.fillStyle = "#848484";
          gameVars.ctx.fillRect(x * ts, y * ts, ts, ts);
        }
        else
        {
          if(tile.val == 0)
            gameVars.ctx.drawImage(wormhole, x*ts, y*ts, ts, ts);
          else if(tile.val == 1)
            gameVars.ctx.drawImage(asteroid, x*ts, y*ts, ts, ts);
          else if(tile.val == 2)
            gameVars.ctx.drawImage(station, x*ts, y*ts, ts, ts);
          else if(tile.val == 4)
            gameVars.ctx.drawImage(freighter, x*ts, y*ts, ts, ts);
          else if(tile.val == 5)
            gameVars.ctx.drawImage(meteors, x*ts, y*ts, ts, ts);
          else if(tile.val == 111)
            gameVars.ctx.drawImage(planet, x*ts, y*ts, ts, ts);
        }

        gameVars.ctx.strokeStyle = "blue";
        gameVars.ctx.strokeRect(x * ts, y * ts, ts, ts);
      }
    }
  }

  gameVars.ctx.font = "20px Georgia";

  if(gameVars.ship.health)
  {
    gameVars.ctx.fillStyle = "white";
    gameVars.ctx.fillText("Your ship has been damaged.", 20, 590);
  }
  else
  {
    gameVars.ctx.fillStyle = "white";
    gameVars.ctx.fillText("Your ship is in excellent condition.", 20, 590);
  }
/*
  gameVars.ctx.fillStyle = "white";
  gameVars.ctx.fillText("Health: " + gameVars.ship.health, 20, 490);
*/
  gameVars.ctx.fillStyle = "white";
  gameVars.ctx.fillText("Energy: " + gameVars.ship.energy, 20, 515);

  gameVars.ctx.fillStyle = "white";
  gameVars.ctx.fillText("Supplies: " + Math.round(gameVars.ship.supplies) + "%", 20, 540);

  gameVars.ctx.fillStyle = "white";
  gameVars.ctx.fillText("Credits: " + gameVars.ship.credits , 20, 565);

  gameVars.ctx.fillStyle = "white";
  gameVars.ctx.fillText("Position: " + gameVars.ship.posX + ":" + gameVars.ship.posY, 450, 590);
}

/*
Helper function that draws mini map of the canvas:
Is called from drawGame() function
*/
function drawMini()
{
  //clear mini canvas before drawing again
  miniVars.ctx.clearRect(0,0, 192, 192);
  var ts = miniVars.tileSize;
  for(var i = 0; i <= gameVars.mapSize-1; i++)
  {
    for(var j = 0; j <= gameVars.mapSize-1; j++)
    {
      var tile = gameVars.gameMap.getTile(i, j);

      //If this is ships coords
      if(i == gameVars.ship.posX && j == gameVars.ship.posY)
      {
        //Ensure correct background is shown
        objects.updateColor(tile.val);

        miniVars.ctx.fillStyle = "yellow";//objects.currColor;
        miniVars.ctx.fillRect(i * ts, j * ts, ts, ts);
      }
      else
      {
        if(!tile.vis) { miniVars.ctx.fillStyle = "rgba(100,100,100,.7)"; }
        else
        {
          objects.updateColor(tile.val);
          miniVars.ctx.fillStyle = objects.currColor;
        }
        miniVars.ctx.fillRect(i * ts, j * ts, ts, ts);
      }
    }
  }
}
