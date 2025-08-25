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
            var driversJSON = JSON.stringify(data, null, 2);

            var drivers = JSON.parse(driversJSON);

            Object.keys(drivers).forEach(function (entry) {
                $('#driverTable').append(`<tr id=${drivers[entry]['id']}>`);

                for (const [key, value] of Object.entries(drivers[entry])) {
                    $(`#${drivers[entry]['id']}`).append(`<td>${drivers[entry][key]}`);
                }

                $(`#${drivers[entry]['id']}`).append(`<td><a onclick='updatePageRedirect("UpdateDriver.html?id=", ${drivers[entry]['id']})'>Update</a></td>`)
                $(`#${drivers[entry]['id']}`).append(`<td><a onclick='DeleteData(${drivers[entry]['id']})'>Remove</a></td>`)

                $('#driverTable').append('</tr>');
            });
        },
        error: function (xhr, status, error) {
            debugger;
            $('#output').text('Error: ' + error);
        }
    });
}

function DeleteData(id) {
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

//function loadJsonData() {
//    debugger;

//    var postdata = JSON.stringify(
//        {
//            "name": document.getElementById("NameInput").value,
//            "country": document.getElementById("CountryInput").value,
//            "isVisible": true
//        });
//    try {
//        $.ajax({
//            url: 'https://localhost:7253/api/Drivers',
//            type: 'POST',
//            data: postdata,
//            contentType: 'application/json',
//            //dataType: 'json',
//            success: getSuccess,
//            error: getFail
//        });
//    } catch (e) {
//        debugger;
//        alert(e);
//    }
//    function getSuccess(data, textStatus, jqXHR) {
//        debugger;
//        alert(`Created driver with ID: ${data.id}`);
//    };
//    function getFail(jqXHR, textStatus, errorThrown) {
//        debugger;
//        alert(jqXHR.status);
//    };
//};

function getOneDriver(id) {
    return $.ajax({
        url: `https://localhost:7253/api/Drivers/${id}`,
        method: 'GET'
    });
}

//for creating or updating a driver
function loadJsonDriverData(method, id = null) {
    debugger; 

    method = method.toUpperCase();

    var postdataObj = {
        "name": document.getElementById("NameInput").value,
        "country": document.getElementById("CountryInput").value,
        "isVisible": true
    }

    if (method === 'POST') {
        var url = 'https://localhost:7253/api/Drivers';
    }
    else if (method === 'PUT') {
        if (!id) {
            console.log("ID needs to be provided for a PUT operation");
            return;
        }

        var url = `https://localhost:7253/api/Drivers/${id}`;

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
            alert(`Created driver with ID: ${data.id}`);
        }
        else {
            alert("Updated driver");
        }

        redirectMainPage("Driver.html");
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
function defaultValues() {
    debugger;

    var id = getId();

    getOneDriver(id)
        .done(function (driverData) {
            debugger;
            $('#NameInput').val(driverData.name);
            $('#CountryInput').val(driverData.country);
        })
        .fail(function (xhr, status, error) {
            $('#output').text('Error: ' + error);
        })
}

//function loadJsonData(id = null) {
//    debugger;

//    //var postdata = JSON.stringify(
//    //    {
//    //        "name": document.getElementById("NameInput").value,
//    //        "country": document.getElementById("CountryInput").value,
//    //        "isVisible": true
//    //    });

//    var postdataObj = {
//        "name": document.getElementById("NameInput").value,
//        "country": document.getElementById("CountryInput").value,
//        "isVisible": true
//    }

//    if (id) {
//        postdataObj['id'] = id;
//    }

//    var postdata = JSON.stringify(postdataObj);

//    try {
//        $.ajax({
//            url: `https://localhost:7253/api/Drivers/${id}`,
//            type: 'PUT',
//            data: postdata,
//            contentType: 'application/json',
//            //dataType: 'json',
//            success: getSuccess,
//            error: getFail
//        });
//    } catch (e) {
//        debugger;
//        alert(e);
//    }
//    function getSuccess(data, textStatus, jqXHR) {
//        debugger;
//        alert(`Updated driver`);
//        myFunc();
//    };
//    function getFail(jqXHR, textStatus, errorThrown) {
//        debugger;
//        alert(jqXHR.status);
//    };
//};