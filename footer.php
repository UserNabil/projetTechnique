<?php
	// if (!isset($_SESSION["id"])) header("location: login.php");	// Renvoie à la page de connexion si non connecté
	if (count(get_included_files()) == 1) header("location: login.php");	// Empêche l'accès direct
?>

<div class="container mt-auto">
	<footer class="d-flex flex-wrap justify-content-between align-items-center py-3 my-4 border-top">
		<div class="col-md-4 d-flex align-items-center">
			<a href="/" class="mb-3 me-2 mb-md-0 text-muted text-decoration-none lh-1">
				<svg class="bi" width="30" height="24"><use xlink:href="#bootstrap"></use></svg>
			</a>
			<span class="text-muted">© <span id="footer-year"></span> EILCO</span>
		</div>

		<ul class="nav col-md-4 justify-content-end list-unstyled d-flex">
			<li class="ms-3"><a class="text-muted" href="#top"><svg class="bi" width="24" height="24" viewBox="0 0 384 512" fill="#006BA8"><path d="M374.6 246.6C368.4 252.9 360.2 256 352 256s-16.38-3.125-22.62-9.375L224 141.3V448c0 17.69-14.33 31.1-31.1 31.1S160 465.7 160 448V141.3L54.63 246.6c-12.5 12.5-32.75 12.5-45.25 0s-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0l160 160C387.1 213.9 387.1 234.1 374.6 246.6z"/></svg></a>
		</ul>
	</footer>
</div>