function redirectMainPage(page) {
    location.replace(page);
}

function updatePageRedirect(page, id) {
    window.location.href = page + id;
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

//for creating or updating a driver
function loadJsonData(table, method, id = null) {
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
    else if (table == "DriverTeams") {
        var date = new Date();
        
        debugger;
        //slice(-2) is to get the last 2 digits
        //after adding 0
        //if the date is between 1 and 9, last digits would be 01 to 09
        //for the milisecond, the last 3 digits, same logic
        var dateString = date.getFullYear() + "-" + ('0' + (date.getMonth() + 1)).slice(-2) + "-" + ('0' + (date.getDate())).slice(-2)
            + "T" + ('0' + (date.getHours())).slice(-2) + ":" + ('0' + (date.getMinutes())).slice(-2) + ":"
            + ('0' + (date.getSeconds())).slice(-2) + "." + ('00' + (date.getMilliseconds())).slice(-3);

        debugger;
        var postdataObj = {
            "driverId": document.getElementById("driverChoice").value,
            "teamId": document.getElementById("teamChoice").value,
            "raceNumber": document.getElementById("RaceNumber").value,
            "dateFrom": dateString,
            "dateTo": null
        }
    }

    if (method === 'POST') {
        var url = `https://localhost:7253/api/${table}`;
    }
    else if (method === 'PUT') {
        if (!id) {
            console.log("ID needs to be provided for a PUT operation");
            return;
        }

        var url = `https://localhost:7253/api/${table}/${id}`;

        postdataObj['id'] = id;
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
                $('#driverChoice').append(`<option value=${drivers[entry]['id']}>${drivers[entry]['name']}</option>`);
            })

            $.ajax({
                url: `https://localhost:7253/api/Teams`,
                method: 'GET',
                success: function (teamData) {
                    debugger;
                    var teams = teamData;

                    Object.keys(teams).forEach(function (entry) {
                        $('#teamChoice').append(`<option value=${teams[entry]['id']}>${teams[entry]['name']}</option>`);
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