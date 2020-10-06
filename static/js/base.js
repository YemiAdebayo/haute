import {
    getCookie,
    csrfSafeMethod
} from "../js/functions.js";

$(document).ready(function() {

    $("#ajaxLoginForm").submit(function(e) {

        // prevent form  from submitting synchronously
        e.preventDefault();



        //get csrf cookie and set the cookie in ajax
        let csrftoken = getCookie('csrftoken');

        //get the login form by ID and acquire the login url provided as html dataset
        const ajaxLoginForm = document.querySelector('#ajaxLoginForm');
        let ajaxLoginUrl = ajaxLoginForm.dataset.ajaxloginurl;

        // serialize the form data 
        let $serializedData = $(this).serialize();

        $("#ajaxLoginForm").replaceWith(
            `<div class="d-flex justify-content-center align-items-center" style="height: 240px;">
                <div class="spinner-border p-2 m-0" role="status">
                    <span class="sr-only">Loading...</span>
                </div>
                <p class="p-2 m-0">Please wait...</p>
            </div>`
        );

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
                //reset the form after successful submit
                const { message, status } = response;
                console.log(message);
                console.log("status code: " + status);
                // $('#profile-update-form').unbind('submit').submit();
            },
            error: function(response) {
                console.log(response)
            }
        });
        // $("#ajaxLoginForm .modal-body").fadeOut(3000);
    });
});