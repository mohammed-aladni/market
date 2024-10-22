<?php
session_start();
include("connect.php");

// Check if the user is logged in
if (!isset($_SESSION['email'])) {
    header("Location: login.php"); // Redirect to login if the user is not logged in
    exit;
}

$email = $_SESSION['email'];

// Use prepared statements to prevent SQL injection
$stmt = $conn->prepare("SELECT firstName, lastName FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    echo "User not found.";
    exit;
}

$stmt->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome</title>
    <link rel="stylesheet" href="styles.css">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-image: url('image/market.avif'); /* Set the background image */
            background-size: cover; /* Ensure the image covers the entire page */
            background-position: center; /* Center the background image */
            background-repeat: no-repeat; /* Prevent background image repetition */
            height: 100vh; /* Make sure it covers the full viewport height */
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .container {
            background-color: rgba(255, 255, 255, 0.8); /* Semi-transparent background for readability */
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            text-align: center;
            max-width: 400px;
            width: 100%;
        }

        h1 {
            color: #333;
        }

        p {
            color: #666;
        }

        .btn {
            display: inline-block;
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #824caf;
            color: white;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            font-size: 16px;
        }

        .btn:hover {
            background-color: #6c3184;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Welcome, <?php echo htmlspecialchars($user['firstName'] . " " . $user['lastName']); ?>!</h1>
        <p>You are successfully logged in.</p>
        <a href="index.html" class="btn">Go to Home</a>
        <a href="logout.php" class="btn">Logout</a>
    </div>
</body>
</html>
