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

    //Sign up with Ajax main functio

    const initializeAjaxSignUp = () => {

        let ajaxSignUpSubmitBtn = document.querySelector("#ajaxSignUpSubmitBtn");

        //Check that the form is in the DOM
        if (ajaxSignUpSubmitBtn) {

            ajaxSignUpSubmitBtn.addEventListener("click", function(e) {
                //Prevent form from being submitted
                e.preventDefault();
                signupWithAjax();
            })
        };
    };

    const signupWithAjax = () => {

        //Get the signup url provided as html dataset on ajaxLoginForm
        let ajaxSignupUrl = $("#ajaxSignUpForm").data("ajaxsignupurl");

        // serialize the form data 
        let $serializedData = $("#ajaxSignUpForm").serialize();
        console.log($serializedData);
    };


    // This function asynchronously modifies the DOM after a successful login.
    async function updateLoginTemplate() {

        return await $.ajax({
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
            });
    };

    const initializeAjaxLogin = () => {

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
                let {
                    message,
                } = data;

                //Update the modal to show login success message
                $("#ajaxLoginForm").replaceWith(message);


                $('#LogInModal').on('hide.bs.modal', function() {
                    updateLoginTemplate()
                        .then(res => {
                            initializeAjaxLogout();
                        });
                });

            })
            .fail(function(data, textStatus, errorThrown) {

                //Log error and error stattus code in the console.
                const {
                    status
                } = data;

                if (parseInt(status) === 401) {
                    $ajaxLoginErrorDiv.fadeIn(1500);
                };

                if (parseInt(status) === 408) {
                    $(".error-span").text(`Your request timed out. Please try later!`);
                    $ajaxLoginErrorDiv.fadeIn(1500);
                };

                $ajaxLoginSubmitBtn.prop("disabled", false).text(
                    `Sign In`
                );
            })
            .always(function(jqXHROrData, textStatus, jqXHROrErrorThrown) {

                //Run other executions here

            });
    };

    const initializeAjaxLogout = () => {

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
        let ajaxLogoutLink = document.querySelector("#ajaxLogoutLink"),
            ajaxLogoutUrl = ajaxLogoutLink.dataset.ajaxlogouturl;

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

                updateLoginTemplate()
                    .then(res => {
                        initializeAjaxLogin();
                        initializeShowSignUpModal();
                        initializeShowLoginpModal();
                    });

            })
            .fail(function(data, textStatus) {

                //Get success message and other data
                const {
                    message,
                    status
                } = data;

                console.log(textStatus, status);

            })
            .always(function(data, textStatus) {
                //Log final request status
                // console.log(textStatus);
            });
    };

    const initializeShowSignUpModal = () => {
        let showSignUpModalBtn = document.querySelector("#showSignUpModalBtn");

        if (showSignUpModalBtn) {
            showSignUpModalBtn.addEventListener("click", function(e) {

                // prevent button from clicking.
                e.preventDefault();

                console.log("Yea, button prevented from clicking!");

                $(".modal-content.for-login").fadeTo("fast", 0).fadeOut(15);
                $(".modal-content.for-signup").fadeIn(250).fadeTo("slow", 1);
            });
        };
    };

    const initializeShowLoginpModal = () => {
        let showLoginModalBtn = document.querySelector("#showLoginModalBtn");

        if (showLoginModalBtn) {
            showLoginModalBtn.addEventListener("click", function(e) {

                // prevent button from clicking.
                e.preventDefault();

                console.log("Yea, button prevented from clicking!");

                $(".modal-content.for-signup").fadeTo("fast", 0).fadeOut(15);
                $(".modal-content.for-login").fadeIn(250).fadeTo("slow", 1);
            });
        };
    };

    initializeAjaxLogout();
    initializeAjaxLogin();
    initializeShowSignUpModal();
    initializeShowLoginpModal();
    initializeAjaxSignUp();

});