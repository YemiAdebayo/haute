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
        $ajaxLoginErrorDiv = $("#ajaxLoginErrorDiv"),
        // $ajaxLogoutLink = $("#ajaxLogoutLink"),
        $ajaxLoginSubmitBtn = $("#ajaxLoginSubmitBtn");


    //get csrf cookie and set the cookie in ajax
    const csrftoken = getCookie('csrftoken');

    //Configure initial and default setup for Ajax request
    // $.ajaxSetup({
    //     beforeSend: function(xhr, settings) {
    //         if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
    //             xhr.setRequestHeader("X-CSRFToken", csrftoken);
    //         }
    //     }
    // });


    // This function asynchronously modifies the DOM after a successful login.
    const updateLoginTemplate = () => {
        $.ajax({
                type: 'GET',
                url: ajaxUpdateLoginStatusUrl,
                data: ''
            })
            .done(function(response) {
                $ajaxLoginStatus.html(response);
            })
            .fail(function(jqXHR, textStatus, errorThrown) {
                $ajaxLoginStatus.html(errorThrown);
            })
            .always(function() {
                console.log("Login template updated!");
            })
    };


    const loginWithAjaxHelperFunction = () => {

        // let csrftokenFromDOM = document.querySelector("input[name='csrfmiddlewaretoken']").value;
        // console.log(csrftokenFromDOM);

        let ajaxLoginForm = document.querySelector("#ajaxLoginForm");
        if (ajaxLoginForm) {
            ajaxLoginForm.addEventListener("submit", function(e) {

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

            })
        };

    };

    const loginWithAjax = () => {

        //Get the login url provided as html dataset on ajaxLoginForm
        let ajaxLoginUrl = $ajaxLoginForm.data("ajaxloginurl");

        // serialize the form data 
        let $serializedData = $("#ajaxLoginForm").serialize();

        //Send login form as Ajax request
        $.ajax({
                type: 'POST',
                url: ajaxLoginUrl,
                mode: 'same-origin',
                data: $serializedData,
            })
            .done(function(data, textStatus) {

                //Get success message and other data
                const {
                    message,
                } = data;

                //Update the modal to show login success message
                $("#ajaxLoginForm").replaceWith(message);

                $('#LogInModal').on('hidden.bs.modal', function() {
                    updateLoginTemplate();
                });

            })
            .fail(function(jqXHR, textStatus, errorThrown) {

                //Log error and error stattus code in the console.
                // console.log(errorThrown, textStatus);
                $ajaxLoginErrorDiv.fadeIn(2000);
                $ajaxLoginSubmitBtn.prop("disabled", false).text(
                    `Sign In`
                );
            })
            .always(function(jqXHROrData, textStatus, jqXHROrErrorThrown) {

                //Update the login status div and icon
                $('#LogInModal').on('hidden.bs.modal', function() {

                    updateLoginTemplate();

                    setTimeout(() => {
                        logoutWithAjaxHelperFunction();
                    }, 2000);
                });
            });
    };

    const logoutWithAjaxHelperFunction = () => {

        let ajaxLogoutLink = document.querySelector("#ajaxLogoutLink");
        //Check that Ajax logout link is in the DOM on document ready
        if (ajaxLogoutLink) {
            ajaxLogoutLink.addEventListener("click", function(e) {
                e.preventDefault();
                logoutWithAjax();
            });
        };

    };

    const logoutWithAjax = () => {

        //Get the logout url provided as html dataset on ajaxLogoutLink
        let ajaxLogoutLink = document.querySelector("#ajaxLogoutLink");
        let ajaxLogoutUrl = ajaxLogoutLink.dataset.ajaxlogouturl;

        $.ajax({
                type: 'GET',
                url: ajaxLogoutUrl,
                data: '',
            })
            .done(function(data, textStatus) {

                //Get success message and other data
                const {
                    message,
                    status
                } = data;

                console.log(textStatus);

                //Update the modal to show login success message
                // $ajaxLoginForm.replaceWith(message);

                //Update the login status div
                updateLoginTemplate();

                setTimeout(() => {
                    loginWithAjaxHelperFunction();
                }, 1000)

            })
            .fail(function(data, textStatus) {

                //Get success message and other data
                const {
                    message,
                    status
                } = data;

                console.log(textStatus);

            })
            .always(function(data, textStatus) {
                //Log final request status
                // console.log(textStatus);
            });
    };

    logoutWithAjaxHelperFunction();
    loginWithAjaxHelperFunction();

});