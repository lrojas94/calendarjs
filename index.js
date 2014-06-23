var moment = require('moment');
var _ = require('lodash');

var Calendar = (function() {

  function Calendar(year, month) {
    this.moment = moment();

    if (year) {
      this.moment.year(year);
    }

    if (month) {
      if ("number" === typeof month) {
        month--; // to offset moment cause moment "0" = Jan.
      }
      this.moment.month(month);
    }

    // set to the beginning of the month;
    this.moment.date(1);
  }

  Calendar.prototype.daysOfWeekStrings = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  Calendar.prototype.monthStrings = ["Jan", "Feb", "Apr", "Mar", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  Calendar.prototype.createDay = function(moment) {
    return {
      month: moment.month() + 1, // [0, 11]
      date: moment.date(),
      day: moment.day(),
      year: moment.year()
    };
  };

  Calendar.prototype.generate = function(opts) {
    var m; // reused variable for moment()
    var w; // reused variable as a "week"

    // defaults
    opts = _.defaults(opts || {}, {
      withOtherMonthDays: true
    });

    // we will fill in this array
    var weeks = [];

    w = [];
    m = moment(this.moment);
    var daysInMonth = this.moment.daysInMonth();
    var d = 1;
    while (d <= daysInMonth) {
      // finish and close off the week
      if (m.day() === 0 && w.length) {
        weeks.push(w);
        w = [];
      }

      // add the day to the week
      w.push(this.createDay(m));

      // advance one day
      m.add('days', 1);
      d++;
    }

    // add the last week
    if (w.length) {
      weeks.push(w);
    }

    // we will associate other days to the first
    // and last weeks if applicable.
    if (opts.withOtherMonthDays) {
      w = weeks[0];
      m = moment(this.moment).subtract('days', 1);
      while (w.length < 7) {
        w.unshift(this.createDay(m));
        m.subtract('days', 1);
      }
      weeks[0] = w;

      w = weeks[weeks.length-1];
      m = moment(this.moment).add('months', 1);
      while (w.length < 7) {
        w.push(this.createDay(m));
        m.add('day', 1);
      }
      weeks[weeks.length-1] = w;
    }

    return weeks;
  };

  return Calendar;

})();

module.exports = Calendar;