// /*
// 	1. Create a class named DateTime
// 	2. add a BigInt object in it named _date.
// 	3. Store the current date and time in _date as an offset from year 0 in milliseconds
// 	4. Add a property that returns the current year from _date.
// 	5. Add a property that returns the current month from _date.
// 	6. Add a property that returns the current day from _date.
// 	7. Add a function that returns the difference of two DateTime objects
// 	8. Add a function that returns the sum of two DateTime objects
// 	9. Add a constructor that instantiates the Date object from the given year, month, day, hour, minute, second, and millisecond.
// 	10. Add functions for: addDays, addHours, addMinutes, addMonths, addSeconds, addYears, addMilliSeconds
// 	11. Add a property to check if the current DateTime is in daylight saving time
// 	12. Add a property to check if it is a leap year
// 	13. Add comparision functions
// */

// export class DateTime
// {
// 	private _date: Date;
// 	constructor();
// 	constructor(year, month, day, hour, minute, second, millisecond);
// 	constructor(...args)
// 	{
// 		if (args.length == 0)
// 		{
// 			this._date = new Date();
// 		}
// 		else
// 		{
// 			this._date = new Date(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
// 		}
// 	}

// 	static parse(dateString)
// 	{
// 		let date = Date.parse(dateString);
// 		let x = new DateTime();
// 		x._date = new Date(date);
// 		return x;
// 	}

// 	get year()
// 	{
// 		return this._date.getFullYear();
// 	}

// 	get month()
// 	{
// 		return this._date.getMonth();
// 	}

// 	get day()
// 	{
// 		return this._date.getDate();
// 	}

// 	get hour()
// 	{
// 		return this._date.getHours();
// 	}

// 	get minute()
// 	{
// 		return this._date.getMinutes();
// 	}

// 	get second()
// 	{
// 		return this._date.getSeconds();
// 	}

// 	get millisecond()
// 	{
// 		return this._date.getMilliseconds();
// 	}

// 	get difference()
// 	{
// 		return this._date.getTime() - new Date().getTime();
// 	}

// 	get sum()
// 	{
// 		return this._date.getTime() + new Date().getTime();
// 	}

// 	addDays(days)
// 	{
// 		this._date.setDate(this._date.getDate() + days);
// 	}

// 	addHours(hours)
// 	{
// 		this._date.setHours(this._date.getHours() + hours);
// 	}

// 	addMinutes(minutes)
// 	{
// 		this._date.setMinutes(this._date.getMinutes() + minutes);
// 	}

// 	addMonths(months)
// 	{
// 		this._date.setMonth(this._date.getMonth() + months);
// 	}

// 	addSeconds(seconds)
// 	{
// 		this._date.setSeconds(this._date.getSeconds() + seconds);
// 	}

// 	addYears(years)
// 	{
// 		this._date.setFullYear(this._date.getFullYear() + years);
// 	}

// 	addMilliSeconds(milliseconds)
// 	{
// 		this._date.setMilliseconds(this._date.getMilliseconds() + milliseconds);
// 	}

// 	isDaylightSavingTime()
// 	{
// 		return this._date.getTimezoneOffset() < 0;
// 	}

// 	isLeapYear()
// 	{
// 		return this._date.getFullYear() % 4 === 0 && this._date.getFullYear() % 100 !== 0 || this._date.getFullYear() % 400 === 0;
// 	}

// 	isBefore(date)
// 	{
// 		return this._date.getTime() < date.getTime();
// 	}

// 	isAfter(date)
// 	{
// 		return this._date.getTime() > date.getTime();
// 	}

// 	isEqual(date)
// 	{
// 		return this._date.getTime() === date.getTime();
// 	}
// }