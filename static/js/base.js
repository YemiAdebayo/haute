import {
    getCookie,
    csrfSafeMethod,
    writeInputErrorMessage,
    removeInputErrorMessage
} from "../js/functions.js";

$(document).ready(function() {

    //Check if login fields are empty and show error message on field blur or focus
    $(".error-handler").each(function() {
        $(this).blur(function() {
            var $this = $(this);
            writeInputErrorMessage($this);
        })
        $(this).focus(function() {
            var $this = $(this);
            removeInputErrorMessage($this);
        })
    });

    //Most of the globally scoped constants are defined here.
    const ajaxUpdateLoginStatusUrlDiv = document.querySelector('#LogInModal'),
        ajaxUpdateLoginStatusUrl = ajaxUpdateLoginStatusUrlDiv.dataset.ajaxupdatestatusloginurl,
        $ajaxLoginStatus = $("#ajaxLoginStatus"),
        $ajaxLoginForm = $("#ajaxLoginForm"),
        $ajaxLoginSubmitBtn = $("#ajaxLoginSubmitBtn"),
        $ajaxLoginErrorDiv = $("#ajaxLoginErrorDiv"),
        $ajaxLogoutLink = $("#ajaxLogoutLink");

    // This function asynchronously modifies the DOM after a successful login.
    const updateLoginTemplate = () => {
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

    //get csrf cookie and set the cookie in ajax
    let csrftoken = getCookie('csrftoken');

    //Configure default settings for Ajax request
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });

    const loginWithAjax = () => {

        //Get the login url provided as html dataset on ajaxLoginForm
        let ajaxLoginUrl = $ajaxLoginForm.data("ajaxloginurl");

        // serialize the form data 
        let $serializedData = $ajaxLoginForm.serialize();

        $.ajax({
            type: 'POST',
            url: ajaxLoginUrl,
            mode: 'same-origin',
            data: $serializedData,
            success: function(response) {
                //Get success message and other data
                const { message, status } = response;

                //Update the modal to show login success message
                $ajaxLoginForm.replaceWith(message);

                //Update the login status div
                $('#LogInModal').on('hidden.bs.modal', function(e) {
                    updateLoginTemplate();
                })
            },
            error: function(response) {

                $ajaxLoginErrorDiv.fadeIn(2000);
                $ajaxLoginSubmitBtn.prop("disabled", false).text(
                    `Sign In`
                );
            }
        });
    };

    const logoutWithAjax = () => {

        //Get the logout url provided as html dataset on ajaxLogoutLink
        let $ajaxLogoutUrl = $ajaxLogoutLink.data("ajaxlogouturl");
        console.log($ajaxLogoutUrl);

        $.ajax({
            type: 'POST',
            url: $ajaxLogoutUrl,
            data: '',
            success: function(response) {
                //Get success message and other data
                const { message, status } = response;

                //Update the modal to show login success message
                // $ajaxLoginForm.replaceWith(message);

                //Update the login status div
                // updateLoginTemplate();
            },
            error: function(response) {
                console.log(response);
            }
        });
    };

    $("#ajaxLoginForm").submit(function(e) {

        // prevent form  from submitting synchronously
        e.preventDefault();

        //Get all ajax login form fields that contain errors
        let $allWarning = $("#ajaxLoginForm").find(".warning");

        if (parseInt($allWarning.length) > 0) {
            console.log(`${$allWarning.length} failed! Form cannot be submitted.`);
        } else if ($allWarning.length === 0) {

            //Disable submit button to prevent multiple submit
            $ajaxLoginSubmitBtn.prop("disabled", true).html(
                `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Working...`
            );
            //send serialized form as ajax request
            loginWithAjax();
        }
    });

    $("#ajaxLogoutLink").click(function(e) {
        e.preventDefault();
        console.log("Logout button clicked!");
        // logoutWithAjax();
    });

});