function redirectMainPage(page) {
    location.replace(page);
}

function updatePageRedirect(page, id) {
    window.location.href = page + id;
}

function getSelectedOptionId(id) {
    debugger;
    document.querySelector(`#${id}`).addEventListener('change', function (e) {
        debugger;   
        const selectedOptions = e.target.selectedOptions;
        return selectedOptions[0].id;
    });
}

function ResetDate(id) {
    debugger;
    var defaultValue = document.getElementById(id).defaultValue;
    if (defaultValue) {
        document.getElementById(id).value = defaultValue;
    }
    else {
        $(`#${id}`).val('')
            .attr('type', 'text')
            .attr('type', 'date');
    }
}

function GetDrivers() {
    $.ajax({
        url: 'https://localhost:7253/api/Drivers',
        method: 'GET',
        success: function (data) {
            debugger;
            var drivers = data;

            Object.keys(drivers).forEach(function (entry) {
                $('#driverTable').append(`<tr id=${drivers[entry]['id']}>`);

                for (const [key, value] of Object.entries(drivers[entry])) {
                    $(`#${drivers[entry]['id']}`).append(`<td>${drivers[entry][key]}`);
                }

                $(`#${drivers[entry]['id']}`).append(`<td><a onclick='updatePageRedirect("UpdateDriver.html?id=", ${drivers[entry]['id']})'>Update</a></td>`)
                $(`#${drivers[entry]['id']}`).append(`<td><a onclick='DeleteDriver(${drivers[entry]['id']})'>Remove</a></td>`)

                $('#driverTable').append('</tr>');
            });
        },
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    });
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

function GetTeams() {
    $.ajax({
        url: 'https://localhost:7253/api/Teams',
        method: 'GET',
        success: function (data) {
            debugger;
            var teams = data;

            Object.keys(teams).forEach(function (entry) {
                $('#teamTable').append(`<tr id=${teams[entry]['id']}>`);

                for (const [key, value] of Object.entries(teams[entry])) {
                    $(`#${teams[entry]['id']}`).append(`<td>${teams[entry][key]}`);
                }

                $(`#${teams[entry]['id']}`).append(`<td><a onclick='updatePageRedirect("UpdateTeam.html?id=", ${teams[entry]['id']})'>Update</a></td>`)
                $(`#${teams[entry]['id']}`).append(`<td><a onclick='DeleteTeam(${teams[entry]['id']})'>Remove</a></td>`)

                $('#teamTable').append('</tr>');
            });
        },
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    });
}
function DeleteDriver(id) {
    if (confirm("Are you sure you want to delete the driver with ID: " + id)) {
        try {
            $.ajax({
                url: `https://localhost:7253/api/Drivers/${id}`,
                type: 'DELETE',
                success: getSuccess,
                error: getFail
            });
        }
        catch (e) {
            alert(e);
        }
        function getSuccess(data, textStatus, jqXHR) {
            debugger;
            alert(`Delete driver with ID ` + id);
            redirectMainPage("Driver.html");
        };
        function getFail(jqXHR, textStatus, errorThrown) {
            debugger;
            alert(jqXHR.status);
        };
    }
}

function DeleteTeam(id) {
    if (confirm("Are you sure you want to delete the team with ID: " + id)) {
        try {
            $.ajax({
                url: `https://localhost:7253/api/Teams/${id}`,
                type: 'DELETE',
                success: getSuccess,
                error: getFail
            });
        }
        catch (e) {
            alert(e);
        }
        function getSuccess(data, textStatus, jqXHR) {
            debugger;
            alert(`Delete team with ID ` + id);
            redirectMainPage("Team.html");
        };
        function getFail(jqXHR, textStatus, errorThrown) {
            debugger;
            alert(jqXHR.status);
        };
    }
}

function getOneEntry(table, id) {
    return $.ajax({
        url: `https://localhost:7253/api/${table}/${id}`,
        method: 'GET'
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

//for creating or updating a driver
function loadJsonData(table, method, id = null, id2 = null) {
    debugger;

    var entity; //used for success message
    var html; //html for redirect

    switch (table.toUpperCase()) {
        case "driver".toUpperCase(), "drivers".toUpperCase():
            table = "Drivers";
            entity = "driver";
            html = "Driver.html"
            break;

        case "team".toUpperCase(), "teams".toUpperCase():
            table = "Teams";
            entity = "team";
            html = "Team.html"
            break;

        case "driverTeam".toUpperCase(), "driverTeams".toUpperCase():
            table = "DriverTeams";
            entity = "driver-team pairing";
            html = "Driver.html"
            break;

        case "point".toUpperCase(), "points".toUpperCase():
            table = "Points";
            entity = "points scoring";
            html = "Points.html"
            break;

        case "race".toUpperCase(), "races".toUpperCase():
            table = "Races";
            entity = "race";
            html = "Race.html"
            break;

        case "track".toUpperCase(), "tracks".toUpperCase():
            table = "Tracks";
            entity = "track";
            html = "Track.html"
            break;

        default:
            alert(`There is no table called ${table}`);
            return;
    }

    method = method.toUpperCase();

    if (table === "Drivers" || table === "Teams") {
        var postdataObj = {
            "name": document.getElementById("NameInput").value,
            "isVisible": true
        }

        if (table === "Drivers") {
            postdataObj['country'] = document.getElementById("CountryInput").value;
        }
        else if (table === "Teams") {
            postdataObj['engine'] = document.getElementById("EngineInput").value;
        }
    }
    else if (table === "DriverTeams") {
        debugger;
        var postdataObj = {
            "raceNumber": $("#RaceNumber").val()
        }
    }

    if (method === 'POST') {
        if (table === "DriverTeams") {
            debugger;

            postdataObj['driverId'] = document.getElementById('driver').value;
            postdataObj['teamId'] = document.getElementById('team').value;

            var dateFrom = document.getElementById("DateFromInput").value;
            var dateTo = document.getElementById("DateToInput").value;

            if (dateFrom === "") {
                var dateFromString = new Date().toISOString();
            }
            else {
                var dateFromString = new Date(dateFrom).toISOString();
            }

            if (dateTo === "") {
                var dateToString = null;
            }
            else {
                var dateToString = new Date(dateTo).toISOString();
            }

            postdataObj['dateFrom'] = dateFromString;
            postdataObj['dateTo'] = dateToString;
        }

        var url = `https://localhost:7253/api/${table}`;
    }
    else if (method === 'PUT') {
        if (!id) {
            console.log("ID needs to be provided for a PUT operation");
            return;
        }

        if (table === "DriverTeams" || table === "Points") {
            if (!id || !id2) {
                alert("Both IDs are needed for a PUT operation");
            }

            if (table === "DriverTeams") {
                postdataObj['driverId'] = id;
                postdataObj['teamId'] = id2;

                if (document.getElementById('DateFromInput').value === "") {
                    var dateFromString = new Date(document.getElementById('DateFromInput').defaultValue).toISOString();
                }
                else {
                    var dateFromString = new Date(document.getElementById('DateFromInput').value).toISOString();
                }

                if (document.getElementById('DateToInput').value === "") {
                    var dateToString = null;
                }
                else {
                    var dateToString = new Date(document.getElementById('DateToInput').value).toISOString();
                }

                postdataObj['dateFrom'] = dateFromString;
                postdataObj['dateTo'] = dateToString;
            }

            var url = `https://localhost:7253/api/${table}/${id}/${id2}`;
        }
        else {
            var url = `https://localhost:7253/api/${table}/${id}`;

            postdataObj['id'] = id;
            }
    }
    else {
        console.log(`${method} is not a valid method, try again`);
        return;
    }

    var postdata = JSON.stringify(postdataObj);

    try {
        $.ajax({
            url: url,
            type: method,
            data: postdata,
            contentType: 'application/json',
            success: getSuccess,
            error: getFail
        });
    } catch (e) {
        debugger;
        alert(e);
    }


    function getSuccess(data, textStatus, jqXHR) {
        debugger;
        if (data) {
            alert(`Created ${entity} with ID: ${data.id}`);
        }
        else {
            alert(`Updated ${entity}`);
        }

        redirectMainPage(html);
    };
    function getFail(jqXHR, textStatus, errorThrown) {
        debugger;
        alert(jqXHR.status);
    };
}

function getId() {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var id = urlParams.get('id');

    return id;
}

//when on the update page
//fill in the boxes with the existing info
function defaultValues(table) {
    debugger;
    //from which table is the entity

    var id = getId();

    getOneEntry(table, id)
        .done(function (data) {
            debugger;

            switch (table.toUpperCase()) {
                case 'DRIVER', 'DRIVERS':
                    $('#NameInput').val(data.name);
                    $('#CountryInput').val(data.country);
                    break;

                case 'TEAM', 'TEAMS':
                    $('#NameInput').val(data.name);
                    $('#EngineInput').val(data.engine);
                    break;
            }
        })
        .fail(function (xhr, status, error) {
            $('#output').text('Error: ' + error);
        })
}

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
        } ,
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    })
}

