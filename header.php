<?php
	// if (!isset($_SESSION["id"])) header("location: login.php");	// Renvoie à la page de connexion si non connecté
	if (count(get_included_files()) == 1) header("location: login.php");	// Empêche l'accès direct
?>

<header class="shadow p-3 mb-3 border-bottom" id="top">
	<div class="container">
		<div class="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start">
			<a href="index" class="text-centered-flex align-items-center mb-2 me-3 mb-lg-0 text-light text-decoration-none">
				<!-- <img src="assets/img/eilco.jpg" width="40" height="40" class="rounded-circle"> -->
				<img src="assets/img/eilco.png" width="auto" height="40">
			</a>

			<ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
				<?php
					if (basename($_SERVER["PHP_SELF"]) == "index.php" || basename($_SERVER["PHP_SELF"]) == "login.php")
							echo '<li><u><a href="index" class="nav-link px-2 link-light">Accueil</a></u></li>';
						else
							echo '<li><a href="index" class="nav-link px-2 link-light">Accueil</a></li>';

					if ($_SESSION["admin"] == 1 || $_SESSION["toeic"] == 1)
						if (basename($_SERVER["PHP_SELF"]) == "toeic.php")
							echo '<li><u><a href="toeic" class="nav-link px-2 link-light">Gestion TOEIC</a></u></li>';
						else
							echo '<li><a href="toeic" class="nav-link px-2 link-light">Gestion TOEIC</a></li>';
					if ($_SESSION["admin"] == 1 || $_SESSION["mobility"] == 1)
						if (basename($_SERVER["PHP_SELF"]) == "mobilites.php")
							echo '<li><u><a href="mobilites" class="nav-link px-2 link-light">Gestion Mobilités</a></u></li>';
						else
							echo '<li><a href="mobilites" class="nav-link px-2 link-light">Gestion Mobilités</a></li>';
					if ($_SESSION["admin"] == 1 || $_SESSION["partner"] == 1)
						if (basename($_SERVER["PHP_SELF"]) == "partenaires.php")
							echo '<li><u><a href="partenaires" class="nav-link px-2 link-light">Gestion Partenaires</a></u></li>';
						else
							echo '<li><a href="partenaires" class="nav-link px-2 link-light">Gestion Partenaires</a></li>';
					if ($_SESSION["admin"] == 1)
						if (basename($_SERVER["PHP_SELF"]) == "admin.php")
							echo '<li><u><a href="admin" class="nav-link px-2 link-light">Administration</a></u></li>';
						else
							echo '<li><a href="admin" class="nav-link px-2 link-light">Administration</a></li>';
				?>
			</ul>	<!-- echo basename($_SERVER['PHP_SELF']); -->

			<?php if (isset($_SESSION["id"])) echo '
				<div class="dropdown text-end">
					<a href="#" class="d-block link-light text-decoration-none dropdown-toggle" id="dropdownUser" data-bs-toggle="dropdown" aria-expanded="false">
					 	' . $_SESSION["last_name"] . ' ' . $_SESSION["first_name"] .'
						<img src="assets/img/user.svg" class="rounded-circle" height="32px" width="32px">
					</a>
					<ul class="dropdown-menu text-small" aria-labelledby="dropdownUser">
						<li><a class="dropdown-item" href="?logout">Déconnexion</a></li>
					</ul>
				</div>';
			?>
		</div>
	</div>
</header>
