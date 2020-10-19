"use strict";

const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export function isValidEmail(input) {
    return emailReg.test(input);
}

// This function counts the length of user text input and return the length left is a "span"
// The span tg for return must follow the textarea tag immediately
// For this to work, you have to pass the className of which you intend to show the number of remaining text as an
// HTML data attribute of the textarea/textInput element. For instance, my text input element will look like this:
// <input type='text' data-textinput='my_class_name' /input>
export function textareaCounter(textareaClass, textMaxLength) {
    $(textareaClass).each(function () {
        $(this).bind('input propertychange', function () {

            let targetInpuAreaClassName = "." + $(this).data('textinput'),
                currentCounterValue = $(targetInpuAreaClassName),
                currentTextLength = parseInt($(this).val().length),
                intTextMaxLength = parseInt(textMaxLength);

            currentCounterValue.html(intTextMaxLength - currentTextLength);
            if (intTextMaxLength - currentTextLength <= 50) {
                currentCounterValue.css({
                    "color": "#ff0000"
                })
            } else {
                currentCounterValue.css({
                    "color": "#330A68"
                })
            };
        });
    });
};

// This function strips all user generated texts of all Malicious characters and codes and return only texts and numbers
export function userInputStripper(val) {
    if (typeof (val) === "object") {
        let objectEntries = Object.entries(val),
            newObject = {};
        for (const [obj_key, obj_value] of objectEntries) {
            newObject[obj_key] = userInputStripper(obj_value);
        };
        return Object.values(newObject);
    } else if (val !== "" || val !== " ") {
        return val.replace(/\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\+|\=|\[|\{|\]|\}|\(|\)|\||\\|\<|\>|\?|\/|\""/ig, "");
    } else {
        console.log("No text provided in textarea!");
    }
}

// Where there are multiple compulsory SELECT boxes , this function tests that atleast an OPTION
// is selected in each SELECT box. This function takes the jquery_className of the boxes and return
// TRUE if the test passes in all cases
// NOTE: The function will only work with a jquery selecteted jquery_className
export function allSelecBoxesFilled(jquery_className) {
    var passTest = [];
    jquery_className.each(function () {
        if ($(this).children("option:selected").val() !== "" &&
            $(this).children("option:selected").val() !== "placeholder" &&
            typeof ($(this).children("option:selected").val()) !== undefined) {
            passTest.push("passed");
        } else {
            if (!($(this).next().hasClass("warning"))) {
                // writeInputErrorMessage($(this))
                $(this).after($("<span class='warning'>You have not selected a valid option here!</span> ").css("display", "inline-block"));
            }
        }
    })

    if (passTest.length == jquery_className.length) {
        return true;
    } else {
        console.log(jquery_className.length - passTest.length + " important information not provided!");
        return false;
    }
}

// This function returns a user uploaded file size in a format that is human readable
export function returnFileSize(number) {
    if (number < 1024) {
        return number + 'bytes';
    } else if (number >= 1024 && number < 1048576) {
        return (number / 1024).toFixed(1) + 'KB';
    } else if (number >= 1048576) {
        return (number / 1048576).toFixed(1) + 'MB';
    }
}


// This function determines that user uploaded file is one of the acceptable types
const fileTypes = [
    'image/jpeg',
    'image/png',
    "doc",
    "docx",
    "rtf",
    "odt",
    "pdf",
    "jpeg",
    "jpg",
    "png",
    "bmp"
]

export function validFileType(file) {
    for (let i = 0; i < fileTypes.length; i++) {
        if (file === fileTypes[i]) {
            return true;
        };
    }

    return false;
}

var phoneNumberRegEx = /^[0][8]\d{9}$|^[0][7]\d{9}$|^[0][9]\d{9}$|^[\+][2][3][4][7]\d{9}$|^[\+][2][3][4][8]\d{9}$|^[\+][2][3][4][9]\d{9}$|^[2][3][4][7]\d{9}$|^[2][3][4][8]\d{9}$|^[2][3][4][9]\d{9}$/;
export function isValidPhoneNumber(input) {
    return phoneNumberRegEx.test(input);
}

// This function tests if input value="" and returns an error 
export function writeInputErrorMessage(param) {
    if (!(param.prev().hasClass("warning"))) {
        if ($.trim(param.val()) == "" || typeof ($.trim(param.val())) == undefined) {
            // param.after($("<span class='warning'>This field cannot be left empty</span> ").css("display", "inline-block"));
            param.prev().fadeIn(1000);
            param.prev().addClass("warning");
        }
    }
}


export function removeInputErrorMessage(param) {
    if ((param.prev().hasClass("warning"))) {
        // param.next().remove();
        param.prev().fadeOut(1000);
        param.prev().removeClass("warning");
    }
}

export function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

export function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}