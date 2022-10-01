<?php

/* Définition des fonctions */
switch ($_POST["function"]) {
	case "get_campus":
		get_campus();
		break;
	case "get_promotions":
		get_promotions();
		break;
	case 'search_partner':
		search_partner();
		break;
	case "get_student":
		get_student();
		break;
	case "edit_mobility":
		edit_mobility();
		break;
	case "delete_mobility":
		delete_mobility();
		break;
	case "save_mobility":
		save_mobility();
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

/* Récupère la liste des campus */
function get_campus() {
	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$query = $bdd -> query("
		SELECT DISTINCT Campus campus
		FROM promotion
		ORDER BY Campus ASC
	");
	$data = $query -> fetchAll();
	
	echo json_encode($data);	// Envoie du json au JavaScript
}

/* Récupère la liste des promotions */
function get_promotions() {
	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$query = $bdd -> query("
		SELECT DISTINCT Classe class
		FROM promotion
		ORDER BY Classe ASC
	");
	$data = $query -> fetchAll();
	
	echo json_encode($data);	// Envoie du json au JavaScript
}

/* Récupère la liste des partenaires */
function search_partner() {
	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$search = $bdd -> prepare("
		SELECT id partner_id, nom partner_name, pays partner_country
		FROM partenaire_international
	");
	$search -> execute();
	$data = $search -> fetchAll();
	
	// Envoie du json au JavaScript
	echo json_encode($data);
}

/* Recherche des étudiants */
function get_student() {

	// Récupération des données
	$student_id = catch_data("student_id");
	$student_first_name = catch_data("student_first_name");
	$student_last_name = catch_data("student_last_name");
	$student_promotion = catch_data("student_promotion");
	$student_campus = catch_data("student_campus");

	//Traitements des données
	if($student_campus == "Campus")
		$student_campus = NULL;
	if($student_promotion == "Promotion")
		$student_promotion = NULL;
	$year = date("Y");
	$month = date("m");
	if($month < 8)
		$year = $year - 1;

	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$search = $bdd -> prepare("
		SELECT S.numeroEtudiant student_id, M.id mobility_id, S.nom last_name, S.prenom first_name, PA.nom partner_name, PA.pays country, M.periode_formation type, M.sortant is_out, M.dateDebut date_start, M.dateFin date_stop 
		FROM etudiant AS S
		LEFT JOIN mobilite AS M ON S.numeroEtudiant = M.idEtudiant
		LEFT JOIN partenaire_international AS PA ON PA.id = M.idPartenaire
		INNER JOIN annee AS Y ON S.numeroEtudiant=Y.idEtudiant 
		INNER JOIN promotion AS P ON Y.idPromotion=P.id
		WHERE (S.numeroEtudiant = ? OR ? IS NULL) 
		AND (LOWER(S.nom) LIKE LOWER(?) OR ? IS NULL) 
		AND (LOWER(S.prenom) LIKE LOWER(?) OR ? IS NULL)
		AND ((LOWER(P.Classe) = LOWER(?) AND Y.annee LIKE ?) OR ? IS NULL)
		AND ((LOWER(P.Campus) = LOWER(?) AND Y.annee LIKE ?) OR ? IS NULL)
		GROUP BY S.numeroEtudiant, M.id
		ORDER BY S.nom, S.prenom, M.dateDebut ASC
	");

	$search -> execute(array($student_id, $student_id,
	 $student_last_name."%", $student_last_name,
	  $student_first_name."%", $student_first_name,
	   $student_promotion, $year."%", $student_promotion, 
	    $student_campus, $year."%", $student_campus, 
	));
	$data = $search -> fetchAll();
	
	// Envoie du json au JavaScript
	echo json_encode($data);
}

/* Modification des données de la mobilité */
function edit_mobility() {
	// Récupération des données
	$mobility_id = catch_data("mobility_id");
	$mobility_partner_id = catch_data("mobility_partner_id");
	$mobility_type = catch_data("mobility_type");
	$mobility_is_out = intval(catch_data("mobility_is_out"));
	$mobility_date_start = catch_data("mobility_date_start");
	$mobility_date_stop = catch_data("mobility_date_stop");

	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$set = $bdd -> prepare("
		UPDATE mobilite
		SET idPartenaire = ?, periode_formation = ?, sortant = ?, dateDebut = ?, dateFin = ?
		WHERE id = ?
		");
	$statut = $set -> execute(array($mobility_partner_id, $mobility_type, $mobility_is_out, $mobility_date_start, $mobility_date_stop, $mobility_id));

	echo json_encode($statut);	// Envoie du json au JavaScript
}

/* Suppression d'une mobilité */
function delete_mobility() {
	// Récupération des données
	$mobility_id = catch_data("mobility_id");

	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$delete = $bdd -> prepare("
		DELETE FROM mobilite
		WHERE id = ?
		");
	$statut = $delete -> execute(array($mobility_id));

	echo json_encode($statut);	// Envoie du json au JavaScript
}

/* Ajout d'une mobilité */
function save_mobility() {
	// Récupération des données
	$student_id = catch_data("student_id");
	$mobility_partner_id = catch_data("mobility_partner_id");
	$mobility_type = catch_data("mobility_type");
	$mobility_is_out = intval(catch_data("mobility_is_out"));
	$mobility_date_start = catch_data("mobility_date_start");
	$mobility_date_stop = catch_data("mobility_date_stop");

	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$insert = $bdd -> prepare("
		INSERT INTO mobilite (idEtudiant, idPartenaire, periode_formation, sortant, dateDebut, dateFin)
		VALUES (?, ?, ?, ?, ?, ?)
		");
	$statut = $insert -> execute(array($student_id, $mobility_partner_id, $mobility_type, $mobility_is_out, $mobility_date_start, $mobility_date_stop));

	// Récupérer l'id de la mobilité
	$query = $bdd -> query("
		SELECT MAX(id)
		FROM mobilite
	");
	$data = $query -> fetch();

	echo json_encode($data);	// Envoie du json au JavaScript
}
