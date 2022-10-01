<?php

/* Connexion de l'utilisateur */
function login($email, $password) {
	if ($email==null || $password==null) {
		echo "*Veuillez remplir tous les champs";
	} else {
		$password_encrypt = md5($password);

		include("bdd_connect.php");
		$query = $bdd -> query("SELECT * FROM utilisateurs WHERE email='$email'");
		$row = $query -> fetch();
		
		$db_email = $row["email"];
		$db_password = $row["motDePasse"];

		if (!$db_email) {
			echo "*Aucun compte n'est associé à cette adresse mail";
		} elseif ($password_encrypt != $db_password) {
			echo "*Mot de passe incorrect";
		} else {
			$_SESSION["id"] = $row["id"];
			$_SESSION["email"] = $row["email"];
			$_SESSION["last_name"] = $row["nom"];
			$_SESSION["first_name"] = $row["prenom"];

			$_SESSION["admin"] = $row["admin"];
			$_SESSION["toeic"] = $row["TOEIC"];
			$_SESSION["mobility"] = $row["mobilite"];
			$_SESSION["partner"] = $row["partenaire"];

			header("location: index.php");
		}
	}
}

/* Déconnexion de l'utilisateur */
// if (isset($_POST['logout'])) echo logout();
if (isset($_GET['logout'])) echo logout();
function logout() {
	session_start();
	session_destroy();
	session_unset(); 
	header ("location: login.php");
}
