<?php

/* Définition des fonctions */
switch ($_POST["function"]) {
	case "load_users":
		load_users();
		break;
	case "edit_user":
		edit_user();
		break;
	case "delete_user":
		delete_user();
		break;
	case "add_user":
		add_user();
		break;
	default:
		break;
}

/* Récupération des données de l'appel Ajax */
function catch_data($data) {
	if (!empty($_POST["$data"]))
		return $_POST["$data"];
	else
		return NULL;
}

/* Récupère la liste des utilisateurs */
function load_users() {
	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$query = $bdd -> query("
		SELECT id, nom last_name, prenom first_name, email, motDePasse password, admin, toeic, mobilite mobility, partenaire partner
		FROM utilisateurs
		ORDER BY nom, prenom ASC
	");
	$data = $query -> fetchAll();
	
	echo json_encode($data);	// Envoie du json au JavaScript
}

/* Modification des données d'un utilisateur */
function edit_user() {
	// Récupération des données
	$user_id = catch_data("user_id");
	$user_last_name = catch_data("user_last_name");
	$user_first_name = catch_data("user_first_name");
	$user_email = catch_data("user_email");
	$user_password = catch_data("user_password");
	$user_admin = intval(catch_data("user_admin"));
	$user_toeic = intval(catch_data("user_toeic"));
	$user_mobility = intval(catch_data("user_mobility"));
	$user_partner = intval(catch_data("user_partner"));

	include("bdd_connect.php");	// Connexion à la BDD

	if ($user_password != "") {
		// Traitements des données
		$user_password_encrypt = md5($user_password);
		// Requête à la BDD
		$set = $bdd -> prepare("
			UPDATE utilisateurs
			SET nom = ?, prenom = ?, email = ?, motDePasse = ?, admin = ?, toeic = ?, mobilite = ?, partenaire = ?
			WHERE id = ?
			");
		$statut = $set -> execute(array($user_last_name, $user_first_name, $user_email, $user_password_encrypt, $user_admin, $user_toeic, $user_mobility, $user_partner, $user_id));
	} else {
		// Requête à la BDD
		$set = $bdd -> prepare("
			UPDATE utilisateurs
			SET nom = ?, prenom = ?, email = ?, admin = ?, toeic = ?, mobilite = ?, partenaire = ?
			WHERE id = ?
			");
		$statut = $set -> execute(array($user_last_name, $user_first_name, $user_email, $user_admin, $user_toeic, $user_mobility, $user_partner, $user_id));
	}

	echo json_encode($statut);	// Envoie du json au JavaScript
}

/* Suppression d'un utilisateur */
function delete_user() {
	// Récupération des données
	$user_id = catch_data("user_id");

	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$delete = $bdd -> prepare("
		DELETE FROM utilisateurs
		WHERE id = ?
		");
	$statut = $delete -> execute(array($user_id));

	echo json_encode($statut);	// Envoie du json au JavaScript
}

/* Ajout d'un utilisateur */
function add_user() {
	// Récupération des données
	$new_last_name = catch_data("new_last_name");
	$new_first_name = catch_data("new_first_name");
	$new_email = catch_data("new_email");
	$new_password = catch_data("new_password");

	$password_encrypt = md5($new_password);

	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$insert = $bdd -> prepare("
		INSERT INTO utilisateurs (nom, prenom, email, motDePasse)
		VALUES (?, ?, ?, ?)
		");
	$statut = $insert -> execute(array($new_last_name, $new_first_name, $new_email, $password_encrypt));

	echo json_encode($statut);	// Envoie du json au JavaScript
}
