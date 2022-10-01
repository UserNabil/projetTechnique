/* Variables globale */
list_campus = [];
list_promotions = [];

/* Quand la page est chargée */
$(document).ready(function(){
	get_campus(list_campus);
	get_promotions(list_promotions);
});

/* Crée une liste des différents campus */
function get_campus(list) {
	$.ajax({
		url: "assets/php/toeic.php",
		type: "POST",
		dataType: "json",
		data: {"function": "get_campus"},
		success: function(result, statut) {
			result.forEach(elt => {
				$("#student_campus").append(
					'<option>' + elt['campus'] + '</option>'
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

/* Crée une liste des différentes promotions */
function get_promotions(list) {
	$.ajax({
		url: "assets/php/toeic.php",
		type: "POST",
		dataType: "json",
		data: {"function": "get_promotions"},
		success: function(result, statut) {
			result = JSON.stringify(result);
			result = result.replaceAll("PREPA 1", "CP1").replaceAll("PREPA 2", "CP2").replaceAll("1ERE ANNEE", "ING1").replaceAll("2EME ANNEE", "ING2").replaceAll("3EME ANNEE", "ING3");
			result = JSON.parse(result);
			result.sort((a, b) => a.class.localeCompare(b.class));
			result.forEach(elt => {
				$("#student_promotion").append(
					'<option>' + elt['class'] + '</option>'
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

/* Lance la recherche des étudiants avec affichage dynamique */
$("#search").click(function() {
	// Récupération des données saisies
	student_id = $("#student_id").val();
	student_last_name = $("#student_last_name").val();
	student_first_name = $("#student_first_name").val();
	// student_promotion = $("#student_promotion").val();
	student_promotion = $("#student_promotion").val().replaceAll("CP1", "PREPA 1").replaceAll("CP2", "PREPA 2").replaceAll("ING1", "1ERE ANNEE").replaceAll("ING2", "2EME ANNEE").replaceAll("ING3", "3EME ANNEE");
	student_campus = $("#student_campus").val();

	// Récupération des données correspondantes en BDD et affichage
	$.ajax({
		url: "assets/php/toeic.php",
		type: "POST",
		dataType: "json",
		data: {"function": "get_student", "student_id": student_id, "student_first_name": student_first_name, "student_last_name": student_last_name, "student_promotion": student_promotion, "student_campus": student_campus},
		success: function(result, statut) {
			// Affichage dynamique
			$("#students").empty();
			$("#students").append('<thead><tr class="text-center"><th>Numéro</th><th>Nom</th><th>Prénom</th><th>Obtenu</th><th>Note</th><th>Date</th><th>Action</th></tr></thead>');
			$("#students").append('<tbody>');
			result.forEach(elt => {
				$("#students").append(
					'<tr class="text-center" id="' + elt['id'] + '">' +
						'<td class="id">' + elt['id'] + '</td>' +
						'<td class="last_name">' + elt['last_name'] + '</td>' +
						'<td class="first_name">' + elt['first_name'] + '</td>' +
						'<td class="toeic_obtain">' + (elt['toeic_obtain'] == 1 ? 'Oui' : 'Non') + '</td>' +
						'<td class="toeic_grade"><input class="input" type="number" value="' + (elt['toeic_grade'] ? elt['toeic_grade'] : '') + '" min="0" max="990" disabled></td>' +
						'<td class="toeic_date"><input class="input" type="date" value="' + (elt['toeic_date'] ? elt['toeic_date'] : '') + '" disabled></td>' +
						'<td class="toeic_action"><button type="submit" class="toeic_edit btn btn-info btn-sm me-2" onclick=edit_toeic('+ elt['id'] +')>Modifier</button><button type="submit" class="toeic_delete btn btn-danger btn-sm" onclick=delete_toeic('+ elt['id'] +')>Supprimer</button></td>' +
					'</tr>'
				);
			});
			$("#students").append('</tbody>');
		},
		error: function(result, statut, error) {
			console.log(statut);
			console.log(error);
			console.log(result);	
		}
	});
});

/* Permet la modification des données d'un étudiant */
function edit_toeic(student_id) {
	$("#"+student_id).find(".input").prop("disabled", false);	// Rend les champs modifiables
	$("#"+student_id).find(".toeic_edit").text("Sauvegarder").attr("onclick", "save_toeic("+ student_id +")");	// Change le bouton modifier en sauvegarder
	$("#"+student_id).find(".toeic_delete").text("Annuler").attr("onclick", "cancel_toeic("+ student_id +")");	// Change le bouton supprimer en annuler

	// Sauvegarde de la valeur dans le nom
	$("#"+student_id).find(".toeic_grade input").attr("name", $("#"+student_id).find(".toeic_grade input").val());
	$("#"+student_id).find(".toeic_date input").attr("name", $("#"+student_id).find(".toeic_date input").val());
}

/* Annule la modification */
function cancel_toeic(student_id) {
	$("#"+student_id).find(".input").prop("disabled", true);	// Rend les champs non modifiables
	$("#"+student_id).find(".toeic_edit").text("Modifier").attr("onclick", "edit_toeic("+ student_id +")");	// Change le bouton sauvegarder en modifier
	$("#"+student_id).find(".toeic_delete").text("Supprimer").attr("onclick", "delete_toeic("+ student_id +")");	// Change le bouton annuler en supprimer

	// Reset des données avec celles précédentes
	$("#"+student_id).find(".toeic_grade input").val($("#"+student_id).find(".toeic_grade input").attr("name"));
	$("#"+student_id).find(".toeic_date input").val($("#"+student_id).find(".toeic_date input").attr("name"));
}

/* Supprime la note */
function delete_toeic(student_id) {
	// Récupération des données
	student_last_name = $("#"+student_id).find(".last_name").text();
	student_first_name = $("#"+student_id).find(".first_name").text();
	student_toeic_grade = $("#"+student_id).find(".toeic_grade input").val();

	// Vérification que pas déjà nul
	if (!student_toeic_grade) {
		alert("Les champs pour cet(te) étudiant(e) sont déjà vides.");
	} else {
		// Demande confirmmation
		if (confirm("Êtes-vous sûr de vouloir supprimer la note de " + student_last_name + " " + student_first_name + "?") == true) {
			// Mise à jour visuelle
			$("#"+student_id).find(".toeic_obtain").text("Non");
			$("#"+student_id).find(".toeic_grade input").val(null);
			$("#"+student_id).find(".toeic_date input").val(null);

			// Mise à jour de la BDD
			$.ajax({
				url: "assets/php/toeic.php",
				type: "POST",
				dataType: "json",
				data: {"function": "edit_student", "student_id": student_id, "student_toeic_obtain" : null, "student_toeic_grade" : null, "student_toeic_date" : null },
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
}

/* Sauvegarde en BDD les modifications */
function save_toeic(student_id) {
	// Récupération des données
	student_toeic_grade = $("#"+student_id).find(".toeic_grade input").val();
	student_toeic_date = $("#"+student_id).find(".toeic_date input").val();

	if (!student_toeic_grade) {
		alert("Veuillez saisir une note ou annuler l'action.");
	} else if (!student_toeic_date) {
		alert("Veuillez saisir une date ou annuler l'action.");
	} else {
		$("#"+student_id).find(".input").prop("disabled", true);	// Rend les champs non modifiables
		$("#"+student_id).find(".toeic_edit").text("Modifier").attr("onclick", "edit_toeic("+ student_id +")");	// Change le bouton sauvegarder en modifier
		$("#"+student_id).find(".toeic_delete").text("Supprimer").attr("onclick", "delete_toeic("+ student_id +")");	// Change le bouton annuler en supprimer

		if (student_toeic_grade >= 785) {
			$("#"+student_id).find(".toeic_obtain").text("Oui");
			student_toeic_obtain = "Oui";
		} else {
			$("#"+student_id).find(".toeic_obtain").text("Non");
			student_toeic_obtain = "Non";
		}

		// Mise à jour de la BDD
		$.ajax({
			url: "assets/php/toeic.php",
			type: "POST",
			dataType: "json",
			data: {"function": "edit_student", "student_id": student_id, "student_toeic_obtain" : student_toeic_obtain, "student_toeic_grade" : student_toeic_grade, "student_toeic_date" : student_toeic_date },
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
