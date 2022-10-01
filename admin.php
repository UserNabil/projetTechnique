<?php
	session_start();	// Lancement de la session
	if (!isset($_SESSION["id"]) || !($_SESSION['admin']==1)) header("location: login.php");	// Renvoie à la page de connexion si non connecté ou pas la permission
	include_once("assets/php/session.php");	// Importation des scripts de session
?>

<!DOCTYPE html>
<html>
<head>
	<title>Administration</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=np"/>
	<link rel="stylesheet" type="text/css" href="assets/css/style.css"/>
	<link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
</head>

<body class="d-flex flex-column min-vh-100">
	<?php include_once('header.php'); ?>

	<div class="container-fluid px-5">
		<form class="row justify-content-center" id="new_user">
			<div class="col-auto mb-2"><input class="form-control" id="new_last_name" type="text" placeholder="Nom"></div>
			<div class="col-auto mb-2"><input class="form-control" id="new_first_name" type="text" placeholder="Prénom"></div>
			<div class="col-auto mb-2"><input class="form-control" id="new_email" type="text" placeholder="Email"></div>
			<div class="col-auto mb-2"><input class="form-control" id="new_password" type="text" placeholder="Mot de passe"></div>
			<div class="col-auto mb-2"><button type="button" class="btn btn-primary" id="new">Ajouter</button></div>
		</form>
	</div>

	<div class="container-fluid px-5">
		<div class="row">
			<table class="table table-striped" id="users"></table>
		</div>
	</div>
	
	<?php include_once('footer.php'); ?>

	<script type="text/javascript" src="assets/js/script.js"></script>
	<script type="text/javascript" src="assets/js/bootstrap.bundle.min.js"></script>
	<script type="text/javascript" src="assets/js/jquery.min.js"></script>
	<script type="text/javascript" src="assets/js/admin.js"></script>
</body>
</html>
