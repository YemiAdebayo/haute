import {
    getCookie,
    csrfSafeMethod,
    writeInputErrorMessage,
    removeInputErrorMessage
} from "../js/functions.js";

$(document).ready(function () {

    //Check if login fields are empty and show error message on field blur or focus
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
        $ajaxLoginSubmitBtn = $("#ajaxLoginSubmitBtn");


    // This function asynchronously modifies the DOM after a successful login.
    const updateLoginTemplate = (_callBack) => {
        $.ajax({
            type: 'GET',
            url: ajaxUpdateLoginStatusUrl,
            data: '',
            success: function (response) {
                $ajaxLoginStatus.html(response);
            },
            error: function (response) {
                console.log(response)
            }
        });

        _callBack();
    };

    //get csrf cookie and set the cookie in ajax
    const csrftoken = getCookie('csrftoken');

    //Configure initial and default setup for Ajax request
    $.ajaxSetup({
        beforeSend: function (xhr, settings) {
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

        //Send login form as Ajax request
        $.ajax({
            type: 'POST',
            url: ajaxLoginUrl,
            mode: 'same-origin',
            data: $serializedData,
            success: function (response) {
                //Get success message and other data
                const {
                    message,
                } = response;

                //Update the modal to show login success message
                $ajaxLoginForm.replaceWith(message);

                //Update the login status div and icon
                $('#LogInModal').on('hidden.bs.modal', function () {
                    setTimeout(() => {
                        updateLoginTemplate(logoutWithAjaxHelperFunction);
                    }, 1000)
                })
            },
            error: function (err) {
                console.log(err);
                $ajaxLoginErrorDiv.fadeIn(2000);
                $ajaxLoginSubmitBtn.prop("disabled", false).text(
                    `Sign In`
                );
            },
            complete: function () {
                // setTimeout(() => {
                //     console.log($ajaxLogoutLink);
                //     console.log("Login completed!");
                // }, 500)
            }
        });
    };

    const logoutWithAjaxHelperFunction = () => {
        let ajaxLogoutLink = document.querySelector("#ajaxLogoutLink");
        console.log("Found Ajax Logout link:", ajaxLogoutLink);
        //Check that Ajax logout link is in the DOM on document ready
        if (ajaxLogoutLink) {
            ajaxLogoutLink.addEventListener("click", function (e) {
                e.preventDefault();
                console.log("Click even prevented!");
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
            success: function (response) {
                //Get success message and other data
                const {
                    message,
                    status
                } = response;

                //Update the modal to show login success message
                // $ajaxLoginForm.replaceWith(message);

                //Update the login status div

                // setTimeout(() => {
                //     updateLoginTemplate(loginWithAjaxHelperFunction);
                // }, 1000)

            },
            error: function (err) {
                console.log(err);
            }
        });
    };

    logoutWithAjaxHelperFunction();
    // loginWithAjaxHelperFunction();

    let ajaxLoginForm = document.querySelector("#ajaxLoginForm");
    if (ajaxLoginForm) {
        ajaxLoginForm.addEventListener("submit", function (e) {

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

});