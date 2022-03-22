Vue.createApp({
    data: function () {
        return {
            workoutWeight: [],
            reps: [],
            startWeight: "",
            completedWorkouts: [],
            date: new Date().toISOString().slice(0, 10),
            total: 0,
            workoutNr: 1,
            toggle: false,
            id: ""
        };
    },
    methods: {
        //clear all workouts from active page
        clearAll: function () {
            window.localStorage.removeItem('completedWorkouts' + this.id);
            window.localStorage.removeItem('workoutWeight' + this.id);
            window.localStorage.removeItem('workoutNr' + this.id);
            window.localStorage.removeItem('total' + this.id);
            window.location.reload();
        },
        //reset next worout if last worout is deleted
        deleteThis: function (index) {
            if (index === 0) {
                this.workoutWeight = this.completedWorkouts[0].workoutWeight;
            }
            //remove workout at index and renumber remaining
            this.completedWorkouts.splice(index, 1);
            this.workoutNr = this.completedWorkouts.length + 1;
            for (var i = 0; i < this.completedWorkouts.length; i++) {
                this.completedWorkouts[i].workoutNr = this.completedWorkouts.length - i;
            }
            //calculate new total for next workout
            this.total = 0;
            for (var i = 0; i < this.workoutWeight.length; i++) {
                this.total += this.workoutWeight[i];
            }
            //save uppdated data for finnished workouts and next workout
            window.localStorage.setItem('completedWorkouts' + this.id, JSON.stringify(this.completedWorkouts));
            window.localStorage.setItem('workoutWeight' + this.id, JSON.stringify(this.workoutWeight));
            window.localStorage.setItem('workoutNr' + this.id, JSON.stringify(this.workoutNr));
            window.localStorage.setItem('total' + this.id, JSON.stringify(this.total));
        },
        //add workout to list
        saveCompletedWorkout: function () {
            this.completedWorkouts.unshift({
                workoutWeight: JSON.parse(JSON.stringify(this.workoutWeight)),
                reps: JSON.parse(JSON.stringify(this.reps)),
                date: JSON.parse(JSON.stringify(this.date)),
                total: this.total,
                workoutNr: this.workoutNr
            }),
                //increase nr for next workout
                this.workoutNr++;
            //set weight for next workout depending on reps
            for (var i = 0; i < this.workoutWeight.length; i++) {
                this.reps[i] > 5 ? this.workoutWeight[i] += 5 : this.workoutWeight[i];
            }
            //calculate total for next workout
            this.total = 0;
            for (var i = 0; i < this.workoutWeight.length; i++) {
                this.total += this.workoutWeight[i];
            }
            //reset reps for next workout
            for (var i = 0; i < this.reps.length; i++) {
                this.reps[i] = 5;
            }
            //save data for finnished workout and next workout
            window.localStorage.setItem('completedWorkouts' + this.id, JSON.stringify(this.completedWorkouts));
            window.localStorage.setItem('workoutWeight' + this.id, JSON.stringify(this.workoutWeight));
            window.localStorage.setItem('workoutNr' + this.id, JSON.stringify(this.workoutNr));
            window.localStorage.setItem('total' + this.id, JSON.stringify(this.total));
        },
        //Fill empty array for first workout
        setStartingWeight: function () {
            for (var i = 0; i < 5; i++) {
                this.workoutWeight[i] = this.startWeight;
            }
            //total for starting weight
            for (var i = 0; i < this.workoutWeight.length; i++) {
                this.total += this.workoutWeight[i];
            }
            //hide "set starting weight" when it´s set
            this.toggle = !this.toggle;
        },
        //check local storage for data and load 
        setUnits: function () {
            var check = JSON.parse(window.localStorage.getItem('completedWorkouts' + this.id));
            if (check !== null) {
                this.completedWorkouts = JSON.parse(window.localStorage.getItem('completedWorkouts' + this.id));
                this.workoutWeight = JSON.parse(window.localStorage.getItem('workoutWeight' + this.id));
                this.workoutNr = JSON.parse(window.localStorage.getItem('workoutNr' + this.id));
                this.total = JSON.parse(window.localStorage.getItem('total' + this.id));
            }
            //hide "set starting weight" if loading from storage
            if (check !== null) {
                this.toggle = true;
            }
            //Fill empty array for first workout
            for (var i = 0; i < 5; i++) {
                this.reps[i] = 5;
            }
            this.startWeight = 100;
        }
    },
    //get page id for local storage
    mounted: function () {
        this.id = this.$refs.id.innerHTML.slice(0, 5);
        this.setUnits();
    }
}).mount('body');
//# sourceMappingURL=script.js.map