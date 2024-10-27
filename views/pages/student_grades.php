<?php
if ($_SESSION["user_type"] != "teacher") {
    http_response_code(403);
    header("location: 403");
    exit();
}

include_once "../views/pages/templates/header.php";

$teacher_id = $_SESSION["user_id"];

$grade_components = $db->select_all("grade_components");

$sql = "
    SELECT students.id AS student_id, students.student_number, users.name AS student_name,
           sg.course, sg.year, sg.semester, subjects.description AS subject,
           gc.id AS component_id, sg.grade AS grade
    FROM student_grades sg
    INNER JOIN students ON students.account_id = sg.student_id
    INNER JOIN users ON users.id = students.account_id
    INNER JOIN subjects ON subjects.id = sg.subject_id
    RIGHT JOIN grade_components gc ON gc.id = sg.grade_component_id
    WHERE sg.teacher_id = '$teacher_id'
    ORDER BY students.id, gc.id
";

$students_grades = $db->run_custom_query($sql);

$display_data = [];
foreach ($students_grades as $row) {
    $student_id = $row['student_id'];
    $component_id = $row['component_id'];
    $grade = isset($row['grade']) ? $row['grade'] : 'Unavailable';

    if (!isset($display_data[$student_id])) {
        $display_data[$student_id] = [
            'student_number' => $row['student_number'],
            'student_name' => $row['student_name'],
            'course' => $row['course'],
            'year' => $row['year'],
            'semester' => $row['semester'],
            'subject' => $row['subject'],
            'grades' => []
        ];
    }
    $display_data[$student_id]['grades'][$component_id] = $grade; // Store the grade for each component
}
?>

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
                                <?php foreach ($display_data as $student): ?>
                                    <?php
                                    // Initialize an empty string for grades
                                    $grades_text = '';
                                    $final_grade = 0;
                                    $num_components = 0; // Count of available grades
                                    $all_components_available = true; // Flag to track if all components have grades

                                    // Loop through all grade components to gather individual grades
                                    foreach ($grade_components as $component) {
                                        $component_id = $component['id'];
                                        // Check if the specific grade exists for this component
                                        $grade = isset($student['grades'][$component_id]) ? $student['grades'][$component_id] : 'Unavailable';

                                        // Append the component's name and grade to the grades text
                                        $grades_text .= htmlspecialchars($component['component']) . ": " . htmlspecialchars($grade) . "<br>";

                                        // Check if the grade is unavailable
                                        if ($grade === 'Unavailable') {
                                            $all_components_available = false; // Mark the flag as false
                                        } else {
                                            $final_grade += (float)$grade;
                                            $num_components++; // Increment the count of available grades
                                        }
                                    }
                                    ?>
                                    <tr>
                                        <td><?= htmlspecialchars($student['student_number']) ?></td>
                                        <td><?= htmlspecialchars($student['student_name']) ?></td>
                                        <td><?= htmlspecialchars($student['course']) ?></td>
                                        <td><?= htmlspecialchars($student['year']) ?> Year</td>
                                        <td><?= htmlspecialchars($student['semester']) ?> Semester</td>
                                        <td><?= htmlspecialchars($student['subject']) ?></td>
                                        <td>
                                            <?php
                                            // Set final grade to "Unavailable" if not all components are available
                                            if ($all_components_available && $num_components > 0) {
                                                echo round($final_grade / $num_components, 2) . "%";
                                            } else {
                                                echo "Unavailable";
                                            }
                                            ?>
                                        </td>
                                    </tr>
                                <?php endforeach; ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<?php include_once "../views/pages/templates/footer.php" ?>