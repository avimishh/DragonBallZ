var maxContainerWidth = parseFloat($("#container").css("width")) - parseFloat($("#container").css("border")) * 2 - parseFloat($("#player").css("width"));		//maxWidth = container.width - border*2 - player.width
var missileFallingTime = 5000;
var lvlNum = parseFloat($("#lvlNum").text());

function levelUp() {
    if (lvlNum >= 10) return;
    missileFallingTime -= 450;
    $("#lvlNum").text(++lvlNum);
    a
}
function levelDown() {
    if (lvlNum <= 1) return;
    missileFallingTime += 450;
    $("#lvlNum").text(--lvlNum);
}

var playerLeftPos;
//player movement functionality
$("body").on("keydown", function (e) {
    playerLeftPos = parseFloat($("#player").css("left"));

    if (e.keyCode === 37 && playerLeftPos > -10)
        playerLeftPos -= 10;
    else if (e.keyCode === 39 && playerLeftPos < maxContainerWidth - 10)
        playerLeftPos += 10;
    $("#player").css("left", playerLeftPos);

    if (e.keyCode === 38)
        playerShoot();
}
)

//player shooting
function playerShoot() {
    let $newShoot = $("<img>").attr("class", "shoot").css("left", (playerLeftPos + 50) + "px").attr("src", "./res/ball.png");
    $("#container").append($newShoot);
    $newShoot.animate({
        top: "20px"
    },
        {
            duration: 3000,
            easing: "linear",
            complete: function () {
                $newShoot.remove();
            },
            progress: function () {
                $(".missile").each(function () {

                    let dx = Math.abs(parseFloat($newShoot.css("left")) - parseFloat($(this).css("left")));
                    if (dx < 40) {
                        let dy = parseFloat($newShoot.css("top")) - parseFloat($(this).css("top"));
                        let isHitted = $(this).attr("data-name");		//מטרת הבדיקה לוודא שטיל שכבר נבחר בפגיעה לא יבחר יריות  נוספות  עד שהוא מתחסל
                        if (dy < 50 && (!(isHitted === "hitted"))) {
                            $(this).attr("data-name", "hitted");
                            scoreUpdate($(this).attr("src").substr(6, 3), "hit");
                            $(this).attr("src", "./res/hit.png");
                            let $hittedMissile = $(this);
                            setTimeout(function () { $newShoot.remove(); }, 100);
                            setTimeout(function () { $hittedMissile.remove(); $hittedMissile.stop(); }, 200);
                            $newShoot.stop();
                        }
                    }

                })
            }

        })
}
var enemyCounter = 1;
function lotEnemy() {

    let res = Math.random();
    let imgSrc;

    if (res <= 0.7)
        imgSrc = "./res/vegeta.png";
    else if (res <= 0.9)
        imgSrc = "./res/frieza.png";
    else if (0.9 < res)
        imgSrc = "./res/buu.png";
    return imgSrc;
}

function launchMissile() {
    enemyCounter++;
    if (enemyCounter > 101) {
        for (var i in enemyStopArray)
            clearTimeout(enemyStopArray[i]);
        return;
    }

    let posFromLeft = Math.floor(Math.random() * 2000) % (maxContainerWidth) + 10;
    let $newMissile = $("<img>").attr("class", "missile").css("left", posFromLeft + "px").attr("src", lotEnemy());
    $("#container").append($newMissile);
    $newMissile.animate({
        top: "300px"


    },
        {
            duration: missileFallingTime,
            easing: "linear",
            complete: function () {

                scoreUpdate($(this).attr("src").substr(6, 3), "miss");
                backgroundFlip($("#container"), "red");
                // $newMissile.attr("class","boom");
                setTimeout(function () {
                    $newMissile.remove();
                }, 50);
            },
            progress: function () {
                if (isNewGame) {
                    $(this).stop();
                    $(this).remove();
                }
            }

        })
    if (enemyCounter < 100) {
        enemyStopArray.push(setTimeout(launchMissile, 2000));
        if (enemyCounter % 10 === 0)
            levelUp();
    }
}
var enemyStopArray = [];
function backgroundFlip(elm, clr) {
    // elm.css("background-color","white");
    // let prv = elm.css("background-color");
    // if(!(prv==="red"||prv==="green")){				//check if still iterating a previous flip
    elm.css("background-color", clr);
    setTimeout(function () {
        elm.css("background-color", "white");
    }, 100);
    // }
}

function scoreUpdate(str, operation) {
    let $elm = $("#" + str + "_hits");
    $elm.children().eq(0).text(parseFloat($elm.children().eq(0).text()) + 1);
    allHitsUpdate(0);
    if (operation === "hit") {
        $elm.children().eq(1).text(parseFloat($elm.children().eq(1).text()) + 1);
        allHitsUpdate(1);
        ptsUpdate(str);
        backgroundFlip($elm, "green");
    }
    else if (operation === "miss") {
        backgroundFlip($elm, "red");
    }
}

function allHitsUpdate(n) {
    if (n === 0 || n === 1)
        $("#all_hits").children().eq(n).text(parseFloat($("#all_hits").children().eq(n).text()) + 1);

}

function ptsUpdate(who) {
    let n;
    switch (who) {
        case "veg":
            n = 10;
            break;
        case "fri":
            n = 25;
            break;
        case "buu":
            n = 50;
            break;
    }
    $("#" + who + "_pts").text(n * parseFloat($("#" + who + "_hits").children().eq(0).text()));
    $("#all_pts").text(parseFloat($("#all_pts").text()) + n);
    if (parseFloat($("#all_pts").text()) > parseFloat($("#HighScore").text()))
        $("#HighScore").text($("#all_pts").text());
}

var $defaultStat = $("#stat").html();
var $defaultContainer = $("#container").html();
var isNewGame = false;
function newGame() {
    for (var i in enemyStopArray)
        clearTimeout(enemyStopArray[i]);
    enemyStopArray = [];
    isNewGame = true;
    $("#stat").html($defaultStat);
    $("#container").html($defaultContainer);
    setTimeout(function () {
        isNewGame = false;
        enemyCounter = 1;
        missileFallingTime = 5000;
        lvlNum = 1;
        $("#lvlNum").text(1);
        launchMissile();
    }, 200);
}

$(document).ready(launchMissile);
