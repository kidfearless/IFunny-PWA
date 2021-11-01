/* 
	1. Create a js class call TimeSpan
	2. Add get and set properties for the following: Months, Days, Hours, Minutes, Seconds, Milliseconds
	3. Create comparision functions using the total time of the properties
	4. Create artithmetic operators as well
	5. Create static functions that return a new timespan object. Create one for each of the following properties: Months, Days, Hours, Minutes, Seconds, Milliseconds
	6. Write unit tests for each of the properties and methods
	7. Add a parse method that takes a string and returns a new TimeSpan object
*/

export class TimeSpan
{
	private _months: number;
	private _days: number;
	private _hours: number;
	private _minutes: number;
	private _seconds: number;
	private _milliseconds: number;

	constructor();
	constructor(months: number, days: number, hours: number, minutes: number, seconds: number, milliseconds: number);
	constructor(...args: number[])
	{
		if (args.length == 6)
		{
			this._months = args[0];
			this._days = args[1];
			this._hours = args[2];
			this._minutes = args[3];
			this._seconds = args[4];
			this._milliseconds = args[5];
		}
		else
		{
			this._months = 0;
			this._days = 0;
			this._hours = 0;
			this._minutes = 0;
			this._seconds = 0;
			this._milliseconds = 0;
		}
	}


	get months()
	{
		return this._months;
	};

	set months(months)
	{
		this.months = months;
	};

	get days()
	{
		return this._days;
	};

	set days(days)
	{
		this.days = days;
	};

	get hours()
	{
		return this._hours;
	};

	set hours(hours)
	{
		this.hours = hours;
	};

	get minutes()
	{
		return this._minutes;
	};

	set minutes(minutes)
	{
		this.minutes = minutes;
	};

	get seconds()
	{
		return this._seconds;
	};

	set seconds(seconds)
	{
		this.seconds = seconds;
	};

	get milliseconds()
	{
		return this._milliseconds;
	};

	set milliseconds(milliseconds)
	{
		this.milliseconds = milliseconds;
	};

	get totalmilliseconds()
	{
		return this._months * 30 * 24 * 60 * 60 * 1000 + this._days * 24 * 60 * 60 * 1000 + this._hours * 60 * 60 * 1000 + this._minutes * 60 * 1000 + this._seconds * 1000 + this._milliseconds;
	};

	get totalseconds()
	{
		return this._months * 30 * 24 * 60 * 60 + this._days * 24 * 60 * 60 + this._hours * 60 * 60 + this._minutes * 60 + this._seconds + this._milliseconds / 1000;
	};

	get totalminutes()
	{
		return this._months * 30 * 24 * 60 + this._days * 24 * 60 + this._hours * 60 + this._minutes + this._seconds / 60 + this._milliseconds / 1000 / 60;
	};

	get totalhours()
	{
		return this._months * 30 * 24 + this._days * 24 + this._hours + this._minutes / 60 + this._seconds / 60 / 60 + this._milliseconds / 1000 / 60 / 60;
	};

	get totaldays()
	{
		return this._months * 30 + this._days + this._hours / 24 + this._minutes / 60 / 24 + this._seconds / 60 / 60 / 24 + this._milliseconds / 1000 / 60 / 60 / 24;
	};

	get totalmonths()
	{
		return this._months + this._days / 30 + this._hours / 24 / 30 + this._minutes / 60 / 24 / 30 + this._seconds / 60 / 60 / 24 / 30 + this._milliseconds / 1000 / 60 / 60 / 24 / 30;
	};

	add(timespan: TimeSpan)
	{
		this.months += timespan.months;
		this.days += timespan.days;
		this.hours += timespan.hours;
		this.minutes += timespan.minutes;
		this.seconds += timespan.seconds;
		this.milliseconds += timespan.milliseconds;
	};

