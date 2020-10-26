import {
    getCookie,
    csrfSafeMethod,
    writeInputErrorMessage,
    removeInputErrorMessage,
    isValidEmail,
    validateName,
    isValidPhoneNumber
} from "../js/functions.js";

$(document).ready(function () {

    //Check if login and sign up fields are empty and show error message on field blur or focus
    $(".error-handler").each(function () {
        $(this).blur(function () {
            var $this = $(this);
            writeInputErrorMessage($this);
        })
        $(this).focus(function () {
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
        $ajaxSignUpSubmitBtn = $("#ajaxSignUpSubmitBtn"),
        $ajaxLoginSubmitBtn = $("#ajaxLoginSubmitBtn");

    const toggleSignUpPasswordVisibility = () => {
        //Get the toggle button and password field
        let btn = document.querySelector("#ajaxSignUpPasswordRevealBtn"),
            passwordSelector = document.querySelector("#ajaxSignUpPasswordOne");

        //Attach event to the toggle button and make password visible on toggle
        btn.addEventListener('click', function (e) {
            // toggle the type attribute
            const type = passwordSelector.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordSelector.setAttribute('type', type);
            // toggle the eye slash icon
            this.classList.toggle('fa-eye-slash');
            this.classList.toggle('fa-eye');
        });
    };

    const toggleLoginPasswordVisibility = () => {
        //Get the toggle button and password field
        let btn = document.querySelector("#ajaxLoginPasswordRevealBtn"),
            passwordSelector = document.querySelector("#ajaxLoginPassword");

        //Attach event to the toggle button and make password visible on toggle
        btn.addEventListener('click', function (e) {
            // toggle the type attribute
            const type = passwordSelector.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordSelector.setAttribute('type', type);
            // toggle the eye slash icon
            this.classList.toggle('fa-eye-slash');
            this.classList.toggle('fa-eye');
        });
    };

    //Sign up with Ajax helper function
    const initializeAjaxSignUp = () => {
        /*  
            Traverse the DOM to get the Sign up form here.
            Important to do it here rather than as a global constant because the DOM
            the DOM changes regularly as a result of async login and logout.
         */
        let ajaxSignUpForm = document.querySelector("#ajaxSignUpForm");

        //Check that the form is in the DOM
        if (ajaxSignUpForm) {
            ajaxSignUpForm.addEventListener("submit", function (e) {
                //Prevent the sign up form from being submitted.
                e.preventDefault();

                //Check that all input fields have values provided and throw exceptions if not.
                $("#ajaxSignUpForm .error-handler").each(function () {
                    let $this = $(this);
                    writeInputErrorMessage($this);
                });

                /*
                    Get all ajax login form fields and 
                    define most function level variables here.
                */
                let allwarning = ajaxSignUpForm.querySelectorAll(".warning"),
                    $firstName = $("#ajaxSignUpFirstName"),
                    $lastName = $("#ajaxSignUpLastName"),
                    $email = $("#ajaxSignUpEmail"),
                    $phone = $("#ajaxSignUpPhoneNumber"),
                    $password = $("#ajaxSignUpPasswordOne"),
                    $passwordTwo = $("#ajaxSignUpPasswordTwo"),

                    /*
                        This regex checks that the name provided on
                        sign up is at least 2 and at most 50 characters long
                    */
                    nameLenRgx = /^\w{2,50}$/;

                if (parseInt(allwarning.length) > 0) {
                    console.log(`${allwarning.length} failed! Form cannot be submitted.`);
                };

                if (!nameLenRgx.test($.trim($firstName.val()))) {
                    //Show error message
                    validateName($firstName, "Name must be between 2 to 50 characters long!");
                } else if (!nameLenRgx.test($.trim($lastName.val()))) {
                    //Show error message
                    validateName($lastName, "Name must be between 2 to 50 characters long!");
                } else if (!isValidEmail($.trim($email.val()))) {
                    //Show error message
                    validateName($email, "Email is not valid!");
                } else if (!isValidPhoneNumber($.trim($phone.val()))) {
                    //Show error message
                    validateName($phone, "Phone number is not valid!");
                    console.log($phone.val());
                } else if (parseInt($.trim($password.val()).length) < 8) {
                    //Show error message
                    validateName($password, "Password too short!");
                } else {
                    //Disable submit button to prevent multiple submit
                    $ajaxSignUpSubmitBtn.prop("disabled", true).html(
                        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Signing up...`
                    );
                    //Set passwordTwo value equals passwordOne
                    $passwordTwo.val($.trim($password.val()));
                    signupWithAjax();
                };
            })
        };
    };

    //Main Ajax Sign up function
    const signupWithAjax = () => {

        //Get the signup url provided as html dataset on ajaxLoginForm
        let ajaxSignupUrl = $("#ajaxSignUpForm").data("ajaxsignupurl");

        //get csrf cookie and preset the cookie in be Ajax request is sent
        let csrftoken = getCookie('csrftoken');

        //Configure initial and default setup for Ajax request
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        // serialize the form data 
        let $serializedData = $("#ajaxSignUpForm").serialize();

        //Send Ajax request
        $.ajax({
                type: 'POST',
                url: ajaxSignupUrl,
                mode: 'same-origin',
                data: $serializedData,
            })
            .done(function (responseData, textStatus, jqXHR) {

                //Get success message and other data
                let {
                    message,
                } = responseData;

                //Update the modal to show login success message
                $("#ajaxSignUpForm").replaceWith(message);

                $('#LogInModal').on('hidden.bs.modal', function () {
                    updateLoginTemplate()
                        .then(res => {
                            initializeAjaxLogout();
                        });
                });

            })
            .fail(function (jqXHR, textStatus, errorThrown) {

                // //Log error and error stattus code in the console.
                // const {
                //     status
                // } = data;

                // if (parseInt(status) === 401) {
                //     $ajaxLoginErrorDiv.fadeIn(1500);
                // };

                let errorJSON = jqXHR["responseJSON"];
                const {
                    email,
                    password2
                } = errorJSON;

                // if (parseInt(status) === 408) {
                //     $(".error-span").text(`Your request timed out. Please try later!`);
                //     $ajaxLoginErrorDiv.fadeIn(1500);
                // };

                if (email && email[0] === "This email is taken!") {
                    $("#ajaxSignUpErrorDiv").fadeIn(1500);
                    $ajaxSignUpSubmitBtn.prop("disabled", false).text(
                        `Sign Up`
                    );
                } else if (password2 && password2[0] === "This password is too common.") {
                    $("#ajaxSignUpErrorDiv .error-span").text(`${password2[0]}`);
                    $("#ajaxSignUpErrorDiv").fadeIn(1500);
                    $ajaxSignUpSubmitBtn.prop("disabled", false).text(
                        `Sign Up`
                    );
                };

                // $ajaxLoginSubmitBtn.prop("disabled", false).text(
                //     `Sign In`
                // );

                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            })
            .always(function (jqXHROrData, textStatus, jqXHROrErrorThrown) {

                //Run other executions here

            });
    };


    // This function asynchronously modifies the DOM after a successful login.
    async function updateLoginTemplate() {

        return await $.ajax({
                type: 'GET',
                url: ajaxUpdateLoginStatusUrl,
                data: ''
            })
            .done(function (response) {
                $ajaxLoginStatus.html(response);
            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                $ajaxLoginStatus.html(errorThrown);
            })
            .always(function () {
                console.log("Login template updated!");
            });
    };

    const initializeAjaxLogin = () => {

        let ajaxLoginForm = document.querySelector("#ajaxLoginForm");
        if (ajaxLoginForm) {
            ajaxLoginForm.addEventListener("submit", function (e) {

                // prevent form  from submitting synchronously
                e.preventDefault();

                let $usernameField = $("#ajaxLoginUsername"),
                    $passwordField = $("#ajaxLoginPassword");

                let emailVal = document.querySelector("#ajaxLoginUsername").value,
                    passwordVal = document.querySelector("#ajaxLoginPassword").value;


                //Get all ajax login form fields that contain errors
                let allwarning = ajaxLoginForm.querySelectorAll(".warning");

                if (parseInt(allwarning.length) > 0) {
                    console.log(`${allwarning.length} failed! Form cannot be submitted.`);
                } else if (!emailVal) {
                    //Show error message
                    writeInputErrorMessage($usernameField, "Enter a valid email!");

                    //Enable submit button to allow retry
                    $ajaxLoginSubmitBtn.prop("disabled", false).text(
                        `Sign In`
                    );
                } else if (!passwordVal) {
                    //Show error message
                    writeInputErrorMessage($passwordField, "Enter a valid password!");

                    //Enable submit button to allow retry
                    $ajaxLoginSubmitBtn.prop("disabled", false).text(
                        `Sign In`
                    );
                } else {
                    //Disable submit button to prevent multiple submit
                    $ajaxLoginSubmitBtn.prop("disabled", true).html(
                        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Signing in...`
                    );
                    //send serialized form as ajax request
                    loginWithAjax();
                };
            })
        };
    };

    const loginWithAjax = () => {

        //Get the login url provided as html dataset on ajaxLoginForm
        let ajaxLoginUrl = $ajaxLoginForm.data("ajaxloginurl");

        //get csrf cookie and preset the cookie in be Ajax request is sent
        let csrftoken = getCookie('csrftoken');

        //Configure initial and default setup for Ajax request
        $.ajaxSetup({
            beforeSend: function (xhr, settings) {
                if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                    xhr.setRequestHeader("X-CSRFToken", csrftoken);
                }
            }
        });

        // serialize the form data 
        let $serializedData = $("#ajaxLoginForm").serialize();

        //Send login form as Ajax request
        $.ajax({
                type: 'POST',
                url: ajaxLoginUrl,
                mode: 'same-origin',
                data: $serializedData,
            })
            .done(function (data, textStatus, jqXHR) {

                //Get success message and other data
                let {
                    message,
                } = data;

                //Update the modal to show login success message
                $("#ajaxLoginForm").replaceWith(message);


                $('#LogInModal').on('hide.bs.modal', function () {
                    updateLoginTemplate()
                        .then(res => {
                            initializeAjaxLogout();
                        });
                });

            })
            .fail(function (data, textStatus, errorThrown) {

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
            .always(function (jqXHROrData, textStatus, jqXHROrErrorThrown) {

                //Run other executions here

            });
    };

    const initializeAjaxLogout = () => {

        let ajaxLogoutLink = document.querySelector("#ajaxLogoutLink");
        //Check that Ajax logout link is in the DOM on document ready
        if (ajaxLogoutLink) {
            ajaxLogoutLink.addEventListener("click", function (e) {
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
            .done(function (data, textStatus, jqXHR) {

                updateLoginTemplate()
                    .then(res => {
                        initializeAjaxLogin();
                        initializeShowSignUpModal();
                        initializeShowLoginpModal();
                        initializeAjaxSignUp();
                        toggleLoginPasswordVisibility();
                        toggleSignUpPasswordVisibility();
                    });

            })
            .fail(function (jqXHR, textStatus, errorThrown) {
                console.log(jqXHR);
                console.log(textStatus);
                console.log(errorThrown);
            })
            .always(function (data, textStatus) {
                //Log final request status
                // console.log(textStatus);
            });
    };

    const initializeShowSignUpModal = () => {
        let showSignUpModalBtn = document.querySelector("#showSignUpModalBtn");

        if (showSignUpModalBtn) {
            showSignUpModalBtn.addEventListener("click", function (e) {
                // prevent button from clicking.
                e.preventDefault();

                //Fade in the new modal
                $(".modal-content.for-login").fadeTo("fast", 0).fadeOut(15);
                $(".modal-content.for-signup").fadeIn(250).fadeTo("slow", 1);
            });
        };
    };

    const initializeShowLoginpModal = () => {
        let showLoginModalBtn = document.querySelector("#showLoginModalBtn");

        if (showLoginModalBtn) {
            showLoginModalBtn.addEventListener("click", function (e) {

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
    toggleLoginPasswordVisibility();
    toggleSignUpPasswordVisibility();

});