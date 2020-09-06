const RADIUS_OUTER = 320
const RADIUS_INNER = 180
const CENTER_X = (window.innerWidth - 25) / 2;
const CENTER_Y = (window.innerHeight - 25) / 2;
const SEGMENT_EDGES = [];
const TOTAL_SECONDS = 60;

const LINE_WIDTH = 3;
const TEXT_FONT = "LCD14";

let CURRENT_INTERVAL;
let BACKGROUND = 'rgba(0, 0, 0, 0.917)';
let OUTER_CIRCLE_COLOR = '#27303a';
let INNER_CIRCLE_COLOR = 'rgba(0, 0, 0, 0.863)';
let FILLING_COLOR = 'orange';
let TEXT_COLOR = 'white';
let LINE_COLOR = 'white';

let SECOND = TOTAL_SECONDS;
let SEGMENT = 0;

function play() {
    clearCanvas();
    document.getElementById("audioControl").play();
    resetAndRestart();
}

function record() {
    setFormVisible(false);
    document.getElementById("audioControl").pause();
    clearCanvas();
    setTimeout(() => {
        document.getElementById("audioControl").currentTime = 0;
        document.getElementById("audioControl").play();
        resetAndRestart();
    }, 9000);
}

function setFormVisible(isVisible) {
    if (isVisible) {
        $('.form').show();
    } else {
        $('.form').hide();
    }
}

function stop() {
    clearInterval(CURRENT_INTERVAL);
    setTimeout(() => {
        document.getElementById("audioControl").pause();
        setFormVisible(true);
    }, 5000);
}

function resetAndRestart() {
    document.getElementById("audioControl").currentTime = 0;
    clearCanvas();
    draw();
}

function clearCanvas() {
    var c = document.getElementById("countdown");
    var ctx = c.getContext("2d");
    clearInterval(CURRENT_INTERVAL);
    ctx.clearRect(0, 0, c.width, c.height);
}

function setStyles(ctx) {
    ctx.lineWidth = LINE_WIDTH;
}

function draw() {
    calculateSegmentEdges();
    var c = document.getElementById("countdown");
    c.width = window.innerWidth - 25;
    c.height = window.innerHeight - 25;
    var ctx = c.getContext("2d");

    setStyles(ctx);
    drawOuterCircle(ctx);
    drawLines(ctx);

    SECOND = TOTAL_SECONDS;
    SEGMENT = 0;

    runSegment();
    CURRENT_INTERVAL = setInterval(runSegment, 1000);
}

function runSegment() {

    var c = document.getElementById("countdown");
    var ctx = c.getContext("2d");

    if (SECOND < TOTAL_SECONDS) {
        fillSegment(ctx, SEGMENT++);
    }
    drawLines(ctx);
    drawText(ctx, SECOND--);

    if (SECOND === -1) {
        stop();
    }
}

function calculateSegmentEdges() {
    for (let angle = -90; angle <= 270; angle += 6) {
        const angleRadians = angle * Math.PI / 180
        const edgeX = CENTER_X + RADIUS_OUTER * Math.cos(angleRadians);
        const edgeY = CENTER_Y + RADIUS_OUTER * Math.sin(angleRadians);
        SEGMENT_EDGES.push({ x: edgeX, y: edgeY });
    }
}

function drawOuterCircle(ctx) {
    ctx.beginPath();
    ctx.fillStyle = OUTER_CIRCLE_COLOR;
    ctx.strokeStyle = LINE_COLOR;
    ctx.arc(CENTER_X, CENTER_Y, RADIUS_OUTER, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.fill();
}

function drawInnerCircle(ctx) {
    ctx.beginPath();
    ctx.arc(CENTER_X, CENTER_Y, RADIUS_INNER, 0, 2 * Math.PI);
    ctx.fillStyle = INNER_CIRCLE_COLOR;
    ctx.fill();
}

function drawLines(ctx) {
    SEGMENT_EDGES.forEach(edge => {
        ctx.beginPath();
        ctx.strokeStyle = LINE_COLOR;
        ctx.moveTo(CENTER_X, CENTER_Y);
        ctx.lineTo(edge.x, edge.y);
        ctx.stroke();
    });
}

function fillSegment(ctx, segment) {
    const circleEdge1 = SEGMENT_EDGES[segment];
    const nextSegment = segment + 1 === SEGMENT_EDGES.length ? 0 : segment + 1;
    const circleEdge2 = SEGMENT_EDGES[nextSegment];

    ctx.beginPath();
    ctx.fillStyle = FILLING_COLOR;
    ctx.moveTo(CENTER_X, CENTER_Y);
    ctx.lineTo(circleEdge1.x, circleEdge1.y);
    ctx.lineTo(circleEdge2.x, circleEdge2.y);
    ctx.fill();
}

function drawText(ctx, seconds) {

    drawInnerCircle(ctx);

    ctx.font = "170px LCD14";
    ctx.fillStyle = TEXT_COLOR;
    ctx.textAlign = "center";
    const text = String(seconds).padStart(2, '0');
    ctx.fillText(text, CENTER_X, CENTER_Y + 65);
}

