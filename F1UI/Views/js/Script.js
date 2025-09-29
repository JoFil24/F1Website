function redirectMainPage(page) {
    location.replace(page);
}

function updatePageRedirect(page, id) {
    window.location.href = page + id;
}

//for the params, the needed input is
//"raceId=${raceId}"
function multipleParamsRedirect(page, param1, param2) {
    debugger;
    var pageWithParams = page + "?";
    for (var i = 0; i < paramList.length; i++) {
        pageWithParams = pageWithParams + paramList[i] + "&";
    }

    window.location.href = pageWithParams;
}

function convertDateFormat(date=null) {
    debugger;
    if (date === null) {
        //default is today
        var dateObj = new Date();
    }
    else {
        var dateObj = new Date(date);
    }

    var year = dateObj.getFullYear();
    var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
    var day = ("0" + dateObj.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
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

function getOneEntry(table, id) {
    return $.ajax({
        url: `https://localhost:7253/api/${table}/${id}`,
        method: 'GET'
    });
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

    if (table === "Drivers" || table === "Teams" || table === "Tracks") {
        var postdataObj = {
            "name": document.getElementById("NameInput").value,
            "isVisible": true
        }

        if (table === "Drivers" || table === "Tracks") {
            postdataObj['country'] = document.getElementById("CountryInput").value;

            if (table === "Tracks") {
                postdataObj['length'] = document.getElementById("LengthInput").value;
            }
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
    else if (table === "Races") {
        var postdataObj = {
            "raceDate": document.getElementById("RaceDateInput").value,
            "laps": document.getElementById("LapInput").value,
            "trackId": document.getElementById("TrackId").value,
            "isVisible": true
        }
    }

    else if (table === "Points") {
        var postdataObj = {
            "points": document.getElementById("pointsInput").value,
            "position": document.getElementById("positionInput").value
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

        if (table === "Points") {
            debugger;

            postdataObj['driverId'] = document.getElementById('driver').value;
            postdataObj['raceId'] = document.getElementById('race').value;

            html = `Points.html?id=${postdataObj['raceId']}`
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

            if (table === "Points") {
                postdataObj['driverId'] = id;
                postdataObj['raceId'] = id2;

                html = `Points.html?id=${id2}`
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
            if (data.id) {
                alert(`Created ${entity} with ID: ${data.id}`);
            }
            else {
                alert(`Created entry for table ${table}`)
            }
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
                case 'TRACK', 'TRACKS':
                    $('#NameInput').val(data.name);
                    $('#CountryInput').val(data.country);
                    $('#LengthInput').val(data.length);
            }
        })
        .fail(function (xhr, status, error) {
            $('#output').text('Error: ' + error);
        })
}