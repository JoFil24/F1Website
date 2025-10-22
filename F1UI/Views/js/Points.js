function GetPoints(raceId) {
    $.ajax({
        url: `https://localhost:7253/api/Points/raceDriverNames/${raceId}`,
        method: 'GET',
        success: function (data) {
            debugger;

            var points = data;

            Object.keys(points).forEach(function (entry) {
                debugger;

                $("#pointsTable").append(`<tr id='${points[entry]['driverId']}'></tr>`)

                $(`#${points[entry]['driverId']}`).append(`<td>${points[entry]['position']}</td>`);
                $(`#${points[entry]['driverId']}`).append(`<td>${points[entry]['driverName']}</td>`);
                $(`#${points[entry]['driverId']}`).append(`<td>${points[entry]['points']}</td>`);

                $(`#${points[entry]['driverId']}`).append(`<td><a onclick='redirectMainPage("updatePoints.html?raceId=${points[entry]['raceId']}&driverId=${points[entry]['driverId']}")'>Update</a></td>`);
                $(`#${points[entry]['driverId']}`).append(`<td><a onclick='deletePointsEntry(${getId()}, ${points[entry]['driverId']})'>Remove</a></td>`);
            })
        },
        error: function(xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    })
}

function pointsDropdown() {
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
                url: `https://localhost:7253/api/Races/RacesWithTracks`,
                method: 'GET',
                success: function (raceData) {
                    debugger;
                    var races = raceData;

                    Object.keys(races).forEach(function (entry) {
                        var raceDate = new Date(races[entry]['raceDate']);
                        var raceYear = raceDate.getFullYear();

                        $('#race').append(`<option value=${races[entry]['id']}>${races[entry]['trackName']} ${raceYear}</option>`);
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

function getOnePointsEntry() {
    var queryString = window.location.search;
    var urlParams = new URLSearchParams(queryString);
    var driverId = urlParams.get('driverId');
    var raceId = urlParams.get('raceId');

    $.ajax({
        url: `https://localhost:7253/api/Points/raceDriverNames/${driverId}/${raceId}`,
        method: 'GET',
        success: function (data) {
            debugger;
            var points = data[0];

            $("#driverDisplay").text(`${points['driverName']}`);
            $("#positionInput").val(points['position']);
            $("#pointsInput").val(points['points']);

            $('#submitButton').attr('onclick', `loadJsonData('Points', 'PUT', ${points['driverId']}, ${points['raceId']})`);
        },
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    })
}

function deletePointsEntry(raceId, driverId) {
    if (confirm("Are you sure you want to delete this points entry?")){
        try {
            $.ajax({
                url: `https://localhost:7253/api/Points/${driverId}/${raceId}`,
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
            alert(`Deleted points entry`);
            redirectMainPage(`Points.html?id=${raceId}`);
        };
        function getFail(jqXHR, textStatus, errorThrown) {
            debugger;
            alert(jqXHR.status);
        };
    }
}

function pointsSystem(position, halfPoints) {
    debugger;
    let points;

    if (typeof position === "string") {
        position = Number(position);
    }

    switch (position) {
        case 1:
            points = 25;
            break;
        case 2:
            points = 18;
            break;
        case 3:
            points = 15;
            break;
        case 4:
            points = 12;
            break;
        case 5:
            points = 10;
            break;
        case 6:
            points = 8;
            break;
        case 7:
            points = 6;
            break;
        case 8:
            points = 4;
            break;
        case 9:
            points = 2;
            break;
        case 10:
            points = 1;
            break;
        default:
            points = 0;
    }

    if (halfPoints) {
        points = points / 2;
    }

    return points;
}

function raceSelectDropdown() {
    $.ajax({
        url: `https://localhost:7253/api/Races/RacesWithTracks/`,
        method: 'GET',
        success: function (data) {
            //debugger;
            var races = data;

            Object.keys(races).forEach(function (entry) {
                var raceDate = new Date(races[entry]['raceDate']);
                var raceYear = raceDate.getFullYear();

                $('#race').append(`<option value=${races[entry]['id']}>${races[entry]['trackName']} ${raceYear}</option>`);
            })
        },
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    })
}

function driverTableAutoGenerate() {
    $.ajax({
        url: `https://localhost:7253/api/Drivers/DriverTeamPairs`,
        method: 'GET',
        success: function (data) {
            debugger;
            var drivers = data;

            //add all the positions selected

            Object.keys(drivers).forEach(function(entry) {
                var tr = document.createElement('tr');
                tr.id = `${drivers[entry]['id']}`;

                $("#driverRaceTable").append(tr);

                let removeButton = document.createElement('button');
                removeButton.textContent = 'X';
                removeButton.addEventListener('click', () => removeElement(tr));

                //if I add it as a string, it only prints the object as text and doesn't actually add the dropdown
                //I know this code is shit but it works fuck it

                //$(`#${drivers[entry]['id']}`).append(`<td>${select}</td>`);
                $(`#${drivers[entry]['id']}`).append(document.createElement('td').appendChild(pointsEntryPositionDropdown(drivers[entry]['id'])));
                $(`#${drivers[entry]['id']}`).append(`<td>${drivers[entry]['name']}</td>`);
                $(`#${drivers[entry]['id']}`).append(`<td>${drivers[entry]['team']}</td>`);
                $(`#${drivers[entry]['id']}`).append(`<td>${drivers[entry]['raceNumber']}</td>`);
                //$(`#${drivers[entry]['id']}`).append(`<td>${removeButton}</td>`);
                $(`#${drivers[entry]['id']}`).append(document.createElement('td').appendChild(removeButton));
            })
        }, 
        error: function(xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    })
}

function removeElement(el) {
    let element = el;
    element.remove();
}

function addElement(el, parent) {
    let element = el;
    parent.appendChild(element);
}

//execute both function on page onload
function createPointsTableOnload() {
    raceSelectDropdown();
    driverTableAutoGenerate();
}

function pointsEntryPositionDropdown(id) {
    var select = document.createElement('select');
    select.name = `positionFor${id}`;

    for (let i = 0; i < 26; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.textContent = i;

        select.appendChild(option);
    }

    return select;
}