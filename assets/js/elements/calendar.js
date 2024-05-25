let calendar;
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
		eventClick: function (info) {
			info.jsEvent.preventDefault();
			var eventTitle = info.event.title;
			var eventStart = info.event.start.toLocaleString();
			var eventEnd = info.event.end ? info.event.end.toLocaleString() : 'Non spécifié';
			var eventDescription = info.event.extendedProps.description || 'Aucune description disponible.';

			Swal.fire({
				title: eventTitle,
				html: `
					<p><strong>Heure de début :</strong> ${eventStart}</p>
					<p><strong>Heure de fin :</strong> ${eventEnd}</p>
					<p><strong>Description :</strong> ${eventDescription}</p>
					<button id="update_button" onclick="updateEventDescription('${info.event.id}, ${info.event.extendedProps.description}')" style="color:#000 !important;">S'inscrire</button>
					<pre id="content" style="white-space: pre-wrap;"></pre>
				`,
				showCloseButton: false
			});
		},
	});

	calendar.render();
});

function updateEventDescription(event_Id) {
	const event = event_Id.split(',');
	const eventId = event[0];
	const description = event[1];

	const match = description.match(/\d+/);
	const firstNumber = match ? parseInt(match[0]) : 0;

	const maxOptions = 20;
	let options = '';
	for (let i = 0; i < maxOptions; i++) {
		options += `<option value="${i + 1}">${i + 1}</option>`;
	}

	Swal.fire({
		title: 'Inscription',
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
			getAuthCode();
			gapi.client.calendar.events.get({
				calendarId: agendaId,
				eventId: eventId
			}).then(function (response) {
				const eventToUpdate = response.result;
				eventToUpdate.description = `${remainingPlaces} places restantes`;

			}, function (error) {
				console.error('Erreur lors de la récupération de l\'événement :', error);
			});

			return remainingPlaces;
		}
	}).then((result) => {
		if (result.isConfirmed) {
			Swal.fire({
				title: 'Succès',
				html: `L'inscription a été prise en compte.<br />Nombre de places restantes : ${result.value}`,
				icon: 'success',
				confirmButtonText: 'OK',
			});
		}
	});
}

