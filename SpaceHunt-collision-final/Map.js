/*
Class represents individual tile on the canvas
*/
class Tile
{
    constructor()
    {
        this.val = 0;
        this.vis = false;
    }
}

/*
Class represents the whole map used for the game
*/
class Map
{
    constructor(mS)
    {
        this.mapSize = mS;
        this.map = [];
        this.maxAsteroids = 200;
        this.maxWorms = 200;
        this.maxStations = 500;
        this.maxFreighter = 500;
        this.maxMeteors = 25;

        //all new
        this.planetPlacer = {};
        this.planets_by_name = {};
        this.planets_by_coords = {};

        //planet logic
        //planet at 0,0 is Eniac
        this.planetPlacer[0] = {x: 0, type: "eniac"};
        this.planets_by_name["eniac"] = {x: 0, y: 0};
        this.planets_by_coords[[0,0]] = "eniac";
    }

    /*
    Helper function that returns tile object
    */
    getTile(x, y)
    {
        if(x >= 0 && x < this.mapSize && y >= 0 && y < this.mapSize)
            return this.map[x][y];
        else return null;
    }

    /*
    Helper function that builds initial planets
    */
    buildPlanets()
    {
        //figure out what quadrant the Pentium system will be in
        var pentium_x = Math.floor(Math.random()*2);
        var pentium_y = Math.floor(Math.random()*2);

        var i = 1;
        for(i; i < 8; i++)
        {
            var x = Math.floor(Math.random() * (this.mapSize/2)) + pentium_x*(this.mapSize/2);
            var y = Math.floor(Math.random() * (this.mapSize/2)) + pentium_y*(this.mapSize/2);
            if(this.planetPlacer[y] && this.planetPlacer[y].x == x)
                i--;
            else
            {
                this.planetPlacer[y] = {x: x, type: "pentium"+i}
                this.planets_by_name["pentium"+i] = {x: x, y: y};
                this.planets_by_coords[[x, y]] = "pentium"+i;
            }
        }

        i -= 7;
        var planet_names = ["celeron", "xeon", "ryzen"];

        for(var i = 0; i < 3; i++)
        {
            var x = Math.floor(Math.random() * this.mapSize);
            var y = Math.floor(Math.random() * this.mapSize);
            if(this.planetPlacer[y] && this.planetPlacer[y].x == x)
                i--;
            else
            {
                this.planetPlacer[y] = {x: x, type: planet_names[i]};
                this.planets_by_name[planet_names[i]] = {x: x, y: y};
                this.planets_by_coords[[x, y]] = planet_names[i];
            }
        }
    }

    /*
    Helper function that builds random map
    */
    buildRandom()
    {
        this.buildPlanets();

        for(var i = 0; i < this.mapSize; i++)
        {
            var row = [];
            for(var j = 0; j < this.mapSize; j++)
            {
                //Random position at which something will be placed
                var randPlacer = Math.floor(Math.random() * this.mapSize);
                //number of things e.g.: planets, holes, stations etc = # of colors
                var maxChoices = 6;
                //Gives a starting range for random num: e.g: 2-4
                var startAt = 0;
                //Create new tile
                var newTile = new Tile();

                /*
                if(i == 0 || j == 0 || i == this.mapSize - 1 || j == this.mapSize - 1)
                {
                    newTile.val = 0;
                    row.push(newTile);
                }
                */
                if(true)
                {
                    if(this.planetPlacer[j] && this.planetPlacer[j].x == i)
                    {
                      newTile.val = 111;
                      row.push(newTile);
                    }
                    else if(i == randPlacer || j == randPlacer)
                    {
                        if(this.maxWorms <= 0) { maxChoices--; startAt = 1; }
                        if(this.maxAsteroids <= 0) { maxChoices--; startAt = 2; }
                        if(this.maxStations <= 0) { maxChoices--; startAt = 3; }
                        if(this.maxFreighter <= 0) { maxChoices--; startAt = 4; }
                        if(this.maxMeteors <= 0) { maxChoices --; startAt = 5; }


                        var choice = Math.floor((Math.random() * maxChoices) + startAt);

                    
                        console.log(choice)

                        if(choice == 0) { this.maxWorms--; }
                        if(choice == 1) { this.maxAsteroids--; }
                        if(choice == 2) { this.maxStations--; }
                        if(choice == 4) { this.maxFreighter--; }
                        if(choice == 5) { this.maxMeteors--; }

                        // Siphoning out invalid values.
                        if(choice <= 5)
                            newTile.val = choice;
                        else
                            newTile.val = 3;

                        row.push(newTile);
                    }
                    else
                    {
                        newTile.val = 3;
                        row.push(newTile);
                    }
                }
            }
            this.map.push(row);
        }
    }

    /*
    Helper function that builds custom map
    */
    buildCustom()
    {
        this.buildPlanets();

        for(var i = 0; i < this.mapSize; i++)
        {
            var row = [];
            for(var j = 0; j < this.mapSize; j++)
            {
                //Create new tile
                var newTile = new Tile();
                if(true)
                {
                    if(this.planetPlacer[j] && this.planetPlacer[j].x == i)
                    {
                      newTile.val = 111;
                      row.push(newTile);
                    }
                    else if((String(i) + ':' + String(j)) in gameVars.object_list)
                    {
                        newTile.val = gameVars.object_list[String(i) + ':' + String(j)];
                        row.push(newTile);
                    }
                    else
                    {
                        newTile.val = 3;
                        row.push(newTile);
                    }
                }
            }
            this.map.push(row);
        }
    }

     /*
     Change the title to space from visited freighter and dock
     */
     removeTile(x,y)
     {
         this.map[x][y].val = 3;
         return;
     }

     /*
     Helper function that returns tuple of planet coordinates (for supplied planet name)
     */
     getPlanetByName(planet_name)
     {
       return this.planets_by_name[planet_name];
     }

     /*
     Helper function to get one of the main planets coordinates
     */
     getPlanetByCoords(x, y)
     {
       return this.planets_by_coords[[x,y]];
     }

    /*
    "Constructor" which takes an object, so it can be loaded from localStorage.
    */
    copyMap(obj)
    {
        this.map = obj.map;
        this.mapSize = obj.mapSize;
        this.maxAsteroids = obj.maxAsteroids;
        this.maxWorms = obj.maxWorms;
        this.maxStations = obj.maxStations;
        this.maxFreighter = obj.maxFreighter;
        //this.maxDock = obj.maxDock;

        this.planetPlacer = obj.planetPlacer;
        this.planets_by_name = obj.planets_by_name;
        this.planets_by_coords = obj.planets_by_coords;
    }
}
