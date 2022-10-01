<?php
	session_start();	// Lancement de la session
	if (!isset($_SESSION["id"])) header("location: login.php");	// Renvoie à la page de connexion si non connecté
	include_once("assets/php/session.php");	// Importation des scripts de session
?>

<!DOCTYPE html>
<html>
<head>
	<title>Accueil</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=np"/>
	<link rel="stylesheet" type="text/css" href="assets/css/style.css"/>
	<link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
</head>
<body class="d-flex flex-column min-vh-100">
	<?php include_once('header.php'); ?>

	<div class="container text-center pt-4">
		<div class="row">
			<?php if ($_SESSION["admin"] == 1 || $_SESSION["toeic"] == 1) echo '
				<div class="col-sm-4 pb-5">
					<div class="card shadow" style="width: 18rem;">
						<img src="assets/img/language-solid.svg" class="card-img-top p-2" height="100px">
						<div class="card-body">
							<h5 class="card-title">Gestion TOEIC</h5>
							<p class="card-text">Gestion des notes de TOEIC de l\'ensemble des étudiants.</p>
							<a href="toeic.php" class="btn btn-primary">Y aller</a>
						</div>
					</div>
				</div>
			' ?>
			<?php if ($_SESSION["admin"] == 1 || $_SESSION["mobility"] == 1) echo '
				<div class="col-sm-4 pb-5">
					<div class="card shadow" style="width: 18rem;">
						<img src="assets/img/earth-europe-solid.svg" class="card-img-top p-2" height="100px">
						<div class="card-body">
							<h5 class="card-title">Gestion Mobilités</h5>
							<p class="card-text">Gestion des mobilités à l\'internationale des étudiants.</p>
							<a href="mobilites.php" class="btn btn-primary">Y aller</a>
						</div>
					</div>
				</div>
			' ?>
			<?php if ($_SESSION["admin"] == 1 || $_SESSION["partner"] == 1) echo '
				<div class="col-sm-4 pb-5">
					<div class="card shadow" style="width: 18rem;">
						<img src="assets/img/handshake-solid.svg" class="card-img-top p-2" height="100px">
						<div class="card-body">
							<h5 class="card-title">Gestion Partenaires</h5>
							<p class="card-text">Gestion des partenaires internationaux.</p>
							<a href="partenaires.php" class="btn btn-primary">Y aller</a>
						</div>
					</div>
				</div>
			' ?>
			<?php if ($_SESSION["admin"] == 1) echo '
				<div class="col-sm-4 pb-5">
					<div class="card shadow" style="width: 18rem;">
						<img src="assets/img/gear-solid.svg" class="card-img-top p-2" height="100px">
						<div class="card-body">
							<h5 class="card-title">Administration</h5>
							<p class="card-text">Gestion des différents utilisateurs et de leurs accès au site.</p>
							<a href="admin.php" class="btn btn-primary">Y aller</a>
						</div>
					</div>
				</div>
			' ?>
		</div>
	</div>

	<?php include_once('footer.php'); ?>

	<script type="text/javascript" src="assets/js/script.js"></script>
	<script type="text/javascript" src="assets/js/bootstrap.bundle.min.js"></script>
</body>
</html>
