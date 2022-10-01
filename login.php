<?php
	session_start();	// Lancement de la session
	ob_start();
	if (isset($_SESSION["id"])) header("location: index.php");	// Renvoie à la page d'accueil si connecté
	include_once("assets/php/session.php");	// Importation des scripts de session
	// Initialisation des variablmes de session (permet d'utiliser le même header)
	$_SESSION["admin"] = 0;
	$_SESSION["toeic"] = 0;
	$_SESSION["mobility"] = 0;
	$_SESSION["partner"] = 0;
	// Test la connexion
	if (isset($_POST['login'])) echo login($_POST['email'], $_POST['password']);
?>


<!DOCTYPE html>
<html>
<head>
	<title>Connexion</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=np"/>
	<link rel="stylesheet" type="text/css" href="assets/css/style.css"/>
	<link rel="stylesheet" type="text/css" href="assets/css/bootstrap.min.css"/>
</head>
<body class="d-flex flex-column min-vh-100">
	<?php include_once('header.php'); ?>

	<div class="container my-auto">
		<div class="row">
			<form class="text-center" method="post">
				<div class="row justify-content-center mb-2">
					<div class="col-sm-4">
						<h2>Connexion</h2>
					</div>
				</div>
				<div class="form-group row justify-content-center mb-2">
					<!-- <label for="email" class="col-sm-2 col-form-label">Adresse mail :</label> -->
					<div class="col-sm-4">
						<input class="form-control" id="email" type="text" placeholder="Adresse mail" name="email" pattern="^[a-zA-Z0-9_.+-]+@eilco-ulco\.fr$" title="Adresse mail en @eilco-ulco.fr">
					</div>
				</div>
				<div class="form-group row justify-content-center mb-2">
					<!-- <label for="password" class="col-sm-2 col-form-label">Mot de passe :</label> -->
					<div class="col-sm-4">
						<input class="form-control" id="password" type="password" placeholder="Mot de passe" name="password">
					</div>
				</div>
				<div class="form-group row justify-content-center mt-4 mb-2">
					<div class="col-sm-12">
						<button type="submit" class="btn btn-primary" name="login">Se connecter</button>
					</div>
				</div>
			</form>
		</div>
	</div>

	<?php include_once('footer.php'); ?>

	<script type="text/javascript" src="assets/js/script.js"></script>
	<script type="text/javascript" src="assets/js/bootstrap.bundle.min.js"></script>
	<script type="text/javascript" src="assets/js/jquery.min.js"></script>
</body>
</html>