	subtract(timespan: TimeSpan)
	{
		this.months -= timespan.months;
		this.days -= timespan.days;
		this.hours -= timespan.hours;
		this.minutes -= timespan.minutes;
		this.seconds -= timespan.seconds;
		this.milliseconds -= timespan.milliseconds;
	};

	equals(timespan: TimeSpan)
	{
		return this.months === timespan.months && this.days === timespan.days && this.hours === timespan.hours && this.minutes === timespan.minutes && this.seconds === timespan.seconds && this.milliseconds === timespan.milliseconds;
	};

	greaterThan(timespan: TimeSpan)
	{
		return this.months > timespan.months && this.days > timespan.days && this.hours > timespan.hours && this.minutes > timespan.minutes && this.seconds > timespan.seconds && this.milliseconds > timespan.milliseconds;
	};

	greaterThanOrEqual(timespan: TimeSpan)
	{
		return this.months >= timespan.months && this.days >= timespan.days && this.hours >= timespan.hours && this.minutes >= timespan.minutes && this.seconds >= timespan.seconds && this.milliseconds >= timespan.milliseconds;
	};

	lessThan(timespan: TimeSpan)
	{
		return this.months < timespan.months && this.days < timespan.days && this.hours < timespan.hours && this.minutes < timespan.minutes && this.seconds < timespan.seconds && this.milliseconds < timespan.milliseconds;
	};

	lessThanOrEqual(timespan: TimeSpan)
	{
		return this.months <= timespan.months && this.days <= timespan.days && this.hours <= timespan.hours && this.minutes <= timespan.minutes && this.seconds <= timespan.seconds && this.milliseconds <= timespan.milliseconds;
	};

	parse(timespan: string)
	{
		var months = 0;
		var days = 0;
		var hours = 0;
		var minutes = 0;
		var seconds = 0;
		var milliseconds = 0;

		var time = timespan.split(":");
		if (time.length === 4)
		{
			months = parseInt(time[0]);
			days = parseInt(time[1]);
			hours = parseInt(time[2]);
			minutes = parseInt(time[3]);
		} else if (time.length === 3)
		{
			days = parseInt(time[0]);
			hours = parseInt(time[1]);
			minutes = parseInt(time[2]);
		} else if (time.length === 2)
		{
			hours = parseInt(time[0]);
			minutes = parseInt(time[1]);
		} else if (time.length === 1)
		{
			minutes = parseInt(time[0]);
		}

		var secondsTime = timespan.split(",");
		if (secondsTime.length === 2)
		{
			seconds = parseInt(secondsTime[0]);
			milliseconds = parseInt(secondsTime[1]);
		} else if (secondsTime.length === 1)
		{
			seconds = parseInt(secondsTime[0]);
		}

		return new TimeSpan(months, days, hours, minutes, seconds, milliseconds);
	};

	toString()
	{
		return this._months + " months, " + this._days + " days, " + this._hours + " hours, " + this._minutes + " minutes, " + this._seconds + " seconds, " + this._milliseconds + " milliseconds";
	};

	toShortString()
	{
		return this._months + "M, " + this._days + "D, " + this._hours + "H, " + this._minutes + "M, " + this._seconds + "S, " + this._milliseconds + "MS";
	};

	toLongString()
	{
		return this._months + " Months, " + this._days + " Days, " + this._hours + " Hours, " + this._minutes + " Minutes, " + this._seconds + " Seconds, " + this._milliseconds + " Milliseconds";
	};

	toCompactString()
	{
		return this._months + "M" + this._days + "D" + this._hours + "H" + this._minutes + "M" + this._seconds + "S" + this._milliseconds + "MS";
	};

	toShortCompactString()
	{
		return this._months + "M" + this._days + "D" + this._hours + "H" + this._minutes + "M" + this._seconds + "S" + this._milliseconds + "MS";
	};

