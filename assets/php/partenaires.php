<?php

/* Définition des fonctions */
switch ($_POST["function"]) {
	case "get_countries":
		get_countries();
		break;
	case "get_partner":
		get_partner();
		break;
	case "edit_partner":
		edit_partner();
		break;
	case "delete_partner":
		delete_partner();
		break;
	case "add_partner":
		add_partner();
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

/* Récupère la liste des pays */
function get_countries() {
	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$query = $bdd -> query("
		SELECT DISTINCT pays country
		FROM partenaire_international
		ORDER BY pays ASC
	");
	$data = $query -> fetchAll();
	
	echo json_encode($data);	// Envoie du json au JavaScript
}

/* Récupère la liste des partenaires */
function get_partner() {
	// Récupération des données
	$partner_name = catch_data("partner_name");
	$partner_country = catch_data("partner_country");

	// Traitements des données
	if ($partner_country == "Pays")
		$partner_country = NULL;

	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$search = $bdd -> prepare("
		SELECT DISTINCT(P.id), P.nom name, P.pays country, P.prenom_contact contact_first_name, P.nom_contact contact_last_name, P.email_contact contact_email, P.numero_contact contact_phone
		FROM partenaire_international AS P
		WHERE (LOWER(P.nom) LIKE LOWER(?) OR ? IS NULL) 
		AND (LOWER(P.pays) LIKE LOWER(?) OR ? IS NULL)
		ORDER BY P.nom ASC
	");
	$search -> execute(array($partner_name."%", $partner_name."%",
		$partner_country."%", $partner_country."%" 
	));
	$data = $search -> fetchAll();

	echo json_encode($data);	// Envoie du json au JavaScript
}

/* Modification des données d'un partenaire */
function edit_partner() {
	// Récupération des données
	$partner_id = catch_data("partner_id");
	$partner_name = catch_data("partner_name");
	$partner_country = catch_data("partner_country");
	$partner_contact_last_name = catch_data("partner_contact_last_name");
	$partner_contact_first_name = catch_data("partner_contact_first_name");
	$partner_contact_email = catch_data("partner_contact_email");
	$partner_contact_phone = catch_data("partner_contact_phone");

	// Traitements des données
	// if ($new_contact_last_name == NULL)
	// 	$new_contact_last_name = "";
	// if ($new_contact_first_name == NULL)
	// 	$new_contact_first_name = "";
	// if ($new_contact_email == NULL)
	// 	$new_contact_email = "";
	// if ($new_contact_phone == NULL)
	// 	$new_contact_phone = "";

	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$set = $bdd -> prepare("
		UPDATE partenaire_international
		SET nom = ?, pays = ?, nom_contact = ?, prenom_contact = ?, email_contact = ?, numero_contact = ?
		WHERE id = ?
		");
	$statut = $set -> execute(array($partner_name, $partner_country, $partner_contact_last_name, $partner_contact_first_name, $partner_contact_email, $partner_contact_phone, $partner_id));

	echo json_encode($statut);	// Envoie du json au JavaScript
}

/* Suppression d'un partenaire */
function delete_partner() {
	// Récupération des données
	$partner_id = catch_data("partner_id");

	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$delete = $bdd -> prepare("
		DELETE FROM partenaire_international
		WHERE id = ?
		");
	$statut = $delete -> execute(array($partner_id));

	echo json_encode($statut);	// Envoie du json au JavaScript
}

/* Ajout d'un partenaire */
function add_partner() {
	// Récupération des données
	$new_name = catch_data("new_name");
	$new_country = catch_data("new_country");
	$new_contact_last_name = catch_data("new_contact_last_name");
	$new_contact_first_name = catch_data("new_contact_first_name");
	$new_contact_email = catch_data("new_contact_email");
	$new_contact_phone = catch_data("new_contact_phone");

	// Traitements des données
	if ($new_contact_last_name == NULL)
		$new_contact_last_name = "";
	if ($new_contact_first_name == NULL)
		$new_contact_first_name = "";
	if ($new_contact_email == NULL)
		$new_contact_email = "";
	if ($new_contact_phone == NULL)
		$new_contact_phone = "";

	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$insert = $bdd -> prepare("
		INSERT INTO partenaire_international (nom, pays, nom_contact, prenom_contact, email_contact, numero_contact)
		VALUES (?, ?, ?, ?, ?, ?)
		");
	$statut = $insert -> execute(array($new_name, $new_country, $new_contact_last_name, $new_contact_first_name, $new_contact_email, $new_contact_phone));

	echo json_encode($statut);	// Envoie du json au JavaScript
}
