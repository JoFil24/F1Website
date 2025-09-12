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