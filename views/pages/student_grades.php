<?php
if ($_SESSION["user_type"] != "teacher") {
    http_response_code(403);

    header("location: 403");

    exit();
}

$current_weight_sum = $db->get_sum('grade_components', 'weight', 'teacher_id', $_SESSION["user_id"]);
?>

<?php include_once "../views/pages/templates/header.php" ?>

<main id="main" class="main">
    <div class="pagetitle">
        <div class="row">
            <div class="col-6">
                <h1>Student Grades</h1>
                <nav>
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item active">Student Grades</li>
                    </ol>
                </nav>
            </div>
        </div>
    </div>

    <section class="section">
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-journal-bookmark me-1"></i> All Student Grades</h5>

                        <table class="table datatable">
                            <thead>
                                <tr>
                                    <th>Student Number</th>
                                    <th>Student Name</th>
                                    <th>Course</th>
                                    <th>Year</th>
                                    <th>Semester</th>
                                    <th>Subject</th>
                                    <th>Final Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($student_grades = $db->select_many("student_grades", "teacher_id", $_SESSION["user_id"], "id", "DESC")): ?>
                                    <?php foreach ($student_grades as $student_grade): ?>
                                        <tr>
                                            <td><?= $db->select_one("students", "account_id", $student_grade["student_id"])["student_number"] ?></td>
                                            <td><?= $db->select_one("users", "id", $student_grade["student_id"])["name"] ?></td>
                                            <td><?= $student_grade["course"] ?></td>
                                            <td><?= $student_grade["year"] ?> Year</td>
                                            <td><?= $student_grade["semester"] ?> Semester</td>
                                            <td><?= $db->select_one("subjects", "id", $student_grade["subject_id"])["description"] ?></td>
                                            <td><?= $student_grade["grade"] ?>%</td>
                                        </tr>
                                    <?php endforeach ?>
                                <?php endif ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once "../views/pages/components/new_student_grade.php" ?>
<?php include_once "../views/pages/components/update_course.php" ?>

<?php include_once "../views/pages/templates/footer.php" ?>