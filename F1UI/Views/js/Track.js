function getTracks() {
    $.ajax({
        url: "https://localhost:7253/api/Tracks",
        method: 'GET',
        success: function (data) {
            debugger;

            var tracks = data;

            Object.keys(tracks).forEach(function (entry) {
                $("#trackTable").append(`<tr id=${tracks[entry]['id']}></tr>`)

                for (const [key, value] of Object.entries(tracks[entry])) {
                    $(`#${tracks[entry]['id']}`).append(`<td>${tracks[entry][key]}</td>`);
                }

                $(`#${tracks[entry]['id']}`).append(`<td><a onclick=''>Update Track</a></td>`);
                $(`#${tracks[entry]['id']}`).append(`<td><a onclick=''>Remove Track</a></td>`);
            })
        },
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    })
}