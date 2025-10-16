function DriverTeamDropdown() {
    $.ajax({
        url: `https://localhost:7253/api/Drivers`,
        method: 'GET',
        success: function (driverData) {
            debugger;
            var drivers = driverData;

            //put id as value and name as the displayed value
            Object.keys(drivers).forEach(function (entry) {
                $('#driver').append(`<option value=${drivers[entry]['id']}>${drivers[entry]['name']}</option>`);
            })

            $.ajax({
                url: `https://localhost:7253/api/Teams`,
                method: 'GET',
                success: function (teamData) {
                    debugger;
                    var teams = teamData;

                    Object.keys(teams).forEach(function (entry) {
                        $('#team').append(`<option value=${teams[entry]['id']}>${teams[entry]['name']}</option>`);
                    })
                },
                error: function (xhr, status, error) {
                    debugger;
                    $('#output').text('Error: ' + error);
                }
            })
        },
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    })
}

function GetDriverTeamPairs() {
    $.ajax({
        url: 'https://localhost:7253/api/Drivers/DriverTeamPairs',
        method: 'GET',
        success: function (data) {
            debugger;
            var drivers = data;

            Object.keys(drivers).forEach(function (entry) {
                debugger;
                $('#driverTable').append(`<tr id=${drivers[entry]['id']}>`);

                for (const [key, value] of Object.entries(drivers[entry])) {
                    $(`#${drivers[entry]['id']}`).append(`<td>${drivers[entry][key]}`);
                }

                $(`#${drivers[entry]['id']}`).append(`<td><a onclick='updatePageRedirect("UpdateDriver.html?id=", ${drivers[entry]['id']})'>Update</a></td>`)
                $(`#${drivers[entry]['id']}`).append(`<td><a onclick='DeleteDriver(${drivers[entry]['id']})'>Remove</a></td>`)
                $(`#${drivers[entry]['id']}`).append(`<td><a onclick='updatePageRedirect("UpdateDriverTeam.html?id=", ${drivers[entry]['id']})'>Update Driver Team</a></td>`)

                $('#driverTable').append('</tr>');
            });
        },
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    });
}

//get one entry for tables which do not have a primary key
function getOneDriverTeam() {
    var id = getId();

    return $.ajax({
        url: `https://localhost:7253/api/Drivers/DriverTeamPairs/${id}`,
        method: 'GET',
        success: function (driverData) {
            debugger;

            var driver = driverData[0];

            $('#Driver').append(`<td><p>${driver['name']}</p></td>`);
            $('#Team').append(`<td><p>${driver['team']}</p></td>`);
            $('#Race-Number').append(`<td><input id="RaceNumber" value=${driver['raceNumber']} / ></td>`);

            $.ajax({
                url: `https://localhost:7253/api/DriverTeams/${driver['id']}/${driver['teamId']}`,
                method: 'GET',
                success: function (data) {
                    debugger;
                    var driverTeam = data;

                    //var date = new Date(driverTeam['dateFrom']).toISOString();
                    var date = new Date(driverTeam['dateFrom']);

                    var year = date.getFullYear();
                    var month = ("0" + (date.getMonth() + 1)).slice(-2);
                    var day = ("0" + date.getDate()).slice(-2);

                    var dateValue = year + "-" + month + "-" + day;

                    $('#DateFrom').append(`<td><input type="date" id='DateFromInput' value=${dateValue} / ></td>`);
                    $('#DateFromInput').val(dateValue);
                    $('#DateFrom').append(`<button onclick="ResetDate('DateFromInput')">Reset Date</a>`)

                    $('#DateTo').append(`<td><input type="date" id='DateToInput' / ></td>`);
                    $('#DateTo').append(`<button onclick="ResetDate('DateToInput')">Reset Date</a>`);

                    if (driverTeam['dateTo'] !== null) {
                        var dateTo = new Date(driverTeam['dateTo']);

                        var yearTo = dateTo.getFullYear();
                        var monthTo = ("0" + (dateTo.getMonth() + 1)).slice(-2);
                        var dayTo = ("0" + dateTo.getDate()).slice(-2);

                        var dateToValue = yearTo + "-" + monthTo + "-" + dayTo;

                        $('#DateToInput').val(dateToValue);
                    }
                },
                error: function (xhr, status, error) {
                    debugger;
                    $('#output').text('Error: ' + error);
                }
            })

            $('#submitButton').attr('onclick', `loadJsonData('DriverTeams', 'PUT', ${driver['id']}, ${driver['teamId']})`);
        },
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    })
}