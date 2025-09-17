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

                //list of parameters for the redirect
                //var paramList = [
                //    `raceId=${points[entry]['raceId']}`,
                //    `driverId=${points[entry]['driverId']}`
                //]

                $(`#${points[entry]['driverId']}`).append(`<td><a onclick='redirectMainPage("updatePoints.html?raceId=${points[entry]['raceId']}&driverId=${points[entry]['driverId']}")'>Update</a></td>`);
                //$(`#updateResultLinkForId${points[entry]['driverId']}`).click(function () {
                //    multipleParamsRedirect('updatePoints.html', paramList);
                //})
                //                    attr('onclick', 'multipleParamsRedirect("updatePoints.html", "' + paramList + '")');

                //$(`#${points[entry]['driverId']}`).append(`<td></td>`)
            })
        },
        error: function(xhr, status, error) {
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