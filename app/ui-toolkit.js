// Note to self: Jobcan actually stores the info I'm calculating in the top of the page
// So we can probably do it a lot more efficiently.


// working days in the month
var user_info = Array.prototype.map.call(
    document.querySelectorAll('table.jbc-table')[1].querySelectorAll('td'),
		function (td) {
				return td.innerHTML.trim();
		}
);
// (0)working days, weekends worked, holidays worked, absences, late clock-ins, early leaves
var working_days_info = Array.prototype.map.call(
    document.querySelectorAll('table.jbc-table')[2].querySelectorAll('td'),
		function(td) {
				inner = td.querySelector('span').innerHTML.trim();
				return parseInt(inner)
    }
);
// (0)working minutes, scheduled minutes, overtime, night shift, weekday hours, weekday overtime, weekday nightshift,
//     holiday hours, holiday overtime, holiday nightshift
var working_minutes_info = Array.prototype.map.call(
    document.querySelectorAll('table.jbc-table')[3].querySelectorAll('td'),
		function(td) {
				inner = td.querySelector('span').innerHTML.trim();
				// Take HH:MM format and convert to just minutes
				split = inner.split(':');
				return (parseInt(split[0]) * 60) + parseInt(split[1])
    }
);

function minutes_to_hhmm(minutes){
	hours = parseInt(minutes / 60)
	minutes = minutes % 60
	hours_s = String(hours).padStart(2, '0')
	minutes_s = String(minutes).padStart(2, '0')
	return `${hours_s}:${minutes_s}`
}

// One-off value calculations
var daily_minutes = 450 // 7.5 * 60
var prescribed_working_days = parseInt(user_info[3].slice(0, 2)) // Prescribed Working Days stripped "Days", just uses num
var expected_monthly_minutes = prescribed_working_days * daily_minutes
var working_minutes = working_minutes_info[4] // Weekday Working Hours (converted to minutes)
var worked_days = working_days_info[1] // Weekdays Worked

var expected_worked_minutes = worked_days * daily_minutes
var minutes_diff = working_minutes - expected_worked_minutes

if (minutes_diff < 0) {
	var minutes_ahead = 0
	var minutes_behind = -minutes_diff
}
else {
	var minutes_ahead = minutes_diff
	var minutes_behind = 0
}

var table = `
<div class="col-lg-6 mb-3">
  <div class="card jbc-card-bordered h-100">
    <div class="card-header jbc-card-header"><h5 class="card-text">Monthly Progress for 7.5 Hour Days</h5></div>
    <div class="card-body">
      <table class='table jbc-table jbc-table-fixed'>
        <tbody>
          <tr>
            <th scope="row" class="jbc-text-sub text-nowrap">Days in Month</th>
            <td>${prescribed_working_days}</td>
          </tr>
          <tr>
            <th scope="row" class="jbc-text-sub text-nowrap">Expected hours for month</th>
            <td>${minutes_to_hhmm(expected_monthly_minutes)}</td>
          </tr>
          <tr>
            <th scope="row" class="jbc-text-sub text-nowrap">Days Worked</th>
            <td>${worked_days}</td>
          </tr>
          <tr>
            <th scope="row" class="jbc-text-sub text-nowrap">Expected hours worked so far</th>
            <td>${minutes_to_hhmm(expected_worked_minutes)}</td>
          </tr>
          <tr>
            <th scope="row" class="jbc-text-sub text-nowrap">Actual hours worked</th>
            <td>${minutes_to_hhmm(working_minutes)}</td>
          </tr>
          <tr>
            <th scope="row" class="jbc-text-sub text-nowrap">Hours Ahead</th>
            <td>${minutes_to_hhmm(minutes_ahead)}</td>
          </tr>
            <th scope="row" class="jbc-text-sub text-nowrap">Hours Behind</th>
            <td>${minutes_to_hhmm(minutes_behind)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
  
`

var append_spot = document.getElementsByClassName('row')[2]
append_spot.innerHTML = table + append_spot.innerHTML
