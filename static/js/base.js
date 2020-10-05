import {
    getCookie,
    csrfSafeMethod
} from "../js/functions.js";

$(document).ready(function() {

    $("#ajaxLoginForm").submit(function(e) {

        // prevent form  from submitting synchronously
        e.preventDefault();

        $("#submitBtn").prop("disabled", true).html(
            `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Working...`
        );

        //get csrf cookie and set the cookie in ajax
        let csrftoken = getCookie('csrftoken');

        $.ajaxSetup({
            beforeSend: function(xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        //get the login form by ID and acquire the login url provided as html dataset
        const ajaxLoginForm = document.querySelector('#ajaxLoginForm');
        let ajaxLoginUrl = ajaxLoginForm.dataset.ajaxloginurl;

        // serialize the form data 
        let $serializedData = $(this).serialize();

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
        $("#ajaxLoginForm .modal-body").fadeOut(3000);
    });
});