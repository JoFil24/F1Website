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