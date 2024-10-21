<?php include_once "../views/pages/templates/header.php" ?>

<main id="main" class="main">
    <div class="pagetitle">
        <div class="row">
            <div class="col-6">
                <h1>Subjects</h1>
                <nav>
                    <ol class="breadcrumb">
                        <li class="breadcrumb-item"><a href="/">Home</a></li>
                        <li class="breadcrumb-item active">Subjects</li>
                    </ol>
                </nav>
            </div>
            <div class="col-6">
                <button class="btn btn-primary float-end" data-bs-toggle="modal" data-bs-target="#new_subject_modal"><i class="bi bi-plus"></i> New Subject</button>
            </div>
        </div>
    </div>

    <section class="section">
        <div class="row">
            <div class="col-lg-12">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title"><i class="bi bi-journal-bookmark me-1"></i> All Subjects</h5>

                        <table class="table datatable">
                            <thead>
                                <tr>
                                    <th>Subject Code</th>
                                    <th>Descriptive Title</th>
                                    <th>Course</th>
                                    <th>Total Units</th>
                                    <th>Lec Units</th>
                                    <th>Lab Units</th>
                                    <th>Hours/Week</th>
                                    <th class="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <?php if ($subjects = $db->select_all("subjects", "id", "DESC")): ?>
                                    <?php foreach ($subjects as $subjects): ?>
                                        <tr>
                                            <td><?= $subjects["code"] ?></td>
                                            <td><?= $subjects["description"] ?></td>
                                            <td><?= $subjects["course"] ?></td>
                                            <td><?= intval($subjects["lecture_units"]) + intval($subjects["laboratory_units"]) ?></td>
                                            <td><?= $subjects["lecture_units"] ?></td>
                                            <td><?= $subjects["laboratory_units"] ?></td>
                                            <td><?= $subjects["hours_per_week"] ?></td>
                                            <td class="text-center">
                                                <i class="bi bi-pencil-fill text-primary me-1 update_subject" role="button" subject_id="<?= $subjects["id"] ?>"></i>
                                                <i class="bi bi-trash-fill text-danger delete_subject" role="button" subject_id="<?= $subjects["id"] ?>"></i>
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

<?php include_once "../views/pages/components/new_subject.php" ?>
<?php include_once "../views/pages/components/update_subject.php" ?>

<?php include_once "../views/pages/templates/footer.php" ?>