function TrackDropdown() {
    $.ajax({
        url: `https://localhost:7253/api/Tracks`,
        method: 'GET',
        success: function (data) {
            debugger;

            var tracks = data;

            //set today's date as the minimum value
            $("#RaceDateInput").attr('min', convertDateFormat());

            Object.keys(tracks).forEach(function (entry) {
                $("#TrackId").append(`<option value="${tracks[entry]['id']}">${tracks[entry]['name']}</option>`);
            })
        },
        error: function (xhr, status, error) {
            debugger;
            alert("Error: " + status + " " + error);
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

                $(`#${races[entry]['id']}`).append(`<td><a onclick='updatePageRedirect("UpdateRace.html?id=", ${races[entry]['id']})'>Update Race</a></td>`);
                $(`#${races[entry]['id']}`).append(`<td><a onclick='DeleteRace(${races[entry]['id']})'>Remove Race</a></td>`);

                //this is for the points, updatePageRedirect is used to add the id parameter
                $(`#${races[entry]['id']}`).append(`<td><a onclick='updatePageRedirect("Points.html?id=", ${races[entry]['id']})'>Results</a></td>`);
            })
        },
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    })
}

function getRace() {
    var id = getId();

    $.ajax({
        url: `https://localhost:7253/api/Races/RacesWithTracks/${id}`,
        method: 'GET',
        success: function (data) {
            debugger;

            //only one race is present anyways
            var race = data[0];

            $("#RaceDateInput").attr('value', convertDateFormat(race['raceDate']));
            $("#LapInput").val(race['laps']);
            $("#Track").append(`<td><p>${race['trackName']}</p></td>`);
            document.getElementById('TrackId').value = race['trackId'];
        },
        error: function (xhr, status, error) {
            debugger;
            alert("Error: " + status + " " + error);
        }
    })
}

function DeleteRace(id) {
    if (confirm("Are you sure you want to delete the race with ID: " + id)) {
        try {
            $.ajax({
                url: `https://localhost:7253/api/Races/${id}`,
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
            alert(`Delete race with ID ` + id);
            redirectMainPage("Race.html");
        };
        function getFail(jqXHR, textStatus, errorThrown) {
            debugger;
            alert(jqXHR.status);
        };
    }
}