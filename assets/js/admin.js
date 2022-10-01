/* Quand la page est chargée */
$(document).ready(function(){
	load_users();
});

/* Load users */
function load_users() {
	// Récupération des données correspondantes en BDD et affichage
	$.ajax({
		url: "assets/php/admin.php",
		type: "POST",
		dataType: "json",
		data: {"function": "load_users"},
		success: function(result, statut) {
			console.log(result);
			// Affichage dynamique
			$("#users").empty();
			$("#users").append('<thead><tr class="text-center"><th>Nom</th><th>Prénom</th><th>Email</th><th>Mot de passe</th><th>Admin</th><th>TOEIC</th><th>Mobilité</th><th>Partenaires</th><th>Action</th></tr></thead>');
			$("#users").append('<tbody>');
			result.forEach(elt => {
				$("#users").append(
					'<tr class="text-center align-middle" id="' + elt['id'] + '">' +
						'<td class="last_name"><input class="input" type="text" size="10" value="' + elt['last_name'] + '" disabled></td>' +
						'<td class="first_name"><input class="input" type="text" size="10" value="' + elt['first_name'] + '" disabled></td>' +
						'<td class="email"><input class="input" type="text" value="' + elt['email'] + '" disabled></td>' +
						'<td class="password"><input class="input" type="text" placeholder="•••••••••" value="•••••••••" disabled></td>' +
						'<td class="admin"><input class="input" type="checkbox"' + (elt['admin'] == 1 ? 'checked' : '') + ' disabled></td>' +
						'<td class="toeic"><input class="input" type="checkbox"' + (elt['toeic'] == 1 ? 'checked' : '') + ' disabled></td>' +
						'<td class="mobility"><input class="input" type="checkbox"' + (elt['mobility'] == 1 ? 'checked' : '') + ' disabled></td>' +
						'<td class="partner"><input class="input" type="checkbox"' + (elt['partner'] == 1 ? 'checked' : '') + ' disabled></td>' +
						'<td class="user_action"><button type="submit" class="user_edit btn btn-info btn-sm me-2" onclick=edit_user('+ elt['id'] +')>Modifier</button><button type="submit" class="user_delete btn btn-danger btn-sm" onclick=delete_user('+ elt['id'] +')>Supprimer</button></td>' +
					'</tr>'
				);
			});
			$("#users").append('</tbody>');
		},
		error: function(result, statut, error) {
			console.log(statut);
			console.log(error);
			console.log(result);	
		}
	});
}

/* Permet la modification des données d'un utilisateur */
function edit_user(user_id) {
	$("#"+user_id).find(".input").prop("disabled", false);	// Rend les champs modifiables
	$("#"+user_id).find(".user_edit").text("Sauvegarder").attr("onclick", "save_user("+ user_id +")");	// Change le bouton modifier en sauvegarder
	$("#"+user_id).find(".user_delete").text("Annuler").attr("onclick", "cancel_user("+ user_id +")");	// Change le bouton supprimer en annuler

	// Sauvegarde de la valeur dans le nom
	$("#"+user_id).find(".last_name input").attr("name", $("#"+user_id).find(".last_name input").val());
	$("#"+user_id).find(".first_name input").attr("name", $("#"+user_id).find(".first_name input").val());
	$("#"+user_id).find(".email input").attr("name", $("#"+user_id).find(".email input").val());
	// $("#"+user_id).find(".password input").attr("name", $("#"+user_id).find(".password input").val());
	$("#"+user_id).find(".password input").val("");	// Spécifique au mot de passe
	$("#"+user_id).find(".admin input").attr("name", $("#"+user_id).find(".admin input").is(":checked"));
	$("#"+user_id).find(".toeic input").attr("name", $("#"+user_id).find(".toeic input").is(":checked"));
	$("#"+user_id).find(".mobility input").attr("name", $("#"+user_id).find(".mobility input").is(":checked"));
	$("#"+user_id).find(".partner input").attr("name", $("#"+user_id).find(".partner input").is(":checked"));
}

