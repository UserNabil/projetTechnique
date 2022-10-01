<?php
	session_start();	// Lancement de la session
	if (!isset($_SESSION["id"]) || !($_SESSION['admin']==1 || $_SESSION['partner']==1)) header("location: login.php");	// Renvoie à la page de connexion si non connecté ou pas la permission
	include_once("assets/php/session.php");	// Importation des scripts de session
?>

<!DOCTYPE html>
<html>
<head>
	<title>Gestion Partenaires Internationnaux</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=np"/>
	<link rel="stylesheet" type="text/css" href="assets/css/style.css"/>
	<link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
</head>

<body class="d-flex flex-column min-vh-100">
	<?php include_once('header.php'); ?>

	<div class="container-fluid px-5">
		<form class="row justify-content-center" id="new_partner">
			<div class="col-auto mb-2"><input class="form-control" id="new_name" type="text" placeholder="Nom du partenaire"></div>
			<div class="col-auto mb-2"><input class="form-control" id="new_country" type="text" placeholder="Pays"></div>
			<div class="col-auto mb-2"><input class="form-control" id="new_contact_last_name" type="text" placeholder="Nom Contact"></div>
			<div class="col-auto mb-2"><input class="form-control" id="new_contact_first_name" type="text" placeholder="Prénom Contact"></div>
			<div class="col-auto mb-2"><input class="form-control" id="new_contact_email" type="text" placeholder="Email Contact"></div>
			<div class="col-auto mb-2"><input class="form-control" id="new_contact_phone" type="text" placeholder="Numéro Contact"></div>
			<div class="col-auto mb-2"><button type="button" class="btn btn-primary" id="new">Ajouter</button></div>
		</form>
	</div>
	<hr>

	<div class="container-fluid px-5 mb-2">
		<form class="row justify-content-center" id="search_partner">
			<div class="col-md-4 mb-2"><input class="form-control" id="partner_name" type="text" placeholder="Nom du partenaire"></div>
			<div class="col-md-2 mb-2">
				<select class="form-control" id="partner_country">
					<option>Pays</option>
					<option disabled class="divider"></option>
					<option class="divider middle" disabled>&nbsp;</option>
					<option disabled class="divider"></option>
				</select>
			</div>
			<div class="col-md-2 mb-2"><button type="button" class="btn btn-primary" id="search">Rechercher</button></div>
		</form>
	</div>

	<div class="container-fluid px-5">
		<div class="row">
			<table class="table table-striped" id="partners"></table>
		</div>
	</div>

	<?php include_once('footer.php'); ?>

	<script type="text/javascript" src="assets/js/script.js"></script>
	<script type="text/javascript" src="assets/js/bootstrap.bundle.min.js"></script>
	<script type="text/javascript" src="assets/js/jquery.min.js"></script>
	<script type="text/javascript" src="assets/js/partenaires.js"></script>
</body>
</html>
