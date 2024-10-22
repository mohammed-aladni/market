<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    $mail = new PHPMailer(true);

    try {
        //Server settings
        $mail->isSMTP();
        $mail->Host       = 'smtp.gmail.com';  // Use Gmail's SMTP server
        $mail->SMTPAuth   = true;
        $mail->Username   = '';  // Your Gmail address
        $mail->Password   = '';  // Use the App Password here instead of your Gmail password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;  // Encryption method
        $mail->Port       = 587;  // Port for TLS

        //Recipients
        $mail->setFrom('', 'Your Name');
        $mail->addAddress('');  // Recipient

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'New Contact Form Message from ' . $name;
        $mail->Body    = "Name: $name<br>Email: $email<br>Message: $message";

        $mail->send();
        echo 'Message has been sent';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
