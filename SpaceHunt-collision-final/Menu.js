/*
All the varialbes with which new/loaded game will be initialized
*/
var init_game =
{
    fix_start:        false,
    startX:           1,
    startY:           1,
    init_energy:      1000,
    init_supplies:    100,
    init_credits:     1000,
    fix_wormhole:     false,
    unlim_game:       false,
    map_size:         128,
    fix_objects:      false
}

/*
New Game function (gets called when New Game button is pressed)
*/
var runGame = function()
{
    document.getElementById("newGame").style.display = "none";
    document.getElementById("theHead").style.display = "none";
    document.getElementById("credits").style.display = "none";
    document.getElementById("main").style.display = "block";
    document.getElementById("creditBtn").style.display = "none";
    document.getElementById("settBtn").style.display = "none";
    document.getElementById("loadBtn").style.display = "none";

    createGame(init_game.fix_start, init_game.init_energy, init_game.init_supplies, init_game.init_credits,
               init_game.fix_wormhole, init_game.unlim_game, init_game.map_size, init_game.fix_objects);

    document.getElementById("distScroll").style.display = "block";
    document.getElementById("upBtn").style.display = "block";
    document.getElementById("downBtn").style.display = "block";
    document.getElementById("leftBtn").style.display = "block";
    document.getElementById("rightBtn").style.display = "block";
    document.getElementById("sensBtn").style.display = "block";
    document.getElementById("saveBtn").style.display = "block";
    document.getElementById("list").style.display = "block";
    //document.getElementById("music").style.display = "block";
};

/*
Credits function (currently displays testing)
*/
var showCredits = function()
{
    document.getElementById("theHead").style.display = "none";
    document.getElementById("creditBtn").style.display = "none";
    document.getElementById("newGame").style.display = "none";
    document.getElementById("credits").style.display = "block";
    document.getElementById("backBtn").style.display = "block";
    document.getElementById("settBtn").style.display = "none";
    document.getElementById("loadBtn").style.display = "none";

    var sett = document.getElementsByClassName("stngs");
    for(var i = 0; i < sett.length; i++)
        sett[i].style.display = "none";
};

/*
Go Back function (gets called when Back button is pressed)
*/
var goBack = function()
{
    document.getElementById("backBtn").style.display = "none";
    document.getElementById("credits").style.display = "none";
    document.getElementById("theHead").style.display = "block";
    document.getElementById("newGame").style.display = "block";
    document.getElementById("settBtn").style.display = "block";
    document.getElementById("creditBtn").style.display = "block";
    document.getElementById("loadBtn").style.display = "block";

    var sett = document.getElementsByClassName("stngs");
    var opt = document.getElementsByClassName("optional");
    for(var i = 0; i < sett.length; i++)
        sett[i].style.display = "none";
    for(var i = 0; i < opt.length; i++)
        opt[i].style.display = "none";
};

/*
Setting function (gets called when Settings button is pressed)
*/
var settMen = function()
{
    document.getElementById("theHead").style.display = "none";
    document.getElementById("creditBtn").style.display = "none";
    document.getElementById("newGame").style.display = "none";
    document.getElementById("credits").style.display = "none";
    document.getElementById("settBtn").style.display = "none";
    document.getElementById("loadBtn").style.display = "none";

    var sett = document.getElementsByClassName("stngs");

    for(var i = 0; i < sett.length; i++)
        sett[i].style.display = "block";

    document.getElementById("backBtn").style.display = "block";
};

/*
Helper function that changes initial energy on user input in Setting
*/
function changeEnergy(newEnergy)
{
    document.getElementById("energyOut").innerHTML = newEnergy;
    init_game.init_energy = newEnergy;
}

/*
Helper function that changes initial supplies on user input in Settings
*/
function changeSupplies(newSupplies)
{
    document.getElementById("suppliesOut").innerHTML = newSupplies;
    init_game.init_supplies = newSupplies;
}

/*
Helper function that changes initial credits on user input in Settings
*/
function changeCredits(newCredits)
{
    document.getElementById("creditsOut").innerHTML = newCredits;
    init_game.init_credits = newCredits;
}

/*
Helper function that changes the size/dimensions of the initial map on user input in Settings
*/
function changeMap(newMap)
{
    document.getElementById("mapOut").innerHTML = newMap;
    init_game.map_size = newMap;
}

