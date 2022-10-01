<?php

/* Définition des fonctions */
switch ($_POST["function"]) {
	case "get_campus":
		get_campus();
		break;
	case "get_promotions":
		get_promotions();
		break;
	case "get_student":
		get_student();
		break;
	case "edit_student":
		edit_student();
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

/* Recherche des étudiants */
function get_student() {

	// Récupération des données
	$student_id = catch_data("student_id");
	$student_first_name = catch_data("student_first_name");
	$student_last_name = catch_data("student_last_name");
	$student_promotion = catch_data("student_promotion");
	$student_campus = catch_data("student_campus");

	// Traitements des données
	if ($student_campus == "Campus")
		$student_campus = NULL;
	if ($student_promotion == "Promotion")
		$student_promotion = NULL;
	$year = date("Y");
	$month = date("m");
	if ($month < 8)
		$year = $year - 1;

	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$search = $bdd -> prepare("
		SELECT DISTINCT(S.numeroEtudiant) id, S.nom last_name, S.prenom first_name, S.toeicObtention toeic_obtain, S.toeicNote toeic_grade, S.toeicDateObtention  toeic_date
		FROM etudiant AS S, annee as Y, promotion as P 
		WHERE S.numeroEtudiant=Y.idEtudiant 
		AND Y.idPromotion=P.id
		AND (S.numeroEtudiant = ? OR ? IS NULL) 
		AND (LOWER(S.nom) LIKE LOWER(?) OR ? IS NULL) 
		AND (LOWER(S.prenom) LIKE LOWER(?) OR ? IS NULL)
		AND ((LOWER(P.Classe) = LOWER(?) AND Y.annee LIKE ?) OR ? IS NULL)
		AND ((LOWER(P.Campus) = LOWER(?) AND Y.annee LIKE ?) OR ? IS NULL)
		ORDER BY S.nom, S.prenom ASC
	");
	$search -> execute(array($student_id, $student_id,
	 $student_last_name."%", $student_last_name,
	  $student_first_name."%", $student_first_name,
	   $student_promotion, $year."%", $student_promotion, 
	    $student_campus, $year."%", $student_campus, 
	));
	$data = $search -> fetchAll();
	
	echo json_encode($data);	// Envoie du json au JavaScript
}

/* Modification des données de l'étudiant */
function edit_student() {
	
	// Récupération des données
	$student_id = catch_data("student_id");
	$student_toeic_obtain = catch_data("student_toeic_obtain");
	$student_toeic_grade = catch_data("student_toeic_grade");
	$student_toeic_date = catch_data("student_toeic_date");

	// Traitements des données
	switch ($student_toeic_obtain) {
		case "Oui":
			$student_toeic_obtain = 1;
			break;
		case "Non":
			$student_toeic_obtain = 0;
			break;
		case NULL:
			$student_toeic_obtain = 0;
			break;
		default:
			$student_toeic_obtain = NULL;
			break;
	}

	include("bdd_connect.php");	// Connexion à la BDD

	// Requête à la BDD
	$set = $bdd -> prepare("
		UPDATE etudiant
		SET toeicObtention = ?, toeicNote = ?, toeicDateObtention = ?
		WHERE numeroEtudiant = ?
		");
	$statut = $set -> execute(array($student_toeic_obtain, $student_toeic_grade, $student_toeic_date, $student_id));

	echo json_encode($statut);	// Envoie du json au JavaScript
}