	toLongCompactString()
	{
		return this._months + " Months, " + this._days + " Days, " + this._hours + " Hours, " + this._minutes + " Minutes, " + this._seconds + " Seconds, " + this._milliseconds + " Milliseconds";
	};

	toShortLongCompactString()
	{
		return this._months + " Months, " + this._days + " Days, " + this._hours + " Hours, " + this._minutes + " Minutes, " + this._seconds + " Seconds, " + this._milliseconds + " Milliseconds";
	};

	toShortLongString()
	{
		return this._months + " Months, " + this._days + " Days, " + this._hours + " Hours, " + this._minutes + " Minutes, " + this._seconds + " Seconds, " + this._milliseconds + " Milliseconds";
	};

	toShortStringWithTime()
	{
		return this._months + "M" + this._days + "D" + this._hours + "H" + this._minutes + "M" + this._seconds + "S" + this._milliseconds + "MS";
	};

	toLongStringWithTime()
	{
		return this._months + " Months, " + this._days + " Days, " + this._hours + " Hours, " + this._minutes + " Minutes, " + this._seconds + " Seconds, " + this._milliseconds + " Milliseconds";
	};

	toShortLongStringWithTime()
	{
		return this._months + " Months, " + this._days + " Days, " + this._hours + " Hours, " + this._minutes + " Minutes, " + this._seconds + " Seconds, " + this._milliseconds + " Milliseconds";
	};

	toCompactStringWithTime()
	{
		return this._months + "M" + this._days + "D" + this._hours + "H" + this._minutes + "M" + this._seconds + "S" + this._milliseconds + "MS";
	};

	toShortCompactStringWithTime()
	{
		return this._months + "M" + this._days + "D" + this._hours + "H" + this._minutes + "M" + this._seconds + "S" + this._milliseconds + "MS";
	};

	toLongCompactStringWithTime()
	{
		return this._months + " Months, " + this._days + " Days, " + this._hours + " Hours, " + this._minutes + " Minutes, " + this._seconds + " Seconds, " + this._milliseconds + " Milliseconds";
	};

	toShortLongCompactStringWithTime()
	{
		return this._months + " Months, " + this._days + " Days, " + this._hours + " Hours, " + this._minutes + " Minutes, " + this._seconds + " Seconds, " + this._milliseconds + " Milliseconds";
	};


	toShortStringWithTimeZone()
	{
		return this._months + "M" + this._days + "D" + this._hours + "H" + this._minutes + "M" + this._seconds + "S" + this._milliseconds + "MS";
	};

	toLongStringWithTimeZone()
	{
		return this._months + " Months, " + this._days + " Days, " + this._hours + " Hours, " + this._minutes + " Minutes, " + this._seconds + " Seconds, " + this._milliseconds + " Milliseconds";
	};


	toCompactStringWithTimeZone()
	{
		return this._months + "M" + this._days + "D" + this._hours + "H" + this._minutes + "M" + this._seconds + "S" + this._milliseconds + "MS";
	};

	toShortCompactStringWithTimeZone()
	{
		return this._months + "M" + this._days + "D" + this._hours + "H" + this._minutes + "M" + this._seconds + "S" + this._milliseconds + "MS";
	};

	toLongCompactStringWithTimeZone()
	{
		return this._months + " Months, " + this._days + " Days, " + this._hours + " Hours, " + this._minutes + " Minutes, " + this._seconds + " Seconds, " + this._milliseconds + " Milliseconds";
	};

	toShortLongCompactStringWithTimeZone()
	{
		return this._months + " Months, " + this._days + " Days, " + this._hours + " Hours, " + this._minutes + " Minutes, " + this._seconds + " Seconds, " + this._milliseconds + " Milliseconds";
	};

	toShortLongStringWithTimeZone()
	{
		return this._months + " Months, " + this._days + " Days, " + this._hours + " Hours, " + this._minutes + " Minutes, " + this._seconds + " Seconds, " + this._milliseconds + " Milliseconds";
	};

}
