<?php

/* Connextion à la BDD */
function bddConnect() {
	try {
		$bdd = new PDO("mysql:host=localhost;dbname=projettec2;charset=utf8", "root", "");
	} catch (Exception $e) {
		exit();
	}
	return $bdd;
}

$bdd = bddConnect();
