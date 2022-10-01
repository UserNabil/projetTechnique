/* Variables globale */
list_countries = [];

/* Quand la page est chargée */
$(document).ready(function(){
	get_countries(list_countries);
});

/* Crée une liste des différents pays */
function get_countries(list) {
	$.ajax({
		url: "assets/php/partenaires.php",
		type: "POST",
		dataType: "json",
		data: {"function": "get_countries"},
		success: function(result, statut) {
			result.forEach(elt => {
				$("#partner_country").append(
					'<option>' + elt['country'] + '</option>'
				);
			});
		},
		error: function(result, statut, error) {
			console.log(statut);
			console.log(error);
			console.log(result);	
		}
	});
}

/* Lance la recherche des partenaires avec affichage dynamique */
$("#search").click(function() {
	// Récupération des données saisies
	partner_name = $("#partner_name").val();
	partner_country = $("#partner_country").val();
	
	// Récupération des données correspondantes en BDD et affichage
	$.ajax({
		url: "assets/php/partenaires.php",
		type: "POST",
		dataType: "json",
		data: {"function": "get_partner", "partner_name": partner_name, "partner_country": partner_country},
		success: function(result, statut) {
			// Affichage dynamique
			$("#partners").empty();
			$("#partners").append('<thead><tr class="text-center"><th>Nom</th><th>Pays</th><th>Nom Contact</th><th>Prénom Contact</th><th>Email Contact</th><th>Numéro Contact</th><th>Action</th></tr></thead>');
			$("#partners").append('<tbody>');
			result.forEach(elt => {
				$("#partners").append(
					'<tr class="text-center" id="' + elt['id'] + '">' +
						'<td class="name"><input class="input w-100" type="text" value="' + elt['name'] + '" disabled></td>' +
						'<td class="country px-0"><input class="input w-75" type="text" value="' + elt['country'] + '" disabled></td>' +
						'<td class="contact_last_name px-0"><input class="input w-85" type="text" value="' + (elt['contact_last_name'] ? elt['contact_last_name'] : '') + '" disabled></td>' +
						'<td class="contact_first_name px-0"><input class="input w-85" type="text" value="' + (elt['contact_first_name'] ? elt['contact_first_name'] : '') + '" disabled></td>' +
						'<td class="contact_email px-0"><input class="input w-100" type="text" value="' + (elt['contact_email'] ? elt['contact_email'] : '') + '" disabled></td>' +
						'<td class="contact_phone px-0"><input class="input w-85" type="text" value="' + (elt['contact_phone'] ? elt['contact_phone'] : '') + '" disabled></td>' +
						'<td class="partner_action px-0 w-15"><button type="submit" class="partner_edit btn btn-info btn-sm me-2 mb-2" onclick=edit_partner('+ elt['id'] +')>Modifier</button><button type="submit" class="partner_delete btn btn-danger btn-sm mb-2" onclick=delete_partner('+ elt['id'] +')>Supprimer</button></td>' +
					'</tr>'
				);
			});
			$("#partners").append('</tbody>');
		},
		error: function(result, statut, error) {
			console.log(statut);
			console.log(error);
			console.log(result);	
		}
	});
});

/* Permet la modification des données d'un partenaire */
function edit_partner(partner_id) {
	$("#"+partner_id).find(".input").prop("disabled", false);	// Rend les champs modifiables
	$("#"+partner_id).find(".partner_edit").text("Sauvegarder").attr("onclick", "save_partner("+ partner_id +")");	// Change le bouton modifier en sauvegarder
	$("#"+partner_id).find(".partner_delete").text("Annuler").attr("onclick", "cancel_partner("+ partner_id +")");	// Change le bouton supprimer en annuler

	// Sauvegarde de la valeur dans le nom
	$("#"+partner_id).find(".name input").attr("name", $("#"+partner_id).find(".name input").val());
	$("#"+partner_id).find(".country input").attr("name", $("#"+partner_id).find(".country input").val());
	$("#"+partner_id).find(".contact_last_name input").attr("name", $("#"+partner_id).find(".contact_last_name input").val());
	$("#"+partner_id).find(".contact_first_name input").attr("name", $("#"+partner_id).find(".contact_first_name input").val());
	$("#"+partner_id).find(".contact_email input").attr("name", $("#"+partner_id).find(".contact_email input").val());
	$("#"+partner_id).find(".contact_phone input").attr("name", $("#"+partner_id).find(".contact_phone input").val());
}

