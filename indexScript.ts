declare var Vue: any;

Vue.createApp({
    data() {
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
            workoutNrD: 1,
        };
    },

    methods: {

        //get sample workouts from json
        async loadSampleData() {
            window.localStorage.clear();
            let response = await fetch('data.json');
            let json = await response.json();
            Object.entries(json)
                .forEach(([k, v]) => localStorage.setItem(k, v))
            window.location.reload();
        },

        //get data from local storage for pages by id      
        getData(id) {
            let name = "";
            let dataLength = 10;
            this.dataPoints = [];
            //check if data exists in local storage and load
            let check = JSON.parse(window.localStorage.getItem('completedWorkouts' + id));
            if (check !== null) {
                this.completedWorkouts = JSON.parse(window.localStorage.getItem('completedWorkouts' + id));
                for (let i = 0; i < this.completedWorkouts.length; i++) {
                    this.dataPoints.unshift({ y: this.completedWorkouts[i].total, x: this.completedWorkouts[i].workoutNr })
                }
                // take last ten workouts
                if (this.completedWorkouts.length > dataLength) {
                    let diff = this.completedWorkouts.length - dataLength;
                    this.dataPoints.splice(0, diff)
                }
                switch (id) {
                    case "Bench":
                        name = "Bench Press Progress"
                        this.workoutWeightB = JSON.parse(window.localStorage.getItem('workoutWeight' + id));
                        this.workoutNrB = JSON.parse(window.localStorage.getItem('workoutNr' + id));
                        this.totalB = JSON.parse(window.localStorage.getItem('total' + id));
                        this.loadCanvasData(this.dataPoints, this.canvasBench, name);
                        break;
                    case "Squat":
                        name = "Squat Progress"
                        this.workoutWeightS = JSON.parse(window.localStorage.getItem('workoutWeight' + id));
                        this.workoutWeightS = JSON.parse(window.localStorage.getItem('workoutWeight' + id));
                        this.workoutNrS = JSON.parse(window.localStorage.getItem('workoutNr' + id));
                        this.totalS = JSON.parse(window.localStorage.getItem('total' + id));
                        this.loadCanvasData(this.dataPoints, this.canvasSquat, name);
                        break;
                    case "Deadl":
                        name = "Deadlift Progress"
                        this.workoutWeightD = JSON.parse(window.localStorage.getItem('workoutWeight' + id));
                        this.workoutNrD = JSON.parse(window.localStorage.getItem('workoutNr' + id));
                        this.totalD = JSON.parse(window.localStorage.getItem('total' + id));
                        this.loadCanvasData(this.dataPoints, this.canvasDeadl, name);
                        break;
                }
            }

        },

        loadCanvasData(dataPoints, canvas, name) {
            let previousX = 27;
            let previousY = 0;
            let diff = dataPoints[dataPoints.length - 1].y - dataPoints[0].y;
            let factor = 0;
            //set factor for y-axis to better fill graph
            if (diff > 175) {
                factor = 0.5
            }
            else if (diff >= 145) {
                factor = 0.75
            }
            else if (diff >= 120) {
                factor = 0.9
            }
            else if (diff >= 90) {
                factor = 1.1
            }
            else {
                factor = 1.5
            }
            //loop values to draw line
            for (let i = 1; i < dataPoints.length; i++) {

                this.drawLine(name, dataPoints, i, canvas, previousX, previousY * factor, previousX + 27,
                    (dataPoints[i].y - dataPoints[i - 1].y + previousY) * factor);

                previousX += 27;
                previousY += dataPoints[i].y - dataPoints[i - 1].y;
            }
        },
        //draw graph and add numbers
        drawLine(name, dataPoints, i, c, x1, y1, x2, y2) {
            let font = "8px LCD"
            //set first value in graph
            if (i === 1) {
                c.fillStyle = '#00d2be';
                c.fillRect(x1 - 20, y1, 23, 1);
                c.fillRect(x1, y1 - 2, 1, 5);
                c.save();
                c.transform(1, 0, 0, -1, 0, 140);
                c.font = font
                c.fillStyle = '#bffaf4';
                c.fillText(dataPoints[i - 1].y, x1 - 10, 140 - y1 - 3)
                c.fillText(dataPoints[i - 1].x, x1, 150)
                c.font = "12px LCD"
                c.fillText(name, 150, 15)
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
            c.font = font
            c.fillStyle = '#bffaf4';
            c.fillText(dataPoints[i].y, x2 - 10, 140 - y2 - 3)
            c.fillText(dataPoints[i].x, x2, 150)
            c.restore();
        },
        //set scale and increase resolution to unblur numbers
        setCanvasScale(canvas, refs, e) {
            var size = 200;
            canvas.width = size;
            canvas.height = size;
            var scale = window.devicePixelRatio + 2;
            refs[e][1].width = Math.floor((size + 90) * scale);
            refs[e][1].height = Math.floor((size - 45) * scale);
            canvas.scale(scale, scale);
            canvas.textAlign = 'center';
            canvas.transform(1, 0, 0, -1, 0, 140);           
        }
    },
    mounted() {

        this.canvasBench = this.$refs.Bench.getContext('2d');
        this.setCanvasScale(this.canvasBench, Object.entries(this.$refs), 0)

        this.canvasSquat = this.$refs.Squat.getContext('2d');
        this.setCanvasScale(this.canvasSquat, Object.entries(this.$refs), 1)

        this.canvasDeadl = this.$refs.Deadl.getContext('2d');
        this.setCanvasScale(this.canvasDeadl, Object.entries(this.$refs), 2)

        this.getData("Bench");
        this.getData("Squat")
        this.getData("Deadl")
    },
}).mount('body');