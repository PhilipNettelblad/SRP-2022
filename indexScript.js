var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Vue.createApp({
    data: function () {
        return {
            completedWorkouts: [],
            workoutWeightB: [],
            workoutWeightS: [],
            workoutWeightD: [],
            totalB: 0,
            totalS: 0,
            totalD: 0,
            workoutNrB: 1,
            workoutNrS: 1,
            workoutNrD: 1
        };
    },
    methods: {
        //get sample workouts from json
        loadSampleData: function () {
            return __awaiter(this, void 0, void 0, function () {
                var response, json;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            window.localStorage.clear();
                            return [4 /*yield*/, fetch('data.json')];
                        case 1:
                            response = _a.sent();
                            return [4 /*yield*/, response.json()];
                        case 2:
                            json = _a.sent();
                            Object.entries(json)
                                .forEach(function (_a) {
                                var k = _a[0], v = _a[1];
                                return localStorage.setItem(k, v);
                            });
                            window.location.reload();
                            return [2 /*return*/];
                    }
                });
            });
        },
        //get data from local storage for pages by id      
        getData: function (id) {
            var name = "";
            var dataLength = 10;
            this.dataPoints = [];
            //check if data exists in local storage and load
            var check = JSON.parse(window.localStorage.getItem('completedWorkouts' + id));
            if (check !== null) {
                this.completedWorkouts = JSON.parse(window.localStorage.getItem('completedWorkouts' + id));
                for (var i = 0; i < this.completedWorkouts.length; i++) {
                    this.dataPoints.unshift({ y: this.completedWorkouts[i].total, x: this.completedWorkouts[i].workoutNr });
                }
                // take last ten workouts
                if (this.completedWorkouts.length > dataLength) {
                    var diff = this.completedWorkouts.length - dataLength;
                    this.dataPoints.splice(0, diff);
                }
                switch (id) {
                    case "Bench":
                        name = "Bench Press Progress";
                        this.workoutWeightB = JSON.parse(window.localStorage.getItem('workoutWeight' + id));
                        this.workoutNrB = JSON.parse(window.localStorage.getItem('workoutNr' + id));
                        this.totalB = JSON.parse(window.localStorage.getItem('total' + id));
                        this.loadCanvasData(this.dataPoints, this.canvasBench, name);
                        break;
                    case "Squat":
                        name = "Squat Progress";
                        this.workoutWeightS = JSON.parse(window.localStorage.getItem('workoutWeight' + id));
                        this.workoutWeightS = JSON.parse(window.localStorage.getItem('workoutWeight' + id));
                        this.workoutNrS = JSON.parse(window.localStorage.getItem('workoutNr' + id));
                        this.totalS = JSON.parse(window.localStorage.getItem('total' + id));
                        this.loadCanvasData(this.dataPoints, this.canvasSquat, name);
                        break;
                    case "Deadl":
                        name = "Deadlift Progress";
                        this.workoutWeightD = JSON.parse(window.localStorage.getItem('workoutWeight' + id));
                        this.workoutNrD = JSON.parse(window.localStorage.getItem('workoutNr' + id));
                        this.totalD = JSON.parse(window.localStorage.getItem('total' + id));
                        this.loadCanvasData(this.dataPoints, this.canvasDeadl, name);
                        break;
                }
            }
        },
        loadCanvasData: function (dataPoints, canvas, name) {
            var previousX = 27;
            var previousY = 0;
            var diff = dataPoints[dataPoints.length - 1].y - dataPoints[0].y;
            var factor = 0;
            //set factor for y-axis to better fill graph
            if (diff > 175) {
                factor = 0.5;
            }
            else if (diff >= 145) {
                factor = 0.75;
            }
            else if (diff >= 120) {
                factor = 0.9;
            }
            else if (diff >= 90) {
                factor = 1.1;
            }
            else {
                factor = 1.5;
            }
            //loop values to draw line
            for (var i = 1; i < dataPoints.length; i++) {
                this.drawLine(name, dataPoints, i, canvas, previousX, previousY * factor, previousX + 27, (dataPoints[i].y - dataPoints[i - 1].y + previousY) * factor);
                previousX += 27;
                previousY += dataPoints[i].y - dataPoints[i - 1].y;
            }
        },
        //draw graph and add numbers
        drawLine: function (name, dataPoints, i, c, x1, y1, x2, y2) {
            var font = "8px LCD";
            //set first value in graph
            if (i === 1) {
                c.fillStyle = '#00d2be';
                c.fillRect(x1 - 20, y1, 23, 1);
                c.fillRect(x1, y1 - 2, 1, 5);
                c.save();
                c.transform(1, 0, 0, -1, 0, 140);
                c.font = font;
                c.fillStyle = '#bffaf4';
                c.fillText(dataPoints[i - 1].y, x1 - 10, 140 - y1 - 3);
                c.fillText(dataPoints[i - 1].x, x1, 150);
                c.font = "12px LCD";
                c.fillText(name, 150, 15);
                c.restore();
            }
            //fill graph
            c.beginPath();
            c.strokeStyle = '#00d2be';
            c.lineWidth = 1;
            c.moveTo(x1, y1);
            c.lineTo(x2, y2);
            c.stroke();
            c.closePath();
            c.fillStyle = '#00d2be';
            c.fillRect(x2 - 20, y2, 23, 1);
            c.fillRect(x2, y2 - 2, 1, 5);
            c.fillRect(x2, -2, 1, 5);
            c.save();
            c.transform(1, 0, 0, -1, 0, 140);
            c.font = font;
            c.fillStyle = '#bffaf4';
            c.fillText(dataPoints[i].y, x2 - 10, 140 - y2 - 3);
            c.fillText(dataPoints[i].x, x2, 150);
            c.restore();
        },
        //set scale and increase resolution to unblur numbers
        setCanvasScale: function (canvas, htmlCanvas, e) {
            var size = 200;
            canvas.width = size;
            canvas.height = size;
            var scale = window.devicePixelRatio + 2;
            htmlCanvas[e].width = Math.floor((size + 90) * scale);
            htmlCanvas[e].height = Math.floor((size - 45) * scale);
            canvas.scale(scale, scale);
            canvas.textAlign = 'center';
            canvas.transform(1, 0, 0, -1, 0, 140);
        }
    },
    mounted: function () {
        this.htmlCanvas = document.querySelectorAll("canvas");
        this.canvasBench = this.$refs.Bench.getContext('2d');
        this.setCanvasScale(this.canvasBench, this.htmlCanvas, 0);
        this.canvasSquat = this.$refs.Squat.getContext('2d');
        this.setCanvasScale(this.canvasSquat, this.htmlCanvas, 1);
        this.canvasDeadl = this.$refs.Deadl.getContext('2d');
        this.setCanvasScale(this.canvasDeadl, this.htmlCanvas, 2);
        this.getData("Bench");
        this.getData("Squat");
        this.getData("Deadl");
    }
}).mount('body');
//# sourceMappingURL=indexScript.js.map