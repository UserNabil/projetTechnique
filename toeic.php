<?php
	session_start();	// Lancement de la session
	if (!isset($_SESSION["id"]) || !($_SESSION['admin']==1 || $_SESSION['toeic']==1)) header("location: login.php");	// Renvoie à la page de connexion si non connecté ou pas la permission
	include_once("assets/php/session.php");	// Importation des scripts de session
?>

<!DOCTYPE html>
<html>
<head>
	<title>Gestion Notes TOEIC</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=np"/>
	<link rel="stylesheet" type="text/css" href="assets/css/style.css"/>
	<link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
</head>

<body class="d-flex flex-column min-vh-100">
	<?php include_once('header.php'); ?>

	<div class="container-fluid px-5 mb-2">
		<form class="row justify-content-center" id="search_student">
			<div class="col-auto mb-2"><input class="form-control" id="student_id" type="number" placeholder="Numéro d'étudiant"></div>
			<div class="col-auto mb-2"><input class="form-control" id="student_last_name" type="text" placeholder="Nom de l'étudiant"></div>
			<div class="col-auto mb-2"><input class="form-control" id="student_first_name" type="text" placeholder="Prénom de l'étudiant"></div>
			<div class="col-auto mb-2">
				<select class="form-control" id="student_campus">
					<option>Campus</option>
					<option disabled class="divider"></option>
					<option class="divider middle" disabled>&nbsp;</option>
					<option disabled class="divider"></option>
				</select>
			</div>
			<div class="col-auto mb-2">
				<select class="form-control" id="student_promotion">
					<option>Promotion</option>
					<option disabled class="divider"></option>
					<option class="divider middle" disabled>&nbsp;</option>
					<option disabled class="divider"></option>
				</select>
			</div>
			<div class="col-auto"><button type="button" class="btn btn-primary" id="search">Rechercher</button></div>
		</form>
	</div>

	<div class="container-fluid px-5">
		<div class="row">
			<table class="table table-striped" id="students"></table>
		</div>
	</div>

	<?php include_once('footer.php'); ?>

	<script type="text/javascript" src="assets/js/script.js"></script>
	<script type="text/javascript" src="assets/js/bootstrap.bundle.min.js"></script>
	<script type="text/javascript" src="assets/js/jquery.min.js"></script>
	<script type="text/javascript" src="assets/js/toeic.js"></script>
</body>
</html>
