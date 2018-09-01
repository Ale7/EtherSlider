(function() {
  var Blank, Puzzle, Tile, __bind = function(fn, me){ 
    return function(){ 
      return fn.apply(me, arguments); 
    }; 
  };

  Puzzle = (function() {
    function Puzzle(images) {
      var i, image, t, x, y, _i, _j, _len, _ref, _this = this;

      var ss = document.getElementsByClassName('stopwatch');

      [].forEach.call(ss, function (s) {
        var currentTimer = 0,
		solveTime = 0,
        interval = 0,
        lastUpdateTime = new Date().getTime(),
        start = s.querySelector('button.start'),
        stop = s.querySelector('button.stop'),
        mins = s.querySelector('span.minutes'),
        secs = s.querySelector('span.seconds'),
        cents = s.querySelector('span.centiseconds');
        this.currentTimer = currentTimer;
        this.interval = interval;
        this.lastUpdateTime = lastUpdateTime;
		this.solveTime = solveTime;
        this.start = start;
        this.stop = stop;
        this.mins = mins;
        this.secs = secs;
        this.cents = cents;
      });           
    
      this.images = images;
      this.changeImage = __bind(this.changeImage, this);
      this.switchTwo = __bind(this.switchTwo, this);
      this.renderBoard = __bind(this.renderBoard, this);
      this.blankPosition = __bind(this.blankPosition, this);
      this.checkIfWon = __bind(this.checkIfWon, this);
      this.mix = __bind(this.mix, this);
      this.places = [];
      this.initialPlaces = [];
      
      _ref = this.images;
      
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        image = _ref[_i];
      }
      
      //Select which image to use for puzzle
      this.image = this.images[0];
      
      $('.mini').bind('click', function(event) {
        return _this.changeImage(event.target.src);
      });
      
      for (i = _j = 0; _j <= 7; i = ++_j) {
        x = Math.floor(i % 3) * 240;
        y = Math.floor(i / 3) * 240;
        t = new Tile(i, 240, 240, x, y, this.image);
        this.places.push(t);
      }
      
      this.places.push(new Blank(8));
      this.initialPlaces = this.places.slice(0);
      this.init();
	  this.startTimer();
    }
    
    Puzzle.prototype.newPuzzle = function() {
        this.places = [];
        
        var i, _j;
        
        for (i = _j = 0; _j <= 7; i = ++_j) {
          x = Math.floor(i % 3) * 240;
          y = Math.floor(i / 3) * 240;
          t = new Tile(i, 240, 240, x, y, this.image);
          this.places.push(t);
        }
      
      this.places.push(new Blank(8));
      this.initialPlaces = this.places.slice(0);
      this.init();
    };

    Puzzle.prototype.pad = function(n) {
        return ('00' + n).substr(-2);
    };

    Puzzle.prototype.update = function() {
        var now = new Date().getTime(),
            dt = now - lastUpdateTime;

        currentTimer += dt;

        var time = new Date(currentTimer);

        mins.innerHTML = time.getMinutes();
        secs.innerHTML = time.getSeconds();
        cents.innerHTML = Math.floor(time.getMilliseconds() / 10);

        lastUpdateTime = now;
    };

    Puzzle.prototype.startTimer = function() {
        if (!interval) {
            lastUpdateTime = new Date().getTime();
            interval = setInterval(this.update, 1);
        }
    };

    Puzzle.prototype.stopTimer = function() {
        clearInterval(interval);
        interval = 0;
    };
    
    Puzzle.prototype.mix = function() {
      var blankpos, randomNum, results;
      blankpos = 8;
      results = [];
      
      for (i = 0; i < 10; i++) {
        randomNum = Math.floor(Math.random() * 9);
        this.switchTwo(randomNum, blankpos);
        results.push(blankpos = randomNum);
      }
    };
    
    Puzzle.prototype.checkSolvable = function(results) {
        var inversions = 0;
        
         for(i = 0; i < results.length - 1; i++) {
            for(j = i + 1; j < results.length; j++) {
                if(results[i] > results[j]) {
                    inversions++;
                }
            }
        }
        if (inversions % 2 === 0) {
            return true;
        } else {
            return false;
        }
    };
    
    Puzzle.prototype.coordsToNum = function(x, y) {
        var ret;
        ret = (y / 240) * 3 + (x / 240) + 1;
        if (isNaN(ret)) {
            ret = 9;
        }
        return ret;
    };
    
    Puzzle.prototype.init = function() {
      var puzzleStart;
      var key;
      var counter = 0;
      this.mix();

      myObj = this.places;
      pieces = [];
      for(i = 0; i < 9; i++) {
          _x = myObj[i].x;
          _y = myObj[i].y;
          if (this.coordsToNum(_x, _y) != 9) {
            pieces[counter] = this.coordsToNum(_x, _y); 
            counter++;
          } 
      } 
      
      if (this.checkSolvable(pieces) === false) {
          puzzleStart = this.newPuzzle();
      }
      
      return puzzleStart;
    };

    Puzzle.prototype.checkIfWon = function() {
      var i, _i;
      for (i = _i = 0; _i <= 8; i = ++_i) {
        if (this.places[i] === this.initialPlaces[i]) {
          continue;
        } else {
          return false;
        }
      }
      this.stopTimer();
      solveTime = currentTimer;
      console.log(this.pieces);
      console.log(solveTime);      
      return true;
    };

    Puzzle.prototype.blankPosition = function() {
      var place, pos, _i, _len, _ref;
      _ref = this.places;
      for (pos = _i = 0, _len = _ref.length; _i < _len; pos = ++_i) {
        place = _ref[pos];
        if (place["class"] === 'Blank') {
          return pos;
        }
      }
    };

    Puzzle.prototype.renderBoard = function() {
      var blank, t, _i, _len, _ref,
        _this = this;
      blank = this.blankPosition();
      $('#canvas').html('');
      if (this.checkIfWon()) {
        $('#canvas').append('<span id="windiv"><img src="' + this.image + '"/><div class="banner"> Completed!</div></span><button onclick="myFunction()">Submit Time</button>');
		return $('#windiv').show('slow');
      } else {
        _ref = this.places;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          t = _ref[_i];
          t.show(blank);
        }
        return $('.clickable').bind('click', function(event) {
          var toSwitch;
          toSwitch = parseInt(event.target.id);
          return _this.switchTwo(toSwitch, _this.blankPosition());
        });
      }
    };

    Puzzle.prototype.switchTwo = function(pos1, pos2) {
      var x, y;
      x = this.places[pos1];
      y = this.places[pos2];
      this.places[pos2] = x;
      this.places[pos1] = y;
      this.places[pos2].position = pos2;
      return this.renderBoard();
    };

    Puzzle.prototype.changeImage = function(image) {
      var panel, _i, _len, _ref;
      this.image = image;
      _ref = this.places;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        panel = _ref[_i];
        if (panel["class"] !== 'Blank') {
          panel.image = image;
        }
      }
      return this.renderBoard();
    };

    return Puzzle;

  })();

  Tile = (function() {
    function Tile(position, width, height, x, y, image) {
      this.position = position;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
      this.image = image;
      this["class"] = 'Tile';
    }

    Tile.prototype.show = function(blankPosition) {
      if (this.isAdjacent(blankPosition)) {
        $('#canvas').append('<div id="' + this.position + '" class="innerSquare imageSquare clickable"></div>');
      } else {
        $('#canvas').append('<div id="' + this.position + '" class="innerSquare imageSquare"></div>');
      }
      $("#" + this.position).css('background-position', '-' + this.x + 'px -' + this.y + 'px');
      return $("#" + this.position).css('background-image', 'url(' + this.image + ')');
    };

    Tile.prototype.isAdjacent = function(blanksPosition) {
      if (blanksPosition - 1 === this.position && (blanksPosition % 3) > 0 || blanksPosition + 1 === this.position && (blanksPosition % 3) < 2 || blanksPosition + 3 === this.position && (blanksPosition / 3) < 2 || blanksPosition - 3 === this.position && (blanksPosition / 3) > 0) {
        return true;
      }
      return false;
    };

    Tile.prototype.setImage = function(image) {
      return this.image = image;
    };

    return Tile;

  })();

  Blank = (function() {
    function Blank(position) {
      this.position = position;
      this["class"] = 'Blank';
    }

    Blank.prototype.show = function() {
      return $('#canvas').append('<div class="innerSquare blank"></div>');
    };

    return Blank;

  })();

  $(document).ready(function() {
    var imgs, puzzle;
    imgs = ['img/img1.png'];
    return puzzle = new Puzzle(imgs);
  });

}).call(this);