<?php
class Database
{
    private $host = 'localhost';
    private $dbname = 'student_grading_system';
    private $username = 'root';
    private $password = '';
    private $connection;

    public function __construct()
    {
        $this->connect();
        $this->create_database();
        $this->select_database();
        $this->create_users_table();
        $this->create_students_table();
        $this->create_teachers_table();
        $this->create_courses_table();
        $this->create_subjects_table();
        $this->create_student_grades_table();
        $this->create_grade_components_table();
        $this->create_logs_table();
        $this->insert_admin_data();
    }

    private function connect()
    {
        $this->connection = new mysqli($this->host, $this->username, $this->password);

        if ($this->connection->connect_error) {
            die("Connection failed: " . $this->connection->connect_error);
        }
    }

    private function create_database()
    {
        $sql = "CREATE DATABASE IF NOT EXISTS " . $this->dbname;

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating database: " . $this->connection->error);
        }
    }

    private function select_database()
    {
        $this->connection->select_db($this->dbname);
    }

    private function create_users_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS users (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(36) NOT NULL UNIQUE,
            name VARCHAR(100) NOT NULL,
            username VARCHAR(50) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            image VARCHAR(50) NOT NULL,
            user_type VARCHAR(20) NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating users table: " . $this->connection->error);
        }
    }

    private function create_students_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS students (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(36) NOT NULL UNIQUE,
            account_id INT(11) NOT NULL UNIQUE,
            student_number VARCHAR(100) NOT NULL UNIQUE,
            course VARCHAR(100) NOT NULL,
            year VARCHAR(100) NOT NULL,
            section VARCHAR(100) NOT NULL,
            first_name VARCHAR(100) NOT NULL,
            middle_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            birthday VARCHAR(100) NOT NULL,
            mobile_number VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            address TEXT NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating users table: " . $this->connection->error);
        }
    }

    private function create_teachers_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS teachers (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(36) NOT NULL UNIQUE,
            account_id INT(11) NOT NULL UNIQUE,
            employee_number VARCHAR(100) NOT NULL UNIQUE,
            first_name VARCHAR(100) NOT NULL,
            middle_name VARCHAR(100) NOT NULL,
            last_name VARCHAR(100) NOT NULL,
            birthday VARCHAR(100) NOT NULL,
            mobile_number VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            address TEXT NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating users table: " . $this->connection->error);
        }
    }

    private function create_courses_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS courses (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(36) NOT NULL UNIQUE,
            code VARCHAR(100) NOT NULL UNIQUE,
            description VARCHAR(100) NOT NULL,
            years INT(11) NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating users table: " . $this->connection->error);
        }
    }

    private function create_grade_components_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS grade_components (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(36) NOT NULL UNIQUE,
            teacher_id INT(11) NOT NULL,
            component VARCHAR(255) NOT NULL UNIQUE,
            weight INT(11) NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating users table: " . $this->connection->error);
        }
    }

    private function create_student_grades_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS student_grades (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(36) NOT NULL UNIQUE,
            teacher_id INT(11) NOT NULL,
            student_id INT(11) NOT NULL,
            subject_id INT(11) NOT NULL,
            grade_component_id INT(11) NOT NULL,
            course VARCHAR(100) NOT NULL,
            year VARCHAR(10) NOT NULL,
            semester VARCHAR(10) NOT NULL,
            grade FLOAT(11,2) NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating users table: " . $this->connection->error);
        }
    }

    private function create_subjects_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS subjects (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(36) NOT NULL UNIQUE,
            code VARCHAR(100) NOT NULL,
            description VARCHAR(100) NOT NULL,
            lecture_units INT(11) NOT NULL,
            laboratory_units INT(11) NOT NULL,
            hours_per_week INT(11) NOT NULL,
            course VARCHAR(100) NOT NULL,
            year VARCHAR(10) NOT NULL,
            semester VARCHAR(10) NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating users table: " . $this->connection->error);
        }
    }

    private function create_logs_table()
    {
        $sql = "CREATE TABLE IF NOT EXISTS logs (
            id INT(11) AUTO_INCREMENT PRIMARY KEY,
            uuid VARCHAR(36) NOT NULL UNIQUE,
            user_id INT(11) NOT NULL,
            activity TEXT NOT NULL,
            created_at DATETIME NOT NULL,
            updated_at DATETIME NOT NULL
        )";

        if (!$this->connection->query($sql) === TRUE) {
            die("Error creating users table: " . $this->connection->error);
        }
    }

    private function insert_admin_data()
    {
        $is_admin_exists = $this->select_one("users", "id", "1");

        if (!$is_admin_exists) {
            $data = [
                "uuid" => $this->generate_uuid(),
                "name" => 'Administrator',
                "username" => 'admin',
                "password" => password_hash('admin123', PASSWORD_BCRYPT),
                "image" => 'default-user-image.png',
                "user_type" => 'admin',
                "created_at" => date('Y-m-d H:i:s'),
                "updated_at" => date('Y-m-d H:i:s'),
            ];

            $this->insert("users", $data);
        }
    }

    private function generate_uuid()
    {
        return bin2hex(random_bytes(16));
    }

    private function getParamTypes($data)
    {
        return implode('', array_map(function ($value) {
            return is_int($value) ? 'i' : (is_double($value) ? 'd' : 's');
        }, $data));
    }

    public function get_last_insert_id()
    {
        return $this->connection->insert_id;
    }

    public function select_one($table, $condition_column, $condition_value)
    {
        $sql = "SELECT * FROM $table WHERE $condition_column = ? LIMIT 1";
        $stmt = $this->connection->prepare($sql);
        $stmt->bind_param("s", $condition_value);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    public function select_many($table = null, $condition_column = null, $condition_value = null, $order_by = null, $direction = 'ASC', $custom_sql = null)
    {
        if ($custom_sql) {
            $stmt = $this->connection->prepare($custom_sql);
            $stmt->execute();
            return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
        }

        $sql = "SELECT * FROM $table WHERE $condition_column = ?";

        if ($order_by) {
            $sql .= " ORDER BY $order_by " . strtoupper($direction);
        }

        $stmt = $this->connection->prepare($sql);

        $type = is_int($condition_value) ? 'i' : 's';
        $stmt->bind_param($type, $condition_value);

        $stmt->execute();

        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function select_all($table, $order_by = null, $direction = 'ASC')
    {
        $sql = "SELECT * FROM $table";

        if ($order_by) {
            $sql .= " ORDER BY $order_by " . strtoupper($direction);
        }

        $result = $this->connection->query($sql);

        return $result->fetch_all(MYSQLI_ASSOC);
    }

    public function insert($table, $data)
    {
        try {
            $columns = implode(", ", array_keys($data));
            $placeholders = implode(", ", array_fill(0, count($data), "?"));

            $sql = "INSERT INTO $table ($columns) VALUES ($placeholders)";
            $stmt = $this->connection->prepare($sql);

            $types = $this->getParamTypes($data);
            $values = array_values($data);

            if ($stmt->bind_param($types, ...$values) && $stmt->execute()) {
                return true;
            } else {
                return false;
            }
        } catch (mysqli_sql_exception $e) {
            return false;
        }
    }

    public function update($table, $data, $condition_column, $condition_value)
    {
        try {
            $set = implode(", ", array_map(function ($key) {
                return "$key = ?";
            }, array_keys($data)));

            $sql = "UPDATE $table SET $set WHERE $condition_column = ?";
            $stmt = $this->connection->prepare($sql);

            $types = $this->getParamTypes($data);
            $values = array_values($data);
            $types .= is_int($condition_value) ? 'i' : 's';

            $stmt->bind_param($types, ...array_merge($values, [$condition_value]));

            if ($stmt->execute()) {
                return true;
            } else {
                return false;
            }
        } catch (mysqli_sql_exception $e) {
            return false;
        }
    }

    public function delete($table, $condition_column, $condition_value)
    {
        try {
            $sql = "DELETE FROM $table WHERE $condition_column = ?";
            $stmt = $this->connection->prepare($sql);

            $type = is_int($condition_value) ? 'i' : 's';
            $stmt->bind_param($type, $condition_value);

            if ($stmt->execute()) {
                return true;
            } else {
                return false;
            }
        } catch (mysqli_sql_exception $e) {
            return false;
        }
    }

    public function get_sum($table_name, $column_name, $condition_column, $condition_value)
    {
        $sql = "SELECT SUM($column_name) as total_sum FROM $table_name WHERE $condition_column = ?";
        $stmt = $this->connection->prepare($sql);

        $type = is_int($condition_value) ? 'i' : 's';
        $stmt->bind_param($type, $condition_value);

        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();

        return $result['total_sum'] ?? 0;
    }

    public function run_custom_query($custom_sql)
    {
        $stmt = $this->connection->prepare($custom_sql);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}

$db = new Database();
