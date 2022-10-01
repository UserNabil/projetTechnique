/* Variables globale */
list_partners = [];
list_campus = [];
list_promotions = [];
select_partner = '';

/* Quand la page est chargée */
$(document).ready(function(){
	get_campus(list_campus);
	get_promotions(list_promotions);
	search_partner(list_partners);
});

/* Crée une liste des différents partenaires */
function search_partner(list) {
	$.ajax({
		url: "assets/php/mobilites.php",
		type: "POST",
		dataType: "json",
		data: {"function": "search_partner"},
		success: function(result, statut) {
			result.forEach( function(element, index) {
				list.push(element);
			});
		},
		error: function(result, statut, error) {
			console.log(statut);
			console.log(error);
			console.log(result);	
		}
	});
}

/* Crée une liste des différents campus */
function get_campus(list) {
	$.ajax({
		url: "assets/php/mobilites.php",
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
		url: "assets/php/mobilites.php",
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

/* Fonction de recherche des étudiants avec affichage dynamique */
$("#search").click(function() {
	// Récupération des données
	student_id = $("#student_id").val();
	student_last_name = $("#student_last_name").val();
	student_first_name = $("#student_first_name").val();
	student_promotion = $("#student_promotion").val();
	student_campus = $("#student_campus").val();

	// Récupération des données correspondantes en BDD et affichage
	$.ajax({
		url: "assets/php/mobilites.php",
		type: "POST",
		dataType: "json",
		data: {"function": "get_student", "student_id": student_id, "student_first_name": student_first_name, "student_last_name": student_last_name, "student_promotion": student_promotion, "student_campus": student_campus},
		success: function(result, statut) {
			// console.log(result);
			// Affichage dynamique
			$("#students").empty();
			$("#students").append('<thead><tr class="text-center"><th>Numéro</th><th>Nom</th><th>Prénom</th><th>Pays</th><th>Partenaire</th><th>Type</th><th>Sortant</th><th>Date Début</th><th>Date Fin</th><th></th><th>Action</th><th></th></tr></thead>');
			$("#students").append('<tbody>');

			result.forEach(elt => {
				// Charge la liste des partenaires
				select_partner = '<select class="input w-85 my-08" disabled>';
				list_partners.forEach(element => {
					select_partner += '<option name="' + element['partner_id'] + '" ';
					if (elt['partner_name'] == element['partner_name'])
						select_partner += 'selected';
					select_partner += '>'+ element['partner_name'] +'</option>' ;
				});
				select_partner += '</select>';

				// Si l'étudiant est déjà dans la liste - sinon
				if ($("#students").find("#" + elt["student_id"]).length) {
					$("#"+elt["student_id"]+" .country table").append(
						'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
							'<div class="my-09">' + elt['country'] + '</div>' +
						'</td></tr>'
					);
					$("#"+elt["student_id"]+" .partner table").append(
						'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
							select_partner +
						'</td></tr>'
					);
					// $("#"+elt["student_id"]+" .type table").append(
					// 	'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
					// 		'<select class="input my-08" disabled>' +
					// 			'<option ' + (elt['type'] == 'DD' ? 'selected' : '') + '>DD</option>' +
					// 			'<option ' + (elt['type'] == 'ING2' ? 'selected' : '') + '>ING2</option>' +
					// 			'<option ' + (elt['type'] == 'ING3' ? 'selected' : '') + '>ING3</option>' +
					// 		'</select>' +
					// 	'</td></tr>'
					// );
					$("#"+elt["student_id"]+" .type table").append(
						'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
							'<select class="input my-08" disabled>' +
								'<option ' + (elt['type'] == '1 an DD' ? 'selected' : '') + '>DD</option>' +
								'<option ' + (elt['type'] == '2e semestre ING2' ? 'selected' : '') + '>ING2</option>' +
								'<option ' + (elt['type'] == '1er semestre' ? 'selected' : '') + '>ING3</option>' +
							'</select>' +
						'</td></tr>'
					);
					$("#"+elt["student_id"]+" .is_out table").append(
						'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
							'<div class="my-09">' + (elt['is_out'] == 1 ? 'Oui' : 'Non') + '</div>' +
						'</td></tr>'
					);
					$("#"+elt["student_id"]+" .date_start table").append(
						'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
							'<input class="input w-75 my-04" type="date" value="' + (elt['date_start'] ? elt['date_start'] : '') + '" disabled>' +
						'</td></tr>'
					);
					$("#"+elt["student_id"]+" .date_stop table").append(
						'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
							'<input class="input w-75 my-04" type="date" value="' + (elt['date_stop'] ? elt['date_stop'] : '') + '" disabled>' +
						'</td></tr>'
					);
					$("#"+elt["student_id"]+" .mobility_action_edit table").append(
						'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
							'<button type="submit" class="mobility_edit btn btn-info btn-sm mx-1" onclick=edit_mobility(' + elt['student_id'] + ',' + elt['mobility_id'] + ')>Modifier</button>' +
						'</td></tr>'
					);
					$("#"+elt["student_id"]+" .mobility_action_delete table").append(
						'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
							'<button type="submit" class="mobility_delete btn btn-danger btn-sm mx-1" onclick=delete_mobility('+ elt['student_id'] + ',' + elt['mobility_id'] + ')>Supprimer</button>' +
						'</td></tr>'
					);
					// $("#"+elt["student_id"]+" .mobility_action_add table").append(
					// 	'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
					// 		'<button type="submit" class="mobility_add btn btn-info btn-sm mx-1" onclick=add_mobility('+ elt['student_id'] + ',' + elt['mobility_id'] +')>Ajouter</button>' +
					// 	'</td></tr>'
					// );
				} else {
					// Numéro/Nom/Prénom : tableau avec l'id de l'étudiant
					$("#students").append(
						'<tr class="text-center" id="' + elt["student_id"] + '">' +
							'<td class="id align-middle px-0">' + elt["student_id"] + '</td>' +
							'<td class="last_name align-middle px-0">' + elt["last_name"] + '</td>' +
							'<td class="first_name align-middle px-0">' + elt["first_name"] + '</td>'
					);
					// Informations sur la mobilité : tableau avec l'id de la mobilité - Si l'étudiant a une mobilité, sinon
					if (elt['mobility_id']) {
						$("#"+elt["student_id"]).append(
							'<td class="country no-border px-0"><table class="table no-margin">' +
								'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
									'<div class="my-09">' + elt['country'] + '</div>' +
								'</td></tr>' +
							'</table></td>' +
							'<td class="partner no-border px-0"><table class="table no-margin">' +
								'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
									select_partner +
								'</td></tr>' +
							'</table></td>' +
							'<td class="type no-border px-0"><table class="table no-margin">' +
								'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
									'<select class="input my-08" disabled>' +
										'<option ' + (elt['type'] == '1 an DD' ? 'selected' : '') + '>DD</option>' +
										'<option ' + (elt['type'] == '2e semestre ING2' ? 'selected' : '') + '>ING2</option>' +
										'<option ' + (elt['type'] == '1er semestre' ? 'selected' : '') + '>ING3</option>' +
									'</select>' +
								'</td></tr>' +
							'</table></td>' +
							'<td class="is_out no-border px-0"><table class="table no-margin">' +
								'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
									'<div class="my-09">' + (elt['is_out'] == 1 ? 'Oui' : 'Non') + '</div>' +
								'</td></tr>' +
							'</table></td>' +
							'<td class="date_start no-border px-0"><table class="table no-margin">' +
								'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
									'<input class="input w-75 my-04" type="date" value="' + (elt['date_start'] ? elt['date_start'] : '') + '" disabled>' +
								'</td></tr>' +
							'</table></td>' +
							'<td class="date_stop no-border px-0"><table class="table no-margin">' +
								'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
									'<input class="input w-75 my-04" type="date" value="' + (elt['date_stop'] ? elt['date_stop'] : '') + '" disabled>' +
								'</td></tr>' +
							'</table></td>' +
							'<td class="mobility_action_edit no-border px-0"><table class="table no-margin">' +
								'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
									'<button type="submit" class="mobility_edit btn btn-info btn-sm mx-1" onclick=edit_mobility(' + elt['student_id'] + ',' + elt['mobility_id'] + ')>Modifier</button>' +
								'</td></tr>' +
							'</table></td>' +
							'<td class="mobility_action_delete no-border px-0"><table class="table no-margin">' +
								'<tr class="m' + elt['mobility_id'] + '"><td class="px-0">' +
									'<button type="submit" class="mobility_delete btn btn-danger btn-sm mx-1" onclick=delete_mobility('+ elt['student_id'] + ',' + elt['mobility_id'] + ')>Supprimer</button>' +
								'</td></tr>' +
							'</table></td>' +
							'<td class="mobility_action_add align-middle no-border px-0"><table class="table no-margin">' +
								'<tr><td class="px-0">' +
									'<button type="submit" class="mobility_add btn btn-info btn-sm mx-1" onclick=add_mobility('+ elt['student_id'] +')>Ajouter</button>' +
								'</td></tr>' +
							'</table></td>'
						);
					} else {
						$("#"+elt["student_id"]).append(
							'<td class="country no-border px-0"><table class="table no-margin">' +
								'<tbody></tbody>' +
							'</table></td>' +
							'<td class="partner no-border px-0"><table class="table no-margin">' +
								'<tbody></tbody>' +
							'</table></td>' +
							'<td class="type no-border px-0"><table class="table no-margin">' +
								'<tbody></tbody>' +
							'</table></td>' +
							'<td class="is_out no-border px-0"><table class="table no-margin">' +
								'<tbody></tbody>' +
							'</table></td>' +
							'<td class="date_start no-border px-0"><table class="table no-margin">' +
								'<tbody></tbody>' +
							'</table></td>' +
							'<td class="date_stop no-border px-0"><table class="table no-margin">' +
								'<tbody></tbody>' +
							'</table></td>' +
							'<td class="mobility_action_edit no-border px-0"><table class="table no-margin">' +
								'<tbody></tbody>' +
							'</table></td>' +
							'<td class="mobility_action_delete no-border px-0"><table class="table no-margin">' +
								'<tbody></tbody>' +
							'</table></td>' +
							'<td class="mobility_action_add align-middle no-border px-0"><table class="table no-margin">' +
								'<tr><td class="px-0">' +
									'<button type="submit" class="mobility_add btn btn-info btn-sm mx-1" onclick=add_mobility('+ elt['student_id'] +')>Ajouter</button>' +
								'</td></tr>' +
							'</table></td>'
						)
					}
				}

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

/* Permet la modification des données d'une mobilité */
function edit_mobility(student_id, mobility_id) {
	// $("#"+student_id+" .m"+mobility_id).find(".input").prop("disabled", false);	// Rend les champs modifiables
	$("#"+student_id).find(".m"+mobility_id+" .input").prop("disabled", false);	// Rend les champs modifiables
	$("#"+student_id).find(".m"+mobility_id+" .mobility_edit").text("Sauvegarder").attr("onclick", 'save_mobility(' + student_id + ',' + mobility_id + ')');	// Change le bouton modifier en sauvegarder
	$("#"+student_id).find(".m"+mobility_id+" .mobility_delete").text("Annuler").attr("onclick", 'cancel_mobility(' + student_id + ',' + mobility_id + ')');	// Change le bouton supprimer en annuler

	// Sauvegarde de la valeur dans le nom
	$("#"+student_id).find(".partner .m"+mobility_id+" select").attr("name", $("#"+student_id).find(".partner .m"+mobility_id+" select").val());
	$("#"+student_id).find(".type .m"+mobility_id+" select").attr("name", $("#"+student_id).find(".type .m"+mobility_id+" select").val());
	$("#"+student_id).find(".date_start .m"+mobility_id+" select").attr("name", $("#"+student_id).find(".date_start .m"+mobility_id+" select").val());
	$("#"+student_id).find(".date_stop .m"+mobility_id+" select").attr("name", $("#"+student_id).find(".date_stop .m"+mobility_id+" select").val());
}

/* Annule la modification */
function cancel_mobility(student_id, mobility_id) {
	$("#"+student_id).find(".m"+mobility_id+" .input").prop("disabled", true);	// Rend les champs non modifiables
	$("#"+student_id).find(".m"+mobility_id+" .mobility_edit").text("Modifier").attr("onclick", 'edit_mobility(' + student_id + ',' + mobility_id + ')');	// Change le bouton sauvegarder en modifier
	$("#"+student_id).find(".m"+mobility_id+" .mobility_delete").text("Supprimer").attr("onclick", 'delete_mobility(' + student_id + ',' + mobility_id + ')');	// Change le bouton annuler en supprimer

	// Reset des données avec celles précédentes
	$("#"+student_id).find(".partner .m"+mobility_id+" select").val($("#"+student_id).find(".partner .m"+mobility_id+" select").attr("name"));
	$("#"+student_id).find(".type .m"+mobility_id+" select").val($("#"+student_id).find(".type .m"+mobility_id+" select").attr("name"));
	$("#"+student_id).find(".date_start .m"+mobility_id+" select").val($("#"+student_id).find(".date_start .m"+mobility_id+" select").attr("name"));
	$("#"+student_id).find(".date_stop .m"+mobility_id+" select").val($("#"+student_id).find(".date_stop .m"+mobility_id+" select").attr("name"));
}

/* Sauvegarde en BDD les modifications */
function save_mobility(student_id, mobility_id) {
	// Récupération des données
	mobility_partner_name = $("#"+student_id).find(".partner .m"+mobility_id+" select").val();
	mobility_partner_id = $("#"+student_id).find('.partner .m'+mobility_id+' select option:contains("'+ mobility_partner_name +'")').attr('name');
	// mobility_type = $("#"+student_id).find(".type .m"+mobility_id+" select").val();
	mobility_type = $("#"+student_id).find(".type .m"+mobility_id+" select").val().replaceAll("DD", "1 an DD").replaceAll("ING2", "2e semestre ING2").replaceAll("ING3", "1er semestre");
	mobility_date_start = $("#"+student_id).find(".date_start .m"+mobility_id+" input").val();
	mobility_date_stop = $("#"+student_id).find(".date_stop .m"+mobility_id+" input").val();

	$("#"+student_id).find(".m"+mobility_id+" .input").prop("disabled", true);	// Rend les champs non modifiables
	$("#"+student_id).find(".m"+mobility_id+" .mobility_edit").text("Modifier").attr("onclick", 'edit_mobility(' + student_id + ',' + mobility_id + ')');	// Change le bouton sauvegarder en modifier
	$("#"+student_id).find(".m"+mobility_id+" .mobility_delete").text("Supprimer").attr("onclick", 'delete_mobility(' + student_id + ',' + mobility_id + ')');	// Change le bouton annuler en supprimer

	// MAJ Pays
	for (let element of list_partners) {
		if (element['partner_id'] == mobility_partner_id) {
			mobility_country = element['partner_country'];
			$("#"+student_id).find(".country .m"+mobility_id+" td").text(mobility_country);
			break;
		}
	}

	// MAJ Sortant + set mobility_is_out
	if (mobility_country != 'France') {
		$("#"+student_id).find(".is_out .m"+mobility_id+" td").text("Oui");
		mobility_is_out = 1;
	} else {
		$("#"+student_id).find(".is_out .m"+mobility_id+ "td").text("Non");
		mobility_is_out = 0;
	}

	// console.log(mobility_id + ' ' + mobility_partner_id + ' ' + mobility_type + ' ' + mobility_is_out + ' ' + mobility_date_start + ' ' + mobility_date_stop);

	// Mise à jour de la BDD
	$.ajax({
		url: "assets/php/mobilites.php",
		type: "POST",
		dataType: "json",
		data: {"function": "edit_mobility", "mobility_id" : mobility_id, "mobility_partner_id" : mobility_partner_id, "mobility_type" : mobility_type, "mobility_is_out" : mobility_is_out, "mobility_date_start" : mobility_date_start, "mobility_date_stop" : mobility_date_stop},
		success: function(result, statut) {
			// console.log(result);
		},
		error: function(result, statut, error) {
			console.log(statut);
			console.log(error);
			console.log(result);	
		}
	});
}

/* Supprime la mobilité */
function delete_mobility(student_id, mobility_id) {
	// Récupération des données
	student_last_name = $("#"+student_id).find(".last_name").text();
	student_first_name = $("#"+student_id).find(".first_name").text();

	// Demande confirmmation
	if (confirm("Êtes-vous sûr de vouloir supprimer la note de " + student_last_name + " " + student_first_name + " ?") == true) {
		// Mise à jour visuelle
		$("#"+student_id).find(".m"+mobility_id).remove();

		// Mise à jour de la BDD
		$.ajax({
			url: "assets/php/mobilites.php",
			type: "POST",
			dataType: "json",
			data: {"function": "delete_mobility", "mobility_id": mobility_id},
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

/* ========== FONCTIONS AJOUT MOBILITE ========== */
/* Ajoute une mobilité */
function add_mobility(student_id) {
	unique_id = Date.now().toString(16);

	$("#"+student_id+" .country table").append(
		'<tr class="m'+unique_id+'"><td class="px-0">' +
			'<div class="my-09">NULL</div>' +
		'</td></tr>'
	);

	select_partner = '<select class="input w-85 my-08"><option name="NULL"></option>';
	list_partners.forEach(element => {
		select_partner += '<option name="' + element['partner_id'] + '" >'+ element['partner_name'] +'</option>';
	});
	select_partner += '</select>';
	$("#"+student_id+" .partner table").append(
		'<tr class="m'+unique_id+'"><td class="px-0">' +
			select_partner +
		'</td></tr>'
	);

	$("#"+student_id+" .type table").append(
		'<tr class="m'+unique_id+'"><td class="px-0">' +
			'<select class="input my-08">' +
				'<option></option>' +
				'<option>DD</option>' +
				'<option>ING2</option>' +
				'<option>ING3</option>' +
			'</select>' +
		'</td></tr>'
	);

	$("#"+student_id+" .is_out table").append(
		'<tr class="m'+unique_id+'"><td class="px-0">' +
			'<div class="my-09">NULL</div>' +
		'</td></tr>'
	);

	$("#"+student_id+" .date_start table").append(
		'<tr class="m'+unique_id+'"><td class="px-0">' +
			'<input class="input w-75 my-04" type="date">' +
		'</td></tr>'
	);

	$("#"+student_id+" .date_stop table").append(
		'<tr class="m'+unique_id+'"><td class="px-0">' +
			'<input class="input w-75 my-04" type="date">' +
		'</td></tr>'
	);

	$("#"+student_id+" .mobility_action_edit table").append(
		'<tr class="m'+unique_id+'"><td class="px-0">' +
			'<button type="submit" class="mobility_edit btn btn-info btn-sm mx-1" onclick=save_add_mobility(' + student_id + ',"' + unique_id + '")>Sauvegarder</button>' +
		'</td></tr>'
	);

	$("#"+student_id+" .mobility_action_delete table").append(
		'<tr class="m'+unique_id+'"><td class="px-0">' +
			'<button type="submit" class="mobility_delete btn btn-danger btn-sm mx-1" onclick=cancel_add_mobility(' + student_id + ',"' + unique_id + '")>Annuler</button>' +
		'</td></tr>'
	);
}

/* Annule l'ajout d'une mobilité */
function cancel_add_mobility(student_id, unique_id) {
	$("#"+student_id).find(".m"+unique_id).remove();
}

/* Sauvegarde l'ajout de la mobilité */
function save_add_mobility(student_id, unique_id) {
	// Récupération des données
	mobility_partner_name = $("#"+student_id).find(".partner .m"+unique_id+" select").val();
	mobility_partner_id = $("#"+student_id).find('.partner .m'+unique_id+' select option:contains("'+ mobility_partner_name +'")').attr('name');
	// mobility_type = $("#"+student_id).find(".type .m"+unique_id+" select").val();
	mobility_type = $("#"+student_id).find(".type .m"+unique_id+" select").val().replaceAll("DD", "1 an DD").replaceAll("ING2", "2e semestre ING2").replaceAll("ING3", "1er semestre");
	mobility_date_start = $("#"+student_id).find(".date_start .m"+unique_id+" input").val();
	mobility_date_stop = $("#"+student_id).find(".date_stop .m"+unique_id+" input").val();

	if (!mobility_partner_id) {
		alert('Veuillez saisir un partenaire de mobilité.');
	} else if (!mobility_type) {
		alert('Veuillez saisir un type de mobilité.');
	} else {
		$("#"+student_id).find(".m"+unique_id+" .input").prop("disabled", true);	// Rend les champs non modifiables

		// MAJ Pays
		for (let element of list_partners) {
			if (element['partner_id'] == mobility_partner_id) {
				mobility_country = element['partner_country'];
				$("#"+student_id).find(".country .m"+unique_id+" td div").text(mobility_country);
				break;
			}
		}

		// MAJ Sortant + set mobility_is_out
		if (mobility_country != 'France') {
			$("#"+student_id).find(".is_out .m"+unique_id+" td div").text("Oui");
			mobility_is_out = 1;
		} else {
			$("#"+student_id).find(".is_out .m"+unique_id+" td div").text("Non");
			mobility_is_out = 0;
		}

		// Mise à jour de la BDD
		$.ajax({
			url: "assets/php/mobilites.php",
			type: "POST",
			dataType: "json",
			data: {"function": "save_mobility", "student_id" : student_id, "mobility_partner_id" : mobility_partner_id, "mobility_type" : mobility_type, "mobility_is_out" : mobility_is_out, "mobility_date_start" : mobility_date_start, "mobility_date_stop" : mobility_date_stop},
			success: function(result, statut) {
				// console.log(statut, result);
				mobility_id = result[0];

				// Remplace tous les IDs
				$("#"+student_id).find(".m"+unique_id).addClass("m"+mobility_id);
				$("#"+student_id).find(".m"+unique_id).removeClass("m"+unique_id);

				$("#"+student_id).find(".m"+mobility_id+" .mobility_edit").text("Modifier").attr("onclick", 'edit_mobility(' + student_id + ',' + mobility_id + ')');	// Change le bouton sauvegarder en modifier
				$("#"+student_id).find(".m"+mobility_id+" .mobility_delete").text("Supprimer").attr("onclick", 'delete_mobility(' + student_id + ',' + mobility_id + ')');	// Change le bouton annuler en supprimer
			},
			error: function(result, statut, error) {
				console.log(statut);
				console.log(error);
				console.log(result);	
			}
		});
	}
}
