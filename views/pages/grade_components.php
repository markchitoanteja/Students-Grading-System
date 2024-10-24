<?php
if ($_SESSION["user_type"] != "teacher") {
    http_response_code(403);

    header("location: 403");

    exit();
}
?>

<?php include_once "../views/pages/templates/header.php" ?>

<main id="main" class="main">
    <div class="pagetitle">
        <div class="row">
            <div class="col-6">
                <h1>Grade Components</h1>
                <nav>
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item active">Grade Components</li>
                    </ol>
                </nav>
            </div>
            <div class="col-6">
                <button class="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#new_grade_component_modal"><i class="bi bi-plus"></i> New Component</button>
            </div>
        </div>
    </div>

    <section class="section">
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-journal-bookmark me-1"></i> All Components</h5>

                        <table class="table datatable">
                            <thead>
                                <tr>
                                    <th>Component</th>
                                    <th>Weight</th>
                                    <th class="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($grade_components = $db->select_all("grade_components", "component", "ASC")): ?>
                                    <?php foreach ($grade_components as $grade_component): ?>
                                        <tr>
                                            <td><?= $grade_component["component"] ?></td>
                                            <td><?= $grade_component["weight"] ?>%</td>
                                            <td class="text-center">
                                                <i class="bi bi-pencil-fill text-primary me-1 update_grade_component" role="button" grade_component_id="<?= $grade_component["id"] ?>"></i>
                                                <i class="bi bi-trash-fill text-danger delete_grade_component" role="button" grade_component_id="<?= $grade_component["id"] ?>"></i>
                                            </td>
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

<?php include_once "../views/pages/components/new_course.php" ?>
<?php include_once "../views/pages/components/update_course.php" ?>

<?php include_once "../views/pages/templates/footer.php" ?>