function GetRaces() {
    $.ajax({
        url: `https://localhost:7253/api/Races/RacesWithTracks`,
        method: 'GET',
        success: function (data) {
            debugger;
            var races = data;

            Object.keys(races).forEach(function (entry) {
                debugger;
                $('#raceTable').append(`<tr id=${races[entry]['id']}>`);

                for (const [key, value] of Object.entries(races[entry])) {
                    if (key.toLowerCase().includes("date")) {
                        var date = new Date(races[entry][key]);
                        year = date.getFullYear();
                        month = date.getMonth();
                        day = date.getDate();

                        //slice(-2) so it can get the last 2 characters
                        //ex. if the date is 1, it will print out 01 since it will be 2 characters
                        //if the date is 11, it will add the 0 to make 011, then get the last 2 characters for 11
                        var dateString = `${year}-${("0" + (month + 1)).slice(-2)}-${("0" + day).slice(-2)}`

                        $(`#${races[entry]['id']}`).append(`<td>${dateString}</td>`);
                    }
                    else {
                        $(`#${races[entry]['id']}`).append(`<td>${races[entry][key]}</td>`);
                    }
                }

                $(`#${races[entry]['id']}`).append(`<td><a onclick=''>Update Race</a></td>`);
                $(`#${races[entry]['id']}`).append(`<td><a onclick=''>Remove Race</a></td>`);
            })
        },
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    })
}