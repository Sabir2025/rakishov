<?php
header('Content-Type: text/html; charset=utf-8');

$thank_you_page = isset($_GET['thank']) ? $_GET['thank'] : 'thankyou.html';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$project = trim($_POST['project'] ?? '');
$message = trim($_POST['message'] ?? '');

if (empty($name) || empty($email)) {
    die('Ошибка: Заполните обязательные поля имя и email.');
}

$name = htmlspecialchars(strip_tags($name), ENT_QUOTES, 'utf-8');
$email = filter_var($email, FILTER_VALIDATE_EMAIL);
$project = htmlspecialchars(strip_tags($project), ENT_QUOTES, 'utf-8');
$message = htmlspecialchars(strip_tags($message), ENT_QUOTES, 'utf-8');

if (!$email) {
    die('Ошибка: Неверный формат email.');
}

$to = 'sabirrakishov@gmail.com';
$subject = 'Новая заявка с сайта - ' . ($project ?: 'Без названия');

$headers = [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=utf-8',
    'From: Сайт портфолио <noreply@' . $_SERVER['HTTP_HOST'] . '>',
    'Reply-To: ' . $email,
    'Return-Path: <noreply@' . $_SERVER['HTTP_HOST'] . '>'
];

$email_body = "Новая заформа с сайта портфолио\n";
$email_body .= "========================\n\n";
$email_body .= "Имя: " . $name . "\n";
$email_body .= "Email: " . $email . "\n";
$email_body .= "Проект: " . $project . "\n";
$email_body .= "Сообщение: " . $message . "\n";
$email_body .= "\n========================\n";
$email_body .= "Отправлено: " . date('d.m.Y H:i:s') . "\n";
$email_body .= "IP: " . $_SERVER['REMOTE_ADDR'] . "\n";

$headers_string = implode("\r\n", $headers);

if (mail($to, $subject, $email_body, $headers_string)) {
    header('Location: ' . $thank_you_page);
    exit;
} else {
    die('Ошибка отправки. Попробуйте позже или свяжитесь по email.');
}