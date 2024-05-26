let event
			let eventId
			let event_Id
			let event_description
			let event_start_date

			function updateEvent(event_Id) {
				event = event_Id.split(',');
				eventId = event[0];
				event_description = event[1];
				const match = event_description.match(/\d+/);
				const firstNumber = match ? parseInt(match[0]) : 0;
				const subtractionValue = parseFloat(document.getElementById('subtractionValue').value);
				const remainingPlaces = firstNumber - subtractionValue;

				gapi.client.calendar.events.get({
					calendarId: agendaId,
					eventId: eventId
				}).then(function (response) {
					const eventToUpdate = response.result;
					eventToUpdate.description = `${remainingPlaces} places restantes`;

					gapi.client.calendar.events.update({
						calendarId: agendaId,
						eventId: eventId,
						resource: eventToUpdate
					}).then(function (response) {
						console.log('Evénement mis à jour avec succès :', response);
					}, function (error) {
						console.error('Erreur lors de la mise à jour de l\'événement :', error);
					});
				}, function (error) {
					console.error('Erreur lors de la récupération de l\'événement :', error);
				});
			}

			let calendar;
			function updateEventDescription(event_Id) {
				event = event_Id.split(',');
				eventId = event[0];
				event_description = event[1];

				const match = event_description.match(/\d+/);
				const firstNumber = match ? parseInt(match[0]) : 0;

				const maxOptions = firstNumber;
				let options = '';
				for (let i = 0; i < maxOptions; i++) {
					options += `<option value="${i + 1}">${i + 1}</option>`;
				}

				Swal.fire({
					title: 'Inscription - ' + new Intl.DateTimeFormat('fr-FR', {
						year: 'numeric',
						month: 'numeric',
						day: 'numeric',
					}).format(event_start_date),
					html: `
						<div>
							<label for="Name">Nom :</label>
							<input type="text" id="Name" class="swal2-input" required>
							<label for="email">Email :</label>
							<input type="email" id="mail" class="swal2-input" required>
							<label for="phone">Téléphone :</label>
							<input type="number" id="phone" class="swal2-input" required>
							<label for="subtractionValue">Nombre de participants :</label>
							<select id="subtractionValue" class="swal2-select" required>
								${options}								
							</select>
						</div>
					`,
					showCancelButton: true,
					confirmButtonText: 'Confirmer',
					cancelButtonText: 'Annuler',
					customClass: {
						popup: 'custom-popup',
						confirmButton: 'custom-confirm-button',
						cancelButton: 'custom-cancel-button'
					},
					preConfirm: () => {
						const name = document.getElementById('Name').value;
						const email = document.getElementById('mail').value;
						const phone = document.getElementById('phone').value;
						const subtractionValue = parseFloat(document.getElementById('subtractionValue').value);

						if (!name || !email || !phone || isNaN(subtractionValue)) {
							Swal.showValidationMessage('Veuillez remplir tous les champs correctement.');
							return false;
						}

						const remainingPlaces = firstNumber - subtractionValue;

						return checkAuth().then(() => {
							return remainingPlaces;
						}).catch(error => {
							console.error('Erreur lors de l\'authentification :', error);
							Swal.showValidationMessage('Erreur lors de l\'authentification. Veuillez réessayer.');
						});
					}
				}).then((result) => {
					if (result.isConfirmed) {
						updateEvent(event_Id);
						Swal.fire({
							title: 'Succès',
							html: `L'inscription a été prise en compte.<br />
							Date de l'évènement: ${event_start_date} <br />
							Nombre de places restantes : ${result.value}`,
							icon: 'success',
							confirmButtonText: 'OK',
						}).then(() => {
							location.reload();
						});
					}

				});
			}

			document.addEventListener('DOMContentLoaded', function () {
				var calendarEl = document.getElementById('calendar');

				calendar = new FullCalendar.Calendar(calendarEl, {
					initialDate: new Date().toISOString(),
					validRange: {
						start: new Date().toISOString(),
						end: '2024-10-01'
					},
					editable: true,
					selectable: true,
					buttonText: {
						today: 'Aujourd\'hui',
						month: 'Mois',
						list: 'Liste'
					},
					locale: 'fr',
					firstDay: 1,
					googleCalendarApiKey: API_KEY,
					events: {
						googleCalendarId: agendaId,
					},
					timeZone: 'local',
					eventContent: function () {
						return {
							html: `<a href="#" class="reserve_button" >Réserver</a>`
						};
					},
					eventClick: function (info) {
						info.jsEvent.preventDefault();
						var eventTitle = info.event.title;
						event_start_date = info.event.start;

						eventStartDate = new Intl.DateTimeFormat('fr-FR', {
							hour: '2-digit',
							minute: '2-digit'
						}).format(info.event.start);

						var eventEnd = info.event.end
						? new Intl.DateTimeFormat('fr-FR', {
							hour: '2-digit',
							minute: '2-digit'
						}).format(info.event.end)
						: 'Non spécifié';
						
						event_description = info.event.extendedProps.description || 'Aucune description disponible.';

						Swal.fire({
							title: eventTitle,
							html: `
								<p><strong>Heure de début :</strong> ${eventStartDate}</p>
								<p><strong>Heure de fin :</strong> ${eventEnd}</p>
								<p><strong>Description :</strong> ${event_description}</p>
								<button id="update_button" onclick="updateEventDescription('${info.event.id}, ${info.event.extendedProps.description}')" style="color:#000 !important;">S'inscrire</button>
								<pre id="content" style="white-space: pre-wrap;"></pre>
							`,
							showCloseButton: false
						});
					},
				});

				calendar.render();
			});