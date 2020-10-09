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

        //Disable submit button to prevent multiple submit
        $("#ajaxLoginSubmitBtn").prop("disabled", true).html(
            `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Working...`
        );

        //get csrf cookie and set the cookie in ajax
        let csrftoken = getCookie('csrftoken');

        //Get the login url provided as html dataset on ajaxLoginForm
        let ajaxLoginUrl = $ajaxLoginForm.data("ajaxloginurl");

        // serialize the form data 
        let $serializedData = $ajaxLoginForm.serialize();

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
            // mode: 'same-origin',
            data: $serializedData,
            success: function(response) {
                //Get success message and other data
                const { message, status } = response;

                //Update the modal to show login success message
                $ajaxLoginForm.replaceWith(message);

                //Update the login status div
                $('#LogInModal').on('hidden.bs.modal', function(e) {
                    updateLogin();
                })
            },
            error: function(response) {

                $("#ajaxLoginErrorDiv").fadeIn(2000);
                $("#ajaxLoginSubmitBtn").prop("disabled", false).text(
                    `Sign In`
                );
            }
        });
    });

});