import {
    getCookie,
    csrfSafeMethod
} from "../js/functions.js";

$(document).ready(function() {

    //Most of the globally scoped constants are defined here.
    const ajaxUpdateLoginStatusUrlDiv = document.querySelector('#LogInModal'),
        ajaxUpdateLoginStatusUrl = ajaxUpdateLoginStatusUrlDiv.dataset.ajaxupdatestatusloginurl,
        $ajaxLoginStatus = $("#ajaxLoginStatus"),
        $ajaxLoginForm = $("#ajaxLoginForm");

    // This function asynchronously modifies the DOM after a successful login.
    const updateLogin = () => {
        $.ajax({
            type: 'GET',
            url: ajaxUpdateLoginStatusUrl,
            data: '',
            success: function(response) {
                $ajaxLoginStatus.html(response);
            },
            error: function(response) {
                console.log(response)
            }
        });
    };

    $ajaxLoginForm.submit(function(e) {

        // prevent form  from submitting synchronously
        e.preventDefault();

        //get csrf cookie and set the cookie in ajax
        let csrftoken = getCookie('csrftoken');

        //Get the login url provided as html dataset on ajaxLoginForm
        let ajaxLoginUrl = $ajaxLoginForm.data("ajaxloginurl");

        // serialize the form data 
        let $serializedData = $ajaxLoginForm.serialize();

        // $ajaxLoginForm.replaceWith(
        //     `<div class="d-flex justify-content-center align-items-center" style="height: 240px;">
        //         <div class="spinner-border p-2 m-0" role="status">
        //             <span class="sr-only">Loading...</span>
        //         </div>
        //         <p class="p-2 m-0">Please wait...</p>
        //     </div>`
        // );

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        //send serialized form as ajax request
        $.ajax({
            type: 'POST',
            url: ajaxLoginUrl,
            data: $serializedData,
            success: function(response) {
                //Get success message and other data
                const { message, status } = response;

                //Update the modal to show login success message
                // let processedMessage = `${message}`;
                console.log(message);
                $ajaxLoginForm.replaceWith(message);

                $('#LogInModal').on('hidden.bs.modal', function(e) {
                    updateLogin();
                })
            },
            error: function(response) {
                console.log(response)
            }
        });
    });

});