//가등급 7~8세트 게임
var SVG = Snap('#my-svg');

// 최상위 그룹
var Paper = SVG.g();

//이미지
var hidari = Paper.image('img/hidari.png', 0, 0, 21, 23).toDefs();
var migi = Paper.image('img/migi.png', 0, 0, 21, 23).toDefs();
var direction = Paper.image('img/direction.png', 0, 0, 25, 30).toDefs();

var Library = {
  //SVG 외곽선
  drawLayout: function() {
    Paper.rect(0, 0, 360, 640).attr({
      'stroke': 'gray',
      'fill': 'none',
      'rx': 6,
      'ry': 6
    });

    // 상단 바 부분
    var topBox = Paper.g();

    topBox.path('M1 40 L359 40 L359 0 Q358 1 358 1 L1 1').attr({
      'fill': '#E8EBEE'
    });
    topBox.text(180, 27, '9까지의 수(세어 보기)').attr({
      'font-size': 18,
      'text-anchor': 'middle'
    });

    hidari.use().transform('t10, 9').appendTo(topBox).click(handlerPre).attr({
      'cursor': 'pointer'
    });

    function handlerPre() {
      location.replace('2korean00.html');
    }

    migi.use().transform('t325, 9').appendTo(topBox).click(handlerPre).attr({
      'cursor': 'pointer'
    });

    direction.use().transform('t12, 55').appendTo(topBox);
    topBox.text(43, 78, '같은 수를 세는 방법끼리 짝지어 보세요.').attr({
      'font-size': 17,
    });

  },

  //////////////////////////////////////////////////////////////////////////////////////////////
  generatePairGame: function(params) {
    var condition = params.condition;
    var pairInfo = {};
    var gameData = data.slice();
    var paper = Paper.g();

    gameData = gameData.filter(function(el) {
      if (el.jei_set.indexOf(condition.grade) === -1) return false;
      var setNum = Number(el.jei_set.slice(1, 3));
      if (setNum < condition.setRange[0] || condition.setRange[1] < setNum) return false;
      return true;
    });
    gameData = shuffle(gameData).slice(0, 9);

    return gameData;

    function shuffle(arr) {
      return arr.sort(function() {
        return Math.random() - 0.5;
      });
    }
  },

  drawPairGame: function(params) {
    var paper = params.paper.g();
    var questionInfo = params.questionInfo;

    var gameEl = [];
    for (var i = 0; i < questionInfo.length; i++) {
      gameEl.push({
        text: questionInfo[i].hanja,
        data: i
      });
      gameEl.push({
        text: questionInfo[i].mean,
        data: i
      });
    }
    gameEl = shuffle(gameEl);
    console.log(gameEl);

    function shuffle(arr) {
      return arr.sort(function() {
        return Math.random() - 0.5;
      });
    }

    var questions = [];
    for (var j = 0; j < gameEl.length; j++) {
      questions[j] = paper.g();
      questions[j].attr({
        'cursor': 'pointer'
      });
      questions[j].rect(18 + (j % 3) * 110, 105 + Math.floor(j / 3) * 84, 100, 70, 6, 6).attr({
        'fill': 'white',
        'stroke': '#afdc55',
        'stroke-width': 1.5
      });
      questions[j].text(67 + (j % 3) * 110, 151 + Math.floor(j / 3) * 84, gameEl[j].text).attr({
        'font-size': 32,
        'text-anchor': 'middle'
      });
      questions[j].data('i', gameEl[j].data);
    }

    return questions;

  },

  checkPairGame: function(params) {
    var questions = params.questions;
    var pair = [];
    var correctCount = [];
    var callback = params.callback;
    var startTime = new Date().getTime();
    var paper = Paper.g();

    for (var i = 0; i < questions.length; i++) {
      questions[i].click(handler);
    }

    function handler() {
      this.attr({
        'pointer-events': 'none'
      });
      this.select('rect').attr({
          'fill': '#afdc55',
          'opacity' : '0.3'
      });

      pair.push(this.data('i'));

      setTimeout(function() {
        if (pair.length === 2) { //두 개를 선택
          if (pair[0] === pair[1]) { //정답일 때
            pairRemove(pair[0]);
            var userTime = new Date().getTime() - startTime;
            correctCount.push(userTime);
            if (correctCount.length === questions.length / 2) { //다 없어졌는지 체크
              callback(userTime);
            }
          } else {
            clearAttr();
          }
          pair = [];
        }
      }, 300);
    }

    function pairRemove(index) {
      for (var i = 0; i < questions.length; i++) {
        if (questions[i].data('i') === index) {
          questions[i].remove();
        }
      }
    }

    function clearAttr() {
      for (var i = 0; i < questions.length; i++) {
        questions[i].select('rect').attr({
          'fill': 'white'
        });
        questions[i].attr({
          'pointer-events': 'auto'
        });
      }
    }
  },
};

Library.drawLayout();
