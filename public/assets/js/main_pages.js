jQuery(document).ready(function () {
    if (notification) {
        Swal.fire({
            title: notification.title,
            text: notification.text,
            icon: notification.icon
        });
    }

    $(".logout").click(function () {
        var formData = new FormData();

        formData.append('logout', true);

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response) {
                    location.href = "/";
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#account_settings").click(function () {
        $("#account_settings_modal").modal("show");

        $(".actual-form").addClass("d-none");
        $(".loading").removeClass("d-none");

        var formData = new FormData();

        formData.append('user_id', user_id);

        formData.append('get_admin_data', true);

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                $(".loading").addClass("d-none");
                $(".actual-form").removeClass("d-none");

                $("#account_settings_name").val(response.name);
                $("#account_settings_username").val(response.username);
                $("#account_settings_image_display").attr("src", "assets/img/uploads/" + response.image);
                $("#account_settings_id").val(response.id);
                $("#account_settings_old_password").val(response.password);
                $("#account_settings_old_image").val(response.image);
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#acccount_settings_form").submit(function () {
        const name = $("#account_settings_name").val();
        const username = $("#account_settings_username").val();
        const password = $("#account_settings_password").val();
        const confirm_password = $("#account_settings_confirm_password").val();
        const image_input = $("#account_settings_image")[0];

        const id = $("#account_settings_id").val();
        const old_password = $("#account_settings_old_password").val();
        const old_image = $("#account_settings_old_image").val();

        let is_new_password = false;
        let is_new_image = false;

        let is_error = false;

        if (password) {
            if (password != confirm_password) {
                $("#account_settings_password").addClass("is-invalid");
                $("#account_settings_confirm_password").addClass("is-invalid");

                $("#error_account_settings_password").removeClass("d-none");

                is_error = true;
            } else {
                is_new_password = true;
            }
        }

        if (!is_error) {
            if (image_input.files.length > 0) {
                var image_file = image_input.files[0];

                is_new_image = true;
            }

            $("#account_settings_submit").text("Please Wait..");
            $("#account_settings_submit").attr("disabled", true);

            var formData = new FormData();

            formData.append('name', name);
            formData.append('username', username);
            formData.append('password', password);
            formData.append('image_file', image_file);
            formData.append('id', id);
            formData.append('old_password', old_password);
            formData.append('old_image', old_image);
            formData.append('is_new_password', is_new_password);
            formData.append('is_new_image', is_new_image);

            formData.append('update_admin_account', true);

            $.ajax({
                url: 'server',
                data: formData,
                type: 'POST',
                dataType: 'JSON',
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response) {
                        location.reload();
                    } else {
                        $("#account_settings_username").addClass("is-invalid");
                        $("#error_account_settings_username").removeClass("d-none");

                        $("#account_settings_submit").text("Save changes");
                        $("#account_settings_submit").removeAttr("disabled");
                    }
                },
                error: function (_, _, error) {
                    console.error(error);
                }
            });
        }
    })

    $("#account_settings_username").keydown(function () {
        $("#account_settings_username").removeClass("is-invalid");
        $("#error_account_settings_username").addClass("d-none");
    })

    $("#account_settings_password").keydown(function () {
        $("#account_settings_password").removeClass("is-invalid");
        $("#account_settings_confirm_password").removeClass("is-invalid");

        $("#error_account_settings_password").addClass("d-none");
    })

    $("#account_settings_confirm_password").keydown(function () {
        $("#account_settings_password").removeClass("is-invalid");
        $("#account_settings_confirm_password").removeClass("is-invalid");

        $("#error_account_settings_password").addClass("d-none");
    })

    $("#account_settings_image").change(function (event) {
        var displayImage = $('#account_settings_image_display');
        var file = event.target.files[0];

        if (file) {
            var imageURL = URL.createObjectURL(file);

            displayImage.attr('src', imageURL);

            displayImage.on('load', function () {
                URL.revokeObjectURL(imageURL);
            });
        } else {
            displayImage.attr('src', "assets/img/uploads/default-user-image.png");
        }
    })

    $("#new_course_form").submit(function () {
        const code = $("#new_course_code").val();
        const description = $("#new_course_description").val();
        const years = $("#new_course_years").val();

        $("#new_course_submit").text("Please Wait..");
        $("#new_course_submit").attr("disabled", true);

        $(".actual-form").addClass("d-none");
        $(".loading").removeClass("d-none");

        var formData = new FormData();

        formData.append('code', code);
        formData.append('description', description);
        formData.append('years', years);

        formData.append('new_course', true);

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response) {
                    location.reload();
                } else {
                    $("#new_course_submit").text("Submit");
                    $("#new_course_submit").removeAttr("disabled");

                    $("#new_course_code").addClass("is-invalid");
                    $("#error_new_course_code").removeClass("d-none");

                    $(".loading").addClass("d-none");
                    $(".actual-form").removeClass("d-none");
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#new_course_code").keydown(function () {
        $("#new_course_code").removeClass("is-invalid");
        $("#error_new_course_code").addClass("d-none");
    })

    $(document).on("click", ".delete_course", function () {
        const id = $(this).attr("course_id");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                var formData = new FormData();

                formData.append('id', id);

                formData.append('delete_course', true);

                $.ajax({
                    url: 'server',
                    data: formData,
                    type: 'POST',
                    dataType: 'JSON',
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response) {
                            location.reload();
                        }
                    },
                    error: function (_, _, error) {
                        console.error(error);
                    }
                });
            }
        });
    })

    $(document).on("click", ".update_course", function () {
        const id = $(this).attr("course_id");

        $("#update_course_modal").modal("show");

        $(".loading").removeClass("d-none");
        $(".actual-form").addClass("d-none");

        var formData = new FormData();

        formData.append('id', id);

        formData.append('get_course_data', true);

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response) {
                    $("#update_course_id").val(response.id);
                    $("#update_course_code").val(response.code);
                    $("#update_course_description").val(response.description);
                    $("#update_course_years").val(response.years);

                    $(".loading").addClass("d-none");
                    $(".actual-form").removeClass("d-none");
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#update_course_form").submit(function () {
        const id = $("#update_course_id").val();
        const code = $("#update_course_code").val();
        const description = $("#update_course_description").val();
        const years = $("#update_course_years").val();

        $("#update_course_submit").text("Please Wait..");
        $("#update_course_submit").attr("disabled", true);

        $(".actual-form").addClass("d-none");
        $(".loading").removeClass("d-none");

        var formData = new FormData();

        formData.append('id', id);
        formData.append('code', code);
        formData.append('description', description);
        formData.append('years', years);

        formData.append('update_course', true);

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response) {
                    location.reload();
                } else {
                    $("#update_course_submit").text("Submit");
                    $("#update_course_submit").removeAttr("disabled");

                    $("#update_course_code").addClass("is-invalid");
                    $("#error_update_course_code").removeClass("d-none");

                    $(".loading").addClass("d-none");
                    $(".actual-form").removeClass("d-none");
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#update_course_code").keydown(function () {
        $("#update_course_code").removeClass("is-invalid");
        $("#error_update_course_code").addClass("d-none");
    })

    $("#new_subject_course").change(function () {
        const code = $(this).val();

        var formData = new FormData();

        formData.append('code', code);

        formData.append('get_course_data_by_code', true);

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                const years = parseInt(response.years);

                $("#new_subject_year").removeAttr("disabled");
                $("#new_subject_year").empty();

                for (let i = 1; i <= years; i++) {
                    const optionText = getOrdinalSuffix(i);

                    $("#new_subject_year").append(new Option(optionText + " Year", optionText));
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#new_subject_form").submit(function () {
        const code = $("#new_subject_code").val();
        const description = $("#new_subject_description").val();
        const lecture_units = $("#new_subject_lecture_units").val();
        const laboratory_units = $("#new_subject_laboratory_units").val();
        const hours_per_week = $("#new_subject_hours_per_week").val();
        const course = $("#new_subject_course").val();
        const year = $("#new_subject_year").val();
        const semester = $("#new_subject_semester").val();

        $("#new_subject_submit").text("Please Wait..");
        $("#new_subject_submit").attr("disabled", true);

        $(".actual-form").addClass("d-none");
        $(".loading").removeClass("d-none");

        var formData = new FormData();

        formData.append('code', code);
        formData.append('description', description);
        formData.append('lecture_units', lecture_units);
        formData.append('laboratory_units', laboratory_units);
        formData.append('hours_per_week', hours_per_week);
        formData.append('course', course);
        formData.append('year', year);
        formData.append('semester', semester);

        formData.append('new_subject', true);

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response) {
                    location.reload();
                } else {
                    $("#new_subject_code").addClass("is-invalid");
                    $("#error_new_subject_code").removeClass("d-none");

                    $("#new_subject_submit").text("Submit");
                    $("#new_subject_submit").removeAttr("disabled");

                    $(".actual-form").removeClass("d-none");
                    $(".loading").addClass("d-none");
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

<<<<<<< HEAD
    $("#new_subject_code").keydown(function () {
=======
    $("#new_subject_code").keypress(function () {
>>>>>>> c87f6604729a51555f2a6c46925ed895a584d5a5
        $("#new_subject_code").removeClass("is-invalid");
        $("#error_new_subject_code").addClass("d-none");
    })

    $(document).on("click", ".delete_subject", function () {
        const id = $(this).attr("subject_id");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                var formData = new FormData();

                formData.append('id', id);

                formData.append('delete_subject', true);

                $.ajax({
                    url: 'server',
                    data: formData,
                    type: 'POST',
                    dataType: 'JSON',
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response) {
                            location.reload();
                        }
                    },
                    error: function (_, _, error) {
                        console.error(error);
                    }
                });
            }
        });
    })

    $(document).on("click", ".update_subject", function () {
        const id = $(this).attr("subject_id");

        $("#update_subject_modal").modal("show");

        $(".loading").removeClass("d-none");
        $(".actual-form").addClass("d-none");

        var formData = new FormData();

        formData.append('id', id);

        formData.append('get_subject_data', true);

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response) {
                    $("#update_subject_id").val(response.id);
                    $("#update_subject_code").val(response.code);
                    $("#update_subject_description").val(response.description);
                    $("#update_subject_lecture_units").val(response.lecture_units);
                    $("#update_subject_laboratory_units").val(response.laboratory_units);
                    $("#update_subject_hours_per_week").val(response.hours_per_week);
                    $("#update_subject_course").val(response.course);

                    var formData_2 = new FormData();

                    formData_2.append('code', response.course);

                    formData_2.append('get_course_data_by_code', true);

                    $.ajax({
                        url: 'server',
                        data: formData_2,
                        type: 'POST',
                        dataType: 'JSON',
                        processData: false,
                        contentType: false,
                        success: function (response_2) {
                            const years = parseInt(response_2.years);

                            $("#update_subject_year").removeAttr("disabled");
                            $("#update_subject_year").empty();

                            for (let i = 1; i <= years; i++) {
                                const optionText = getOrdinalSuffix(i);

                                $("#update_subject_year").append(new Option(optionText + " Year", optionText));
                            }

                            $("#update_subject_year").val(response.year);
                        },
                        error: function (_, _, error) {
                            console.error(error);
                        }
                    });
                    $("#update_subject_semester").val(response.semester);

                    $(".loading").addClass("d-none");
                    $(".actual-form").removeClass("d-none");
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#update_subject_form").submit(function () {
        const id = $("#update_subject_id").val();
        const code = $("#update_subject_code").val();
        const description = $("#update_subject_description").val();
        const lecture_units = $("#update_subject_lecture_units").val();
        const laboratory_units = $("#update_subject_laboratory_units").val();
        const hours_per_week = $("#update_subject_hours_per_week").val();
        const course = $("#update_subject_course").val();
        const year = $("#update_subject_year").val();
        const semester = $("#update_subject_semester").val();

        $("#update_subject_submit").text("Please Wait..");
        $("#update_subject_submit").attr("disabled", true);

        $(".actual-form").addClass("d-none");
        $(".loading").removeClass("d-none");

        var formData = new FormData();

        formData.append('id', id);
        formData.append('code', code);
        formData.append('description', description);
        formData.append('lecture_units', lecture_units);
        formData.append('laboratory_units', laboratory_units);
        formData.append('hours_per_week', hours_per_week);
        formData.append('course', course);
        formData.append('year', year);
        formData.append('semester', semester);

        formData.append('update_subject', true);

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                if (response) {
                    location.reload();
                } else {
                    $("#update_subject_code").addClass("is-invalid");
                    $("#error_update_subject_code").removeClass("d-none");

                    $("#update_subject_submit").text("Submit");
                    $("#update_subject_submit").removeAttr("disabled");

                    $(".actual-form").removeClass("d-none");
                    $(".loading").addClass("d-none");
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#update_subject_course").change(function () {
        const code = $(this).val();

        var formData = new FormData();

        formData.append('code', code);

        formData.append('get_course_data_by_code', true);

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                const years = parseInt(response.years);

                $("#update_subject_year").removeAttr("disabled");
                $("#update_subject_year").empty();

                for (let i = 1; i <= years; i++) {
                    const optionText = getOrdinalSuffix(i);

                    $("#update_subject_year").append(new Option(optionText + " Year", optionText));
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

<<<<<<< HEAD
    $("#update_subject_code").keydown(function () {
=======
    $("#update_subject_code").keypress(function () {
>>>>>>> c87f6604729a51555f2a6c46925ed895a584d5a5
        $("#update_subject_code").removeClass("is-invalid");
        $("#error_update_subject_code").addClass("d-none");
    })

<<<<<<< HEAD
    $("#new_teacher_image").change(function (event) {
        var displayImage = $('#new_teacher_image_display');
        var file = event.target.files[0];

        if (file) {
            var imageURL = URL.createObjectURL(file);

            displayImage.attr('src', imageURL);

            displayImage.on('load', function () {
                URL.revokeObjectURL(imageURL);
            });
        } else {
            displayImage.attr('src', "assets/img/uploads/default-user-image.png");
        }
    })

    $("#new_teacher_form").submit(function () {
        const employee_number = $("#new_teacher_employee_number").val();
        const first_name = $("#new_teacher_first_name").val();
        const middle_name = $("#new_teacher_middle_name").val();
        const last_name = $("#new_teacher_last_name").val();
        const birthday = $("#new_teacher_birthday").val();
        const mobile_number = $("#new_teacher_mobile_number").val();
        const email = $("#new_teacher_email").val();
        const address = $("#new_teacher_address").val();
        const username = $("#new_teacher_username").val();
        const password = $("#new_teacher_password").val();
        const confirm_password = $("#new_teacher_confirm_password").val();
        const image_file = $("#new_teacher_image")[0].files[0];

        let is_error = false;

        if (password != confirm_password) {
            $("#new_teacher_password").addClass("is-invalid");
            $("#new_teacher_confirm_password").addClass("is-invalid");

            $("#error_new_teacher_password").removeClass("d-none");

            is_error = true;
        }

        if (!is_error) {
            $("#new_teacher_submit").text("Please Wait..");
            $("#new_teacher_submit").attr("disabled", true);

            $(".actual-form").addClass("d-none");
            $(".loading").removeClass("d-none");

            var formData = new FormData();

            formData.append('employee_number', employee_number);
            formData.append('first_name', first_name);
            formData.append('middle_name', middle_name);
            formData.append('last_name', last_name);
            formData.append('birthday', birthday);
            formData.append('mobile_number', mobile_number);
            formData.append('email', email);
            formData.append('address', address);
            formData.append('image_file', image_file);
            formData.append('username', username);
            formData.append('password', password);

            formData.append('new_teacher', true);

            $.ajax({
                url: 'server',
                data: formData,
                type: 'POST',
                dataType: 'JSON',
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.username_ok && response.employee_number_ok) {
                        location.reload();
                    } else {
                        $("#new_teacher_submit").text("Submit");
                        $("#new_teacher_submit").removeAttr("disabled");

                        $(".loading").addClass("d-none");
                        $(".actual-form").removeClass("d-none");

                        if (!response.username_ok) {
                            $("#new_teacher_username").addClass("is-invalid");
                            $("#error_new_teacher_username").removeClass("d-none");

                            $("#new_teacher_username").focus();
                        }

                        if (!response.employee_number_ok) {
                            $("#new_teacher_employee_number").addClass("is-invalid");
                            $("#error_new_teacher_employee_number").removeClass("d-none");

                            $("#new_teacher_employee_number").focus();
                        }
                    }
                },
                error: function (_, _, error) {
                    console.error(error);
                }
            });
        }
    })

    $("#new_teacher_employee_number").keydown(function () {
        $("#new_teacher_employee_number").removeClass("is-invalid");

        $("#error_new_teacher_employee_number").addClass("d-none");
    })

    $("#new_teacher_username").keydown(function () {
        $("#new_teacher_username").removeClass("is-invalid");

        $("#error_new_teacher_username").addClass("d-none");
    })

    $("#new_teacher_password").keydown(function () {
        $("#new_teacher_password").removeClass("is-invalid");
        $("#new_teacher_confirm_password").removeClass("is-invalid");

        $("#error_new_teacher_password").addClass("d-none");
    })

    $("#new_teacher_confirm_password").keydown(function () {
        $("#new_teacher_password").removeClass("is-invalid");
        $("#new_teacher_confirm_password").removeClass("is-invalid");

        $("#error_new_teacher_password").addClass("d-none");
    })

    $(document).on("click", ".update_teacher", function () {
        const id = $(this).attr("teacher_id");

        $("#update_teacher_modal").modal("show");

        $(".actual-form").addClass("d-none");
        $(".loading").removeClass("d-none");

        var formData = new FormData();

        formData.append('id', id);

        formData.append('get_teacher_data', true);

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                $("#update_teacher_account_id").val(response.account_id);
                $("#update_teacher_employee_number").val(response.employee_number);
                $("#update_teacher_first_name").val(response.first_name);
                $("#update_teacher_middle_name").val(response.middle_name);
                $("#update_teacher_last_name").val(response.last_name);
                $("#update_teacher_birthday").val(response.birthday);
                $("#update_teacher_mobile_number").val(response.mobile_number);
                $("#update_teacher_email").val(response.email);
                $("#update_teacher_address").val(response.address);
                $("#update_teacher_username").val(response.username);
                $("#update_teacher_image_display").attr("src", "assets/img/uploads/" + response.image);

                $("#update_teacher_old_image").val(response.image);
                $("#update_teacher_old_password").val(response.password);
                $("#update_teacher_old_username").val(response.username);
                $("#update_teacher_old_employee_number").val(response.employee_number);

                $(".actual-form").removeClass("d-none");
                $(".loading").addClass("d-none");
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $(document).on("click", ".delete_teacher", function () {
        const id = $(this).attr("teacher_id");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                var formData = new FormData();

                formData.append('id', id);

                formData.append('delete_teacher', true);

                $.ajax({
                    url: 'server',
                    data: formData,
                    type: 'POST',
                    dataType: 'JSON',
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response) {
                            location.reload();
                        }
                    },
                    error: function (_, _, error) {
                        console.error(error);
                    }
                });
            }
        });
    })

    $("#update_teacher_form").submit(function () {
        const employee_number = $("#update_teacher_employee_number").val();
        const first_name = $("#update_teacher_first_name").val();
        const middle_name = $("#update_teacher_middle_name").val();
        const last_name = $("#update_teacher_last_name").val();
        const birthday = $("#update_teacher_birthday").val();
        const mobile_number = $("#update_teacher_mobile_number").val();
        const email = $("#update_teacher_email").val();
        const address = $("#update_teacher_address").val();
        const username = $("#update_teacher_username").val();
        const password = $("#update_teacher_password").val();
        const confirm_password = $("#update_teacher_confirm_password").val();
        const image_file = $("#update_teacher_image")[0].files[0];

        const account_id = $("#update_teacher_account_id").val();
        const old_image = $("#update_teacher_old_image").val();
        const old_password = $("#update_teacher_old_password").val();
        const old_employee_number = $("#update_teacher_old_employee_number").val();
        const old_username = $("#update_teacher_old_username").val();

        let is_error = false;
        let is_new_image = false;
        let is_new_password = false;

        if ((password || confirm_password) && (password != confirm_password)) {
            $("#update_teacher_password").addClass("is-invalid");
            $("#update_teacher_confirm_password").addClass("is-invalid");

            $("#error_update_teacher_password").removeClass("d-none");

            is_error = true;
        }

        if (!is_error) {
            if (image_file) {
                is_new_image = true;
            }

            if (password) {
                is_new_password = true;
            }

            $("#update_teacher_submit").text("Please Wait..");
            $("#update_teacher_submit").attr("disabled", true);

            $(".actual-form").addClass("d-none");
            $(".loading").removeClass("d-none");

            var formData = new FormData();

            formData.append('employee_number', employee_number);
            formData.append('first_name', first_name);
            formData.append('middle_name', middle_name);
            formData.append('last_name', last_name);
            formData.append('birthday', birthday);
            formData.append('mobile_number', mobile_number);
            formData.append('email', email);
            formData.append('address', address);
            formData.append('image_file', image_file);
            formData.append('username', username);
            formData.append('password', password);

            formData.append('account_id', account_id);
            formData.append('old_image', old_image);
            formData.append('old_password', old_password);
            formData.append('old_employee_number', old_employee_number);
            formData.append('old_username', old_username);

            formData.append('is_new_image', is_new_image);
            formData.append('is_new_password', is_new_password);

            formData.append('update_teacher', true);

            $.ajax({
                url: 'server',
                data: formData,
                type: 'POST',
                dataType: 'JSON',
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.username_ok && response.employee_number_ok) {
                        location.reload();
                    } else {
                        $("#update_teacher_submit").text("Submit");
                        $("#update_teacher_submit").removeAttr("disabled");

                        $(".loading").addClass("d-none");
                        $(".actual-form").removeClass("d-none");

                        if (!response.username_ok) {
                            $("#update_teacher_username").addClass("is-invalid");
                            $("#error_update_teacher_username").removeClass("d-none");

                            $("#update_teacher_username").focus();
                        }

                        if (!response.employee_number_ok) {
                            $("#update_teacher_employee_number").addClass("is-invalid");
                            $("#error_update_teacher_employee_number").removeClass("d-none");

                            $("#update_teacher_employee_number").focus();
                        }
                    }
                },
                error: function (_, _, error) {
                    console.error(error);
                }
            });
        }
    })

    $("#update_teacher_image").change(function (event) {
        var displayImage = $('#update_teacher_image_display');
        var file = event.target.files[0];

        if (file) {
            var imageURL = URL.createObjectURL(file);

            displayImage.attr('src', imageURL);

            displayImage.on('load', function () {
                URL.revokeObjectURL(imageURL);
            });
        } else {
            displayImage.attr('src', "assets/img/uploads/default-user-image.png");
        }
    })

    $("#update_teacher_employee_number").keydown(function () {
        $("#update_teacher_employee_number").removeClass("is-invalid");

        $("#error_update_teacher_employee_number").addClass("d-none");
    })

    $("#update_teacher_username").keydown(function () {
        $("#update_teacher_username").removeClass("is-invalid");

        $("#error_update_teacher_username").addClass("d-none");
    })

    $("#update_teacher_password").keydown(function () {
        $("#update_teacher_password").removeClass("is-invalid");
        $("#update_teacher_confirm_password").removeClass("is-invalid");

        $("#error_update_teacher_password").addClass("d-none");
    })

    $("#update_teacher_confirm_password").keydown(function () {
        $("#update_teacher_password").removeClass("is-invalid");
        $("#update_teacher_confirm_password").removeClass("is-invalid");

        $("#error_update_teacher_password").addClass("d-none");
    })

    $("#new_student_course").change(function () {
        const code = $(this).val();

        var formData = new FormData();

        formData.append('code', code);

        formData.append('get_course_data_by_code', true);

        $.ajax({
            url: 'server',
            data: formData,
            type: 'POST',
            dataType: 'JSON',
            processData: false,
            contentType: false,
            success: function (response) {
                const years = parseInt(response.years);

                $("#new_student_year").removeAttr("disabled");
                $("#new_student_year").empty();

                for (let i = 1; i <= years; i++) {
                    const optionText = getOrdinalSuffix(i);

                    $("#new_student_year").append(new Option(optionText + " Year", optionText));
                }
            },
            error: function (_, _, error) {
                console.error(error);
            }
        });
    })

    $("#new_student_image").change(function (event) {
        var displayImage = $('#new_student_image_display');
        var file = event.target.files[0];

        if (file) {
            var imageURL = URL.createObjectURL(file);

            displayImage.attr('src', imageURL);

            displayImage.on('load', function () {
                URL.revokeObjectURL(imageURL);
            });
        } else {
            displayImage.attr('src', "assets/img/uploads/default-user-image.png");
        }
    })

    $("#new_student_form").submit(function () {
        const student_number = $("#new_student_student_number").val();
        const course = $("#new_student_course").val();
        const year = $("#new_student_year").val();
        const section = $("#new_student_section").val();
        const first_name = $("#new_student_first_name").val();
        const middle_name = $("#new_student_middle_name").val();
        const last_name = $("#new_student_last_name").val();
        const birthday = $("#new_student_birthday").val();
        const mobile_number = $("#new_student_mobile_number").val();
        const email = $("#new_student_email").val();
        const address = $("#new_student_address").val();
        const username = $("#new_student_username").val();
        const password = $("#new_student_password").val();
        const confirm_password = $("#new_student_confirm_password").val();
        const image_file = $("#new_student_image")[0].files[0];

        let is_error = false;

        if (password != confirm_password) {
            $("#new_student_password").addClass("is-invalid");
            $("#new_student_confirm_password").addClass("is-invalid");

            $("#error_new_student_password").removeClass("d-none");

            is_error = true;
        }

        if (!is_error) {
            $("#new_student_submit").text("Please Wait..");
            $("#new_student_submit").attr("disabled", true);

            $(".actual-form").addClass("d-none");
            $(".loading").removeClass("d-none");

            var formData = new FormData();

            formData.append('student_number', student_number);
            formData.append('course', course);
            formData.append('year', year);
            formData.append('section', section);
            formData.append('first_name', first_name);
            formData.append('middle_name', middle_name);
            formData.append('last_name', last_name);
            formData.append('birthday', birthday);
            formData.append('mobile_number', mobile_number);
            formData.append('email', email);
            formData.append('address', address);
            formData.append('image_file', image_file);
            formData.append('username', username);
            formData.append('password', password);

            formData.append('new_student', true);

            $.ajax({
                url: 'server',
                data: formData,
                type: 'POST',
                dataType: 'JSON',
                processData: false,
                contentType: false,
                success: function (response) {
                    if (response.username_ok && response.student_number_ok) {
                        location.reload();
                    } else {
                        $("#new_student_submit").text("Submit");
                        $("#new_student_submit").removeAttr("disabled");

                        $(".loading").addClass("d-none");
                        $(".actual-form").removeClass("d-none");

                        if (!response.username_ok) {
                            $("#new_student_username").addClass("is-invalid");
                            $("#error_new_student_username").removeClass("d-none");

                            $("#new_student_username").focus();
                        }

                        if (!response.student_number_ok) {
                            $("#new_student_student_number").addClass("is-invalid");
                            $("#error_new_student_student_number").removeClass("d-none");

                            $("#new_student_student_number").focus();
                        }
                    }
                },
                error: function (_, _, error) {
                    console.error(error);
                }
            });
        }
    })

    $("#new_student_student_number").keydown(function () {
        $("#new_student_student_number").removeClass("is-invalid");

        $("#error_new_student_student_number").addClass("d-none");
    })

    $("#new_student_username").keydown(function () {
        $("#new_student_username").removeClass("is-invalid");

        $("#error_new_student_username").addClass("d-none");
    })

    $("#new_student_password").keydown(function () {
        $("#new_student_password").removeClass("is-invalid");
        $("#new_student_confirm_password").removeClass("is-invalid");

        $("#error_new_student_password").addClass("d-none");
    })

    $("#new_student_confirm_password").keydown(function () {
        $("#new_student_password").removeClass("is-invalid");
        $("#new_student_confirm_password").removeClass("is-invalid");

        $("#error_new_student_password").addClass("d-none");
    })

    $(document).on("click", ".delete_student", function () {
        const id = $(this).attr("student_id");

        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                var formData = new FormData();

                formData.append('id', id);

                formData.append('delete_student', true);

                $.ajax({
                    url: 'server',
                    data: formData,
                    type: 'POST',
                    dataType: 'JSON',
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        if (response) {
                            location.reload();
                        }
                    },
                    error: function (_, _, error) {
                        console.error(error);
                    }
                });
            }
        });
    })

=======
>>>>>>> c87f6604729a51555f2a6c46925ed895a584d5a5
    function getOrdinalSuffix(n) {
        const s = ["th", "st", "nd", "rd"], v = n % 100;

        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
})