/*
Helper function that changes the initial starting position of the ship to user input coordinates in Settings
*/
function changeStartPos(isFixed)
{
    init_game.fix_start = isFixed;
    if(isFixed)
      document.getElementById("setStart").style.display="block"
    else
      document.getElementById("setStart").style.display="none"
}

/*
Helper function the the ChangeStartPos -> accepts user input for starting position (in Settings)
*/
function setStartPos()
{
  var entered = window.prompt("Where would you like to start?", "(" + gameVars.startX + ", " + gameVars.startY + ")");
  var nums = entered.match(/\d+/g); //Regex for matching numbers, gets a list of strings containing only digits
  if (nums.length < 2)
   alert("Error: must provide an X and a Y coordinate");
  var x = parseInt(nums[0]);
  var y = parseInt(nums[1]);

  gameVars.startX = x;
  gameVars.startY = y;
}

/*
Helper function that changes wormhole behavior on the map -> toggle switch in Settings
*/
function changeWormBehav(isFixed)
{
    init_game.fix_wormhole = isFixed;
}

/*
Helper function that changes unlimited/god mode -> toggle switch in Settings
*/
function changeUnlim(isFixed)
{
    init_game.unlim_game = isFixed;
}

/*
Helper function that changes the initial map settings (random/custom) and interacts with user for the custom map settings -> in Settings
*/
function changeFixMap(isFixed)
{
    init_game.fix_objects = isFixed;
    if(isFixed)
    {
      document.getElementById("addWorm").style.display="block";
      document.getElementById("addStation").style.display="block";
      document.getElementById("addAst").style.display="block";
      document.getElementById("addFreighter").style.display="block";
      document.getElementById("addMeteors").style.display="block";
    }

    else
    {
      document.getElementById("addWorm").style.display="none";
      document.getElementById("addStation").style.display="none";
      document.getElementById("addAst").style.display="none";
      document.getElementById("addFreighter").style.display="none";
      document.getElementById("addMeteors").style.display="none";

    }
}

/*
Helper function that gets called when SUBMIT COURSE button is pressed (in-game)
*/
function submitCourse(direction)
{
    startMovement(direction);
}

/*
Helper function that accepts user input for the distance to travel -> range input slider: in-game
*/
function changeDistance(newDistance)
{
    document.getElementById("distanceOut").innerHTML = newDistance;
    updateDistance(newDistance);
}

/*
Helper function that gets called when ACTIVATE/ENGAGE SENSOR button is pressed: in-game
*/
function submitSensor()
{
    callSensor();
}

/*
Function that gets called when Load button is pressed (main Menu)
*/
function load()
{
    loadSaved(init_game.fix_start, init_game.start_loc, init_game.init_energy, init_game.init_supplies,
              init_game.init_credits, init_game.fix_wormhole, init_game.unlim_game, init_game.map_size,
              init_game.fix_objects);

    document.getElementById("newGame").style.display = "none";
    document.getElementById("theHead").style.display = "none";
    document.getElementById("credits").style.display = "none";
    document.getElementById("main").style.display = "block";
    document.getElementById("creditBtn").style.display = "none";
    document.getElementById("settBtn").style.display = "none";
    document.getElementById("loadBtn").style.display = "none";

    document.getElementById("distScroll").style.display = "block";
    document.getElementById("upBtn").style.display = "block";
    document.getElementById("downBtn").style.display = "block";
    document.getElementById("leftBtn").style.display = "block";
    document.getElementById("rightBtn").style.display = "block";
    document.getElementById("sensBtn").style.display = "block";
    document.getElementById("saveBtn").style.display = "block";
    document.getElementById("list").style.display = "block";
    //document.getElementById("music").style.display = "block";

    drawGame();
}

/*
Helper function that gets called when user presses SAVE button: in-game
*/
function save()
{
    name = prompt("Please enter a name for your game: ", "My Game");

    loadSaves();

    if(gameVars.saved_games != null)
    {
        while(gameVars.saved_games.includes(name))
        {
            name = prompt("You already have a game named " + name + ". Please choose a different name.");
        }
    }
    
    //gameVars.saved_games.push(name);
    saveState(name)
}