/* Annule la modification */
function cancel_user(user_id) {
	$("#"+user_id).find(".input").prop("disabled", true);	// Rend les champs non modifiables
	$("#"+user_id).find(".user_edit").text("Modifier").attr("onclick", "edit_user("+ user_id +")");	// Change le bouton sauvegarder en modifier
	$("#"+user_id).find(".user_delete").text("Supprimer").attr("onclick", "delete_user("+ user_id +")");	// Change le bouton annuler en supprimer

	// Reset des données avec celles précédentes
	$("#"+user_id).find(".last_name input").val($("#"+user_id).find(".last_name input").attr("name"));
	$("#"+user_id).find(".first_name input").val($("#"+user_id).find(".first_name input").attr("name"));
	$("#"+user_id).find(".email input").val($("#"+user_id).find(".email input").attr("name"));
	// $("#"+user_id).find(".password input").val($("#"+user_id).find(".password input").attr("name"));
	$("#"+user_id).find(".password input").val("•••••••••");	// Spécifique au mot de passe
	$("#"+user_id).find(".admin input").prop("checked", $("#"+user_id).find(".admin input").attr("name") === "true");
	$("#"+user_id).find(".toeic input").prop("checked", $("#"+user_id).find(".toeic input").attr("name") === "true");
	$("#"+user_id).find(".mobility input").prop("checked", $("#"+user_id).find(".mobility input").attr("name") === "true");
	$("#"+user_id).find(".partner input").prop("checked", $("#"+user_id).find(".partner input").attr("name") === "true");
}

/* Supprime l'utilisateur */
function delete_user(user_id) {
	// Récupération des données
	user_last_name = $("#"+user_id).find(".last_name input").val();
	user_first_name = $("#"+user_id).find(".first_name input").val();

	// Demande confirmmation
	if (confirm("Êtes-vous sûr de vouloir supprimer " + user_last_name + " " + user_first_name + " des utilisateurs ?") == true) {
		// Mise à jour visuelle
		$("#"+user_id).remove();

		// Mise à jour de la BDD
		$.ajax({
			url: "assets/php/admin.php",
			type: "POST",
			dataType: "json",
			data: {"function": "delete_user", "user_id": user_id},
			success: function(result, statut) {
				// console.log(statut);
			},
			error: function(result, statut, error) {
				console.log(statut);
				console.log(error);
				console.log(result);	
			}
		});
	}
}

/* Sauvegarde en BDD les modifications */
function save_user(user_id) {
	// Récupération des données
	user_last_name = $("#"+user_id).find(".last_name input").val();
	user_first_name = $("#"+user_id).find(".first_name input").val();
	user_email = $("#"+user_id).find(".email input").val();
	user_password = $("#"+user_id).find(".password input").val();
	user_admin = $("#"+user_id).find(".admin input").is(":checked") ? 1 : 0;
	user_toeic = $("#"+user_id).find(".toeic input").is(":checked") ? 1 : 0;
	user_mobility = $("#"+user_id).find(".mobility input").is(":checked") ? 1 : 0;
	user_partner = $("#"+user_id).find(".partner input").is(":checked") ? 1 : 0;

	$("#"+user_id).find(".password input").val("•••••••••");	// Masquer le mot de passe

	if (!user_last_name) {
		alert("Veuillez saisir un prénom pour l'utilisateur.");
	} else if (!user_first_name) {
		alert("Veullez saisir un nom pour l'utilisateur.");
	} else if (!user_email) {
		alert("Veullez saisir une adresse mail pour l'utilisateur.");
	} else {
		$("#"+user_id).find(".input").prop("disabled", true);	// Rend les champs non modifiables
		$("#"+user_id).find(".user_edit").text("Modifier").attr("onclick", "edit_user("+ user_id +")");	// Change le bouton sauvegarder en modifier
		$("#"+user_id).find(".user_delete").text("Supprimer").attr("onclick", "delete_user("+ user_id +")");	// Change le bouton annuler en supprimer

		// Mise à jour de la BDD
	 	$.ajax({
			url: "assets/php/admin.php",
			type: "POST",
			dataType: "json",
			data: {"function": "edit_user", "user_id": user_id, "user_last_name": user_last_name, "user_first_name": user_first_name, "user_email": user_email, "user_password": user_password, "user_admin": user_admin, "user_toeic": user_toeic, "user_mobility": user_mobility, "user_partner": user_partner},
			success: function(result, statut) {
				// console.log(statut);
			},
			error: function(result, statut, error) {
				console.log(statut);
				console.log(error);
				console.log(result);
			}
		});
	}
}

/* Ajout d'un utilisateur */
$("#new").click(function() {
	// Récupération des données
	new_last_name = $("#new_last_name").val();
	new_first_name = $("#new_first_name").val();
	new_email = $("#new_email").val();
	new_password = $("#new_password").val();

	if (!new_last_name || !new_first_name || !new_email || !new_password) {	// Vérification des champs
		alert("Tous les champs doivent être remplis.");
	} else {
		// Mise à jour de la BDD
		$.ajax({
		url: "assets/php/admin.php",
		type: "POST",
		dataType: "json",
		data: {"function": "add_user", "new_last_name": new_last_name, "new_first_name": new_first_name, "new_email": new_email, "new_password": new_password},
		success: function(result, statut) {
			// Affichage dynamique
			$("#new_user").find("input").val("");
			load_users();
		},
		error: function(result, statut, error) {
			console.log(statut);
			console.log(error);
			console.log(result);	
		}
	});
	}	
});
