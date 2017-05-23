class Match {
    constructor(opp1, opp2, time, icon) {
        this.opp1 = opp1;
        this.opp2 = opp2;
        this.time = time;
        this.parsedTime = this.getParsedTimetime(time);
        this.icon = icon;
    }

    getParsedTimetime(time) {
        let times = time.split(" ");
        if (times[0][times[0].length - 1] !== "m")
            return NaN; // returning NaN for time more than an hour since it's not interisting
        return (parseInt(times[0].substr(0, times[0].length - 1)) * 60) + parseInt(times[1].substr(0, times[1].length - 1));
    }
}

module.exports = Match;