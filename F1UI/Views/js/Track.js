function getTracks() {
    $.ajax({
        url: "https://localhost:7253/api/Tracks",
        method: 'GET',
        success: function (data) {
            debugger;

            var tracks = data;

            Object.keys(tracks).forEach(function (entry) {
                debugger;
                $("#trackTable").append(`<tr id=${tracks[entry]['id']}></tr>`)

                for (const [key, value] of Object.entries(tracks[entry])) {
                    debugger;
                    $(`#${tracks[entry]['id']}`).append(`<td>${tracks[entry][key]}</td>`);
                }

                $(`#${tracks[entry]['id']}`).append(`<td><a onclick='updatePageRedirect("UpdateTrack.html?id=", ${tracks[entry]['id']})'>Update Track</a></td>`);
                $(`#${tracks[entry]['id']}`).append(`<td><a onclick='deleteTrack(${tracks[entry]['id']})'>Remove Track</a></td>`);
            })
        },
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    })
}

function deleteTrack(id) {
    if (confirm("Are you sure you want to delete the track with ID: " + id)) {
        try {
            $.ajax({
                url: `https://localhost:7253/api/Tracks/${id}`,
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
            alert(`Deleted track with ID ` + id);
            redirectMainPage("Track.html");
        };
        function getFail(jqXHR, textStatus, errorThrown) {
            debugger;
            alert(jqXHR.status);
        };
    }
}