/* Annule la modification */
function cancel_partner(partner_id) {
	$("#"+partner_id).find(".input").prop("disabled", true);	// Rend les champs non modifiables
	$("#"+partner_id).find(".partner_edit").text("Modifier").attr("onclick", "edit_partner("+ partner_id +")");	// Change le bouton sauvegarder en modifier
	$("#"+partner_id).find(".partner_delete").text("Supprimer").attr("onclick", "delete_partner("+ partner_id +")");	// Change le bouton annuler en supprimer

	// Reset des données avec celles précédentes
	$("#"+partner_id).find(".name input").val($("#"+partner_id).find(".name input").attr("name"));
	$("#"+partner_id).find(".country input").val($("#"+partner_id).find(".country input").attr("name"));
	$("#"+partner_id).find(".contact_last_name input").val($("#"+partner_id).find(".contact_last_name input").attr("name"));
	$("#"+partner_id).find(".contact_first_name input").val($("#"+partner_id).find(".contact_first_name input").attr("name"));
	$("#"+partner_id).find(".contact_email input").val($("#"+partner_id).find(".contact_email input").attr("name"));
	$("#"+partner_id).find(".contact_phone input").val($("#"+partner_id).find(".contact_phone input").attr("name"));
}

/* Supprime le partenaire */
function delete_partner(partner_id) {
	// Récupération des données
	partner_name = $("#"+partner_id).find(".name input").val();

	// Demande confirmmation
	if (confirm("Êtes-vous sûr de vouloir supprimer " + partner_name + " des partenaires ?") == true) {
		// Mise à jour visuelle
		$("#"+partner_id).remove();

		// Mise à jour de la BDD
		$.ajax({
			url: "assets/php/partenaires.php",
			type: "POST",
			dataType: "json",
			data: {"function": "delete_partner", "partner_id": partner_id},
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
function save_partner(partner_id) {
	// Récupération des données
	partner_name = $("#"+partner_id).find(".name input").val();
	partner_country = $("#"+partner_id).find(".country input").val();
	partner_contact_last_name = $("#"+partner_id).find(".contact_last_name input").val();
	partner_contact_first_name = $("#"+partner_id).find(".contact_first_name input").val();
	partner_contact_email = $("#"+partner_id).find(".contact_email input").val();
	partner_contact_phone = $("#"+partner_id).find(".contact_phone input").val();

	if (!partner_name) {
		alert("Veuillez saisir un nom pour le partenaire.");
	} else if (!partner_country) {
		alert("Veullez saisir un pays pour le partenaire.");
	} else {
		$("#"+partner_id).find(".input").prop("disabled", true);	// Rend les champs non modifiables
		$("#"+partner_id).find(".partner_edit").text("Modifier").attr("onclick", "edit_partner("+ partner_id +")");	// Change le bouton sauvegarder en modifier
		$("#"+partner_id).find(".partner_delete").text("Supprimer").attr("onclick", "delete_partner("+ partner_id +")");	// Change le bouton annuler en supprimer

		// Mise à jour de la BDD
	 	$.ajax({
			url: "assets/php/partenaires.php",
			type: "POST",
			dataType: "json",
			data: {"function": "edit_partner", "partner_id": partner_id, "partner_name" : partner_name, "partner_country" : partner_country, "partner_contact_last_name" : partner_contact_last_name, "partner_contact_first_name": partner_contact_first_name,"partner_contact_phone": partner_contact_phone,"partner_contact_email": partner_contact_email},
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

/* Ajout d'un partenaire */
$("#new").click(function() {
	// Récupération des données
	new_name = $("#new_name").val();
	new_country = $("#new_country").val();
	new_contact_last_name = $("#new_contact_last_name").val();
	new_contact_first_name = $("#new_contact_first_name").val();
	new_contact_phone = $("#new_contact_phone").val();
	new_contact_email = $("#new_contact_email").val();

	if (!new_name || !new_country) {	// Vérification des champs
		alert("Les champs \"Non du partenaire\" et \"Pays\" doivent obligatoirement être remplis.");
	} else {
		// Affichage dynamique
		$("#partners").empty();
		$("#new_partner").find("input").val("");

		// Mise à jour de la BDD
		$.ajax({
		url: "assets/php/partenaires.php",
		type: "POST",
		dataType: "json",
		data: {"function": "add_partner", "new_name": new_name, "new_country": new_country, "new_contact_last_name": new_contact_last_name, "new_contact_first_name": new_contact_first_name, "new_contact_phone": new_contact_phone, "new_contact_email": new_contact_email},
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
});
